/**
 * Writes WebP files into static/og/** for Open Graph. Run before `vite build` (package.json "prebuild").
 * Satori lays out an SVG, then `sharp` rasterizes and encodes WebP. Texts and paths come from the
 * site's own modules (seo-pages.js, seo.ts, blog.ts, plugin-identity.ts), loaded directly by Node.
 * Skips re-encoding when inputs are unchanged (see LAYOUT_VERSION, static/og/.og-input-hashes.json).
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import satori from 'satori';
import { parse as parseToml } from 'smol-toml';
import { ogBackground, ogColors } from '../src/lib/og-colors.js';
import * as SEO_PAGES from '../src/lib/seo-pages.js';
import { seoBlogPost, seoPlugin } from '../src/lib/seo.ts';
import { parseFrontmatter } from '../src/lib/blog.ts';
import { isValidPlugin, PLUGIN_SOURCES, slugFromId } from '../src/lib/plugin-identity.ts';

/** Satori takes plain `{ type, props }` elements, so React isn't needed to build them. */
const h = (type, props, ...children) => ({ type, props: { ...props, children } });

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const CACHE_FILE = join(root, 'static/og', '.og-input-hashes.json');
const WEBP_OPTIONS = { quality: 88, effort: 4 };
/** Matches the card gradient's base, so a fit-inside thumbnail sits on the same dark field. */
const OG_BACKGROUND = { r: 18, g: 19, b: 41, alpha: 1 };
/** Bump when layout, colors, font usage, or WebP settings change so all images rebuild. */
const LAYOUT_VERSION = 4;

const NOCTALIA_LOGO_SVG_URL = 'https://assets.noctalia.dev/noctalia-logo.svg';

const interLatin = (weight) =>
	readFile(join(root, 'node_modules/@fontsource/inter/files', `inter-latin-${weight}-normal.woff`));

function clip(s, max = 240) {
	const t = s.replace(/\s+/g, ' ').trim();
	if (t.length <= max) return t;
	return `${t.slice(0, max - 1).trim()}…`;
}

function buildGlobalDigest(fontW400, fontW600, logoDataUrl) {
	return createHash('sha256')
		.update(String(LAYOUT_VERSION), 'utf8')
		.update(JSON.stringify(WEBP_OPTIONS), 'utf8')
		.update(fontW400)
		.update(fontW600)
		.update(logoDataUrl || '', 'utf8')
		.digest('hex');
}

function inputDigestForImage(globalDigest, outPathRel, pathLabel, bodyText) {
	return createHash('sha256')
		.update(globalDigest, 'utf8')
		.update(`\0${outPathRel}\0${pathLabel}\0${bodyText}`, 'utf8')
		.digest('hex');
}

/** Cache key for an image built from bytes we fetched (a plugin thumbnail) rather than text. */
function inputDigestForBytes(globalDigest, outPathRel, bytes) {
	return createHash('sha256')
		.update(globalDigest, 'utf8')
		.update(`\0${outPathRel}\0`, 'utf8')
		.update(bytes)
		.digest('hex');
}

async function loadInputCache() {
	try {
		const raw = await readFile(CACHE_FILE, 'utf8');
		return JSON.parse(raw);
	} catch {
		return {};
	}
}

async function saveInputCache(map) {
	await mkdir(join(root, 'static/og'), { recursive: true });
	await writeFile(CACHE_FILE, JSON.stringify(map, null, '\t') + '\n', 'utf8');
}

async function loadLogoDataUrl() {
	try {
		const res = await fetch(NOCTALIA_LOGO_SVG_URL);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const svg = await res.text();
		const data = await sharp(Buffer.from(svg)).resize({ width: 256 }).png().toBuffer();
		return `data:image/png;base64,${data.toString('base64')}`;
	} catch (e) {
		console.warn('Could not load logo; OG art will be text only:', e?.message || e);
		return null;
	}
}

/** Satori can clip a single long flex child oddly; "Plugin" + name as spans avoids that. */
const mintChroma = { fontSize: 40, fontWeight: 600, color: ogColors.accent2, lineHeight: 1.2 };

