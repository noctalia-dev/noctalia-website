import { DOCS_BASE_URL } from '$lib/site-constants';

/**
 * Canonical copy for the three Noctalia projects.
 *
 * Mirrors `PROJECTS` in noctalia-docs (`src/lib/projects.ts`): same names, same
 * order, same one-line roles. Keep both in sync so the marketing site and the
 * documentation site never disagree about what a project is.
 */
export interface Product {
	id: 'noctalia' | 'umbriel' | 'greeter';
	name: string;
	/** One-line role, identical to the docs card. */
	role: string;
	/** Marketing blurb; this is the half the docs site does not carry. */
	blurb: string;
	status: { label: string; tone: 'stable' | 'young' };
	logoUrl: string;
	repoUrl: string;
	docsUrl: string;
	/** The flagship gets accent emphasis in the family grid. */
	flagship?: boolean;
}

export const PRODUCTS: readonly Product[] = [
	{
		id: 'noctalia',
		name: 'Noctalia',
		role: 'Desktop shell',
		blurb:
			'Bar, launcher, control center, lock screen, and wallpaper-driven theming - configured in one place, on every major Wayland compositor.',
		status: { label: 'Stable · v5', tone: 'stable' },
		logoUrl: 'https://assets.noctalia.dev/noctalia-logo.svg',
		repoUrl: 'https://github.com/noctalia-dev/noctalia',
		docsUrl: `${DOCS_BASE_URL}/noctalia/`,
		flagship: true
	},
	{
		id: 'umbriel',
		name: 'Umbriel',
		role: 'Wayland compositor',
		blurb:
			'An independent compositor in C++23 on wlroots and SceneFX, with scrolling and dwindle layouts, blur, shadows, and fluid animations.',
		status: { label: 'Young · moving fast', tone: 'young' },
		logoUrl: 'https://assets.noctalia.dev/umbriel.svg',
		repoUrl: 'https://github.com/noctalia-dev/umbriel',
		docsUrl: `${DOCS_BASE_URL}/umbriel/`
	},
	{
		id: 'greeter',
		name: 'Greeter',
		role: 'greetd login screen',
		blurb:
			"A greetd login screen that mirrors Noctalia's wallpaper, palette, and font, so your session looks consistent from boot.",
		status: { label: 'Stable', tone: 'stable' },
		logoUrl: 'https://assets.noctalia.dev/greeter.svg',
		repoUrl: 'https://github.com/noctalia-dev/noctalia-greeter',
		docsUrl: `${DOCS_BASE_URL}/greeter/`
	}
];
