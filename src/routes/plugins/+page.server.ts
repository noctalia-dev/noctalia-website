import { getRegistryPlugins, isValidPlugin } from '$lib/plugins-registry.server';
import { SEO_PLUGINS_INDEX } from '$lib/seo';

export async function load() {
	try {
		const plugins = (await getRegistryPlugins()).filter(isValidPlugin);
		return { plugins, seo: SEO_PLUGINS_INDEX };
	} catch (error) {
		console.error('Error fetching plugins:', error);
		return { plugins: [], seo: SEO_PLUGINS_INDEX };
	}
}
