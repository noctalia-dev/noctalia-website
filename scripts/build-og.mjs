/**
 * Writes WebP files into static/og/** for Open Graph. Run before `vite build` (package.json "prebuild").
 * Satori + Resvg render a PNG raster, then `sharp` encodes WebP. Paths match `src/lib/seo.ts`.
 * Skips re-encoding when inputs are unchanged (see LAYOUT_VERSION, static/og/.og-input-hashes.json).
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { createElement as h } from 'react';
import sharp from 'sharp';
import satori from 'satori';
import { parse as parseToml } from 'smol-toml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const CACHE_FILE = join(root, 'static/og', '.og-input-hashes.json');
const WEBP_OPTIONS = { quality: 88, effort: 4 };
/** Matches the card gradient's base, so a fit-inside thumbnail sits on the same dark field. */
const OG_BACKGROUND = { r: 10, g: 10, b: 42, alpha: 1 };
/** Bump when layout, font usage, or WebP settings change so all images rebuild. */
const LAYOUT_VERSION = 2;

const NOCTALIA_LOGO_SVG_URL = 'https://assets.noctalia.dev/noctalia-logo.svg';

const interLatin = (weight) =>
	readFile(join(root, 'node_modules/@fontsource/inter/files', `inter-latin-${weight}-normal.woff`));

function clip(s, max = 240) {
	const t = s.replace(/\s+/g, ' ').trim();
	if (t.length <= max) return t;
	return `${t.slice(0, max - 1).trim()}…`;
}

const REQUIRED_FIELDS = ['id', 'name', 'version', 'author'];
const RESERVED_IDS = ['license', 'readme', 'index', 'api', 'admin', 'static', 'assets'];

/** Plugin sources, rendered in this order (official first, then community). Keyed by URL slug. */
const PLUGIN_SOURCES = [
	{ repo: 'official-plugins', slug: 'official' },
	{ repo: 'community-plugins', slug: 'community' }
];

function isValidPlugin(plugin) {
	if (!plugin || typeof plugin !== 'object') return false;
	for (const field of REQUIRED_FIELDS) {
		if (typeof plugin[field] !== 'string' || !plugin[field].trim()) return false;
	}
	const id = plugin.id;
	if (!/^[a-z0-9][a-z0-9_-]*[a-z0-9]$|^[a-z0-9]$/.test(id)) return false;
	if (RESERVED_IDS.includes(id.toLowerCase())) return false;
	return true;
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
		const r = new Resvg(svg, { fitTo: { mode: 'width', value: 256 } });
		const data = r.render().asPng();
		return `data:image/png;base64,${data.toString('base64')}`;
	} catch (e) {
		console.warn('Could not load logo; OG art will be text only:', e?.message || e);
		return null;
	}
}

/** Satori can clip a single long flex child oddly; "Plugin" + name as spans avoids that. */
const mintChroma = { fontSize: 40, fontWeight: 600, color: '#9bfece', lineHeight: 1.2 };

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
					color: '#7c80b4',
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
					color: '#f3edf7',
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
					color: '#7c80b4',
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
				backgroundColor: '#070722',
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
				background: [
					'radial-gradient(ellipse 70% 55% at 18% 28%, rgba(155, 254, 206, 0.14) 0%, transparent 55%)',
					'radial-gradient(ellipse 55% 45% at 88% 72%, rgba(255, 245, 155, 0.09) 0%, transparent 50%)',
					'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(169, 174, 254, 0.06) 0%, transparent 45%)',
					'linear-gradient(165deg, #070722 0%, #0a0a2a 40%, #11112d 100%)',
				].join(', '),
			},
		}),
		h('div', {
			style: {
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: 1,
				background: 'linear-gradient(90deg, transparent, rgba(33, 33, 95, 0.9), transparent)',
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
	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	const out = resvg.render();
	const webp = await sharp(out.asPng()).webp(WEBP_OPTIONS).toBuffer();
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

function parseDescriptionFromMd(raw) {
	const m = raw.match(/^description:\s*(.+)$/m);
	if (!m) return '';
	return m[1].replace(/^["']|["']$/g, '').trim();
}

function parseTitleFromMd(raw) {
	const m = raw.match(/^title:\s*(.+)$/m);
	if (!m) return '';
	return m[1].replace(/^["']|["']$/g, '').trim();
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

	await w('og.webp', 'Home', 'Noctalia - a lightweight Wayland shell.');
	await w('og/blog.webp', 'Blog', 'News from the Noctalia team.');
	await w('og/changelog.webp', 'Changelog', 'Release notes for Noctalia v5 and later.');
	await w('og/plugins.webp', 'Plugins', 'Browse community and official plugins to extend your Noctalia setup.');
	await w('og/palettes.webp', 'Palettes', 'Explore color palettes for Noctalia.');
	await w(
		'og/contributors.webp',
		'Contributors',
		'Meet the people who contribute to Noctalia on GitHub.'
	);
	await w(
		'og/privacy.webp',
		'Privacy',
		'What Noctalia collects, how we use it, and your rights. Open source, transparent, opt-in only.'
	);
	await w(
		'og/ethos.webp',
		'Our Ethos',
		'How we work with the people who use and build Noctalia - a gift exchange, not a support contract.'
	);

	const blogDir = join(root, 'src/content/blog');
	const entries = await readdir(blogDir);
	for (const name of entries) {
		if (!name.endsWith('.md')) continue;
		const slug = name.replace(/\.md$/, '');
		const raw = await readFile(join(blogDir, name), 'utf8');
		const desc = parseDescriptionFromMd(raw) || 'News from the Noctalia team.';
		const postTitle = parseTitleFromMd(raw) || 'Blog';
		await w(`og/blog/${slug}.webp`, postTitle, desc);
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
			for (const row of rows) {
				const slug = typeof row.id === 'string' ? row.id.split('/').pop() : '';
				const plugin = {
					id: slug,
					name: typeof row.name === 'string' ? row.name : '',
					version: typeof row.version === 'string' ? row.version : '',
					author: typeof row.author === 'string' ? row.author : '',
					description: ''
				};
				try {
					const manifestRes = await fetch(`${base}/${slug}/plugin.toml`);
					if (manifestRes.ok) {
						const manifest = parseToml(await manifestRes.text());
						if (typeof manifest.description === 'string') plugin.description = manifest.description;
					}
				} catch {
					/* description stays empty */
				}
				if (!isValidPlugin(plugin)) continue;

				const outPathRel = `og/plugin/${source.slug}/${plugin.id}.webp`;
				const thumbnail = await fetchThumbnail(`${base}/${plugin.id}/thumbnail.webp`);
				if (thumbnail) {
					await writeOgThumbnail(outPathRel, thumbnail, globalDigest, prevCache, nextCache);
				} else {
					// No thumbnail in the repo: fall back to the generated title/description card.
					console.warn(`No thumbnail for ${source.slug}/${plugin.id}; using the generated card`);
					await w(outPathRel, 'Plugin: ' + plugin.name, plugin.description);
				}
			}
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
