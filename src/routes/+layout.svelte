<script lang="ts">
	import '@fontsource-variable/inter/wght.css';
	import './tabler-icons.css';
	import './layout.css';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { applyTheme, getTheme } from '$lib/theme';
	import PlexusCanvas from '$lib/plexus-canvas.svelte';
	import {
		DEFAULT_DESCRIPTION,
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_TITLE,
		OG_IMAGE_HEIGHT,
		OG_IMAGE_WIDTH,
		SITE_NAME,
		SITE_ORIGIN
	} from '$lib/site-constants';

	let { children } = $props();

	const canonicalUrl = $derived(
		`${SITE_ORIGIN}${page.url.pathname === '/' ? '' : page.url.pathname}`
	);

	const metaTitle = $derived(page.data.seo?.title ?? DEFAULT_OG_TITLE);
	const metaDescription = $derived(page.data.seo?.description ?? DEFAULT_DESCRIPTION);
	const ogType = $derived(page.data.seo?.ogType === 'article' ? 'article' : 'website');
	const ogImageUrl = $derived(
		page.data.seo?.ogImagePath ? `${SITE_ORIGIN}${page.data.seo.ogImagePath}` : DEFAULT_OG_IMAGE
	);
	const ogImageAlt = $derived(metaTitle);
	let pageAnimation: Animation | undefined;
	let navigationSequence = 0;

	onNavigate(async (navigation) => {
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const sequence = ++navigationSequence;
		pageAnimation?.cancel();
		const paths = ['/', '/shell', '/umbriel', '/greeter', '/plugins', '/blog', '/changelogs'];
		const from = paths.indexOf(navigation.from?.url.pathname ?? '/');
		const to = paths.indexOf(navigation.to?.url.pathname ?? '/');
		const direction = from >= 0 && to >= 0 && to < from ? -1 : 1;
		const outgoing = document.querySelector('main')?.animate(
			[
				{ opacity: 1, transform: 'translateX(0)', filter: 'blur(0)' },
				{ opacity: 0.2, transform: `translateX(${-direction * 14}px)`, filter: 'blur(2px)' }
			],
			{ duration: 130, easing: 'ease-in', fill: 'forwards' }
		);
		pageAnimation = outgoing;
		try {
			await outgoing?.finished;
		} catch {
			/* A newer navigation can replace this one. */
		}
		return () => {
			outgoing?.cancel();
			if (
				sequence !== navigationSequence ||
				window.matchMedia('(prefers-reduced-motion: reduce)').matches
			)
				return;
			pageAnimation = document.querySelector('main')?.animate(
				[
					{
						opacity: 0,
						transform: `translateX(${direction * 30}px) translateY(8px)`,
						filter: 'blur(4px)'
					},
					{ opacity: 1, transform: 'translateX(0) translateY(0)', filter: 'blur(0)' }
				],
				{ duration: 440, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
			);
		};
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
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" type="application/rss+xml" href="/rss.xml" />
	<meta name="description" content={metaDescription} />
	<meta name="theme-color" content="#070722" />

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:image" content={ogImageUrl} />
	<meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
	<meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
	<meta property="og:image:alt" content={ogImageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metaTitle} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={ogImageUrl} />

	<title>{metaTitle}</title>
</svelte:head>

<div class="page-canvas relative min-h-screen">
	<div class="ambient-tint fixed inset-0 z-0" aria-hidden="true"></div>
	<PlexusCanvas />
	<div class="film-grain" aria-hidden="true"></div>
	<div class="relative z-[1] flex min-h-screen flex-col">{@render children()}</div>
</div>
