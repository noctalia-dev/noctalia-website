import { error } from '@sveltejs/kit';
import { getRegistryPlugins, isValidPlugin } from '$lib/plugins-registry.server';
import { seoPlugin } from '$lib/seo';
import { githubFetch } from '$lib/github.server';

const readmeCache = new Map<string, { content: string | null; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000;

function rewriteRelativeUrls(content: string, repo: string, pluginId: string): string {
	const rawBase = `https://raw.githubusercontent.com/noctalia-dev/${repo}/main/${pluginId}/`;
	const githubBase = `https://github.com/noctalia-dev/${repo}/blob/main/${pluginId}/`;
	let result = content.replace(
		/!\[([^\]]*)\]\((?!https?:\/\/)(?!\/)([^)]+)\)/g,
		(_, alt, path) => `![${alt}](${rawBase}${path})`
	);
	result = result.replace(
		/(?<!!)\[([^\]]*)\]\((?!https?:\/\/)(?!\/)(?!#)([^)]+)\)/g,
		(_, text, path) => `[${text}](${githubBase}${path})`
	);
	return result;
}

async function fetchReadme(plugin: any): Promise<string | null> {
	const now = Date.now();
	const cached = readmeCache.get(plugin.id);
	if (cached && now - cached.timestamp < CACHE_TTL) {
		return cached.content;
	}
	const readmeUrl = `https://raw.githubusercontent.com/noctalia-dev/${plugin.repo}/main/${plugin.id}/README.md`;
	try {
		const response = await githubFetch(readmeUrl);
		if (!response.ok) {
			readmeCache.set(plugin.id, { content: null, timestamp: now });
			return null;
		}
		const raw = await response.text();
		const content = rewriteRelativeUrls(raw, plugin.repo, plugin.id);
		readmeCache.set(plugin.id, { content, timestamp: now });
		return content;
	} catch (err) {
		console.error(`Error fetching README for ${plugin.id}:`, err);
		readmeCache.set(plugin.id, { content: null, timestamp: now });
		return null;
	}
}

export async function entries() {
	const plugins = await getRegistryPlugins();
	return plugins.filter(isValidPlugin).map((plugin: any) => ({ name: plugin.id }));
}

export async function load({ params }: { params: { name: string } }) {
	const plugins = await getRegistryPlugins();
	const plugin = plugins.find((p: any) => p.id === params.name);
	if (!plugin || !isValidPlugin(plugin)) {
		throw error(404, 'Plugin not found');
	}
	const readme = await fetchReadme(plugin);
	return { plugin, readme, seo: seoPlugin(plugin) };
}
