const CATALOG_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/;

export function isValidPluginCatalogId(id: unknown): id is string {
	return typeof id === 'string' && CATALOG_ID.test(id);
}

export function pluginMetricKey(source: string, catalogId: string): string | null {
	if ((source !== 'official' && source !== 'community') || !isValidPluginCatalogId(catalogId)) {
		return null;
	}
	return `${source}:${catalogId}`;
}
