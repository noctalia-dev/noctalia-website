/**
 * Builds static/plugin-wall.webp: a tilted mosaic of every plugin thumbnail, used by the
 * home page plugins row. The most colourful, detailed thumbnails land in the centre; plain
 * ones drift to the faded edges. `scripts/plugin-wall.config.json` can pin (`featured`)
 * or drop (`exclude`) plugins by folder name.
 *
 * Source: a local checkout of community-plugins (PLUGIN_THUMBS_DIR, default
 * ../community-plugins). Without one the committed image is kept, so CI needs nothing.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = resolve(process.env.PLUGIN_THUMBS_DIR ?? join(root, '../community-plugins'));
const outputPath = join(root, 'static/plugin-wall.webp');
const hashPath = join(root, 'static/.plugin-wall-hash');
const config = JSON.parse(await readFile(join(root, 'scripts/plugin-wall.config.json'), 'utf8'));

const VERSION = 1;
const COLS = 17;
const ROWS = 13;
const TILE_W = 384;
const TILE_H = 216;
const GAP = 18;
const RADIUS = 12;
const SCALE = 0.47;
const ANGLE = -8;
const OUT_W = 1600;
const OUT_H = 900;

if (!existsSync(sourceDir)) {
	console.log(`Plugin wall: ${sourceDir} not found, keeping the committed image.`);
	process.exit(0);
}

const exclude = new Set(config.exclude ?? []);
const folders = (await readdir(sourceDir, { withFileTypes: true }))
	.filter((entry) => entry.isDirectory() && !exclude.has(entry.name))
	.map((entry) => entry.name)
	.filter((name) => existsSync(join(sourceDir, name, 'thumbnail.webp')))
	.sort();
if (folders.length === 0) throw new Error(`No plugin thumbnails found in ${sourceDir}`);

const sources = await Promise.all(
	folders.map((name) => readFile(join(sourceDir, name, 'thumbnail.webp')))
);
const digest = createHash('sha256')
	.update(String(VERSION))
	.update(JSON.stringify({ config, COLS, ROWS, TILE_W, TILE_H, GAP, RADIUS, SCALE, ANGLE, OUT_W, OUT_H }));
folders.forEach((name, i) => digest.update(name).update(sources[i]));
const inputHash = digest.digest('hex');
try {
	if ((await readFile(hashPath, 'utf8')).trim() === inputHash) {
		console.log('Plugin wall is up to date.');
		process.exit(0);
	}
} catch {
	// No cache yet.
}

/** Score the screenshot half of a thumbnail: colour, detail and contrast, penalising glare. */
async function score(source) {
	const W = 96;
	const H = 90;
	const { data } = await sharp(source)
		.resize(160, 90, { fit: 'fill' })
		.extract({ left: 64, top: 0, width: W, height: H })
		.removeAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const lum = new Float64Array(W * H);
	let sat = 0;
	for (let i = 0; i < W * H; i++) {
		const r = data[i * 3] / 255;
		const g = data[i * 3 + 1] / 255;
		const b = data[i * 3 + 2] / 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		sat += max > 0 ? (max - min) / max : 0;
		lum[i] = (r + g + b) / 3;
	}
	let mean = 0;
	for (const l of lum) mean += l;
	mean /= lum.length;
	let variance = 0;
	let detail = 0;
	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const l = lum[y * W + x];
			variance += (l - mean) ** 2;
			if (x > 0) detail += Math.abs(l - lum[y * W + x - 1]) / (2 * (W - 1) * H);
			if (y > 0) detail += Math.abs(l - lum[(y - 1) * W + x]) / (2 * W * (H - 1));
		}
	}
	const std = Math.sqrt(variance / lum.length);
	return 0.8 * (sat / lum.length) + 12 * detail + 0.6 * std - 1.4 * Math.max(0, mean - 0.38);
}

const featured = config.featured ?? [];
const scores = await Promise.all(sources.map(score));
const ranked = folders
	.map((name, i) => ({ name, source: sources[i], score: scores[i] }))
	.sort((a, b) => {
		const fa = featured.indexOf(a.name);
		const fb = featured.indexOf(b.name);
		if (fa !== -1 || fb !== -1) return (fa === -1 ? Infinity : fa) - (fb === -1 ? Infinity : fb);
		return b.score - a.score;
	});

// Fill cells from the centre outwards (slightly wider than tall), best tiles first.
const cx = (COLS - 1) / 2;
const cy = (ROWS - 1) / 2;
const cells = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) cells.push([c, r]);
cells.sort(([ac, ar], [bc, br]) => ((ac - cx) / 1.6) ** 2 + (ar - cy) ** 2 - (((bc - cx) / 1.6) ** 2 + (br - cy) ** 2));

const tileMask = Buffer.from(
	`<svg width="${TILE_W}" height="${TILE_H}"><rect width="${TILE_W}" height="${TILE_H}" rx="${RADIUS}"/></svg>`
);
const tiles = await Promise.all(
	ranked.map(({ source }) =>
		sharp(source)
			.resize(TILE_W, TILE_H, { fit: 'cover' })
			.ensureAlpha()
			.composite([{ input: tileMask, blend: 'dest-in' }])
			.png()
			.toBuffer()
	)
);
const gridW = COLS * TILE_W + (COLS - 1) * GAP;
const gridH = ROWS * TILE_H + (ROWS - 1) * GAP;
const grid = await sharp({
	create: { width: gridW, height: gridH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
})
	.composite(
		cells.map(([c, r], i) => ({
			input: tiles[i % tiles.length],
			left: c * (TILE_W + GAP),
			top: r * (TILE_H + GAP)
		}))
	)
	.png()
	.toBuffer();

const tilted = await sharp(
	await sharp(grid)
		.resize(Math.round(gridW * SCALE))
		.png()
		.toBuffer()
)
	.rotate(ANGLE, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
	.png()
	.toBuffer({ resolveWithObject: true });
const { width: tw, height: th } = tilted.info;

// Fade towards the edges so the wall dissolves into whatever theme sits behind it.
const vignette = Buffer.from(
	`<svg width="${OUT_W}" height="${OUT_H}"><defs><radialGradient id="g" cx="50%" cy="50%" r="50%">` +
		`<stop offset="0.3" stop-color="#fff" stop-opacity="1"/><stop offset="0.72" stop-color="#fff" stop-opacity="0.3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>` +
		`</radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`
);
await sharp(tilted.data)
	.extract({
		left: Math.round((tw - OUT_W) / 2),
		top: Math.round((th - OUT_H) / 2),
		width: OUT_W,
		height: OUT_H
	})
	.composite([{ input: vignette, blend: 'dest-in' }])
	.webp({ quality: 74, alphaQuality: 90, effort: 6 })
	.toFile(outputPath);
await writeFile(hashPath, `${inputHash}\n`, 'utf8');
console.log(`Generated ${outputPath} from ${folders.length} plugin thumbnails.`);
