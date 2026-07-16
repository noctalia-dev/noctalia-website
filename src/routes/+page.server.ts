import { SEO_HOME } from '$lib/seo';
import { getRegistryPlugins, isValidPlugin } from '$lib/plugins-registry.server';
import { getAllReleases } from '$lib/releases.server';

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
	return { pluginCount, releaseCount, seo: SEO_HOME };
}
