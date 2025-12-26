// Simple in-memory cache with TTL
const pluginsCache = {
	plugins: [] as any[],
	timestamp: 0
};

const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

async function getPlugins() {
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

export async function load({ params }: { params: { name: string } }) {
	const plugins = await getPlugins();
	
	// Find plugin by id (which is used as the slug)
	const plugin = plugins.find((p: any) => p.id === params.name);
	
	if (!plugin) {
		return {
			status: 404,
			error: new Error('Plugin not found')
		};
	}
	
	return {
		plugin
	};
}

