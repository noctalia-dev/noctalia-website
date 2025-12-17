<script lang="ts">
	import { onMount } from 'svelte';
	import { getTheme, setTheme, applyTheme } from '$lib/theme';
	
	let currentTheme = $state<'dark' | 'light'>('dark');
	
	onMount(() => {
		currentTheme = getTheme();
		
		// Listen for storage changes (e.g., from other tabs)
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'theme' && e.newValue) {
				currentTheme = e.newValue as 'dark' | 'light';
				applyTheme(currentTheme);
			}
		};
		
		window.addEventListener('storage', handleStorageChange);
		
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	});
	
	function toggle() {
		currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
		setTheme(currentTheme);
		applyTheme(currentTheme);
	}
</script>

<button class="theme-toggle" onclick={toggle} aria-label="Toggle theme">
	{#if currentTheme === 'dark'}
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="4"></circle>
			<path d="M12 2v2"></path>
			<path d="M12 20v2"></path>
			<path d="m4.93 4.93 1.41 1.41"></path>
			<path d="m17.66 17.66 1.41 1.41"></path>
			<path d="M2 12h2"></path>
			<path d="M20 12h2"></path>
			<path d="m6.34 17.66-1.41 1.41"></path>
			<path d="m19.07 4.93-1.41 1.41"></path>
		</svg>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 0.5rem;
		background-color: var(--mSurfaceVariant);
		color: var(--mOnSurfaceVariant);
		border: 1px solid var(--mOutline);
		transition: all 0.2s ease;
	}
	
	.theme-toggle:hover {
		background-color: var(--mSecondary);
		color: var(--mOnSecondary);
		border-color: var(--mSecondary);
		transform: scale(1.05);
	}
	
	.theme-toggle svg {
		transition: transform 0.3s ease;
	}
	
	.theme-toggle:hover svg {
		transform: rotate(15deg);
	}
</style>

