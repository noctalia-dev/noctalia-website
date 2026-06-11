import { SEO_HOME } from '$lib/seo';
import { githubFetch } from '$lib/github.server';
import { getRegistryPlugins, isValidPlugin } from '$lib/plugins-registry.server';

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
		const allReleases: unknown[] = [];
		let ghPage = 1;
		let hasMore = true;
		const maxPages = 10;

		while (hasMore && ghPage <= maxPages) {
			const response = await githubFetch(
				`https://api.github.com/repos/noctalia-dev/noctalia/releases?per_page=100&page=${ghPage}`
			);

			if (!response.ok) break;

			const releases = await response.json();
			if (Array.isArray(releases)) {
				if (releases.length === 0) {
					hasMore = false;
				} else {
					allReleases.push(...releases);
					const linkHeader = response.headers.get('Link');
					hasMore = linkHeader?.includes('rel="next"') ?? releases.length === 100;
					ghPage++;
				}
			} else {
				hasMore = false;
			}
		}

		return allReleases.length;
	} catch (err) {
		console.error('Error fetching release count:', err);
	}
	return 0;
}

export async function load() {
	const [pluginCount, releaseCount] = await Promise.all([getPluginCount(), getReleaseCount()]);
	return { pluginCount, releaseCount, seo: SEO_HOME };
}
