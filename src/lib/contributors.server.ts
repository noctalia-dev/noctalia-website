export type Contributor = {
	login: string;
	avatarUrl: string;
	profileUrl: string;
	contributions: number;
};

const REPO_URL = 'https://github.com/noctalia-dev/noctalia';
import { githubFetch } from '$lib/github.server';

const CONTRIBUTORS_URL = 'https://api.github.com/repos/noctalia-dev/noctalia/contributors';

function parseContributor(raw: {
	login?: string;
	avatar_url?: string;
	html_url?: string;
	contributions?: number;
}): Contributor | null {
	if (!raw.login || !raw.avatar_url || !raw.html_url) return null;
	return {
		login: raw.login,
		avatarUrl: raw.avatar_url,
		profileUrl: raw.html_url,
		contributions: raw.contributions ?? 0
	};
}

export async function getShellContributors(): Promise<Contributor[]> {
	const contributors: Contributor[] = [];
	let page = 1;
	let hasMore = true;
	const maxPages = 10;

	while (hasMore && page <= maxPages) {
		let response: Response;
		try {
			response = await githubFetch(`${CONTRIBUTORS_URL}?per_page=100&page=${page}`);
		} catch (err) {
			// githubFetch retries transient failures itself; if it still threw, GitHub is
			// unreachable. Return whatever contributors we already gathered instead of
			// failing the whole page build.
			console.error('Failed to fetch contributors:', err);
			break;
		}
		if (!response.ok) {
			console.error('Failed to fetch contributors, status:', response.status);
			break;
		}

		const batch = await response.json();
		if (!Array.isArray(batch) || batch.length === 0) {
			hasMore = false;
			break;
		}

		for (const raw of batch) {
			const contributor = parseContributor(raw);
			if (contributor) contributors.push(contributor);
		}

		const linkHeader = response.headers.get('Link');
		hasMore = linkHeader?.includes('rel="next"') ?? batch.length === 100;
		page++;
	}

	return contributors;
}

export function shellRepoUrl(): string {
	return REPO_URL;
}
