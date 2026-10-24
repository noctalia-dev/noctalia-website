<script lang="ts">
	import Reveal from '$lib/reveal.svelte';
	import SpotlightSurface from '$lib/spotlight-surface.svelte';
	import { PRODUCTS } from '$lib/products';
	import { DOCS_BASE_URL } from '$lib/site-constants';

	const umbriel = PRODUCTS.find((p) => p.id === 'umbriel')!;

	const setupUrl = (slug: string) => `${DOCS_BASE_URL}/noctalia/compositor-settings/${slug}/`;

	/** From the Umbriel docs (noctalia-docs `umbriel/index.mdx`, `layout.mdx`, `outputs.mdx`). */
	const umbrielHighlights = [
		'Scrolling, Dwindle, Master & Floating layouts',
		'Tabbed windows',
		'HDR',
		'Per-output workspaces',
		'Blur, shadows & animations',
		'Scratchpads',
		'Live config reload'
	];

	/**
	 * Other compositors with a dedicated Noctalia setup guide (noctalia-docs
	 * `noctalia/compositor-settings/`). Order is intentional: Umbriel (featured
	 * card), then Niri, Hyprland, Mango, Sway, Labwc, Scroll.
	 */
	const compositors = [
		{ name: 'Niri', style: 'Scrollable tiling', slug: 'niri' },
		{ name: 'Hyprland', style: 'Dynamic tiling', slug: 'hyprland' },
		{ name: 'Mango', style: 'dwl-based tiling', slug: 'mango' },
		{ name: 'Sway', style: 'i3-compatible tiling', slug: 'sway-scroll' },
		{ name: 'Labwc', style: 'Openbox-style stacking', slug: 'labwc' },
		{ name: 'Scroll', style: 'Scrolling, Sway-based', slug: 'sway-scroll' }
	];

	const linkClass =
		'inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep';
</script>

<div id="compositors" class="scroll-mt-24">
	<Reveal>
		<h2 class="fancy-section-title font-sans text-3xl font-semibold tracking-tight md:text-4xl">
			Pick Your Compositor
		</h2>
		<p class="mt-3 max-w-2xl text-fg-dim">
			Noctalia works great on every compositor below, each with its own setup guide. Umbriel is
			our own, developed alongside the shell - a natural pairing if you're looking for a new home.
		</p>
	</Reveal>

	<div class="mt-12 grid gap-5 lg:grid-cols-2">
		<Reveal delay={55}>
			<SpotlightSurface
				class="card-surface card-surface--flagship relative isolate h-full overflow-hidden p-6 md:p-8"
			>
				{#snippet children()}
					<div
						class="pointer-events-none absolute -right-10 -top-10 z-0 h-32 w-32 rounded-full bg-accent-3/[0.08] blur-2xl"
						aria-hidden="true"
					></div>

					<div class="flex items-center gap-4">
						<img
							src={umbriel.logoUrl}
							alt=""
							class="h-14 w-14 shrink-0 drop-shadow-[0_4px_14px_rgb(255_245_155/0.18)]"
							width="56"
							height="56"
							loading="lazy"
							decoding="async"
						/>
						<div class="min-w-0">
							<h3 class="text-2xl font-semibold leading-tight text-fg">{umbriel.name}</h3>
							<p
								class="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-2/90"
							>
								Built alongside Noctalia
							</p>
						</div>
					</div>

					<p
						class="mt-5 inline-flex w-fit items-center rounded-full border border-accent-3/40 bg-accent-3/10 px-2.5 py-0.5 text-[11px] font-medium text-accent-3"
					>
						{umbriel.status.label}
					</p>

					<p class="mt-3 text-sm leading-relaxed text-fg-dim">{umbriel.blurb}</p>

					<ul class="mt-5 flex flex-wrap gap-2">
						{#each umbrielHighlights as highlight (highlight)}
							<li
								class="rounded-md border border-border/60 bg-surface-2/60 px-2.5 py-1 text-xs font-medium text-fg"
							>
								{highlight}
							</li>
						{/each}
					</ul>

					<div class="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
						<a
							href={umbriel.docsUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="{linkClass} text-accent hover:underline hover:underline-offset-4"
						>
							Umbriel docs
							<span aria-hidden="true">↗</span>
						</a>
						<a
							href={setupUrl('umbriel')}
							target="_blank"
							rel="noopener noreferrer"
							class="{linkClass} text-fg-dim hover:text-accent-2"
						>
							Set up Noctalia on Umbriel
							<span aria-hidden="true">↗</span>
						</a>
						<a
							href={umbriel.repoUrl}
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

		<div class="flex flex-col gap-5">
			<ul class="grid flex-1 grid-cols-2 gap-3">
				{#each compositors as compositor, i (compositor.name)}
					<li>
						<Reveal class="h-full" delay={110 + i * 55}>
							<SpotlightSurface
								href={setupUrl(compositor.slug)}
								external
								class="card-surface card-surface-hover group block h-full p-3 sm:p-4"
							>
								{#snippet children()}
									<div class="my-auto flex items-center justify-between gap-2">
										<div class="min-w-0">
											<p class="font-semibold text-fg">{compositor.name}</p>
											<p
												class="mt-1.5 inline-flex w-fit items-center whitespace-nowrap rounded-full border border-fg-dim/25 bg-fg/[0.04] px-2 py-0.5 text-[11px] font-medium text-fg-dim sm:px-2.5"
											>
												{compositor.style}
											</p>
										</div>
										<span
											class="hidden shrink-0 text-xs font-medium text-fg-dim transition group-hover:text-accent sm:inline"
										>
											Setup <span aria-hidden="true">↗</span>
										</span>
									</div>
								{/snippet}
							</SpotlightSurface>
						</Reveal>
					</li>
				{/each}
			</ul>
			<Reveal delay={450}>
				<p class="text-sm leading-relaxed text-fg-dim">
					Also runs on
					<a
						href={setupUrl('kde')}
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium text-fg underline decoration-border underline-offset-4 transition hover:text-accent hover:decoration-accent"
						>KDE Plasma</a
					>
					with some protocol limits, and on other compositors through standard Wayland protocols.
				</p>
			</Reveal>
		</div>
	</div>
</div>
