<script lang="ts">
	import { onMount } from 'svelte';
	import { getTheme, applyTheme } from '$lib/theme';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import '../lib/styles/global.css';
	
	let { children } = $props();
	
	onMount(() => {
		const theme = getTheme();
		applyTheme(theme);
		
		// Watch for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem('theme')) {
				applyTheme(e.matches ? 'dark' : 'light');
			}
		};
		mediaQuery.addEventListener('change', handleChange);
		
		return () => mediaQuery.removeEventListener('change', handleChange);
	});
</script>

<svelte:head>
	<title>Noctalia - A beautiful, minimal desktop shell for Wayland</title>
	<meta name="description" content="A beautiful, minimal desktop shell for Wayland that actually gets out of your way. Built on Quickshell with a warm lavender aesthetic." />
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/favicon.svg" />
</svelte:head>

<PageTransition />

<div class="app">
	{@render children()}
</div>

<style>
	.app {
		min-height: 100vh;
		background-color: var(--sl-color-bg);
		color: var(--sl-color-text);
	}
</style>
