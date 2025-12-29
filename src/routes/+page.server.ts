async function getPluginCount(): Promise<number> {
	try {
		const response = await fetch('https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/registry.json');
		if (response.ok) {
			const data = await response.json();
			return data.plugins?.length || 0;
		}
	} catch (err) {
		console.error('Error fetching plugin count:', err);
	}
	return 0;
}

async function getReleaseCount(): Promise<number> {
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

		return allReleases.length;
	} catch (err) {
		console.error('Error fetching release count:', err);
	}
	return 0;
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

