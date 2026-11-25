import { SEO_HOME } from '#lib/seo-pages.js';
import { githubFetch } from '#lib/github.server.js';
import { getRegistryPlugins } from '#lib/plugins-registry.server.js';

async function projectStars(repo: string): Promise<number | null> {
	try {
		const response = await githubFetch(`https://api.github.com/repos/noctalia-dev/${repo}`);
		if (!response.ok) return null;
		const project = await response.json();
		return typeof project.stargazers_count === 'number' ? project.stargazers_count : null;
	} catch {
		return null;
	}
}

async function pluginCount(): Promise<number | null> {
	try {
		return (await getRegistryPlugins()).length || null;
	} catch {
		return null;
	}
}

export async function load() {
	const [count, shellStars, umbrielStars, lucioleStars] = await Promise.all([
		pluginCount(),
		projectStars('noctalia'),
		projectStars('umbriel'),
		projectStars('luciole')
	]);
	return {
		pluginCount: count,
		stars: { noctalia: shellStars, umbriel: umbrielStars, luciole: lucioleStars },
		seo: SEO_HOME
	};
}
