<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import ProjectIntro from '$lib/project-intro.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import Reveal from '$lib/reveal.svelte';
	import FeatureIcon from '$lib/feature-icon.svelte';
	import Slideshow from '$lib/slideshow.svelte';
	import SectionHeading from '$lib/section-heading.svelte';
	import StarHistory from '$lib/star-history.svelte';
	import PageOutro from '$lib/page-outro.svelte';
	import Compositors from '$lib/home/Compositors.svelte';
	import { slideshowImages } from '$lib/slideshow-images';
	import { PRODUCTS } from '$lib/products';
	import type { FeatureIconId } from '$lib/feature-icons';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const shell = PRODUCTS.find((p) => p.id === 'noctalia')!;
	const umbriel = PRODUCTS.find((p) => p.id === 'umbriel')!;
	const greeter = PRODUCTS.find((p) => p.id === 'greeter')!;

	type ReasonCard = {
		icon: FeatureIconId;
		title: string;
		body: string;
		stat?: string;
		/** Linked cards get the hover state; static ones stay still. */
		href?: string;
	};

	const reasons = $derived<ReasonCard[]>([
		{
			icon: 'wayland',
			title: 'Built for Wayland',
			body: 'Your bar, launcher, notifications, and desktop controls, made for Wayland from the start.'
		},
		{
			icon: 'minimal',
			title: 'Quiet by design',
			body: 'A clean, uncluttered interface that gets out of your way.'
		},
		{
			icon: 'custom',
			title: 'Yours to shape',
			body: 'Choose your palette, arrange your bar, and make the desktop feel like yours.',
			href: `${shell.docsUrl}`
		},
		{
			icon: 'compositors',
			title: 'Compositors supported',
			body: 'Works across the leading Wayland compositors, with broader support through standard protocols.',
			stat: '7+',
			href: '#compositors'
		},
		{
			icon: 'plugins',
			title: 'Plugins available',
			body: 'Extend your setup with official and community plugins.',
			stat: data.pluginCount > 0 ? `${data.pluginCount}` : undefined,
			href: '/plugins'
		},
		{
			icon: 'releases',
			title: 'Releases so far',
			body: 'Regular releases and steady improvements since July 2025.',
			stat: data.releaseCount > 0 ? `${data.releaseCount}` : undefined,
			href: '/changelogs'
		}
	]);
</script>

<SiteHeader />

<main class="page-sections">
	<ProjectIntro
		title="Noctalia"
		eyebrow={shell.role}
		logoUrl={shell.logoUrl}
		summary="Everything around your Wayland windows."
		detail="The bar, launcher, control center, and lock screen you reach for every day. One place to configure them, a palette that follows your wallpaper, and your choice of compositor underneath."
	>
		{#snippet actions()}
			<a href={shell.docsUrl} target="_blank" rel="noopener noreferrer" class="action-primary"
				>Get started <span aria-hidden="true">↗</span></a
			>
			<a href={shell.repoUrl} target="_blank" rel="noopener noreferrer" class="action-secondary"
				><i class="ti ti-brand-github" aria-hidden="true"></i> Source code</a
			>
		{/snippet}
	</ProjectIntro>

	<section id="spotlight" class="site-shell scroll-mt-24" aria-labelledby="spotlight-title">
		<SectionHeading
			number={1}
			id="spotlight-title"
			label="In use"
			title="At home on your desktop"
			lead="Real setups from the community. Different wallpapers, different palettes, the same Shell."
		/>
		<Reveal delay={60}>
			<div class="spotlight-frame" style="--slideshow-corner-radius: 0">
				<Slideshow images={slideshowImages} interval={4500} />
			</div>
		</Reveal>
	</section>

	<section id="compositors" class="site-shell scroll-mt-24" aria-labelledby="compositors-title">
		<SectionHeading
			number={2}
			id="compositors-title"
			label="Compositors"
			title="Pick your compositor"
			lead="Noctalia runs on every compositor below, each with its own setup guide. Umbriel is our own, developed alongside the Shell."
		/>
		<Compositors />
	</section>

	<section class="site-shell" aria-labelledby="reasons-title">
		<SectionHeading
			number={3}
			id="reasons-title"
			label="Why Noctalia"
			title="A shell you can rely on"
			lead="Quiet by default, easy to make your own, and steadily maintained."
		/>
		<ul class="reasons">
			{#each reasons as reason, i (reason.title)}
				<li>
					<Reveal class="h-full" delay={i * 60}>
						<svelte:element
							this={reason.href ? 'a' : 'div'}
							href={reason.href}
							class="reason card-surface"
							class:card-surface-hover={reason.href}
						>
							<span class="reason-top" aria-hidden="true">
								<FeatureIcon id={reason.icon} class="h-6 w-6" />
								{#if reason.href}<i class="ti ti-arrow-right"></i>{/if}
							</span>
							{#if reason.stat}<span class="reason-stat">{reason.stat}</span>{/if}
							<h3 class="type-card-title">{reason.title}</h3>
							<p class="type-small">{reason.body}</p>
						</svelte:element>
					</Reveal>
				</li>
			{/each}
		</ul>
	</section>

	<StarHistory
		number={4}
		name="Noctalia"
		repo="noctalia-dev/noctalia"
		chartUrl="https://api.noctalia.dev/stars"
	/>

	<PageOutro
		title="Complete the desktop"
		body="Arrange your windows with Umbriel, and sign in with Greeter. Same people, same look."
		links={[
			{ href: '/umbriel', label: 'Compositor', logo: umbriel.logoUrl },
			{ href: '/greeter', label: 'Greeter', logo: greeter.logoUrl }
		]}
	/>
</main>

<SiteFooter />

<style>
	.spotlight-frame {
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: var(--color-void-deep);
	}
	.reasons {
		display: grid;
		gap: 1rem;
	}
	.reasons > li {
		display: grid;
	}
	.reason {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 1.5rem;
	}
	.reason-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
		color: var(--color-accent-2);
	}
	.reason-top i {
		font-size: 1.125rem;
		color: var(--color-fg-dim);
		transition: color 180ms;
	}
	.card-surface-hover:hover .reason-top i {
		color: var(--color-accent);
	}
	.reason-stat {
		margin-bottom: 0.25rem;
		font-size: 2rem;
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: -0.04em;
		font-variant-numeric: tabular-nums;
		color: var(--color-accent);
	}
	.reason .type-small {
		margin-top: 0.375rem;
	}
	@media (min-width: 640px) {
		.reasons {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 1024px) {
		.reasons {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
