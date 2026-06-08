import { SEO_HOME } from '$lib/seo';
import { githubFetch } from '$lib/github.server';

async function getPluginCount(): Promise<number> {
	try {
		const response = await fetch(
			'https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/registry.json'
		);
		if (response.ok) {
			const data = await response.json();
			return data.plugins?.length || 0;
		}
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
