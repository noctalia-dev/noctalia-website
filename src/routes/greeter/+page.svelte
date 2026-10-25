<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import Reveal from '$lib/reveal.svelte';
	import ProjectIntro from '$lib/project-intro.svelte';
	import SpotlightSurface from '$lib/spotlight-surface.svelte';
	import { PRODUCTS } from '$lib/products';

	const greeter = PRODUCTS.find((product) => product.id === 'greeter')!;
	const chartUrl = 'https://api.noctalia.dev/stars/noctalia-greeter';
	let chartLoaded = $state(false);
	let chartError = $state(false);
</script>

<SiteHeader />

<main class="pb-20 md:pb-28">
	<ProjectIntro
		title="Greeter"
		eyebrow="greetd login screen"
		logoUrl={greeter.logoUrl}
		summary="The first screen of your day should feel like yours, too."
		detail="Choose your user, sign in, and step into your Wayland session. A quiet welcome, with the same visual language as Noctalia."
		anchorHref="#details"
		anchorLabel="Explore Greeter"
	>
		{#snippet actions()}
			<a
				href={greeter.docsUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-primary-glow inline-flex items-center gap-3 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:brightness-105"
				>Set up Greeter <span aria-hidden="true">↗</span></a
			>
			<a
				href={greeter.repoUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-fg-dim transition-colors hover:text-accent-2"
				><i class="ti ti-brand-github text-lg" aria-hidden="true"></i>Source code</a
			>
		{/snippet}
	</ProjectIntro>

	<div class="site-shell pt-10 md:pt-14">
		<section id="details" class="greeter-details scroll-mt-24" aria-labelledby="details-title">
			<Reveal>
				<div class="details-heading">
					<span class="section-number">A FEW SMALL DETAILS</span>
					<h2
						id="details-title"
						class="mt-5 text-3xl font-semibold tracking-tight text-fg md:text-4xl"
					>
						From login<br />to your own space.
					</h2>
				</div>
			</Reveal>
			<div class="details-rows">
				<Reveal>
					<div class="detail-row">
						<span class="detail-number">01</span>
						<div>
							<h3>A place to start.</h3>
							<p>
								Pick a user and a Wayland session. Greeter handles the sign-in screen; greetd
								handles authentication and starts your session.
							</p>
						</div>
					</div>
				</Reveal>
				<Reveal delay={60}>
					<div class="detail-row">
						<span class="detail-number">02</span>
						<div>
							<h3>Already feels familiar.</h3>
							<p>
								Optionally sync your wallpaper, colors, and font from Noctalia. Your login screen
								and desktop can share the same look.
							</p>
						</div>
					</div>
				</Reveal>
				<Reveal delay={120}>
					<div class="detail-row">
						<span class="detail-number">03</span>
						<div>
							<h3>Keep your hands on the keys.</h3>
							<p>
								Navigate users, sessions, and sign-in controls from the keyboard. Mouse controls are
								there when you need them.
							</p>
						</div>
					</div>
				</Reveal>
			</div>
		</section>

		<section id="stars" class="scroll-mt-24 mb-20 md:mb-28" aria-labelledby="stars-title">
			<Reveal>
				<div class="mb-8 grid gap-4 md:grid-cols-[2fr_3fr] md:gap-12">
					<div>
						<p class="mb-3 text-xs text-accent-2">STAR HISTORY</p>
						<h2 id="stars-title" class="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
							Greeter, over time.
						</h2>
					</div>
					<p class="max-w-lg self-end leading-relaxed text-fg-dim">
						GitHub stars for the Noctalia Greeter repository.
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
										alt="GitHub star history graph for noctalia-dev/noctalia-greeter"
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
											? 'The chart is unavailable right now. You can find Greeter on GitHub below.'
											: 'Loading GitHub star history…'}
									</p>
								{/if}
							</div>
						{/snippet}
					</SpotlightSurface>
					<figcaption
						class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-fg-dim"
					>
						<span>noctalia-dev/noctalia-greeter</span>
						<a
							href={greeter.repoUrl + '/stargazers'}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-sm text-accent transition-colors hover:text-accent-2"
							>View on GitHub <span aria-hidden="true">↗</span></a
						>
					</figcaption>
				</figure>
			</Reveal>
		</section>

		<Reveal>
			<aside class="companion-note" aria-label="Noctalia desktop companion">
				<p>
					And on the other side of login?<br /><span
						>Noctalia brings the bar, launcher, and desktop controls.</span
					>
				</p>
				<a class="text-link" href="/shell">Meet the Shell <span aria-hidden="true">→</span></a>
			</aside>
		</Reveal>
	</div>
</main>

<SiteFooter />

<style>
	.section-number {
		font: 0.65rem var(--font-mono);
		letter-spacing: 0.08em;
		color: var(--color-fg-dim);
	}
	.text-link {
		display: inline-flex;
		align-items: center;
		gap: 1.2rem;
		font-size: 0.8rem;
		font-weight: 600;
		border-radius: 3px;
		transition:
			color 180ms,
			border-color 180ms;
	}
	.text-link span {
		color: var(--color-accent-2);
	}
	.text-link:hover {
		color: var(--color-accent-2);
	}
	.greeter-details {
		display: grid;
		grid-template-columns: 2fr 3fr;
		gap: 4rem;
		margin-bottom: 5rem;
	}
	.detail-row {
		display: grid;
		grid-template-columns: 2rem 1fr;
		gap: 1rem;
		padding-block: 1.6rem;
		border-top: 1px solid var(--color-border);
	}
	.detail-number {
		padding-top: 0.2rem;
		font: 0.65rem var(--font-mono);
		color: var(--color-accent-2);
	}
	h3 {
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.detail-row p {
		margin-top: 0.7rem;
		font-size: 0.85rem;
		line-height: 1.85;
		color: var(--color-fg-dim);
	}
	.companion-note {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
		border-top: 1px solid var(--color-border);
		padding-top: 2rem;
	}
	.companion-note p {
		font-size: 0.9rem;
		line-height: 1.9;
	}
	.companion-note p span {
		color: var(--color-fg-dim);
	}
	@media (max-width: 760px) {
		.greeter-details {
			grid-template-columns: 1fr;
			gap: 2rem;
			margin-bottom: 3.5rem;
		}
		.companion-note {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}
</style>
