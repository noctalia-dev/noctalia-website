import { error } from '@sveltejs/kit';
import { getChangelogRelease, getChangelogReleases } from '$lib/releases.server';
import { seoChangelogRelease } from '$lib/seo';

export async function entries() {
	const releases = await getChangelogReleases();
	return releases.map((release) => ({ tag: release.tagName }));
}

export async function load({ params }: { params: { tag: string } }) {
	const releases = await getChangelogReleases();
	const release = await getChangelogRelease(params.tag);

	if (!release) throw error(404, 'Release not found');

	const index = releases.findIndex((item) => item.tagName === release.tagName);
	return {
		release,
		newerRelease: index > 0 ? releases[index - 1] : null,
		olderRelease: index >= 0 && index < releases.length - 1 ? releases[index + 1] : null,
		seo: seoChangelogRelease(release)
	};
}
