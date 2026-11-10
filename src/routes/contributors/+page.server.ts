import { CONTRIBUTOR_REPOS, getContributors } from '#lib/contributors.server.js';
import { getTranslators, TRANSLATE_URL } from '#lib/translators.server.js';
import { SEO_CONTRIBUTORS } from '#lib/seo.js';

export async function load() {
	const [contributors, translators] = await Promise.all([getContributors(), getTranslators()]);
	return {
		contributors,
		translators,
		repos: CONTRIBUTOR_REPOS,
		translateUrl: TRANSLATE_URL,
		seo: SEO_CONTRIBUTORS
	};
}
