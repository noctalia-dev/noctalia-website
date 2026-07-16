import { githubFetch } from '$lib/github.server';

export interface GithubRelease {
	tagName: string;
	name: string;
	publishedAt: string;
	htmlUrl: string;
	body: string;
	prerelease: boolean;
}

const releasesCache = {
	releases: [] as GithubRelease[],
	timestamp: 0
};

const CACHE_TTL = 60 * 60 * 1000;

function mapRelease(raw: any): GithubRelease {
	return {
		tagName: typeof raw.tag_name === 'string' ? raw.tag_name : '',
		name: typeof raw.name === 'string' ? raw.name : '',
		publishedAt: typeof raw.published_at === 'string' ? raw.published_at : '',
		htmlUrl: typeof raw.html_url === 'string' ? raw.html_url : '',
		body: typeof raw.body === 'string' ? raw.body : '',
		prerelease: Boolean(raw.prerelease)
	};
}

async function fetchAllReleases(): Promise<GithubRelease[]> {
	const all: GithubRelease[] = [];
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
				all.push(...releases.map(mapRelease));
				const linkHeader = response.headers.get('Link');
				hasMore = linkHeader?.includes('rel="next"') ?? releases.length === 100;
				ghPage++;
			}
		} else {
			hasMore = false;
		}
	}

	return all;
}

/** Cached fetch of every GitHub release for the main repo. Shared by the home page's release count and the changelog. */
export async function getAllReleases(): Promise<GithubRelease[]> {
	const now = Date.now();
	if (releasesCache.timestamp > 0 && now - releasesCache.timestamp < CACHE_TTL) {
		return releasesCache.releases;
	}
	try {
		const releases = await fetchAllReleases();
		releasesCache.releases = releases;
		releasesCache.timestamp = now;
		return releases;
	} catch {
		return releasesCache.releases;
	}
}
