<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import ProjectIntro from '$lib/project-intro.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import Reveal from '$lib/reveal.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
	import SpotlightSurface from '$lib/spotlight-surface.svelte';
	import LayoutShowcase from '$lib/umbriel/LayoutShowcase.svelte';
	import { DOCS_BASE_URL } from '$lib/site-constants';

	let chartLoaded = $state(false);
	let chartError = $state(false);
	const chartUrl = 'https://api.noctalia.dev/stars/umbriel';

	const details = [
		{
			title: 'Each screen, its own space.',
			body: 'Keep independent workspaces on each monitor. Use dynamic or named workspaces, with fractional scaling and workspace restoration when a display reconnects.'
		},
		{
			title: 'A mouse belongs here, too.',
			body: 'Move and resize windows with the mouse, or navigate with your keyboard. Optional title bars bring close and maximize buttons, along with moving and resizing without holding a modifier key.'
		},
		{
			title: 'Keep a task together.',
			body: 'Collect related windows in tab groups. Hide a group in a named scratchpad, then bring it back on whichever monitor you are using.'
		},
		{
			title: 'Adjust it as you go.',
			body: 'Set your keybinds, window rules, blur, shadows, and animations in TOML. Configuration reloads while you work, with diagnostics to help you find mistakes.'
		}
	];
</script>

<SiteHeader />

