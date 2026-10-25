<script lang="ts">
	import Reveal from '$lib/reveal.svelte';
	import { PRODUCTS } from '$lib/products';
	import Slideshow from '$lib/slideshow.svelte';
	import { slideshowImages } from '$lib/slideshow-images';
	import LayoutShowcase from '$lib/umbriel/LayoutShowcase.svelte';
	import GreeterPreview from '$lib/home/GreeterPreview.svelte';

	let { stars = {} }: { stars?: Partial<Record<string, number | null>> } = $props();
	const homeImages = slideshowImages.filter((image) =>
		/launcher-real|lemmy|lysec|ltar|zakei|hooxoo/.test(image.src)
	);
	const starFormat = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

	const notes: Record<string, string> = {
		noctalia: 'The things you reach for, all day.',
		umbriel: 'A little order. Or a little freedom.',
		greeter: 'A familiar face, before you sign in.'
	};
</script>

<div id="family" class="project-directory">
	{#each PRODUCTS as product, i (product.id)}
		<Reveal delay={i * 50}>
			<article class="project-entry" class:project-entry--reversed={i % 2 === 1}>
				<div class="project-copy">
					<p class="project-category"><span>0{i + 1}</span> / {product.role}</p>
					<div class="project-name">
						<img src={product.logoUrl} alt="" width="44" height="44" loading="lazy" />
						<h2>{product.id === 'noctalia' ? 'Noctalia Shell' : product.name}</h2>
					</div>
					<p class="project-note">{notes[product.id]}</p>
					<p class="project-description">{product.blurb}</p>
					{#if stars[product.id] != null}
						<a
							class="project-stars"
							href={`${product.repoUrl}/stargazers`}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="{stars[product.id]?.toLocaleString('en')} {product.name} stars on GitHub"
							><span aria-hidden="true">☆</span>
							{starFormat.format(stars[product.id]!)} <span>on GitHub</span></a
						>
					{/if}
					<div class="project-links">
						<a
							href={product.pageUrl ?? product.docsUrl}
							target={product.pageUrl ? undefined : '_blank'}
							rel={product.pageUrl ? undefined : 'noopener noreferrer'}
							class="project-primary"
						>
							{product.pageUrl
								? `Explore ${product.id === 'noctalia' ? 'Shell' : product.name}`
								: 'Greeter documentation'}
							<span aria-hidden="true">{product.pageUrl ? '→' : '↗'}</span>
						</a>
						<a
							href={product.repoUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="project-source"
							aria-label="{product.name} on GitHub">Source <span aria-hidden="true">↗</span></a
						>
					</div>
				</div>

				{#if product.id === 'noctalia'}
					<div class="project-visual screenshot-visual">
						<div class="visual-label">
							<span class="status-dot"></span> The everyday desktop
							<span class="ml-auto">SHELL / 01</span>
						</div>
						<Slideshow images={homeImages} interval={5500} />
						<a class="visual-caption" href="/shell"
							>Desktops from the community <span aria-hidden="true">↗</span></a
						>
					</div>
				{:else if product.id === 'umbriel'}
					<div class="project-visual layout-visual">
						<div class="visual-label">
							<span class="status-dot"></span> Room for your windows
							<span class="ml-auto">UMBRIEL / 02</span>
						</div>
						<div class="home-layout-preview"><LayoutShowcase compact /></div>
						<a class="visual-caption" href="/umbriel#layouts"
							>Four layouts. Take a closer look. <span aria-hidden="true">↗</span></a
						>
					</div>
				{:else}
					<GreeterPreview />
				{/if}
			</article>
		</Reveal>
	{/each}
</div>

<style>
	.project-directory {
		scroll-margin-top: 5rem;
	}
	.project-entry {
		display: grid;
		grid-template-columns: 2fr 3fr;
		align-items: center;
		gap: clamp(2rem, 5vw, 5rem);
		padding-block: 3.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	.project-category {
		font: 0.65rem var(--font-mono);
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--color-fg-dim);
	}
	.project-category > span {
		color: var(--color-accent);
		margin-right: 0.5rem;
	}
	.project-name {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 1.6rem;
	}
	.project-name h2 {
		font-size: 2.25rem;
		font-weight: 600;
		letter-spacing: -0.055em;
		line-height: 1.1;
	}
	.project-name img {
		flex-shrink: 0;
	}
	.project-note {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--color-fg);
		margin-top: 1.3rem;
	}
	.project-description {
		max-width: 25rem;
		font-size: 0.85rem;
		line-height: 1.8;
		color: var(--color-fg-dim);
		margin-top: 0.6rem;
	}
	.project-stars {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.9rem;
		border-radius: 2px;
		font: 0.75rem var(--font-mono);
		color: var(--color-accent);
	}
	.project-stars > span:last-child {
		font: 0.65rem var(--font-sans);
		color: var(--color-fg-dim);
	}
	.project-stars:hover {
		color: var(--color-accent-2);
	}
	.home-layout-preview {
		padding: 0.9rem 1rem 0;
	}
	.project-links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.5rem;
		margin-top: 1.8rem;
		font-size: 0.8rem;
	}
	.project-primary,
	.project-source {
		display: inline-flex;
		gap: 1.4rem;
		align-items: center;
		border-radius: 2px;
		padding-bottom: 0.4rem;
	}
	.project-primary {
		color: var(--color-accent);
		border-bottom: 1px solid color-mix(in srgb, var(--color-accent) 35%, transparent);
		font-weight: 600;
	}
	.project-source {
		color: var(--color-fg-dim);
	}
	.project-primary:hover,
	.project-source:hover {
		color: var(--color-accent-2);
	}
	.project-visual {
		display: block;
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--color-void-deep) 85%, transparent);
		transition: border-color 200ms;
	}
	.project-visual:hover {
		border-color: var(--color-accent-2);
	}
	.visual-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.9rem 1rem;
		font: 0.6rem var(--font-mono);
		color: var(--color-fg-dim);
		border-bottom: 1px solid var(--color-border);
	}
	.status-dot {
		display: inline-block;
		height: 5px;
		width: 5px;
		border-radius: 50%;
		background: var(--color-accent-2);
	}
	.screenshot-visual {
		--slideshow-corner-radius: 0;
	}
	.visual-caption {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 1rem;
		font-size: 0.65rem;
		color: var(--color-fg-dim);
	}
	.visual-caption > span {
		color: var(--color-accent);
	}
	@media (min-width: 761px) {
		.project-entry--reversed {
			grid-template-columns: 3fr 2fr;
		}
		.project-entry--reversed .project-copy {
			grid-column: 2;
			grid-row: 1;
		}
		.project-entry--reversed .project-visual {
			grid-column: 1;
			grid-row: 1;
		}
	}
	@media (max-width: 760px) {
		.project-entry {
			grid-template-columns: 1fr;
			gap: 2rem;
			padding-block: 2.5rem;
		}
		.project-description {
			max-width: 32rem;
		}
		.visual-label {
			font-size: 0.55rem;
		}
	}
</style>
