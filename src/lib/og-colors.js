/**
 * Dark palette for Open Graph art (scripts/build-og.mjs).
 * Satori can't read CSS variables, so these mirror the dark tokens in src/routes/layout.css;
 * change both together and bump LAYOUT_VERSION in build-og.mjs.
 */
export const ogColors = {
	bg: '#0f1024',
	bgSoft: '#15162e',
	border: 'rgba(44, 46, 82, 0.9)',
	fg: '#ece9f4',
	fgDim: '#a5a7c6',
	accent2: '#a0ddc0'
};

export const ogBackground = [
	'radial-gradient(ellipse 70% 55% at 18% 28%, rgba(160, 221, 192, 0.14) 0%, transparent 55%)',
	'radial-gradient(ellipse 55% 45% at 88% 72%, rgba(247, 233, 168, 0.09) 0%, transparent 50%)',
	'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(179, 184, 237, 0.06) 0%, transparent 45%)',
	`linear-gradient(165deg, ${ogColors.bg} 0%, #121329 40%, ${ogColors.bgSoft} 100%)`
].join(', ');
