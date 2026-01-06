import { error } from '@sveltejs/kit';

// Simple in-memory cache with TTL
const pluginsCache = {
	plugins: [] as any[],
	timestamp: 0
};

const readmeCache = new Map<string, { content: string | null; timestamp: number }>();

const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

const REQUIRED_FIELDS = ['id', 'name', 'version', 'author', 'description', 'license', 'lastUpdated'] as const;
const RESERVED_IDS = ['license', 'readme', 'index', 'api', 'admin', 'static', 'assets'];

function isValidPlugin(plugin: any): boolean {
	if (!plugin || typeof plugin !== 'object') return false;

	// Check required fields
	for (const field of REQUIRED_FIELDS) {
		if (typeof plugin[field] !== 'string' || plugin[field].trim() === '') {
			console.warn(`Plugin "${plugin.id ?? 'unknown'}" missing required field: ${field}`);
			return false;
		}
	}

	// Validate ID format (lowercase alphanumeric with hyphens)
	const id = plugin.id;
	if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(id)) {
		console.warn(`Plugin "${id}" has invalid ID format`);
		return false;
	}

	// Block reserved IDs
	if (RESERVED_IDS.includes(id.toLowerCase())) {
		console.warn(`Plugin "${id}" uses reserved ID`);
		return false;
	}

	return true;
}

async function fetchPlugins() {
	const now = Date.now();

	// Return cached data if still valid
	if (pluginsCache.timestamp > 0 && (now - pluginsCache.timestamp) < CACHE_TTL) {
		return pluginsCache.plugins;
	}

	try {
		const response = await fetch('https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/registry.json');
		if (!response.ok) throw new Error('Failed to fetch plugins');
		const data = await response.json();

		const plugins = data.plugins || [];
		pluginsCache.plugins = plugins;
		pluginsCache.timestamp = now;

		return plugins;
	} catch (error) {
		console.error('Error fetching plugins:', error);
		// Return cached data if available, otherwise empty array
		return pluginsCache.plugins.length > 0 ? pluginsCache.plugins : [];
	}
}

async function fetchReadme(plugin: any): Promise<string | null> {
	const now = Date.now();
	const cached = readmeCache.get(plugin.id);

	if (cached && (now - cached.timestamp) < CACHE_TTL) {
		return cached.content;
	}

	const readmeUrl = `https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/${plugin.id}/README.md`;

	try {
		const response = await fetch(readmeUrl);
		if (!response.ok) {
			readmeCache.set(plugin.id, { content: null, timestamp: now });
			return null;
		}
		const content = await response.text();
		readmeCache.set(plugin.id, { content, timestamp: now });
		return content;
	} catch (err) {
		console.error(`Error fetching README for ${plugin.id}:`, err);
		readmeCache.set(plugin.id, { content: null, timestamp: now });
		return null;
	}
}

// Generate all plugin pages at build time
export async function entries() {
	const plugins = await fetchPlugins();
	return plugins
		.filter(isValidPlugin)
		.map((plugin: any) => ({
			name: plugin.id
		}));
}

export async function load({ params }: { params: { name: string } }) {
	const plugins = await fetchPlugins();
	const plugin = plugins.find((p: any) => p.id === params.name);

	if (!plugin || !isValidPlugin(plugin)) {
		throw error(404, 'Plugin not found');
	}

	const readme = await fetchReadme(plugin);

	return {
		plugin,
		readme
	};
}

