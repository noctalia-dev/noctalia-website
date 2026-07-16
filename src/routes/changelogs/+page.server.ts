import { getAllReleases, type GithubRelease } from '$lib/releases.server';
import { SEO_CHANGELOG_INDEX } from '$lib/seo';

const MIN_MAJOR_VERSION = 5;

function majorVersion(tagName: string): number | null {
	const match = tagName.match(/^v?(\d+)\./);
	return match ? Number(match[1]) : null;
}

/** GitHub release bodies open with a "# Release vX.Y.Z" header; the page already renders the tag as its own heading. */
function stripLeadingReleaseHeader(body: string): string {
	return body.replace(/^#\s*Release\s+v[\d.]+[^\n]*\n?/, '').trim();
}

/** GitHub's own `prerelease` flag isn't reliably set when publishing betas, so also check the tag itself. */
function isPrerelease(release: GithubRelease): boolean {
	return release.prerelease || /-(?:beta|alpha|rc)/i.test(release.tagName);
}

export async function load() {
	const releases = (await getAllReleases())
		.filter((release) => (majorVersion(release.tagName) ?? -1) >= MIN_MAJOR_VERSION)
		.map((release) => ({
			...release,
			body: stripLeadingReleaseHeader(release.body),
			prerelease: isPrerelease(release)
		}))
		.sort(
			(a: GithubRelease, b: GithubRelease) =>
				new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
		);

	return { releases, seo: SEO_CHANGELOG_INDEX };
}
