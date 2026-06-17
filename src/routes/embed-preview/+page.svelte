<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { PathSeoPreview } from '$lib/seo';

	let { data } = $props<{
		data: { preview: PathSeoPreview };
	}>();

	let pathInput = $state('');
	$effect(() => {
		pathInput = data.preview.normalizedPath;
	});

	function applyPath(e: Event) {
		e.preventDefault();
		const next = pathInput.trim() || '/';
		const u = new URL('/embed-preview', page.url);
		u.searchParams.set('path', next);
		goto(u.pathname + u.search, { keepFocus: true, noScroll: true, replaceState: false });
	}

	const p = $derived(data.preview);
	const imageUrl = $derived(new URL(p.seo.ogImagePath, page.url.origin).href);
	/** Small unfurl: thumbnail = logo on OG-style gradient only (not a crop of the full PNG). */
	const noctaliaLogoUrl = 'https://assets.noctalia.dev/noctalia-logo.svg';
	const ogStyleThumb =
		'background:radial-gradient(ellipse 70% 55% at 18% 28%, rgba(155, 254, 206, 0.14) 0%, transparent 55%),' +
		'radial-gradient(ellipse 55% 45% at 88% 72%, rgba(255, 245, 155, 0.09) 0%, transparent 50%),' +
		'linear-gradient(165deg, #070722 0%, #0a0a2a 40%, #11112d 100%)';
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<SiteHeader />

<main class="mx-auto max-w-2xl px-4 pb-24 pt-10 md:pt-14">
	<p class="mb-2 text-center text-sm text-fg-dim">Simulated link unfurls (not platform-accurate).</p>
	<p class="mb-6 text-center text-xs text-fg-dim/80">
		Change <code class="text-fg/90">path</code> to see how that URL’s title and description are set. Production
		crawlers read each real page; this tool uses the same <code class="text-fg/90">seo</code> data as your routes.
	</p>

	<form
		class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end"
		onsubmit={applyPath}
		aria-label="Preview path on this site"
	>
		<div class="min-w-0 flex-1">
			<label for="ep-path" class="mb-1 block text-xs font-medium uppercase tracking-wider text-fg-dim"
				>Path on noctalia.dev</label
			>
			<input
				id="ep-path"
				bind:value={pathInput}
				autocomplete="off"
				placeholder="/blog/announcing-noctalia-v5"
				class="w-full rounded-md border border-border/70 bg-void/80 px-3 py-2 text-sm text-fg outline-none ring-offset-2 ring-offset-void-deep placeholder:text-fg-dim/50 focus:border-accent/45 focus:ring-2 focus:ring-accent/25"
			/>
		</div>
		<button
			type="submit"
			class="shrink-0 rounded-md border border-border/60 bg-surface-2/90 px-4 py-2 text-sm font-medium text-fg transition hover:border-accent/35 hover:text-accent"
		>
			Preview
		</button>
	</form>

	<div class="mb-6 flex flex-wrap justify-center gap-2 text-xs">
		<span class="w-full text-center text-fg-dim/90 sm:w-auto sm:text-left">Quick:</span>
		<a class="text-accent underline-offset-2 hover:underline" href="/embed-preview?path=/">Home</a>
		<a class="text-accent underline-offset-2 hover:underline" href="/embed-preview?path=/blog">Blog</a>
		<a
			class="text-accent underline-offset-2 hover:underline"
			href="/embed-preview?path=/blog/announcing-noctalia-v5">Sample post</a
		>
		<a class="text-accent underline-offset-2 hover:underline" href="/embed-preview?path=/plugins"
			>Plugins</a
		>
		<a class="text-accent underline-offset-2 hover:underline" href="/embed-preview?path=/palettes"
			>Palettes</a
		>
		<a class="text-accent underline-offset-2 hover:underline" href="/embed-preview?path=/privacy"
			>Privacy</a
		>
	</div>

	<div
		class="mb-6 flex flex-wrap items-center justify-center gap-2 text-center text-sm"
		aria-live="polite"
	>
		<span
			class="rounded-full border border-border/50 bg-surface-2/60 px-2.5 py-0.5 text-xs font-medium text-accent-2"
		>
			{p.seo.pathLabel}
		</span>
		<span class="font-mono text-xs text-fg-dim">{p.normalizedPath}</span>
		{#if p.notFound}
			<span class="text-sm font-medium text-[#f59e0b]">This path is not a valid post or plugin.</span>
		{:else if p.unknown}
			<span class="text-fg-dim"
				>No dedicated <code class="text-fg/90">seo</code> for this path yet. Showing home defaults in the
				cards only.</span
			>
		{/if}
	</div>

	<section class="mb-12" aria-label="Large image card (Discord, Slack)">
		<h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-dim">Large image</h2>
		<article
			class="flex overflow-hidden rounded-lg bg-[#1e1e1e] text-left shadow-lg ring-1 ring-white/10"
		>
			<div class="w-1 shrink-0 self-stretch bg-[#5865F2]" aria-hidden="true"></div>
			<div class="min-w-0 flex-1">
				<img
					src={imageUrl}
					alt=""
					width="800"
					height="420"
					class="aspect-[1200/630] w-full object-cover"
					loading="lazy"
					decoding="async"
				/>
			</div>
		</article>
	</section>

	<section aria-label="Summary (small image)">
		<h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-dim">Summary (small image)</h2>
		<article
			class="flex max-w-md overflow-hidden rounded border border-border/80 bg-void/90 text-left shadow-md"
		>
			<div
				class="flex w-[120px] shrink-0 items-center justify-center self-stretch border-r border-border/60"
				style:background={ogStyleThumb}
			>
				<img
					src={noctaliaLogoUrl}
					alt=""
					width="56"
					height="56"
					class="h-14 w-14 object-contain"
					loading="lazy"
					decoding="async"
				/>
			</div>
			<div class="min-w-0 p-3">
				<p class="line-clamp-2 text-sm font-semibold text-fg">{p.seo.title}</p>
				<p class="mt-0.5 line-clamp-3 text-xs leading-relaxed text-fg-dim">
					{p.seo.description}
				</p>
				<p class="mt-1.5 text-xs text-fg-dim/90">
					{page.url.host}
				</p>
			</div>
		</article>
	</section>
</main>

<SiteFooter />
