import { env } from '$env/dynamic/private';

export async function load() {
	try {
		const headers: Record<string, string> = {
			'Accept': 'application/vnd.github.v3+json',
			'User-Agent': 'Noctalia-Website'
		};

		if (env.GITHUB_TOKEN) {
			headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
		}

		const response = await fetch('https://raw.githubusercontent.com/noctalia-dev/noctalia-colorschemes/main/registry.json', { headers });
		if (!response.ok) {
			console.error('Failed to fetch themes registry, status:', response.status);
			return { themes: [] };
		}

		const data = await response.json();
		const swatchKeys = ['mPrimary', 'mSecondary', 'mTertiary', 'mError', 'mSurface', 'mSurfaceVariant'];
		const extractSwatches = (variant: any) => swatchKeys.map(k => variant?.[k]).filter(Boolean);

		const themes = (data.themes || []).map((theme: any) => ({
			name: theme.name,
			path: theme.path,
			html_url: `https://github.com/noctalia-dev/noctalia-colorschemes/tree/main/${encodeURIComponent(theme.path)}`,
			swatches: extractSwatches(theme.dark),
			darkSwatches: extractSwatches(theme.dark),
			lightSwatches: extractSwatches(theme.light)
		}));

		return { themes: themes.sort((a: any, b: any) => a.name.localeCompare(b.name)) };
	} catch (error) {
		console.error('Error fetching themes:', error);
		return { themes: [] };
	}
}
