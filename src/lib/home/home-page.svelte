<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import Reveal from '$lib/reveal.svelte';
	import FeatureIcon from '$lib/feature-icon.svelte';
	import SpotlightSurface from '$lib/spotlight-surface.svelte';
	import Slideshow from '$lib/slideshow.svelte';
	import { slideshowImages } from '$lib/slideshow-images';
	import Family from '$lib/home/Family.svelte';
	import type { FeatureIconId } from '$lib/feature-icons';
	import { DOCS_BASE_URL, GITHUB_ORG_URL } from '$lib/site-constants';

	let {
		data,
		media = 'video'
	}: {
		data: { pluginCount: number; releaseCount: number };
		/** 'video' is the public showcase; 'slideshow' is the in-progress replacement. */
		media?: 'video' | 'slideshow';
	} = $props();

	const logoUrl = 'https://assets.noctalia.dev/noctalia-logo.svg';
	const showcaseVideoUrl = 'https://assets.noctalia.dev/video/noctalia-showcase-short.mp4';
	const showcasePosterUrl = 'https://assets.noctalia.dev/video/video-poster.png';
	const showcaseCaptionsUrl = '/video/showcase-en.vtt';

	type FeatureCard = {
		icon: FeatureIconId;
		title: string;
		body: string;
		stat: null | { value: string; sub?: string };
	};

	const featureCards = $derived(
		[
			{
				icon: 'wayland',
				title: 'Built for Wayland',
				body: 'A modern shell for compositors - fast, focused, and ready for your workflow.',
				stat: null
			},
			{
				icon: 'minimal',
				title: 'Quiet by Design',
				body: 'Clean, uncluttered interface that gets out of your way.',
				stat: null
			},
			{
				icon: 'custom',
				title: 'Easily Customizable',
				body: 'Tailor every aspect to match your personal style.',
				stat: null
			},
			{
				icon: 'compositors',
				title: 'Compositors Supported',
				body: 'Works across leading Wayland compositors, with broader support through standard protocols.',
				stat: { value: '7+' }
			},
			{
				icon: 'plugins',
				title: 'Plugins Available',
				body: 'Extend your setup with a growing ecosystem of official and community plugins.',
				stat: { value: `${data.pluginCount}+` }
			},
			{
				icon: 'releases',
				title: 'Releases',
				body: 'Regular releases and steady improvements since July 2025.',
				stat: { value: `${data.releaseCount}+` }
			}
		] satisfies FeatureCard[]
	);
</script>

<SiteHeader />

