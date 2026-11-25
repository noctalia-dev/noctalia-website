import { parse as parseToml } from 'smol-toml';
import { githubFetch } from '#lib/github.server.js';
import { isValidPlugin, PLUGIN_SOURCES, slugFromId } from '#lib/plugin-identity.js';

const pluginsCache = {
	plugins: [] as any[],
	timestamp: 0
};

const CACHE_TTL = 60 * 60 * 1000;

/** One older, still-installable revision of a plugin, from a catalog `[[plugin.release]]` row. */
export type PluginRelease = {
	version: string;
	apiVersion: number | null;
	updatedAt: number | null;
};

/** Catalog `[[plugin.release]]` rows, newest first; rows without a version are dropped. */
function normalizeReleases(value: unknown): PluginRelease[] {
	if (!Array.isArray(value)) return [];
	const releases: PluginRelease[] = [];
	for (const entry of value) {
		if (!entry || typeof entry !== 'object') continue;
		const row = entry as Record<string, unknown>;
		if (typeof row.version !== 'string') continue;
		releases.push({
			version: row.version,
			apiVersion: typeof row.plugin_api === 'number' ? row.plugin_api : null,
			updatedAt: typeof row.updated_at === 'number' ? row.updated_at : null
		});
	}
	return releases.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

/** Fetch a plugin's plugin.toml and merge the fields the catalog omits (description, icon). */
async function enrich(row: any, source: (typeof PLUGIN_SOURCES)[number]): Promise<any> {
	const slug = slugFromId(row.id);
	const base = {
		id: slug,
		catalogId: typeof row.id === 'string' ? row.id : '',
		name: typeof row.name === 'string' ? row.name : '',
		version: typeof row.version === 'string' ? row.version : '',
		author: typeof row.author === 'string' ? row.author : '',
		description: '',
		apiVersion: typeof row.plugin_api === 'number' ? row.plugin_api : null,
		updatedAt: typeof row.updated_at === 'number' ? row.updated_at : null,
		/** Older revisions, newest first; the tip version is not in this list. */
		releases: normalizeReleases(row.release),
		tags: Array.isArray(row.tags) ? row.tags : [],
		source: source.slug,
		repo: source.repo
	};
	if (!slug) return base;
	try {
		const response = await githubFetch(
			`https://raw.githubusercontent.com/noctalia-dev/${source.repo}/main/${slug}/plugin.toml`
		);
		if (!response.ok) {
			console.warn(`plugin.toml for ${source.repo}/${slug}: HTTP ${response.status}; shipping without description`);
			return base;
		}
		const manifest = parseToml(await response.text()) as any;
		return {
			...base,
			description: typeof manifest.description === 'string' ? manifest.description : '',
			icon: typeof manifest.icon === 'string' ? manifest.icon : undefined
		};
	} catch (err) {
		console.warn(`plugin.toml for ${source.repo}/${slug} failed; shipping without description:`, err);
		return base;
	}
}

/**
 * Fetch and normalize one source's catalog.toml; returns [] if the catalog is absent (404).
 * Other failures throw so a GitHub outage fails the build instead of shipping an empty store.
 */
async function fetchSource(source: (typeof PLUGIN_SOURCES)[number]): Promise<any[]> {
	const response = await githubFetch(
		`https://raw.githubusercontent.com/noctalia-dev/${source.repo}/main/catalog.toml`
	);
	if (response.status === 404) return [];
	if (!response.ok) {
		throw new Error(`Plugin catalog ${source.repo}: ${response.status} ${response.statusText}`);
	}
	const catalog = parseToml(await response.text()) as any;
	const rows = Array.isArray(catalog.plugin) ? catalog.plugin : [];
	return Promise.all(rows.map((row: any) => enrich(row, source)));
}

/**
 * Cached fetch of the public plugin catalogs (official + community), in source order.
 * Invalid rows are dropped here, so callers never see them.
 */
export async function getRegistryPlugins(): Promise<any[]> {
	const now = Date.now();
	if (pluginsCache.timestamp > 0 && now - pluginsCache.timestamp < CACHE_TTL) {
		return pluginsCache.plugins;
	}
	const plugins = (await Promise.all(PLUGIN_SOURCES.map(fetchSource))).flat().filter(isValidPlugin);
	if (plugins.length === 0) throw new Error('Plugin catalogs are empty');
	pluginsCache.plugins = plugins;
	pluginsCache.timestamp = now;
	return plugins;
}
