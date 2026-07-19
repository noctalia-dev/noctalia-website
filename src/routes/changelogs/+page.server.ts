import { getChangelogReleases } from '$lib/releases.server';
import { SEO_CHANGELOG_INDEX } from '$lib/seo';

export async function load() {
	const releases = await getChangelogReleases();
	return { releases, seo: SEO_CHANGELOG_INDEX };
}
