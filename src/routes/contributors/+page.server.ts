import { getShellContributors, shellRepoUrl } from '$lib/contributors.server';
import { SEO_CONTRIBUTORS } from '$lib/seo';

export async function load() {
	const contributors = await getShellContributors();
	return { contributors, repoUrl: shellRepoUrl(), seo: SEO_CONTRIBUTORS };
}
