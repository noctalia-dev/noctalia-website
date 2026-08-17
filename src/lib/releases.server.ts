import { githubFetch } from '$lib/github.server';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export interface GithubRelease {
	tagName: string;
	name: string;
	publishedAt: string;
	htmlUrl: string;
	body: string;
	prerelease: boolean;
}

/**
 * Last-known-good snapshot of `getAllReleases()`, committed to the repo and refreshed
 * on every successful fetch. The changelog page and RSS feed are fully prerendered at
 * build time, so if the GitHub API is down or unreachable during a build there's no
 * request to retry later - this file is what keeps the changelog from silently going
 * empty. Update it by running a successful build with network access.
 *
 * Resolved from process.cwd() rather than import.meta.url: this module gets bundled by
 * Vite into .svelte-kit/output, where import.meta.url would point at the bundled chunk
 * instead of the source tree. The build/dev/prerender process always runs from the
 * project root, so process.cwd() reliably lands on the checked-in source file.
 */
const CACHE_FILE = join(process.cwd(), 'src/lib/data/releases-cache.json');

const releasesCache = {
	releases: null as GithubRelease[] | null,
	timestamp: 0
};

const CACHE_TTL = 60 * 60 * 1000;

function readDiskCache(): GithubRelease[] {
	try {
		const parsed = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function writeDiskCache(releases: GithubRelease[]): void {
	try {
		mkdirSync(dirname(CACHE_FILE), { recursive: true });
		writeFileSync(CACHE_FILE, JSON.stringify(releases, null, '\t') + '\n', 'utf-8');
	} catch (err) {
		// Non-fatal: worst case the on-disk snapshot goes stale, it doesn't break the build.
		console.error('Failed to persist releases cache to disk:', err);
	}
}

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

		if (!response.ok) {
			// A non-OK response here is a real failure, not end-of-pagination (GitHub signals
			// that with a 200 + empty array). Throw so the caller falls back to cached data
			// instead of silently caching a truncated/empty list as if it were current.
			throw new Error(
				`GitHub releases request failed: ${response.status} ${response.statusText}`
			);
		}

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

/**
 * Cached fetch of every GitHub release for the main repo. Shared by the home page's
 * release count and the changelog.
 *
 * Two cache layers: an in-memory TTL cache so one build doesn't hit the GitHub API more
 * than once an hour (the changelog page, the RSS feed, and the home page count all call
 * this during the same prerender crawl), and a disk-backed snapshot (see `CACHE_FILE`)
 * that survives across builds. If the live fetch fails for any reason, fall back to the
 * most recent snapshot rather than returning an empty list.
 */
export async function getAllReleases(): Promise<GithubRelease[]> {
	const now = Date.now();
	if (releasesCache.releases && now - releasesCache.timestamp < CACHE_TTL) {
		return releasesCache.releases;
	}
	try {
		const releases = await fetchAllReleases();
		releasesCache.releases = releases;
		releasesCache.timestamp = now;
		writeDiskCache(releases);
		return releases;
	} catch (err) {
		console.error('Failed to fetch GitHub releases, falling back to cached data:', err);
		const fallback = releasesCache.releases ?? readDiskCache();
		releasesCache.releases = fallback;
		releasesCache.timestamp = now; // avoid hammering a down API again within this build
		return fallback;
	}
}

const MIN_MAJOR_VERSION = 5;

function majorVersion(tagName: string): number | null {
	const match = tagName.match(/^v?(\d+)\./);
	return match ? Number(match[1]) : null;
}

/** GitHub release bodies open with a "# Release vX.Y.Z" header; callers render the tag as their own heading. */
function stripLeadingReleaseHeader(body: string): string {
	return body.replace(/^#\s*Release\s+v[\d.]+[^\n]*\n?/, '').trim();
}

/** GitHub's own `prerelease` flag isn't reliably set when publishing betas, so also check the tag itself. */
function isPrerelease(release: GithubRelease): boolean {
	return release.prerelease || /-(?:beta|alpha|rc)/i.test(release.tagName);
}

/** Releases for the public changelog: v5+ only, newest first, prerelease normalized, leading heading stripped. Shared by the changelog page and the RSS feed. */
export async function getChangelogReleases(): Promise<GithubRelease[]> {
	return (await getAllReleases())
		.filter((release) => (majorVersion(release.tagName) ?? -1) >= MIN_MAJOR_VERSION)
		.map((release) => ({
			...release,
			body: stripLeadingReleaseHeader(release.body),
			prerelease: isPrerelease(release)
		}))
		.sort(
			(a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
		);
}