function pathLabelLine(pathLabel) {
	const m = String(pathLabel).match(/^Plugin:\s*(.+)$/i);
	if (m) {
		const name = clip(m[1], 64);
		return h(
			'div',
			{
				style: {
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					marginTop: 12,
					maxWidth: 900,
					/* Explicit width so Satori's flex engine gives the line enough horizontal room. */
					width: 880,
				},
			},
			/* "Plugin" + ": " + name so the space after ":" is always visible. */
			h('span', { style: { ...mintChroma, flex: '0 0 auto' } }, 'Plugin'),
			h('span', { style: { ...mintChroma, flex: '0 0 auto' } }, ': ' + name)
		);
	}
	return h(
		'div',
		{
			style: {
				...mintChroma,
				marginTop: 12,
				maxWidth: 900,
				width: 880,
			},
		},
		clip(pathLabel, 68)
	);
}

function textColumn(pathLabel, body) {
	return h(
		'div',
		{
			style: {
				display: 'flex',
				flexDirection: 'column',
				minWidth: 200,
				maxWidth: 900,
				flexShrink: 0,
			},
		},
		h(
			'div',
			{
				style: {
					fontSize: 15,
					fontWeight: 600,
					letterSpacing: '0.2em',
					textTransform: 'uppercase',
					color: ogColors.fgDim,
					marginBottom: 22,
				},
			},
			'noctalia.dev'
		),
		h(
			'div',
			{
				style: {
					fontSize: 100,
					fontWeight: 600,
					letterSpacing: -2,
					color: ogColors.fg,
					lineHeight: 1.04,
				},
			},
			'Noctalia'
		),
		pathLabelLine(pathLabel),
		h(
			'div',
			{
				style: {
					fontSize: 26,
					fontWeight: 400,
					color: ogColors.fgDim,
					marginTop: 28,
					lineHeight: 1.5,
					maxWidth: 900,
				},
			},
			body
		)
	);
}

function buildTree(pathLabel, bodyText, logoDataUrl) {
	const body = clip(bodyText, 300);
	const heroRow = logoDataUrl
		? h(
				'div',
				{
					style: {
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						gap: 40,
					},
				},
				h('img', {
					src: logoDataUrl,
					width: 128,
					height: 128,
					style: { flexShrink: 0, objectFit: 'contain' },
				}),
				textColumn(pathLabel, body)
			)
		: textColumn(pathLabel, body);

	/** Centred block: horizontal + vertical center of the 1200×630 artboard */
	const content = h(
		'div',
		{
			style: {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100%',
				padding: '40px 56px',
				boxSizing: 'border-box',
			},
		},
		heroRow
	);

	return h(
		'div',
		{
			style: {
				width: 1200,
				height: 630,
				display: 'flex',
				position: 'relative',
				backgroundColor: ogColors.bg,
				fontFamily: 'Inter',
			},
		},
		h('div', {
			style: {
				position: 'absolute',
				top: 0,
				left: 0,
				width: 1200,
				height: 630,
				background: ogBackground,
			},
		}),
		h('div', {
			style: {
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: 1,
				background: `linear-gradient(90deg, transparent, ${ogColors.border}, transparent)`,
			},
		}),
		h('div', {
			style: { position: 'relative', width: '100%', height: '100%', display: 'flex' },
		},
		content
		)
	);
}

/**
 * @param {Array<{ name: string; data: Buffer; weight: number; style: 'normal' }>} fonts
 * @param {Record<string, string>} nextCache
 */
async function writeOg(outPathRel, pathLabel, bodyText, logoDataUrl, fonts, globalDigest, prevCache, nextCache) {
	const digest = inputDigestForImage(globalDigest, outPathRel, pathLabel, bodyText);
	const abs = join(root, 'static', outPathRel);
	if (prevCache[outPathRel] === digest && existsSync(abs)) {
		nextCache[outPathRel] = digest;
		console.log(`Up-to-date static/${outPathRel}`);
		return;
	}

	const tree = buildTree(pathLabel, bodyText, logoDataUrl);
	const svg = await satori(tree, { width: 1200, height: 630, fonts });
	const webp = await sharp(Buffer.from(svg)).webp(WEBP_OPTIONS).toBuffer();
	await mkdir(dirname(abs), { recursive: true });
	await writeFile(abs, webp);
	nextCache[outPathRel] = digest;
	console.log(`Wrote static/${outPathRel}`);
}

/** The plugin's thumbnail bytes, or null if the repo has none (or the fetch fails). */
async function fetchThumbnail(url) {
	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		return Buffer.from(await res.arrayBuffer());
	} catch {
		return null;
	}
}

/**
 * A plugin's own thumbnail as its OG card, so sharing a plugin page shows the plugin.
 * The thumbnail is 16:9 and the OG canvas is 1.91:1, so it is fit inside (never cropped -
 * the generator puts the plugin title near the top edge) on the card background.
 */
