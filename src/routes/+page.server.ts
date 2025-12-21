// Simple in-memory cache with TTL
const cache = {
	pluginCount: { value: 0, timestamp: 0 },
	releaseCount: { value: 0, timestamp: 0 }
};

const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

async function getPluginCount(): Promise<number> {
	const now = Date.now();
	if (cache.pluginCount.timestamp > 0 && (now - cache.pluginCount.timestamp) < CACHE_TTL) {
		return cache.pluginCount.value;
	}

	try {
		const response = await fetch('https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/registry.json');
		if (response.ok) {
			const data = await response.json();
			const count = data.plugins?.length || 0;
			cache.pluginCount = { value: count, timestamp: now };
			return count;
		}
	} catch (err) {
		console.error('Error fetching plugin count:', err);
	}
	
	// Return cached value if available, otherwise 0
	return cache.pluginCount.value || 0;
}

async function getReleaseCount(): Promise<number> {
	const now = Date.now();
	if (cache.releaseCount.timestamp > 0 && (now - cache.releaseCount.timestamp) < CACHE_TTL) {
		return cache.releaseCount.value;
	}

	try {
		let allReleases: any[] = [];
		let page = 1;
		let hasMore = true;
		const maxPages = 10; // Safety limit

		while (hasMore && page <= maxPages) {
			const response = await fetch(`https://api.github.com/repos/noctalia-dev/noctalia-shell/releases?per_page=100&page=${page}`, {
				headers: { 'Accept': 'application/vnd.github.v3+json' }
			});

			if (!response.ok) {
				break;
			}

			const releases = await response.json();
			if (Array.isArray(releases)) {
				if (releases.length === 0) {
					hasMore = false;
				} else {
					allReleases = allReleases.concat(releases);
					const linkHeader = response.headers.get('Link');
					hasMore = linkHeader?.includes('rel="next"') ?? (releases.length === 100);
					page++;
				}
			} else {
				hasMore = false;
			}
		}
		
		const count = allReleases.length;
		cache.releaseCount = { value: count, timestamp: now };
		return count;
	} catch (err) {
		console.error('Error fetching release count:', err);
	}
	
	// Return cached value if available, otherwise 0
	return cache.releaseCount.value || 0;
}

export async function load() {
	const [pluginCount, releaseCount] = await Promise.all([
		getPluginCount(),
		getReleaseCount()
	]);
	
	return {
		pluginCount,
		releaseCount
	};
}