<main class="pb-20 md:pb-28">
	<ProjectIntro
		title="Umbriel"
		eyebrow="Wayland compositor"
		logoUrl="https://assets.noctalia.dev/umbriel.svg"
		summary="Scroll through your windows. Let them tile into place. Or move them around by hand."
		detail="Choose how your windows are arranged on each workspace, with the controls and finishing touches to make it feel like home."
		anchorHref="#layouts"
		anchorLabel="Explore the four layouts"
	>
		{#snippet actions()}
			<a
				href={`${DOCS_BASE_URL}/umbriel/`}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-primary-glow inline-flex items-center gap-3 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:brightness-105"
			>
				Get started <span aria-hidden="true">↗</span>
			</a>
			<a
				href="https://github.com/noctalia-dev/umbriel"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-fg-dim transition-colors hover:text-accent-2"
			>
				<i class="ti ti-brand-github text-lg" aria-hidden="true"></i>
				Source code
			</a>
		{/snippet}
		{#snippet footnote()}
			<p class="flex items-start gap-3">
				<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-3" aria-hidden="true"
				></span>
				<span
					><span class="text-fg">Young and actively evolving.</span> Usable today, with rough edges;
					configuration and behavior may change between releases.</span
				>
			</p>
		{/snippet}
	</ProjectIntro>

	<section
		id="layouts"
		class="site-shell scroll-mt-24 pt-16 md:pt-24"
		aria-labelledby="layouts-title"
	>
		<div>
			<Reveal>
				<div class="mb-8 grid gap-4 md:grid-cols-[2fr_3fr] md:gap-12">
					<div>
						<p class="mb-3 font-mono text-xs text-accent-2">01 / ARRANGE</p>
						<h2
							id="layouts-title"
							class="text-3xl font-semibold tracking-tight text-fg md:text-4xl"
						>
							Find your arrangement.
						</h2>
					</div>
					<p class="max-w-lg self-end leading-relaxed text-fg-dim">
						Try each layout below. Keep one for everything, or use a different one on each
						workspace.
					</p>
				</div>
			</Reveal>

			<LayoutShowcase />
			<p class="mt-4 text-xs leading-relaxed text-fg-dim">
				Simplified illustrations of window movement, rather than screen recordings.
			</p>
		</div>
	</section>

	<section class="site-shell pt-20 md:pt-28" aria-labelledby="everyday-title">
		<div>
			<Reveal>
				<div class="mb-9 grid gap-4 md:grid-cols-[2fr_3fr] md:gap-12">
					<div>
						<p class="mb-3 font-mono text-xs text-accent-2">02 / LIVE IN IT</p>
						<h2
							id="everyday-title"
							class="text-3xl font-semibold tracking-tight text-fg md:text-4xl"
						>
							Beyond the arrangement.
						</h2>
					</div>
					<p class="max-w-lg self-end leading-relaxed text-fg-dim">
						The details that matter when this is where you spend your day.
					</p>
				</div>
			</Reveal>

			<div class="border-t border-border/65">
				{#each details as detail, i (detail.title)}
					<Reveal delay={i * 45}>
						<div
							class="grid gap-3 border-b border-border/65 py-7 md:grid-cols-[2fr_3fr] md:gap-12 md:py-8"
						>
							<h3 class="text-lg font-medium tracking-tight text-fg md:text-xl">{detail.title}</h3>
							<p class="max-w-xl text-sm leading-relaxed text-fg-dim md:text-base">{detail.body}</p>
						</div>
					</Reveal>
				{/each}
			</div>

			<Reveal>
				<div class="mt-8 grid gap-3 md:grid-cols-[2fr_3fr] md:gap-12">
					<p class="text-sm font-medium text-fg">And when it is time to play.</p>
					<p class="max-w-xl text-sm leading-relaxed text-fg-dim">
						HDR and variable refresh rate are available as opt-in features. Support depends on your
						display, graphics stack, and applications.
					</p>
				</div>
			</Reveal>
		</div>
	</section>

	<section id="stars" class="site-shell scroll-mt-24 pt-20 md:pt-28" aria-labelledby="stars-title">
		<div>
			<Reveal>
				<div class="mb-8 grid gap-4 md:grid-cols-[2fr_3fr] md:gap-12">
					<div>
						<p class="mb-3 font-mono text-xs text-accent-2">03 / STAR HISTORY</p>
						<h2 id="stars-title" class="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
							Umbriel, over time.
						</h2>
					</div>
					<p class="max-w-lg self-end leading-relaxed text-fg-dim">
						GitHub stars for the Umbriel repository, from its first supporters onward.
					</p>
				</div>
				<figure>
					<SpotlightSurface
						tag="div"
						class="card-surface mt-10 overflow-hidden p-2 ring-1 ring-inset ring-white/[0.06] sm:p-3"
					>
						{#snippet children()}
							<div class="relative min-h-64">
								{#if !chartError}
									<img
										src={chartUrl}
										alt="GitHub stars for noctalia-dev/umbriel plotted against calendar date"
										width="800"
										height="400"
										loading="lazy"
										decoding="async"
										class="block h-auto w-full rounded-sm"
										class:opacity-0={!chartLoaded}
										onload={() => (chartLoaded = true)}
										onerror={() => (chartError = true)}
									/>
								{/if}
								{#if !chartLoaded || chartError}
									<p
										class="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-fg-dim"
										role="status"
									>
										{chartError
											? 'The chart is unavailable right now. You can find Umbriel on GitHub below.'
											: 'Loading GitHub star history…'}
									</p>
								{/if}
							</div>
						{/snippet}
					</SpotlightSurface>
					<figcaption
						class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-fg-dim"
					>
						<span>noctalia-dev/umbriel</span>
						<a
							href="https://github.com/noctalia-dev/umbriel/stargazers"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-sm text-accent transition-colors hover:text-accent-2"
						>
							View on GitHub <span aria-hidden="true">↗</span>
						</a>
					</figcaption>
				</figure>
			</Reveal>
		</div>
	</section>

	<section class="site-shell pt-20 md:pt-28" aria-labelledby="companion-title">
		<div class="border-t border-border/65 pt-10 md:pt-12">
			<Reveal>
				<div class="grid gap-8 md:grid-cols-[2fr_3fr] md:gap-12">
					<div>
						<p class="mb-3 font-mono text-xs text-accent-2">04 / THE DESKTOP AROUND IT</p>
						<h2
							id="companion-title"
							class="max-w-md text-3xl font-semibold tracking-tight text-fg md:text-4xl"
						>
							At home with Noctalia.
						</h2>
					</div>
					<div>
						<p class="max-w-xl leading-relaxed text-fg-dim">
							Pair Umbriel with Noctalia Shell for your bar, launcher, notifications, lock screen,
							and wallpaper-driven colors. Built by the same people, with a shared look and feel.
						</p>
						<a
							href="/shell"
							class="mt-5 inline-flex items-center gap-3 rounded-sm text-sm font-semibold text-accent transition-colors hover:text-accent-2"
						>
							Explore Noctalia Shell <span aria-hidden="true">→</span>
						</a>
					</div>
				</div>
			</Reveal>
		</div>
	</section>
</main>

<SiteFooter />
<ScrollToTop />
