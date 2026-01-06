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

export async function load() {
	try {
		const response = await fetch('https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/registry.json');
		if (!response.ok) throw new Error('Failed to fetch plugins');
		const data = await response.json();
		const plugins = (data.plugins || []).filter(isValidPlugin);
		return { plugins };
	} catch (error) {
		console.error('Error fetching plugins:', error);
		return {
			plugins: []
		};
	}
}
