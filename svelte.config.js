import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404s for preview images (they may not exist for all plugins)
				if (path.includes('/preview.')) {
					console.warn(`Missing preview image: ${path}`);
					return;
				}
				// Ignore 404s for invalid plugin pages (malformed manifests)
				if (path.startsWith('/plugins/') && path !== '/plugins/') {
					console.warn(`Skipping invalid plugin page: ${path}`);
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
