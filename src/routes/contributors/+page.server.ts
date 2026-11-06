import { getShellContributors, shellRepoUrl } from '#lib/contributors.server.js';
import { SEO_CONTRIBUTORS } from '#lib/seo.js';

export async function load() {
	const contributors = await getShellContributors();
	return { contributors, repoUrl: shellRepoUrl(), seo: SEO_CONTRIBUTORS };
}
