// Simple in-memory cache with TTL
const pluginsCache = {
	plugins: [] as any[],
	timestamp: 0
};

const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

export async function load() {
	const now = Date.now();
	
	// Return cached data if still valid
	if (pluginsCache.timestamp > 0 && (now - pluginsCache.timestamp) < CACHE_TTL) {
		return {
			plugins: pluginsCache.plugins
		};
	}

	try {
		const response = await fetch('https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/registry.json');
		if (!response.ok) throw new Error('Failed to fetch plugins');
		const data = await response.json();
		
		const plugins = data.plugins || [];
		pluginsCache.plugins = plugins;
		pluginsCache.timestamp = now;
		
		return {
			plugins
		};
	} catch (error) {
		console.error('Error fetching plugins:', error);
		// Return cached data if available, otherwise empty array
		return {
			plugins: pluginsCache.plugins.length > 0 ? pluginsCache.plugins : []
		};
	}
}

