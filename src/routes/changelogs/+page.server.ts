import { getChangelogReleases } from '#lib/releases.server.js';
import { SEO_CHANGELOG_INDEX } from '#lib/seo.js';

export async function load() {
	const releases = await getChangelogReleases();
	return { releases, seo: SEO_CHANGELOG_INDEX };
}
