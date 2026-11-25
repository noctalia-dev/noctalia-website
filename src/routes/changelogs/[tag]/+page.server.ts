import { error } from '@sveltejs/kit';
import { getChangelogReleases } from '#lib/releases.server.js';
import { seoChangelogRelease } from '#lib/seo.js';

export async function entries() {
	const releases = await getChangelogReleases();
	return releases.map((release) => ({ tag: release.tagName }));
}

export async function load({ params }: { params: { tag: string } }) {
	const releases = await getChangelogReleases();
	const index = releases.findIndex((item) => item.tagName === params.tag);
	if (index === -1) throw error(404, 'Release not found');

	const release = releases[index];
	return {
		release,
		newerTag: releases[index - 1]?.tagName ?? null,
		olderTag: releases[index + 1]?.tagName ?? null,
		seo: seoChangelogRelease(release)
	};
}
