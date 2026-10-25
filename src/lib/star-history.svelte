<script lang="ts">
	import Reveal from '$lib/reveal.svelte';
	import SectionHeading from '$lib/section-heading.svelte';
	let {
		number,
		name,
		repo,
		chartUrl
	}: {
		number: number;
		/** Display name, e.g. "Umbriel". */
		name: string;
		/** GitHub `owner/name`. */
		repo: string;
		chartUrl: string;
	} = $props();

	let loaded = $state(false);
	let failed = $state(false);
</script>

<section id="stars" class="site-shell star-history" aria-labelledby="stars-title">
	<div class="star-copy">
		<SectionHeading
			{number}
			id="stars-title"
			label="Star history"
			title="{name}, over time"
			lead="GitHub stars for {repo}, from its first supporters onward."
		/>
		<Reveal delay={60}>
			<a
				class="action-link"
				href="https://github.com/{repo}/stargazers"
				target="_blank"
				rel="noopener noreferrer">View on GitHub <span aria-hidden="true">↗</span></a
			>
		</Reveal>
	</div>
	<Reveal delay={90}>
		<figure class="star-chart">
			{#if !failed}
				<img
					src={chartUrl}
					alt="GitHub stars for {repo} plotted against calendar date"
					width="1200"
					height="514"
					loading="lazy"
					decoding="async"
					class:pending={!loaded}
					onload={() => (loaded = true)}
					onerror={() => (failed = true)}
				/>
			{/if}
			{#if !loaded || failed}
				<p class="star-status" role="status">
					{failed ? 'The chart is unavailable right now.' : 'Loading star history…'}
				</p>
			{/if}
		</figure>
	</Reveal>
</section>

<style>
	.star-history {
		display: grid;
		gap: 1.5rem;
		align-items: center;
		scroll-margin-top: 6rem;
	}
	.star-chart {
		position: relative;
		min-height: 12rem;
		margin: 0;
		overflow: hidden;
		padding: 0.5rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--color-void-deep) 85%, transparent);
	}
	.star-chart img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 4px;
		transition: opacity 300ms;
	}
	.star-chart img.pending {
		opacity: 0;
	}
	.star-status {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 1.5rem;
		font-size: 0.875rem;
		color: var(--color-fg-dim);
	}
	@media (min-width: 900px) {
		.star-history {
			grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
			gap: clamp(2rem, 5vw, 5rem);
		}
	}
</style>
