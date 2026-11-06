import { SEO_SHELL } from '#lib/seo.js';
import { getRegistryPlugins, isValidPlugin } from '#lib/plugins-registry.server.js';
import { getAllReleases } from '#lib/releases.server.js';

async function getPluginCount(): Promise<number> {
	try {
		const plugins = await getRegistryPlugins();
		return plugins.filter(isValidPlugin).length;
	} catch (err) {
		console.error('Error fetching plugin count:', err);
	}
	return 0;
}

async function getReleaseCount(): Promise<number> {
	try {
		return (await getAllReleases()).length;
	} catch (err) {
		console.error('Error fetching release count:', err);
	}
	return 0;
}

export async function load() {
	const [pluginCount, releaseCount] = await Promise.all([getPluginCount(), getReleaseCount()]);
	return { pluginCount, releaseCount, seo: SEO_SHELL };
}
