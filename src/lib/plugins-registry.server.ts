import { parse as parseToml } from 'smol-toml';
import { githubFetch } from '$lib/github.server';

const REQUIRED_FIELDS = ['id', 'name', 'version', 'author'] as const;
const RESERVED_IDS = ['license', 'readme', 'index', 'api', 'admin', 'static', 'assets'];

/**
 * Plugin sources, listed/rendered in this order: official first, then community.
 * `slug` namespaces a plugin's URL (/plugins/<slug>/<plugin>): folder names are only unique
 * within one source, so `noctalia/timer` and `someone/timer` can coexist across the two repos.
 * It also says which source a plugin came from - test `source === 'official'`.
 */
const PLUGIN_SOURCES = [
	{ repo: 'official-plugins', slug: 'official' },
	{ repo: 'community-plugins', slug: 'community' }
] as const;

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
	if (!/^[a-z0-9][a-z0-9_-]*[a-z0-9]$|^[a-z0-9]$/.test(id)) {
		return false;
	}
	if (RESERVED_IDS.includes(id.toLowerCase())) {
		return false;
	}
	return true;
}

/** Derive the folder slug (URL + raw path segment) from a namespaced catalog id. */
function slugFromId(catalogId: unknown): string {
	if (typeof catalogId !== 'string') return '';
	return catalogId.split('/').pop() ?? '';
}

/** Fetch a plugin's plugin.toml and merge the fields the catalog omits (description, icon). */
async function enrich(row: any, source: (typeof PLUGIN_SOURCES)[number]): Promise<any> {
	const slug = slugFromId(row.id);
	const base = {
		id: slug,
		name: typeof row.name === 'string' ? row.name : '',
		version: typeof row.version === 'string' ? row.version : '',
		author: typeof row.author === 'string' ? row.author : '',
		description: '',
		minNoctalia: typeof row.min_noctalia === 'string' ? row.min_noctalia : '',
		tags: Array.isArray(row.tags) ? row.tags : [],
		source: source.slug,
		repo: source.repo
	};
	if (!slug) return base;
	try {
		const response = await githubFetch(
			`https://raw.githubusercontent.com/noctalia-dev/${source.repo}/main/${slug}/plugin.toml`
		);
		if (!response.ok) return base;
		const manifest = parseToml(await response.text()) as any;
		return {
			...base,
			description: typeof manifest.description === 'string' ? manifest.description : '',
			icon: typeof manifest.icon === 'string' ? manifest.icon : undefined
		};
	} catch {
		return base;
	}
}

/** Fetch and normalize one source's catalog.toml; returns [] if the repo/catalog is absent. */
async function fetchSource(source: (typeof PLUGIN_SOURCES)[number]): Promise<any[]> {
	try {
		const response = await githubFetch(
			`https://raw.githubusercontent.com/noctalia-dev/${source.repo}/main/catalog.toml`
		);
		if (!response.ok) return [];
		const catalog = parseToml(await response.text()) as any;
		const rows = Array.isArray(catalog.plugin) ? catalog.plugin : [];
		return Promise.all(rows.map((row: any) => enrich(row, source)));
	} catch {
		return [];
	}
}

/**
 * Cached fetch of the public plugin catalogs (official + community), in source order.
 * Shared by the plugins list, detail page, and SEO resolver.
 */
export async function getRegistryPlugins(): Promise<any[]> {
	const now = Date.now();
	if (pluginsCache.timestamp > 0 && now - pluginsCache.timestamp < CACHE_TTL) {
		return pluginsCache.plugins;
	}
	try {
		const sources = await Promise.all(PLUGIN_SOURCES.map(fetchSource));
		const plugins = sources.flat();
		pluginsCache.plugins = plugins;
		pluginsCache.timestamp = now;
		return plugins;
	} catch {
		return pluginsCache.plugins.length > 0 ? pluginsCache.plugins : [];
	}
}
