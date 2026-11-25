import { getRegistryPlugins } from '#lib/plugins-registry.server.js';
import { knownTablerIcon } from '#lib/tabler-icons.server.js';
import { SEO_PLUGINS_INDEX } from '#lib/seo-pages.js';

export async function load() {
	try {
		// Manifests may name icons this Tabler build lacks; resolve them here so the client
		// never has to probe computed styles across hundreds of cards.
		// The list never shows version history, so `releases` stays out of the page data.
		const plugins = (await getRegistryPlugins()).map(({ releases, ...plugin }) => ({
			...plugin,
			icon: knownTablerIcon(plugin.icon)
		}));
		return { plugins, seo: SEO_PLUGINS_INDEX };
	} catch (error) {
		console.error('Error fetching plugins:', error);
		return { plugins: [], seo: SEO_PLUGINS_INDEX };
	}
}
