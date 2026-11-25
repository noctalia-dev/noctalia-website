// No imports: scripts/build-og.mjs loads this file directly, so the site and the OG cards share one rule.
const CATALOG_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/;
const REQUIRED_FIELDS = ['id', 'name', 'version', 'author'] as const;
const RESERVED_IDS = ['license', 'readme', 'index', 'api', 'admin', 'static', 'assets'];

/**
 * Plugin sources, listed/rendered in this order: official first, then community.
 * `slug` namespaces a plugin's URL (/plugins/<slug>/<plugin>): folder names are only unique
 * within one source, so `noctalia/timer` and `someone/timer` can coexist across the two repos.
 * It also says which source a plugin came from - test `source === 'official'`.
 */
export const PLUGIN_SOURCES = [
	{ repo: 'official-plugins', slug: 'official' },
	{ repo: 'community-plugins', slug: 'community' }
] as const;

export function isValidPluginCatalogId(id: unknown): id is string {
	return typeof id === 'string' && CATALOG_ID.test(id);
}

/** Derive the folder slug (URL + raw path segment) from a namespaced catalog id. */
export function slugFromId(catalogId: unknown): string {
	if (typeof catalogId !== 'string') return '';
	return catalogId.split('/').pop() ?? '';
}

export function isValidPlugin(plugin: Record<string, unknown>): boolean {
	for (const field of REQUIRED_FIELDS) {
		const value = plugin[field];
		if (typeof value !== 'string' || value.trim() === '') return false;
	}
	const id = plugin.id as string; // checked above
	if (!isValidPluginCatalogId(plugin.catalogId) || id !== slugFromId(plugin.catalogId)) return false;
	return !RESERVED_IDS.includes(id.toLowerCase());
}

export function pluginMetricKey(source: string, catalogId: string): string | null {
	if ((source !== 'official' && source !== 'community') || !isValidPluginCatalogId(catalogId)) {
		return null;
	}
	return `${source}:${catalogId}`;
}
