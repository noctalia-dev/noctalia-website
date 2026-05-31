import { githubFetch } from '$lib/github.server';

const REQUIRED_FIELDS = ['id', 'name', 'version', 'author', 'description', 'license', 'lastUpdated'] as const;
const RESERVED_IDS = ['license', 'readme', 'index', 'api', 'admin', 'static', 'assets'];

const pluginsCache = {
	plugins: [] as any[],
	timestamp: 0
};

const CACHE_TTL = 60 * 60 * 1000;

export function isValidPlugin(plugin: any): boolean {
	if (!plugin || typeof plugin !== 'object') return false;
	for (const field of REQUIRED_FIELDS) {
		if (typeof plugin[field] !== 'string' || plugin[field].trim() === '') {
			return false;
		}
	}
	const id = plugin.id;
	if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(id)) {
		return false;
	}
	if (RESERVED_IDS.includes(id.toLowerCase())) {
		return false;
	}
	return true;
}

/** Cached fetch of the public plugin registry (shared by plugins list, detail, SEO resolver). */
export async function getRegistryPlugins(): Promise<any[]> {
	const now = Date.now();
	if (pluginsCache.timestamp > 0 && now - pluginsCache.timestamp < CACHE_TTL) {
		return pluginsCache.plugins;
	}
	try {
		const response = await githubFetch(
			'https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/registry.json'
		);
		if (!response.ok) throw new Error('Failed to fetch plugins');
		const data = await response.json();
		const plugins = data.plugins || [];
		pluginsCache.plugins = plugins;
		pluginsCache.timestamp = now;
		return plugins;
	} catch {
		return pluginsCache.plugins.length > 0 ? pluginsCache.plugins : [];
	}
}
