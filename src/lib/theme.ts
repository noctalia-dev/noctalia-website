// Colors live only in src/routes/layout.css; this module just switches `data-theme`.
export type Theme = 'dark' | 'light';

export function getTheme(): Theme {
	if (typeof window === 'undefined') return 'dark';
	const stored = localStorage.getItem('theme') as Theme | null;
	if (stored) return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(theme: Theme) {
	if (typeof window === 'undefined') return;
	const before = document.documentElement.getAttribute('data-theme');
	localStorage.setItem('theme', theme);
	const run = () => applyTheme(theme);
	const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (motionOk && typeof document.startViewTransition === 'function' && before !== theme) {
		document.startViewTransition(run);
	} else {
		run();
	}
}

/** Flip theme and return the new value (for UI binding). */
export function toggleTheme(): Theme {
	const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
	setTheme(next);
	return next;
}

export function applyTheme(theme: Theme) {
	if (typeof window === 'undefined') return;
	const root = document.documentElement;
	root.setAttribute('data-theme', theme);

	// Browser UI / PWA chrome follows the page background token.
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
		meta.setAttribute(
			'content',
			getComputedStyle(root).getPropertyValue('--color-void-deep').trim()
		);
	}
}
