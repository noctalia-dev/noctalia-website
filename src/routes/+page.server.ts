import { SEO_HOME } from '$lib/seo';
import { githubFetch } from '$lib/github.server';
import { getRegistryPlugins, isValidPlugin } from '$lib/plugins-registry.server';

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
		return (await getRegistryPlugins()).filter(isValidPlugin).length || null;
	} catch {
		return null;
	}
}

export async function load() {
	const [count, shellStars, umbrielStars] = await Promise.all([
		pluginCount(),
		projectStars('noctalia'),
		projectStars('umbriel')
	]);
	return {
		pluginCount: count,
		stars: { noctalia: shellStars, umbriel: umbrielStars },
		seo: SEO_HOME
	};
}