<main>
	<!-- Shared atmosphere across hero + spotlight so the canvas doesn’t “reset” at the fold -->
	<div class="relative isolate">
		<div
			class="home-atmosphere pointer-events-none absolute inset-0 -z-10 overflow-hidden"
			aria-hidden="true"
		>
			<div
				class="home-atmosphere__blob home-atmosphere__blob--1 absolute -left-[20%] top-[-8%] h-[24rem] w-[24rem] rounded-full bg-accent/[0.09] blur-3xl md:h-[30rem] md:w-[30rem]"
			></div>
			<div
				class="home-atmosphere__blob home-atmosphere__blob--2 absolute -right-[15%] top-[18%] h-[20rem] w-[20rem] rounded-full bg-accent-2/[0.07] blur-3xl md:h-[26rem] md:w-[26rem]"
			></div>
			<div
				class="home-atmosphere__blob home-atmosphere__blob--3 absolute bottom-[5%] h-[18rem] w-[42rem] max-w-[200%] rounded-full bg-accent-3/[0.06] blur-3xl"
			></div>
		</div>

	<!-- Hero: the family is the headline; Noctalia the shell is detailed further down. -->
	<section class="relative section-hero">
		<div class="relative mx-auto max-w-5xl text-center">
			<Reveal>
				<div class="mb-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
					<img
						src={logoUrl}
						alt=""
						class="h-24 w-24 shrink-0 drop-shadow-[0_8px_36px_rgb(255_245_155/0.28)] md:h-32 md:w-32"
						width="128"
						height="128"
					/>
					<div class="text-center sm:text-left">
						<p class="font-sans text-4xl font-semibold tracking-tight text-fg md:text-5xl">
							Noctalia
						</p>
						<p
							class="mt-1 text-sm font-medium uppercase tracking-[0.16em] text-fg-dim md:mt-1.5 md:text-base"
						>
							quiet by design
						</p>
					</div>
				</div>
			</Reveal>
			<Reveal delay={100}>
				<h1
					class="text-balance font-sans text-3xl font-semibold leading-snug tracking-tight text-fg md:text-5xl md:leading-tight"
				>
					A family of native <span
						class="text-accent-2 drop-shadow-[0_0_24px_rgb(155_254_206/0.35)]">Wayland</span
					> projects <br />
					that feel like one desktop
				</h1>
			</Reveal>
			<Reveal delay={200}>
				<p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-fg-dim md:text-xl">
					A desktop shell, a compositor, and a login screen sharing one look, one palette, and one
					philosophy - each tunable to match your setup.
				</p>
			</Reveal>
			<Reveal delay={290}>
				<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
					<a
						href={DOCS_BASE_URL}
						target="_blank"
						rel="noopener noreferrer"
						class="btn-primary-glow inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent outline-none transition duration-300 hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep active:translate-y-0 active:brightness-95"
					>
						Get started
						<span aria-hidden="true">→</span>
					</a>
					<a
						href="#spotlight"
						class="inline-flex items-center gap-2 rounded-md border border-border/65 bg-surface-2/85 px-5 py-2.5 text-sm font-medium text-fg shadow-md outline-none transition duration-300 hover:-translate-y-0.5 hover:border-accent-2/55 hover:text-accent-2 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-accent-2/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep"
					>
						<i class="ti ti-player-play text-lg leading-none" aria-hidden="true"></i>
						See it in action
					</a>
					<a
						href={GITHUB_ORG_URL}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-fg-dim outline-none transition duration-300 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep"
					>
						<i class="ti ti-brand-github text-lg leading-none" aria-hidden="true"></i>
						GitHub
					</a>
				</div>
			</Reveal>
		</div>
	</section>

	<section class="section-content">
		<div class="site-shell space-y-20 md:space-y-24">
			<Family />

			<div id="spotlight" class="scroll-mt-24">
				<Reveal>
					<h2 class="fancy-section-title font-sans text-3xl font-semibold tracking-tight md:text-4xl">
						See It In Action
					</h2>
					<p class="mt-3 max-w-2xl text-fg-dim">
						Take a closer look at Noctalia's clean, cohesive design.
					</p>
				</Reveal>
				<Reveal delay={90}>
					<!-- --slideshow-corner-radius is the single knob for the card border,
					     its ring, and the slideshow/screenshot corners inside. -->
					<SpotlightSurface
						tag="div"
						class="card-surface mx-auto mt-10 overflow-hidden p-0 ring-1 ring-inset ring-white/[0.06]"
						style="--slideshow-corner-radius: 0.75rem; border-radius: var(--slideshow-corner-radius)"
					>
						{#snippet children()}
							{#if media === 'slideshow'}
								{#if slideshowImages.length > 0}
									<Slideshow images={slideshowImages} interval={4500} />
								{:else}
									<div
										class="flex aspect-video w-full items-center justify-center p-6 text-center text-sm text-fg-dim"
									>
										Drop images into <code>src/lib/assets/slideshow/</code> to preview the slideshow.
									</div>
								{/if}
							{:else}
								<video
									class="block w-full"
									controls
									playsinline
									preload="metadata"
									poster={showcasePosterUrl}
									src={showcaseVideoUrl}
								>
									<track
										kind="captions"
										src={showcaseCaptionsUrl}
										srclang="en"
										label="English"
										default
									/>
								</video>
							{/if}
						{/snippet}
					</SpotlightSurface>
				</Reveal>
			</div>

			<div>
				<Reveal>
					<h2 class="fancy-section-title font-sans text-3xl font-semibold tracking-tight md:text-4xl">
						Why Noctalia
					</h2>
					<p class="mt-3 max-w-2xl text-fg-dim">
						What the shell gives you: a beautiful, distraction-free desktop experience.
					</p>
				</Reveal>
				<div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{#each featureCards as card, i (card.title)}
						<Reveal delay={55 + i * 78}>
							<SpotlightSurface
								class="card-surface card-surface-hover group relative isolate h-full overflow-hidden p-6"
							>
								{#snippet children()}
									<div
										class="pointer-events-none absolute -right-8 -top-8 z-0 h-24 w-24 rounded-full bg-accent/[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-70"
										aria-hidden="true"
									></div>
									<div class="text-accent-2/95" aria-hidden="true">
										<FeatureIcon id={card.icon} class="h-7 w-7 shrink-0 text-accent-2/90" />
									</div>
									{#if card.stat}
										<p class="mt-3 font-mono text-2xl font-semibold tabular-nums text-accent">
											{card.stat.value}
										</p>
										{#if card.stat && 'sub' in card.stat && card.stat.sub}
											<p class="text-xs font-medium uppercase tracking-wider text-fg-dim">
												{card.stat.sub}
											</p>
										{/if}
									{/if}
									<h3 class="mt-3 text-lg font-semibold text-fg">{card.title}</h3>
									<p class="mt-2 text-sm leading-relaxed text-fg-dim">{card.body}</p>
								{/snippet}
							</SpotlightSurface>
						</Reveal>
					{/each}
				</div>
			</div>

			<div>
				<Reveal>
					<h2 class="fancy-section-title font-sans text-3xl font-semibold tracking-tight md:text-4xl">
						Star History
					</h2>
					<p class="mt-3 max-w-2xl text-fg-dim">Watch the community grow over time</p>
				</Reveal>
				<Reveal delay={80}>
					<SpotlightSurface
						tag="div"
						class="card-surface mt-10 overflow-hidden p-2 ring-1 ring-inset ring-white/[0.06] sm:p-3"
					>
						{#snippet children()}
							<img
								src="https://api.noctalia.dev/stars"
								alt="GitHub star history graph for noctalia"
								class="block h-auto w-full rounded-sm"
								width="1200"
								height="514"
								loading="lazy"
								decoding="async"
							/>
						{/snippet}
					</SpotlightSurface>
				</Reveal>
			</div>
		</div>
	</section>
	</div>
</main>

<SiteFooter />
