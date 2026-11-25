/**
 * Cuts the Tabler icon font and CSS (scripts/tabler-icons/, 5k+ icons) down to the icons the site
 * uses: every `ti-<name>` in src/ plus each plugin manifest's `icon`. Writes the committed
 * src/routes/tabler-icons.css and static/tabler-icons/tabler-icons.woff2.
 * If a plugin catalog can't be read, the committed files are kept so no plugin icon goes missing.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import subsetFont from 'subset-font';
import { parse as parseToml } from 'smol-toml';
import { PLUGIN_SOURCES, slugFromId } from '../src/lib/plugin-identity.ts';

const root = join(import.meta.dirname, '..');
const fullCss = await readFile(join(root, 'scripts/tabler-icons/tabler-icons.css'), 'utf8');
const RULE = /\.ti-([a-z0-9-]+):before \{\s*content: "\\([0-9a-f]+)";\s*\}/g;
const codepoints = new Map(Array.from(fullCss.matchAll(RULE), (m) => [m[1], m[2]]));

const used = new Set();
for (const entry of await readdir(join(root, 'src'), { recursive: true, withFileTypes: true })) {
	if (!entry.isFile() || !/\.(svelte|ts|js)$/.test(entry.name)) continue;
	const text = await readFile(join(entry.parentPath, entry.name), 'utf8');
	for (const [, name] of text.matchAll(/\bti-([a-z0-9-]+)/g)) used.add(name);
}

async function fetchText(url) {
	const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
	if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
	return res.text();
}

try {
	for (const source of PLUGIN_SOURCES) {
		const base = `https://raw.githubusercontent.com/noctalia-dev/${source.repo}/main`;
		const rows = parseToml(await fetchText(`${base}/catalog.toml`)).plugin ?? [];
		const slugs = rows.map((row) => slugFromId(row.id)).filter(Boolean);
		for (let i = 0; i < slugs.length; i += 16) {
			const manifests = await Promise.all(
				slugs.slice(i, i + 16).map((slug) => fetchText(`${base}/${slug}/plugin.toml`).catch(() => ''))
			);
			for (const raw of manifests) {
				const icon = raw && parseToml(raw).icon;
				if (typeof icon === 'string') used.add(icon.trim());
			}
		}
	}
} catch (e) {
	console.warn('Icons: plugin catalog unavailable, keeping the committed subset:', e?.message || e);
	process.exit(0);
}

const names = [...used].filter((name) => codepoints.has(name)).sort();
const text = names.map((n) => String.fromCodePoint(parseInt(codepoints.get(n), 16))).join('');
const font = await subsetFont(await readFile(join(root, 'scripts/tabler-icons/tabler-icons.woff2')), text, {
	targetFormat: 'woff2'
});
// Content hash in the URL so browsers drop a cached font when the icon set changes.
const version = createHash('sha256').update(font).digest('hex').slice(0, 10);
const head = fullCss
	.slice(0, fullCss.indexOf('.ti-'))
	.replace(/tabler-icons\.woff2\?[^")]*/, `tabler-icons.woff2?${version}`);
const css = head + names.map((n) => `.ti-${n}:before {\n  content: "\\${codepoints.get(n)}";\n}\n`).join('\n');
await writeFile(join(root, 'src/routes/tabler-icons.css'), css);
await writeFile(join(root, 'static/tabler-icons/tabler-icons.woff2'), font);
console.log(`Icons: kept ${names.length} of ${codepoints.size} (${font.length} bytes of font).`);
