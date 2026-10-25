/**
 * Auto-discovered slideshow images.
 *
 * Drop image files into `src/lib/assets/slideshow/` and they are picked up
 * automatically at build time — no manifest to maintain. Filenames are sorted
 * naturally (slide-2 before slide-10) and used to derive alt text, so prefer
 * descriptive kebab-case names, e.g. `bar-and-launcher.webp`.
 */

export type SlideImage = { src: string; alt: string };

const modules = import.meta.glob('./assets/slideshow/*.{png,jpg,jpeg,webp,avif}', {
	eager: true,
	query: '?url',
	import: 'default'
}) as Record<string, string>;

function altFromPath(path: string): string {
	const file = path.split('/').pop() ?? '';
	const words = file
		.replace(/\.[^.]+$/, '')
		.replace(/[-_]+/g, ' ')
		.trim();
	return words ? `Noctalia screenshot - ${words}` : 'Noctalia screenshot';
}

export const slideshowImages: SlideImage[] = Object.keys(modules)
	.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
	.map((path) => ({ src: modules[path], alt: altFromPath(path) }));
