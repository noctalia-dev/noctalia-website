export async function load() {
	try {
		const headers = {
			'Accept': 'application/vnd.github.v3+json',
			'User-Agent': 'Noctalia-Website'
		};

		const rootRes = await fetch('https://api.github.com/repos/noctalia-dev/noctalia-colorschemes/contents/', { headers });
		if (!rootRes.ok) {
			console.error('Failed to fetch themes index, status:', rootRes.status, await rootRes.text().catch(() => ''));
			return { themes: [] };
		}
		const rootItems = await rootRes.json();

		const dirs = (rootItems || []).filter((i: any) => i.type === 'dir');

		const themes = await Promise.all(dirs.map(async (dir: any) => {
			try {
				const dirRes = await fetch(dir.url, { headers });
				if (!dirRes.ok) return null;
				const dirItems = await dirRes.json();
				const jsonFile = (dirItems || []).find((f: any) => f.type === 'file' && f.name.toLowerCase().endsWith('.json'));
				if (!jsonFile) return null;
				const jsonRes = await fetch(jsonFile.download_url);
				if (!jsonRes.ok) return null;
				const json = await jsonRes.json();

			const preferKeys = ['mPrimary','mSecondary','mTertiary','mError','mSurface','mSurfaceVariant'];
			
			const darkVariant = json.dark || json;
			const lightVariant = json.light || json;
			
			const darkSwatches = preferKeys.map(k => darkVariant[k]).filter(Boolean);
			const lightSwatches = preferKeys.map(k => lightVariant[k]).filter(Boolean);

			return {
				name: dir.name,
				path: dir.path,
				html_url: dir.html_url,
				swatches: darkSwatches,
				darkSwatches,
				lightSwatches
				};
			} catch (err) {
				console.error('Error loading theme', dir.name, err);
				return null;
			}
		}));

		const clean = themes.filter(Boolean) as any[];
		return { themes: clean.sort((a: any, b: any) => a.name.localeCompare(b.name)) };
	} catch (error) {
		console.error('Error fetching themes:', error);
		return { themes: [] };
	}
}
