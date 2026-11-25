/**
 * Title, description and OG card of every fixed page. Plain JS so scripts/build-og.mjs draws the
 * cards from the same text the pages use. Each entry owns its `ogImagePath` image.
 */
import { DEFAULT_DESCRIPTION, DEFAULT_OG_TITLE, SITE_NAME } from './site-constants.js';

export const SEO_HOME = {
	title: DEFAULT_OG_TITLE,
	description: DEFAULT_DESCRIPTION,
	pathLabel: 'Home',
	ogImagePath: '/og.webp'
};

export const SEO_SHELL = {
	title: `Noctalia Shell  -  ${SITE_NAME}`,
	description:
		'A native Wayland desktop shell. Bar, launcher, control center, lock screen, and wallpaper-driven theming, configured together.',
	pathLabel: 'Shell',
	ogImagePath: '/og/shell.webp'
};

export const SEO_UMBRIEL = {
	title: `Umbriel  -  ${SITE_NAME}`,
	description:
		'A Wayland compositor with Scrolling, Dwindle, Master, and Stacking layouts. Explore four ways to arrange your windows.',
	pathLabel: 'Umbriel',
	ogImagePath: '/og/umbriel.webp'
};

export const SEO_GREETER = {
	title: `Greeter  -  ${SITE_NAME}`,
	description:
		'A greetd login screen that shares your Noctalia wallpaper, colors, and font. A familiar desktop from the moment you sign in.',
	pathLabel: 'Greeter',
	ogImagePath: '/og/greeter.webp'
};

export const SEO_LUCIOLE = {
	title: `Luciole  -  ${SITE_NAME}`,
	description:
		'A native Wayland file manager built to stay smooth. Grid, list, and Miller views, tabs, split view, and previews that never block the window.',
	pathLabel: 'Luciole',
	ogImagePath: '/og/luciole.webp'
};

export const SEO_BLOG_INDEX = {
	title: `Blog  -  ${SITE_NAME}`,
	description: 'News from the Noctalia team.',
	pathLabel: 'Blog',
	ogImagePath: '/og/blog.webp'
};

export const SEO_PLUGINS_INDEX = {
	title: `Plugins  -  ${SITE_NAME}`,
	description: 'Browse community and official plugins to extend your Noctalia setup.',
	pathLabel: 'Plugins',
	ogImagePath: '/og/plugins.webp'
};

export const SEO_CHANGELOG_INDEX = {
	title: `Changelog  -  ${SITE_NAME}`,
	description: 'Release notes for Noctalia v5 and later.',
	pathLabel: 'Changelog',
	ogImagePath: '/og/changelog.webp'
};

export const SEO_PALETTES = {
	title: `Palettes  -  ${SITE_NAME}`,
	description: 'Explore color palettes for Noctalia.',
	pathLabel: 'Palettes',
	ogImagePath: '/og/palettes.webp'
};

export const SEO_CONTRIBUTORS = {
	title: `Contributors  -  ${SITE_NAME}`,
	description: 'Meet the people who build and translate Noctalia.',
	pathLabel: 'Contributors',
	ogImagePath: '/og/contributors.webp'
};

export const SEO_PRIVACY = {
	title: `Privacy  -  ${SITE_NAME}`,
	description:
		'What Noctalia collects, how Google Calendar OAuth works, and your rights. Open source and transparent.',
	pathLabel: 'Privacy',
	ogImagePath: '/og/privacy.webp'
};

export const SEO_ETHOS = {
	title: `Our Ethos  -  ${SITE_NAME}`,
	description:
		'How we work with the people who use and build Noctalia - a gift exchange, not a support contract.',
	pathLabel: 'Ethos',
	ogImagePath: '/og/ethos.webp'
};
