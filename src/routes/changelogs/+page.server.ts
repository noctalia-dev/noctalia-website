import { getChangelogReleases } from '#lib/releases.server.js';
import { SEO_CHANGELOG_INDEX } from '#lib/seo-pages.js';

export async function load() {
	// The index only lists releases; bodies load on each release page.
	const releases = (await getChangelogReleases()).map(({ tagName, publishedAt, prerelease }) => ({
		tagName,
		publishedAt,
		prerelease
	}));
	return { releases, seo: SEO_CHANGELOG_INDEX };
}
