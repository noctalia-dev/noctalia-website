<script lang="ts">
	import Reveal from '$lib/reveal.svelte';
	import SpotlightSurface from '$lib/spotlight-surface.svelte';
	import { PRODUCTS } from '$lib/products';

	const linkClass =
		'inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep';
</script>

<div id="family" class="scroll-mt-24">
	<Reveal>
		<h2 class="fancy-section-title font-sans text-3xl font-semibold tracking-tight md:text-4xl">
			The Noctalia Family
		</h2>
		<p class="mt-3 max-w-2xl text-fg-dim">
			Built to work together, designed to stand alone. Run all three, or drop in only the piece your
			setup is missing.
		</p>
	</Reveal>

	<div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each PRODUCTS as product, i (product.id)}
			<Reveal delay={55 + i * 78}>
				<SpotlightSurface
					class="card-surface card-surface-hover group relative isolate h-full overflow-hidden p-6 {product.flagship
						? 'card-surface--flagship'
						: ''}"
				>
					{#snippet children()}
						<div
							class="pointer-events-none absolute -right-8 -top-8 z-0 h-24 w-24 rounded-full bg-accent/[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-70"
							aria-hidden="true"
						></div>

						<div class="flex items-center gap-3">
							<img
								src={product.logoUrl}
								alt=""
								class="h-11 w-11 shrink-0 drop-shadow-[0_4px_14px_rgb(255_245_155/0.18)]"
								width="44"
								height="44"
								loading="lazy"
								decoding="async"
							/>
							<div class="min-w-0">
								<h3 class="text-lg font-semibold leading-tight text-fg">{product.name}</h3>
								<p
									class="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-2/90"
								>
									{product.role}
								</p>
							</div>
						</div>

						<p
							class="mt-4 inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium {product
								.status.tone === 'young'
								? 'border-accent-3/40 bg-accent-3/10 text-accent-3'
								: 'border-border/60 bg-surface-2/60 text-fg-dim'}"
						>
							{product.status.label}
						</p>

						<p class="mt-3 text-sm leading-relaxed text-fg-dim">{product.blurb}</p>

						<div class="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5">
							<a
								href={product.docsUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="{linkClass} text-accent hover:underline hover:underline-offset-4"
							>
								Documentation
								<span aria-hidden="true">↗</span>
							</a>
							<a
								href={product.repoUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="{linkClass} text-fg-dim hover:text-accent-2"
							>
								<i class="ti ti-brand-github text-base leading-none" aria-hidden="true"></i>
								GitHub
							</a>
						</div>
					{/snippet}
				</SpotlightSurface>
			</Reveal>
		{/each}
	</div>
</div>
