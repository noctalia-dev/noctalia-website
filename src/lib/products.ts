import { DOCS_BASE_URL } from '#lib/site-constants.js';

/**
 * Canonical copy for the Noctalia projects.
 *
 * Mirrors `PROJECTS` in noctalia-docs (`src/lib/projects.ts`): same names, same
 * order, same one-line roles. Keep both in sync so the marketing site and the
 * documentation site never disagree about what a project is.
 */
export interface Product {
	id: 'noctalia' | 'umbriel' | 'greeter' | 'luciole';
	name: string;
	/** One-line role, identical to the docs card. */
	role: string;
	/** Function-first label for navigation menus ("Compositor", not "Umbriel"). */
	navLabel: string;
	/** Full product name shown next to `navLabel` so the code name stays visible. */
	fullName: string;
	/** Marketing blurb; this is the half the docs site does not carry. */
	blurb: string;
	logoUrl: string;
	repoUrl: string;
	docsUrl: string;
	/** Focused product page, when the project has one on this site. */
	pageUrl?: string;
	/** The flagship gets accent emphasis in the family grid. */
	flagship?: boolean;
}

export const PRODUCTS: readonly Product[] = [
	{
		id: 'noctalia',
		name: 'Noctalia',
		role: 'Desktop shell',
		navLabel: 'Shell',
		fullName: 'Noctalia',
		blurb:
			'Bar, launcher, control center, lock screen, and wallpaper-driven theming - configured in one place, on every major Wayland compositor.',
		logoUrl: 'https://assets.noctalia.dev/noctalia-logo.svg',
		repoUrl: 'https://github.com/noctalia-dev/noctalia',
		docsUrl: `${DOCS_BASE_URL}/noctalia/`,
		pageUrl: '/shell',
		flagship: true
	},
	{
		id: 'umbriel',
		name: 'Umbriel',
		role: 'Wayland compositor',
		navLabel: 'Compositor',
		fullName: 'Umbriel',
		blurb:
			'A Wayland compositor designed for daily use, with scrolling, dwindle, master, and stacking layouts, per-output workspaces, window rules, blur, shadows, and fluid animations.',
		logoUrl: 'https://assets.noctalia.dev/umbriel.svg',
		repoUrl: 'https://github.com/noctalia-dev/umbriel',
		docsUrl: `${DOCS_BASE_URL}/umbriel/`,
		pageUrl: '/umbriel'
	},
	{
		id: 'luciole',
		name: 'Luciole',
		role: 'File manager',
		navLabel: 'Files',
		fullName: 'Luciole',
		blurb:
			'A native Wayland file manager that stays smooth: quick to start, fluid in huge folders, with grid, list, and Miller views, tabs, split view, and previews that never block the window.',
		logoUrl:
			'https://raw.githubusercontent.com/noctalia-dev/luciole/HEAD/assets/icons/dev.noctalia.luciole.svg',
		repoUrl: 'https://github.com/noctalia-dev/luciole',
		docsUrl: `${DOCS_BASE_URL}/luciole/`,
		pageUrl: '/luciole'
	},
	{
		id: 'greeter',
		name: 'Greeter',
		role: 'greetd login screen',
		navLabel: 'Greeter',
		fullName: 'Login screen',
		blurb:
			"A greetd login screen that mirrors Noctalia's wallpaper, palette, and font, so your session looks consistent from boot.",
		logoUrl: 'https://assets.noctalia.dev/greeter.svg',
		repoUrl: 'https://github.com/noctalia-dev/noctalia-greeter',
		docsUrl: `${DOCS_BASE_URL}/greeter/`,
		pageUrl: '/greeter'
	}
];
