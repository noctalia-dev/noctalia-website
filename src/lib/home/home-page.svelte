<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import ProjectIntro from '$lib/project-intro.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import Reveal from '$lib/reveal.svelte';
	import FeatureIcon from '$lib/feature-icon.svelte';
	import SpotlightSurface from '$lib/spotlight-surface.svelte';
	import Slideshow from '$lib/slideshow.svelte';
	import { slideshowImages } from '$lib/slideshow-images';
	import Compositors from '$lib/home/Compositors.svelte';
	import type { FeatureIconId } from '$lib/feature-icons';
	import { DOCS_BASE_URL } from '$lib/site-constants';

	let {
		data,
		media = 'video'
	}: {
		data: { pluginCount: number; releaseCount: number };
		/** Both the screenshot gallery and video use the same Shell page. */
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
		/** Linked cards get the hover lift; static ones stay still so hover implies "clickable". */
		href?: string;
	};

	const featureCards = $derived([
		{
			icon: 'wayland',
			title: 'Built for Wayland',
			body: 'Your bar, launcher, notifications, and desktop controls, together on Wayland.',
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
			body: 'Choose your palette, arrange your bar, and make the desktop feel like yours.',
			stat: null,
			href: `${DOCS_BASE_URL}/noctalia/`
		},
		{
			icon: 'compositors',
			title: 'Compositors Supported',
			body: 'Works across leading Wayland compositors, with broader support through standard protocols.',
			stat: { value: '7+' },
			href: '#compositors'
		},
		{
			icon: 'plugins',
			title: 'Plugins Available',
			body: 'Extend your setup with a growing ecosystem of official and community plugins.',
			stat: data.pluginCount > 0 ? { value: `${data.pluginCount}+` } : null,
			href: '/plugins'
		},
		{
			icon: 'releases',
			title: 'Releases',
			body: 'Regular releases and steady improvements since July 2025.',
			stat: data.releaseCount > 0 ? { value: `${data.releaseCount}+` } : null,
			href: '/changelogs'
		}
	] satisfies FeatureCard[]);
</script>

<SiteHeader />

<main>
	<ProjectIntro
		title="Noctalia"
		eyebrow="Wayland desktop shell"
		{logoUrl}
		summary="Everything around your Wayland windows."
		detail="The bar, launcher, control center, and lock screen you reach for every day. One place to configure them, a palette that follows your wallpaper, and your choice of compositor underneath."
		anchorHref="#spotlight"
		anchorLabel="See the shell in action"
	>
		{#snippet actions()}
			<a
				href={`${DOCS_BASE_URL}/noctalia/`}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-primary-glow inline-flex items-center gap-3 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:brightness-105"
			>
				Get started <span aria-hidden="true">↗</span>
			</a>
			<a
				href="https://github.com/noctalia-dev/noctalia"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-fg-dim transition-colors hover:text-accent-2"
			>
				<i class="ti ti-brand-github text-lg" aria-hidden="true"></i>
				Source code
			</a>
		{/snippet}
	</ProjectIntro>

	<section class="section-content">
		<div class="site-shell space-y-20 md:space-y-24">
			<Compositors />

			<div id="spotlight" class="scroll-mt-24">
				<Reveal>
					<h2
						class="fancy-section-title font-sans text-3xl font-semibold tracking-tight md:text-4xl"
					>
						At home on your desktop
					</h2>
					<p class="mt-3 max-w-2xl text-fg-dim">
						{#if media === 'slideshow'}
							Real setups from the community. Different wallpapers, different palettes, the same
							Shell.
						{:else}
							A closer look at the bar, launcher, control center, and wallpaper-driven theming.
						{/if}
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
										Community screenshots are on their way. Explore the Shell in the documentation.
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
					<h2
						class="fancy-section-title font-sans text-3xl font-semibold tracking-tight md:text-4xl"
					>
						The everyday pieces, together
					</h2>
					<p class="mt-3 max-w-2xl text-fg-dim">
						A consistent desktop, from opening your first app to locking up for the day.
					</p>
				</Reveal>
				<div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{#each featureCards as card, i (card.title)}
						<Reveal delay={55 + i * 78}>
							<SpotlightSurface
								href={card.href}
								class="card-surface group relative isolate block h-full overflow-hidden p-6 {card.href
									? 'card-surface-hover'
									: ''}"
							>
								{#snippet children()}
									<div
										class="pointer-events-none absolute -right-8 -top-8 z-0 h-24 w-24 rounded-full bg-accent/[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-70"
										aria-hidden="true"
									></div>
									<div
										class="flex items-start justify-between gap-3 text-accent-2/95"
										aria-hidden="true"
									>
										<FeatureIcon id={card.icon} class="h-7 w-7 shrink-0 text-accent-2/90" />
										{#if card.href}
											<i
												class="ti ti-arrow-right text-lg leading-none text-fg-dim transition duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
											></i>
										{/if}
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
					<h2
						class="fancy-section-title font-sans text-3xl font-semibold tracking-tight md:text-4xl"
					>
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
</main>

<SiteFooter />
