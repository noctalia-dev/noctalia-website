import { env } from '$env/dynamic/private';
import coreColorschemes from '$lib/data/core-colorschemes.json';

const swatchKeys = ['mPrimary', 'mSecondary', 'mTertiary', 'mError', 'mSurface', 'mSurfaceVariant'];
const extractSwatches = (variant: any) => swatchKeys.map(k => variant?.[k]).filter(Boolean);

export async function load() {
	// Process core themes from static file
	const coreThemes = (coreColorschemes.themes || []).map((theme: any) => ({
		name: theme.name,
		path: theme.path,
		html_url: `https://github.com/noctalia-dev/noctalia-shell/tree/main/Assets/ColorScheme/${encodeURIComponent(theme.path)}`,
		swatches: extractSwatches(theme.dark),
		darkSwatches: extractSwatches(theme.dark),
		lightSwatches: extractSwatches(theme.light)
	})).sort((a: any, b: any) => a.name.localeCompare(b.name));

	// Fetch community themes from GitHub
	let communityThemes: any[] = [];
	try {
		const headers: Record<string, string> = {
			'Accept': 'application/vnd.github.v3+json',
			'User-Agent': 'Noctalia-Website'
		};

		if (env.GITHUB_TOKEN) {
			headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
		}

		const response = await fetch('https://raw.githubusercontent.com/noctalia-dev/noctalia-colorschemes/main/registry.json', { headers });
		if (response.ok) {
			const data = await response.json();
			communityThemes = (data.themes || []).map((theme: any) => ({
				name: theme.name,
				path: theme.path,
				html_url: `https://github.com/noctalia-dev/noctalia-colorschemes/tree/main/${encodeURIComponent(theme.path)}`,
				swatches: extractSwatches(theme.dark),
				darkSwatches: extractSwatches(theme.dark),
				lightSwatches: extractSwatches(theme.light)
			})).sort((a: any, b: any) => a.name.localeCompare(b.name));
		} else {
			console.error('Failed to fetch community themes registry, status:', response.status);
		}
	} catch (error) {
		console.error('Error fetching community themes:', error);
	}

	return { coreThemes, communityThemes };
}
