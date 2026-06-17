import corePalettes from '$lib/data/core-palettes.json';
import { SEO_PALETTES } from '$lib/seo';

const coreSwatchKeys = ['mPrimary', 'mSecondary', 'mTertiary', 'mError', 'mSurface', 'mSurfaceVariant'];
const communitySwatchKeys = ['primary', 'secondary', 'tertiary', 'error', 'surface', 'surfaceVariant'];
const extractSwatches = (variant: any) => coreSwatchKeys.map(k => variant?.[k]).filter(Boolean);
const extractCommunitySwatches = (variant: any) => communitySwatchKeys.map(k => variant?.[k]).filter(Boolean);

export async function load() {
	// Process core palettes from static file (no external link)
	const corePalettesList = (corePalettes.palettes || []).map((palette: any) => ({
		name: palette.name,
		path: palette.path,
		swatches: extractSwatches(palette.dark),
		darkSwatches: extractSwatches(palette.dark),
		lightSwatches: extractSwatches(palette.light)
	})).sort((a: any, b: any) => a.name.localeCompare(b.name));

	// Fetch community palettes from API
	let communityPalettes: any[] = [];
	try {
		const response = await fetch('https://api.noctalia.dev/palettes');
		if (response.ok) {
			const data = await response.json();
			const palettes = Array.isArray(data) ? data : (data.palettes || data.themes || []);
			communityPalettes = palettes.map((palette: any) => ({
				name: palette.name,
				path: '',
				swatches: extractCommunitySwatches(palette.dark),
				darkSwatches: extractCommunitySwatches(palette.dark),
				lightSwatches: extractCommunitySwatches(palette.light)
			})).sort((a: any, b: any) => a.name.localeCompare(b.name));
		} else {
			console.error('Failed to fetch community palettes, status:', response.status);
		}
	} catch (error) {
		console.error('Error fetching community palettes:', error);
	}

	return { corePalettes: corePalettesList, communityPalettes, seo: SEO_PALETTES };
}
