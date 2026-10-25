import { getRegistryPlugins, isValidPlugin } from '$lib/plugins-registry.server';
import { knownTablerIcon } from '$lib/tabler-icons.server';
import { SEO_PLUGINS_INDEX } from '$lib/seo';

export async function load() {
	try {
		// Manifests may name icons this Tabler build lacks; resolve them here so the client
		// never has to probe computed styles across hundreds of cards.
		const plugins = (await getRegistryPlugins())
			.filter(isValidPlugin)
			.map((plugin) => ({ ...plugin, icon: knownTablerIcon(plugin.icon) }));
		return { plugins, seo: SEO_PLUGINS_INDEX };
	} catch (error) {
		console.error('Error fetching plugins:', error);
		return { plugins: [], seo: SEO_PLUGINS_INDEX };
	}
}
