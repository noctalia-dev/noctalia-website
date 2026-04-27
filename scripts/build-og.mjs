/**
 * Writes PNGs into static/og/** for Open Graph. Run automatically before `vite build` (see package.json "prebuild").
 * Mint line = `pathLabel`; body = the same `description` as in `src/lib/seo.ts` for that URL.
 * Logo is vertically centered with the text block (Satori `alignItems: 'center'` on the row).
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { createElement as h } from 'react';
import satori from 'satori';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const NOCTALIA_LOGO_SVG_URL = 'https://assets.noctalia.dev/noctalia-logo.svg';

const interLatin = (weight) =>
	readFile(join(root, 'node_modules/@fontsource/inter/files', `inter-latin-${weight}-normal.woff`));

function clip(s, max = 240) {
	const t = s.replace(/\s+/g, ' ').trim();
	if (t.length <= max) return t;
	return `${t.slice(0, max - 1).trim()}…`;
}

const REQUIRED_FIELDS = ['id', 'name', 'version', 'author', 'description', 'license', 'lastUpdated'];
const RESERVED_IDS = ['license', 'readme', 'index', 'api', 'admin', 'static', 'assets'];

function isValidPlugin(plugin) {
	if (!plugin || typeof plugin !== 'object') return false;
	for (const field of REQUIRED_FIELDS) {
		if (typeof plugin[field] !== 'string' || !plugin[field].trim()) return false;
	}
	const id = plugin.id;
	if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(id)) return false;
	if (RESERVED_IDS.includes(id.toLowerCase())) return false;
	return true;
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

async function writeOg(outPathRel, pathLabel, bodyText, logoDataUrl) {
	const fonts = [
		{ name: 'Inter', data: await interLatin(400), weight: 400, style: 'normal' },
		{ name: 'Inter', data: await interLatin(600), weight: 600, style: 'normal' },
	];
	const tree = buildTree(pathLabel, bodyText, logoDataUrl);
	const svg = await satori(tree, { width: 1200, height: 630, fonts });
	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	const out = resvg.render();
	const abs = join(root, 'static', outPathRel);
	await mkdir(dirname(abs), { recursive: true });
	await writeFile(abs, out.asPng());
	console.log(`Wrote static/${outPathRel}`);
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
		console.log('SKIP_OG set — skipping build-og.mjs');
		return;
	}

	const logo = await loadLogoDataUrl();

	await writeOg('og.png', 'Home', 'Noctalia - a lightweight Wayland shell.', logo);
	await writeOg('og/blog.png', 'Blog', 'News from the Noctalia team.', logo);
	await writeOg(
		'og/plugins.png',
		'Plugins',
		'Browse community and official plugins to extend your Noctalia setup.',
		logo
	);
	await writeOg('og/palettes.png', 'Palettes', 'Explore color palettes for Noctalia Shell.', logo);
	await writeOg(
		'og/privacy.png',
		'Privacy',
		'What Noctalia Shell collects, how we use it, and your rights. Open source, transparent, opt-in only.',
		logo
	);

	const blogDir = join(root, 'src/content/blog');
	const entries = await readdir(blogDir);
	for (const name of entries) {
		if (!name.endsWith('.md')) continue;
		const slug = name.replace(/\.md$/, '');
		const raw = await readFile(join(blogDir, name), 'utf8');
		const desc = parseDescriptionFromMd(raw) || 'News from the Noctalia team.';
		const postTitle = parseTitleFromMd(raw) || 'Blog';
		await writeOg(`og/blog/${slug}.png`, postTitle, desc, logo);
	}

	try {
		const res = await fetch('https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/registry.json');
		if (res.ok) {
			const data = await res.json();
			const plugins = (data.plugins || []).filter(isValidPlugin);
			for (const p of plugins) {
				const mint = 'Plugin: ' + p.name;
				await writeOg(`og/plugin/${p.id}.png`, mint, p.description, logo);
			}
		} else {
			console.warn('Skipping plugin OG images: registry returned', res.status);
		}
	} catch (e) {
		console.warn('Skipping plugin OG images (offline or network error):', e?.message || e);
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
