import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sourceDir = join(root, 'src/lib/assets/slideshow');
const outputPath = join(root, 'static/github-showcase.webp');
const hashPath = join(root, 'static/.github-showcase-hash');

const WIDTH = 960;
const HEIGHT = 540;
const DELAY = 4000;
const ENCODING = { quality: 72, effort: 5, loop: 0 };
const VERSION = 2;
const supportedExtensions = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp']);

const filenames = (await readdir(sourceDir))
	.filter((filename) => supportedExtensions.has(extname(filename).toLowerCase()))
	.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

if (filenames.length === 0) {
	throw new Error(`No slideshow images found in ${sourceDir}`);
}

const sources = await Promise.all(filenames.map((filename) => readFile(join(sourceDir, filename))));
const digest = createHash('sha256')
	.update(String(VERSION))
	.update(JSON.stringify({ width: WIDTH, height: HEIGHT, delay: DELAY, encoding: ENCODING }))
	.update(filenames.join('\0'));
for (const source of sources) digest.update(source);
const inputHash = digest.digest('hex');

try {
	if ((await readFile(hashPath, 'utf8')).trim() === inputHash) {
		console.log('GitHub showcase is up to date.');
		process.exit(0);
	}
} catch {
	// A missing cache file means the showcase needs to be generated.
}

async function renderFrame(source) {
	const foreground = await sharp(source)
		.resize(WIDTH, HEIGHT, {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		})
		.png()
		.toBuffer();

	return sharp(source)
		.resize(WIDTH, HEIGHT, { fit: 'cover' })
		.blur(28)
		.modulate({ brightness: 0.45, saturation: 1.3 })
		.composite([{ input: foreground }])
		.ensureAlpha()
		.raw()
		.toBuffer();
}

const frames = await Promise.all(sources.map(renderFrame));
const animation = sharp(Buffer.concat(frames), {
	raw: {
		width: WIDTH,
		height: HEIGHT * frames.length,
		channels: 4,
		pageHeight: HEIGHT
	}
});

await animation.webp({ ...ENCODING, delay: Array(frames.length).fill(DELAY) }).toFile(outputPath);
await writeFile(hashPath, `${inputHash}\n`, 'utf8');
console.log(`Generated ${outputPath} from ${frames.length} slideshow images.`);
