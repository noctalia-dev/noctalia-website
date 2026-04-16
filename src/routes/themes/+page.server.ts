import coreColorschemes from '$lib/data/core-colorschemes.json';

const coreSwatchKeys = ['mPrimary', 'mSecondary', 'mTertiary', 'mError', 'mSurface', 'mSurfaceVariant'];
const communitySwatchKeys = ['primary', 'secondary', 'tertiary', 'error', 'surface', 'surfaceVariant'];
const extractSwatches = (variant: any) => coreSwatchKeys.map(k => variant?.[k]).filter(Boolean);
const extractCommunitySwatches = (variant: any) => communitySwatchKeys.map(k => variant?.[k]).filter(Boolean);

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

	// Fetch community themes from API
	let communityThemes: any[] = [];
	try {
		const response = await fetch('https://api.noctalia.dev/palettes');
		if (response.ok) {
			const data = await response.json();
			const themes = Array.isArray(data) ? data : (data.palettes || data.themes || []);
			communityThemes = themes.map((theme: any) => ({
				name: theme.name,
				path: '',
				html_url: 'https://github.com/noctalia-dev/noctalia-colorschemes',
				swatches: extractCommunitySwatches(theme.dark),
				darkSwatches: extractCommunitySwatches(theme.dark),
				lightSwatches: extractCommunitySwatches(theme.light)
			})).sort((a: any, b: any) => a.name.localeCompare(b.name));
		} else {
			console.error('Failed to fetch community palettes, status:', response.status);
		}
	} catch (error) {
		console.error('Error fetching community palettes:', error);
	}

	return { coreThemes, communityThemes };
}
