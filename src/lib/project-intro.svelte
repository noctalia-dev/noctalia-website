<script lang="ts">
	import type { Snippet } from 'svelte';
	import Reveal from '$lib/reveal.svelte';
	let {
		title,
		eyebrow,
		logoUrl,
		icon,
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
		/** Project mark next to the title; pages without one can pass a Tabler `icon` instead. */
		logoUrl?: string;
		icon?: string;
		summary: string;
		detail: string;
		actions?: Snippet;
		anchorHref?: string;
		anchorLabel?: string;
		footnote?: Snippet;
		back?: boolean;
	} = $props();
</script>

<header class="intro site-shell">
	{#if back}
		<Reveal>
			<a href="/" class="intro-back"><span aria-hidden="true">←</span> The Noctalia projects</a>
		</Reveal>
	{/if}
	<div class="intro-body">
		<Reveal delay={60}>
			<p class="eyebrow intro-eyebrow">{eyebrow}</p>
			<div class="intro-lockup">
				{#if logoUrl}
					<img src={logoUrl} alt="" width="80" height="80" class="intro-logo" />
				{:else if icon}
					<i class="ti {icon} intro-icon" aria-hidden="true"></i>
				{/if}
				<h1 class="intro-title">{title}</h1>
			</div>
		</Reveal>
		<Reveal delay={120}>
			<p class="intro-summary">{summary}</p>
			<p class="intro-detail">{detail}</p>
			{#if actions}<div class="intro-actions">{@render actions()}</div>{/if}
			{#if anchorHref && anchorLabel}
				<a href={anchorHref} class="intro-anchor">{anchorLabel} <span aria-hidden="true">↓</span></a>
			{/if}
			{#if footnote}<div class="intro-footnote">{@render footnote()}</div>{/if}
		</Reveal>
	</div>
</header>

<style>
	.intro {
		position: relative;
		isolation: isolate;
		padding-top: 1.5rem;
	}
	.intro::before {
		content: '';
		position: absolute;
		top: 3rem;
		left: 50%;
		z-index: -1;
		width: min(32rem, 90vw);
		aspect-ratio: 1;
		translate: -50% 0;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--color-accent-3) 14%, transparent),
			transparent 65%
		);
		pointer-events: none;
	}
	.intro-back {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.75rem;
		font-size: 0.875rem;
		color: var(--color-fg-dim);
		transition: color 180ms;
	}
	.intro-back:hover {
		color: var(--color-accent);
	}
	.intro-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 46rem;
		margin-inline: auto;
		padding-block: clamp(1.5rem, 4vw, 3rem) clamp(2.5rem, 5vw, 3.5rem);
		text-align: center;
	}
	/* On section pages the section gap supplies the space below; trim it a little under the hero. */
	:global(.page-sections) > .intro .intro-body {
		padding-bottom: 0;
		margin-bottom: calc(-1 * clamp(0.5rem, 2.5vw, 2rem));
	}
	.intro-eyebrow {
		color: var(--color-accent-2);
	}
	.intro-lockup {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(0.875rem, 2vw, 1.25rem);
		margin-top: 1rem;
	}
	.intro-logo {
		width: clamp(3.5rem, 7vw, 5rem);
		height: auto;
		aspect-ratio: 1;
		filter: drop-shadow(0 8px 28px color-mix(in srgb, var(--color-accent) 22%, transparent));
	}
	.intro-icon {
		font-size: clamp(3rem, 6vw, 4.25rem);
		line-height: 1;
		color: var(--color-accent-3);
	}
	.intro-title {
		font-size: clamp(2.75rem, 7vw, 4.75rem);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.05em;
	}
	.intro-summary {
		max-width: 40rem;
		margin: 1.75rem auto 0;
		font-size: clamp(1.125rem, 1.8vw, 1.375rem);
		line-height: 1.45;
		color: var(--color-fg);
		text-wrap: balance;
	}
	.intro-detail {
		max-width: 38rem;
		margin: 0.875rem auto 0;
		font-size: 1rem;
		line-height: 1.65;
		color: var(--color-fg-dim);
		text-wrap: pretty;
	}
	.intro-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 2rem;
	}
	.intro-anchor {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.75rem;
		margin-top: 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-accent-2);
		transition: color 180ms;
	}
	.intro-anchor:hover {
		color: var(--color-accent);
	}
	.intro-footnote {
		margin-top: 1.25rem;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-fg-dim);
	}
</style>
