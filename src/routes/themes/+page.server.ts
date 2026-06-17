import { SEO_THEMES } from '$lib/seo';

const communitySwatchKeys = ['primary', 'secondary', 'tertiary', 'error', 'surface', 'surfaceVariant'];
const extractCommunitySwatches = (variant: any) => communitySwatchKeys.map(k => variant?.[k]).filter(Boolean);

export async function load() {

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
				html_url: 'https://github.com/noctalia-dev/community-palettes',
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

	return { communityThemes, seo: SEO_THEMES };
}
