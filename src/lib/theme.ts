export const colorScheme = {
	dark: {
		// New SL variables
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
		// Legacy mappings
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
		// New SL variables - matching docs theme
		'sl-color-accent': '#5d65f5',
		'sl-color-text-accent': '#5d65f5',
		'sl-border-radius': '10px',
		'sl-color-bg': '#e6e8fa',
		'sl-color-bg-soft': '#eff0ff',
		'sl-color-text': '#2d3180', // Darker than docs for better contrast
		'sl-color-text-soft': '#4b55c8', // Match docs
		'sl-color-hairline': '#8288fc', // Match docs
		'sl-color-bg-nav': '#eff0ff',
		'sl-color-black': '#eff0ff',
		'sl-color-bg-sidebar': '#eff0ff',
		'sl-color-link': '#5d65f5', // Match docs
		'sl-color-link-hover': '#fef29a', // Match docs
		'sl-shadow-color': '#4b55c8', // Match docs
		'ec-frm-edBg': '#e0e2ff',
		'ec-frm-trmBg': '#e0e2ff',
		// Legacy mappings
		mPrimary: '#5d65f5', // Match docs
		mOnPrimary: '#ffffff', // White for better contrast on buttons
		mSecondary: '#fef29a', // Match docs
		mOnSecondary: '#2d3180', // Darker for better contrast
		mTertiary: '#fef29a', // Match docs
		mOnTertiary: '#2d3180', // Darker for better contrast
		mError: '#c62828',
		mOnError: '#ffffff',
		mSurface: '#e6e8fa', // Match docs
		mOnSurface: '#2d3180', // Darker for better contrast
		mSurfaceVariant: '#eff0ff', // Match docs
		mOnSurfaceVariant: '#4b55c8', // Match docs
		mOutline: '#8288fc', // Match docs
		mShadow: '#eff0ff', // Match docs
		mHover: '#fef29a', // Match docs
		mOnHover: '#2d3180' // Darker for better contrast
	}
};

export type Theme = 'dark' | 'light';

export function getTheme(): Theme {
	if (typeof window === 'undefined') return 'dark';
	const stored = localStorage.getItem('theme') as Theme | null;
	if (stored) return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(theme: Theme) {
	if (typeof window === 'undefined') return;
	localStorage.setItem('theme', theme);
	document.documentElement.setAttribute('data-theme', theme);
}

export function applyTheme(theme: Theme) {
	if (typeof window === 'undefined') return;
	const colors = colorScheme[theme];
	const root = document.documentElement;
	
	Object.entries(colors).forEach(([key, value]) => {
		root.style.setProperty(`--${key}`, value);
	});
	
	root.setAttribute('data-theme', theme);
}

