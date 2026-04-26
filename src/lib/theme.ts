export const colorScheme = {
	dark: {
		'sl-color-accent': '#fff59b',
		'sl-color-text-accent': '#fff59b',
		'sl-border-radius': '10px',
		'sl-color-bg': '#070722',
		'sl-color-bg-soft': '#11112d',
		'sl-color-text': '#f3edf7',
		'sl-color-text-soft': '#7c80b4',
		'sl-color-hairline': '#21215F',
		'sl-color-bg-nav': '#11112d',
		'sl-color-black': '#11112d',
		'sl-color-bg-sidebar': '#11112d',
		'sl-color-link': '#fff59b',
		'sl-color-link-hover': '#9BFECE',
		'sl-shadow-color': '#7c80b4',
		'ec-frm-edBg': '#151538',
		'ec-frm-trmBg': '#151538',
		mPrimary: '#fff59b',
		mOnPrimary: '#0e0e43',
		mSecondary: '#9BFECE',
		mOnSecondary: '#0e0e43',
		mTertiary: '#9BFECE',
		mOnTertiary: '#0e0e43',
		mError: '#FD4663',
		mOnError: '#0e0e43',
		mSurface: '#070722',
		mOnSurface: '#f3edf7',
		mSurfaceVariant: '#11112d',
		mOnSurfaceVariant: '#7c80b4',
		mOutline: '#21215F',
		mShadow: '#070722',
		mHover: '#9BFECE',
		mOnHover: '#0e0e43'
	},
	light: {
		'sl-color-accent': '#5d65f5',
		'sl-color-text-accent': '#5d65f5',
		'sl-border-radius': '10px',
		'sl-color-bg': '#e6e8fa',
		'sl-color-bg-soft': '#eff0ff',
		'sl-color-text': '#2d3180',
		'sl-color-text-soft': '#4b55c8',
		'sl-color-hairline': '#8288fc',
		'sl-color-bg-nav': '#eff0ff',
		'sl-color-black': '#eff0ff',
		'sl-color-bg-sidebar': '#eff0ff',
		'sl-color-link': '#5d65f5',
		'sl-color-link-hover': '#fef29a',
		'sl-shadow-color': '#4b55c8',
		'ec-frm-edBg': '#e0e2ff',
		'ec-frm-trmBg': '#e0e2ff',
		mPrimary: '#5d65f5',
		mOnPrimary: '#ffffff',
		mSecondary: '#fef29a',
		mOnSecondary: '#2d3180',
		mTertiary: '#fef29a',
		mOnTertiary: '#2d3180',
		mError: '#c62828',
		mOnError: '#ffffff',
		mSurface: '#e6e8fa',
		mOnSurface: '#2d3180',
		mSurfaceVariant: '#eff0ff',
		mOnSurfaceVariant: '#4b55c8',
		mOutline: '#8288fc',
		mShadow: '#eff0ff',
		mHover: '#fef29a',
		mOnHover: '#2d3180'
	}
};

export type Theme = 'dark' | 'light';

/** Browser UI / PWA chrome */
export const themeMetaColor: Record<Theme, string> = {
	dark: '#070722',
	light: '#e6e8fa'
};

/**
 * Tailwind @theme tokens  -  set at runtime so utilities (`bg-void-deep`, `text-fg`, …) follow the active theme.
 */
const tailwindThemeTokens: Record<Theme, Record<string, string>> = {
	dark: {
		'--color-void-deep': '#070722',
		'--color-void': '#11112d',
		'--color-surface': 'rgb(17 17 45 / 0.92)',
		'--color-surface-2': 'rgb(21 21 56 / 0.55)',
		'--color-border': '#21215f',
		'--color-accent': '#fff59b',
		'--color-accent-2': '#9bfece',
		'--color-accent-3': '#a9aefe',
		'--color-fg': '#f3edf7',
		'--color-fg-dim': '#7c80b4',
		'--color-on-accent': '#0e0e43',
		'--color-muted': '#7c80b4',
		'--shadow-card':
			'0 14px 36px -16px rgb(0 0 0 / 0.55), 0 0 0 1px rgb(255 245 155 / 0.04)',
		'--shadow-card-hover':
			'0 22px 48px -18px rgb(0 0 0 / 0.5), 0 0 0 1px rgb(255 245 155 / 0.09), 0 0 40px -12px rgb(255 245 155 / 0.06)',
		'--shadow-header': '0 10px 40px -12px rgb(0 0 0 / 0.45)'
	},
	light: {
		'--color-void-deep': '#e6e8fa',
		'--color-void': '#eff0ff',
		'--color-surface': 'rgb(239 240 255 / 0.94)',
		'--color-surface-2': 'rgb(210 214 255 / 0.55)',
		'--color-border': '#a8affc',
		'--color-accent': '#5d65f5',
		'--color-accent-2': '#c9a32a',
		'--color-accent-3': '#6b74f0',
		'--color-fg': '#2d3180',
		'--color-fg-dim': '#4b55c8',
		'--color-on-accent': '#ffffff',
		'--color-muted': '#4b55c8',
		'--shadow-card':
			'0 14px 36px -16px rgb(45 49 128 / 0.14), 0 0 0 1px rgb(93 101 245 / 0.1)',
		'--shadow-card-hover':
			'0 22px 48px -18px rgb(45 49 128 / 0.16), 0 0 0 1px rgb(93 101 245 / 0.18), 0 0 40px -12px rgb(93 101 245 / 0.12)',
		'--shadow-header': '0 10px 40px -12px rgb(45 49 128 / 0.12)'
	}
};

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

	Object.entries(colorScheme[theme]).forEach(([key, value]) => {
		root.style.setProperty(`--${key}`, value);
	});

	Object.entries(tailwindThemeTokens[theme]).forEach(([key, value]) => {
		root.style.setProperty(key, value);
	});

	root.setAttribute('data-theme', theme);

	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) meta.setAttribute('content', themeMetaColor[theme]);
}
