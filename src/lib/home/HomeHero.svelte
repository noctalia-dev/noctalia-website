<script lang="ts">
	import Reveal from '$lib/reveal.svelte';
	import { PRODUCTS } from '$lib/products';
	import { DOCS_BASE_URL } from '$lib/site-constants';
</script>

<header class="hero">
	<Reveal>
		<div class="hero-lockup">
			<img
				src="https://assets.noctalia.dev/noctalia-logo.svg"
				alt=""
				width="128"
				height="128"
				class="hero-logo"
			/>
			<p class="hero-wordmark">Noctalia</p>
		</div>
	</Reveal>
	<Reveal delay={70}>
		<h1 class="hero-title">
			A family of native <span>Wayland</span> projects that feel like one desktop.
		</h1>
		<p class="hero-lead">
			A desktop shell, a compositor, and a login screen that share one look, one palette, and one
			philosophy. Use them together, or choose the pieces you need.
		</p>
	</Reveal>
	<Reveal delay={130}>
		<div class="hero-actions">
			<a href={DOCS_BASE_URL} target="_blank" rel="noopener noreferrer" class="action-primary"
				>Get started <span aria-hidden="true">↗</span></a
			>
			<a href="#family" class="action-secondary">Meet the projects <span aria-hidden="true">↓</span></a>
		</div>
	</Reveal>
	<Reveal delay={190}>
		<ul class="family-strip" aria-label="The projects">
			{#each PRODUCTS as product (product.id)}
				<li>
					<a href="#{product.id}" class="family-chip">
						<img src={product.logoUrl} alt="" width="32" height="32" />
						<span
							><strong>{product.navLabel}</strong><small>{product.fullName}</small
							></span
						>
					</a>
				</li>
			{/each}
		</ul>
	</Reveal>
</header>

<style>
	.hero {
		position: relative;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 64rem;
		margin-inline: auto;
		padding: clamp(3.5rem, 9vw, 7rem) 1rem clamp(1.5rem, 3vw, 2.5rem);
		text-align: center;
	}
	.hero::before {
		content: '';
		position: absolute;
		top: 2rem;
		left: 50%;
		z-index: -1;
		width: min(36rem, 90vw);
		aspect-ratio: 1;
		translate: -50% 0;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--color-accent-3) 18%, transparent),
			transparent 65%
		);
		pointer-events: none;
	}
	.hero-lockup {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(1rem, 2.5vw, 1.5rem);
	}
	.hero-logo {
		width: clamp(4.5rem, 10vw, 8rem);
		height: auto;
		aspect-ratio: 1;
		filter: drop-shadow(0 8px 32px color-mix(in srgb, var(--color-accent) 25%, transparent));
	}
	.hero-wordmark {
		font-size: clamp(2rem, 4.5vw, 3rem);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.04em;
	}
	.hero-title {
		max-width: 58rem;
		margin: clamp(1.75rem, 3.5vw, 2.5rem) auto 0;
		font-size: clamp(2rem, 4.4vw, 3.5rem);
		font-weight: 600;
		line-height: 1.08;
		letter-spacing: -0.035em;
		text-wrap: balance;
	}
	.hero-title span {
		color: var(--color-accent-2);
	}
	.hero-lead {
		max-width: 38rem;
		margin: 1.25rem auto 0;
		font-size: clamp(1.0625rem, 1.6vw, 1.25rem);
		line-height: 1.55;
		color: var(--color-fg-dim);
		text-wrap: pretty;
	}
	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 2rem;
	}
	.family-strip {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
		width: 100%;
		max-width: 46rem;
		margin-top: clamp(2.5rem, 5vw, 3.5rem);
	}
	.family-chip {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		height: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
		border-radius: 8px;
		background: color-mix(in srgb, var(--color-void-deep) 60%, transparent);
		text-align: left;
		transition:
			border-color 180ms,
			background 180ms;
	}
	.family-chip:hover {
		border-color: color-mix(in srgb, var(--color-accent) 35%, var(--color-border));
		background: var(--color-surface-2);
	}
	.family-chip img {
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
	}
	.family-chip strong {
		display: block;
		font-size: 0.9375rem;
		font-weight: 600;
		line-height: 1.3;
	}
	.family-chip small {
		display: block;
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color-fg-dim);
	}
	@media (max-width: 639px) {
		.family-strip {
			grid-template-columns: 1fr;
			max-width: 22rem;
		}
	}
</style>