async function writeOgThumbnail(outPathRel, thumbnail, globalDigest, prevCache, nextCache) {
	const digest = inputDigestForBytes(globalDigest, outPathRel, thumbnail);
	const abs = join(root, 'static', outPathRel);
	if (prevCache[outPathRel] === digest && existsSync(abs)) {
		nextCache[outPathRel] = digest;
		console.log(`Up-to-date static/${outPathRel}`);
		return;
	}

	const webp = await sharp(thumbnail)
		.resize(1200, 630, { fit: 'contain', background: OG_BACKGROUND })
		.webp(WEBP_OPTIONS)
		.toBuffer();
	await mkdir(dirname(abs), { recursive: true });
	await writeFile(abs, webp);
	nextCache[outPathRel] = digest;
	console.log(`Wrote static/${outPathRel} (plugin thumbnail)`);
}

/** Run `fn` over `items` with at most `limit` in flight. */
async function mapPool(items, limit, fn) {
	let next = 0;
	const worker = async () => {
		while (next < items.length) await fn(items[next++]);
	};
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

async function main() {
	if (process.env.SKIP_OG === '1' || process.env.SKIP_OG === 'true') {
		console.log('SKIP_OG set - skipping build-og.mjs');
		return;
	}

	const logo = await loadLogoDataUrl();
	const fontW400 = await interLatin(400);
	const fontW600 = await interLatin(600);
	const fonts = [
		{ name: 'Inter', data: fontW400, weight: 400, style: 'normal' },
		{ name: 'Inter', data: fontW600, weight: 600, style: 'normal' },
	];
	const globalDigest = buildGlobalDigest(fontW400, fontW600, logo);
	const prevCache = await loadInputCache();
	/** Rel path → input sha; rewritten each run (drops removed routes). */
	const nextCache = /** @type {Record<string, string>} */ ({});

	const w = (rel, pathLabel, body) => writeOg(rel, pathLabel, body, logo, fonts, globalDigest, prevCache, nextCache);

	for (const seo of Object.values(SEO_PAGES)) {
		await w(seo.ogImagePath.slice(1), seo.pathLabel, seo.description);
	}

	const blogDir = join(root, 'src/content/blog');
	for (const name of await readdir(blogDir)) {
		if (!name.endsWith('.md')) continue;
		const { meta } = parseFrontmatter(await readFile(join(blogDir, name), 'utf8'));
		const seo = seoBlogPost({ slug: name.replace(/\.md$/, ''), ...meta });
		await w(seo.ogImagePath.slice(1), seo.pathLabel, seo.description);
	}

	for (const source of PLUGIN_SOURCES) {
		const base = `https://raw.githubusercontent.com/noctalia-dev/${source.repo}/main`;
		try {
			const res = await fetch(`${base}/catalog.toml`);
			if (!res.ok) {
				console.warn(`Skipping ${source.repo} OG images: catalog returned`, res.status);
				continue;
			}
			const catalog = parseToml(await res.text());
			const rows = Array.isArray(catalog.plugin) ? catalog.plugin : [];
			await mapPool(rows, 16, async (row) => {
				const plugin = {
					id: slugFromId(row.id),
					catalogId: row.id,
					source: source.slug,
					name: row.name,
					version: row.version,
					author: row.author,
					description: ''
				};
				if (!isValidPlugin(plugin)) return;
				const slug = plugin.id;
				try {
					const manifestRes = await fetch(`${base}/${slug}/plugin.toml`);
					if (manifestRes.ok) {
						const manifest = parseToml(await manifestRes.text());
						if (typeof manifest.description === 'string') plugin.description = manifest.description;
					}
				} catch {
					/* description stays empty */
				}

				const outPathRel = seoPlugin(plugin).ogImagePath.slice(1);
				const thumbnail = await fetchThumbnail(`${base}/${plugin.id}/thumbnail.webp`);
				if (thumbnail) {
					await writeOgThumbnail(outPathRel, thumbnail, globalDigest, prevCache, nextCache);
				} else {
					// No thumbnail in the repo: fall back to the generated title/description card.
					console.warn(`No thumbnail for ${source.slug}/${plugin.id}; using the generated card`);
					await w(outPathRel, seoPlugin(plugin).pathLabel, plugin.description);
				}
			});
		} catch (e) {
			console.warn(`Skipping ${source.repo} OG images (offline or network error):`, e?.message || e);
		}
	}

	await saveInputCache(nextCache);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
