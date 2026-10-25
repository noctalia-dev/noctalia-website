<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import Reveal from '$lib/reveal.svelte';
	let {
		title,
		eyebrow,
		logoUrl,
		summary,
		detail,
		actions,
		anchorHref,
		anchorLabel,
		footnote,
		back = true
	}: {
		title: string;
		eyebrow: string;
		logoUrl: string;
		summary: string;
		detail: string;
		actions?: Snippet;
		anchorHref?: string;
		anchorLabel?: string;
		footnote?: Snippet;
		back?: boolean;
	} = $props();

	// Follow the navigation order, carrying the alternating homepage rhythm into page intros.
	const rightSidePages = new Set(['/shell', '/greeter', '/blog', '/ethos', '/privacy']);
	const mirrored = $derived(rightSidePages.has(page.url.pathname.replace(/\/+$/, '') || '/'));
</script>

<header class="site-shell pt-9 md:pt-14" data-logo-side={mirrored ? 'right' : 'left'}>
	<Reveal>
		{#if back}
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-sm text-sm text-fg-dim transition-colors hover:text-accent"
				><span aria-hidden="true">←</span> The Noctalia projects</a
			>
		{:else}
			<p class="text-sm text-fg-dim">
				Noctalia <span class="mx-2 text-accent" aria-hidden="true">/</span> quiet by design
			</p>
		{/if}
	</Reveal>
	<div
		class="intro-grid mt-10 grid items-end gap-8 border-b border-border/65 pb-10 md:mt-16 md:gap-12 md:pb-14"
		class:intro-grid--reversed={mirrored}
	>
		<div class="intro-heading">
			<Reveal delay={60}>
				<p class="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-accent-2">{eyebrow}</p>
				<div
					class="intro-heading-line flex items-center gap-4 sm:gap-5"
					class:intro-heading-line--reversed={mirrored}
				>
					<img
						src={logoUrl}
						alt=""
						width="80"
						height="80"
						class="h-12 w-12 shrink-0 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
					/>
					<h1 class="page-title">{title}</h1>
				</div>
				{#if anchorHref && anchorLabel}
					<a
						href={anchorHref}
						class="mt-7 inline-flex items-center gap-3 rounded-sm py-1 text-sm font-medium text-accent-2 transition-colors hover:text-accent"
						>{anchorLabel}<span aria-hidden="true">↓</span></a
					>
				{/if}
			</Reveal>
		</div>
		<div class="intro-copy">
			<Reveal delay={130}>
				<p class="text-xl leading-relaxed text-fg md:text-[1.35rem]">{summary}</p>
				<p class="mt-4 leading-relaxed text-fg-dim">{detail}</p>
				{#if actions}<div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
						{@render actions()}
					</div>{/if}
			</Reveal>
		</div>
	</div>
	{#if footnote}<Reveal delay={180}
			><div class="mt-5 text-sm leading-relaxed text-fg-dim">{@render footnote()}</div></Reveal
		>{/if}
</header>

<style>
	.intro-heading-line {
		width: fit-content;
		max-width: 100%;
	}
	.intro-heading-line--reversed {
		flex-direction: row-reverse;
	}
	.intro-heading,
	.intro-copy {
		min-width: 0;
	}
	.intro-heading {
		container-type: inline-size;
		--intro-logo-size: 3rem;
		--intro-title-gap: 1rem;
	}
	@media (min-width: 640px) {
		.intro-heading {
			--intro-logo-size: 4rem;
			--intro-title-gap: 1.25rem;
		}
	}
	@media (min-width: 1024px) {
		.intro-heading {
			--intro-logo-size: 5rem;
		}
	}
	@media (min-width: 768px) {
		.intro-grid {
			grid-template-columns: 2fr 3fr;
		}
		.intro-grid--reversed {
			grid-template-columns: 3fr 2fr;
		}
		.intro-grid--reversed .intro-heading {
			grid-column: 2;
			grid-row: 1;
			text-align: right;
		}
		.intro-grid--reversed .intro-heading-line {
			margin-left: auto;
		}
		.intro-grid--reversed .intro-copy {
			grid-column: 1;
			grid-row: 1;
		}
	}
	.page-title {
		font-size: clamp(
			2rem,
			calc((100cqw - var(--intro-logo-size) - var(--intro-title-gap)) / 5.6),
			6.5rem
		);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.065em;
		overflow-wrap: normal;
	}
</style>
