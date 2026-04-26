<script lang="ts">
	import '@fontsource-variable/inter/wght.css';
	import '@fontsource-variable/jetbrains-mono/wght.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { applyTheme, getTheme } from '$lib/theme';
	import DotGlowCanvas from '$lib/dot-glow-canvas.svelte';
	import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, SITE_ORIGIN } from '$lib/site-constants';

	let { children } = $props();

	const canonicalUrl = $derived(`${SITE_ORIGIN}${page.url.pathname === '/' ? '' : page.url.pathname}`);

	onNavigate((navigation) => {
		if (typeof document === 'undefined' || !document.startViewTransition) return;
		return new Promise<void>((fulfil) => {
			document.startViewTransition(async () => {
				fulfil();
				await navigation.complete;
			});
		});
	});

	onMount(() => {
		applyTheme(getTheme());
		const onStorage = (e: StorageEvent) => {
			if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
				applyTheme(e.newValue);
			}
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="canonical" href={canonicalUrl} />
	<meta name="description" content={DEFAULT_DESCRIPTION} />
	<meta name="theme-color" content="#070722" />

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={`${SITE_NAME}  -  Wayland shell & bar`} />
	<meta property="og:description" content={DEFAULT_DESCRIPTION} />
	<meta property="og:image" content={DEFAULT_OG_IMAGE} />
	<meta property="og:image:alt" content="Noctalia desktop shell preview" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${SITE_NAME}  -  Wayland shell & bar`} />
	<meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
	<meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

	<title>{SITE_NAME}  -  Wayland shell &amp; bar</title>
</svelte:head>

<div class="page-canvas relative min-h-screen">
	<div class="ambient-tint fixed inset-0 z-0" aria-hidden="true"></div>
	<DotGlowCanvas />
	<div class="film-grain" aria-hidden="true"></div>
	<div class="relative z-[1]">{@render children()}</div>
</div>
