import { githubFetch } from '#lib/github.server.js';

export const CONTRIBUTOR_REPOS = [
	{ id: 'noctalia', label: 'Noctalia', url: 'https://github.com/noctalia-dev/noctalia' },
	{ id: 'umbriel', label: 'Umbriel', url: 'https://github.com/noctalia-dev/umbriel' },
	{ id: 'official-plugins', label: 'Official plugins', url: 'https://github.com/noctalia-dev/official-plugins' }
] as const;

export type ContributorRepoId = (typeof CONTRIBUTOR_REPOS)[number]['id'];

export type Contributor = {
	login: string;
	avatarUrl: string;
	profileUrl: string;
	/** Commits summed across every repo in `CONTRIBUTOR_REPOS`. */
	contributions: number;
	/** Per-repo commits, in `CONTRIBUTOR_REPOS` order, nonzero only. */
	repos: { id: ContributorRepoId; contributions: number }[];
};

type RepoContributor = Omit<Contributor, 'repos'>;

function parseContributor(raw: {
	login?: string;
	avatar_url?: string;
	html_url?: string;
	contributions?: number;
	type?: string;
}): RepoContributor | null {
	if (!raw.login || !raw.avatar_url || !raw.html_url || raw.type === 'Bot') return null;
	return {
		login: raw.login,
		avatarUrl: raw.avatar_url,
		profileUrl: raw.html_url,
		contributions: raw.contributions ?? 0
	};
}

async function fetchRepoContributors(repo: string): Promise<RepoContributor[]> {
	const contributors: RepoContributor[] = [];
	let page = 1;
	let hasMore = true;
	const maxPages = 10;

	while (hasMore && page <= maxPages) {
		let response: Response;
		try {
			response = await githubFetch(
				`https://api.github.com/repos/noctalia-dev/${repo}/contributors?per_page=100&page=${page}`
			);
		} catch (err) {
			// githubFetch retries transient failures itself; if it still threw, GitHub is
			// unreachable. Return whatever contributors we already gathered instead of
			// failing the whole page build.
			console.error(`Failed to fetch contributors for ${repo}:`, err);
			break;
		}
		if (!response.ok) {
			console.error(`Failed to fetch contributors for ${repo}, status:`, response.status);
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

/** Contributors of every repo in `CONTRIBUTOR_REPOS`, merged by login, most commits first. */
export async function getContributors(): Promise<Contributor[]> {
	const perRepo = await Promise.all(CONTRIBUTOR_REPOS.map((repo) => fetchRepoContributors(repo.id)));
	const merged = new Map<string, Contributor>();

	CONTRIBUTOR_REPOS.forEach((repo, index) => {
		for (const c of perRepo[index]) {
			if (c.contributions === 0) continue;
			const key = c.login.toLowerCase();
			let entry = merged.get(key);
			if (!entry) {
				entry = { ...c, contributions: 0, repos: [] };
				merged.set(key, entry);
			}
			entry.contributions += c.contributions;
			entry.repos.push({ id: repo.id, contributions: c.contributions });
		}
	});

	return [...merged.values()].sort(
		(a, b) => b.contributions - a.contributions || a.login.localeCompare(b.login)
	);
}
