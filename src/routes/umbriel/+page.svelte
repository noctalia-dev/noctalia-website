<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import ProjectIntro from '$lib/project-intro.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import Reveal from '$lib/reveal.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
	import SectionHeading from '$lib/section-heading.svelte';
	import StarHistory from '$lib/star-history.svelte';
	import PageOutro from '$lib/page-outro.svelte';
	import LayoutShowcase from '$lib/umbriel/LayoutShowcase.svelte';
	import { PRODUCTS } from '$lib/products';

	const umbriel = PRODUCTS.find((p) => p.id === 'umbriel')!;
	const shell = PRODUCTS.find((p) => p.id === 'noctalia')!;
	const greeter = PRODUCTS.find((p) => p.id === 'greeter')!;

	const details = [
		{
			title: 'Each screen, its own space',
			body: 'Keep independent workspaces on each monitor. Use dynamic or named workspaces, with fractional scaling and workspace restoration when a display reconnects.'
		},
		{
			title: 'A mouse belongs here, too',
			body: 'Move and resize windows with the mouse, or navigate with your keyboard. Optional title bars bring close and maximize buttons, along with moving and resizing without holding a modifier key.'
		},
		{
			title: 'Keep a task together',
			body: 'Collect related windows in tab groups. Hide a group in a named scratchpad, then bring it back on whichever monitor you are using.'
		},
		{
			title: 'Adjust it as you go',
			body: 'Set your keybinds, window rules, blur, shadows, and animations in TOML. Configuration reloads while you work, with diagnostics to help you find mistakes.'
		},
		{
			title: 'And when it is time to play',
			body: 'HDR and variable refresh rate are available as opt-in features. Support depends on your display, graphics stack, and applications.'
		}
	];
</script>

<SiteHeader />

<main class="page-sections">
	<ProjectIntro
		title="Umbriel"
		eyebrow={umbriel.role}
		logoUrl={umbriel.logoUrl}
		summary="Scroll through your windows. Let them tile into place. Or move them around by hand."
		detail="Choose how your windows are arranged on each workspace, with the controls and finishing touches to make it feel like home."
	>
		{#snippet actions()}
			<a href={umbriel.docsUrl} target="_blank" rel="noopener noreferrer" class="action-primary"
				>Get started <span aria-hidden="true">↗</span></a
			>
			<a href={umbriel.repoUrl} target="_blank" rel="noopener noreferrer" class="action-secondary"
				><i class="ti ti-brand-github" aria-hidden="true"></i> Source code</a
			>
		{/snippet}
	</ProjectIntro>

	<section id="layouts" class="site-shell scroll-mt-24" aria-labelledby="layouts-title">
		<SectionHeading
			number={1}
			id="layouts-title"
			label="Layouts"
			title="Find your arrangement"
			lead="Keep one layout for everything, or use a different one on each workspace. The demo cycles through all four; pick one to stay on it."
		/>
		<Reveal delay={60}><LayoutShowcase /></Reveal>
	</section>

	<section class="site-shell" aria-labelledby="details-title">
		<SectionHeading
			number={2}
			id="details-title"
			label="Everyday"
			title="Beyond the arrangement"
			lead="The details that matter when this is where you spend your day."
		/>
		<ul class="detail-rows">
			{#each details as detail, i (detail.title)}
				<li>
					<Reveal delay={i * 45}>
						<div class="detail-row">
							<h3 class="type-card-title">{detail.title}</h3>
							<p class="type-body">{detail.body}</p>
						</div>
					</Reveal>
				</li>
			{/each}
		</ul>
	</section>

	<StarHistory
		number={3}
		name="Umbriel"
		repo="noctalia-dev/umbriel"
		chartUrl="https://api.noctalia.dev/stars-animated/umbriel"
	/>

	<PageOutro
		title="The desktop around it"
		body="Pair Umbriel with Noctalia Shell for your bar, launcher, and wallpaper-driven colors, and sign in with Greeter. Same people, same look."
		links={[
			{ href: '/shell', label: 'Shell', logo: shell.logoUrl },
			{ href: '/greeter', label: 'Greeter', logo: greeter.logoUrl }
		]}
	/>
</main>

<SiteFooter />
<ScrollToTop />

<style>
	.detail-rows {
		border-top: 1px solid var(--color-border);
	}
	.detail-row {
		display: grid;
		gap: 0.5rem;
		padding-block: 1.75rem;
		border-bottom: 1px solid var(--color-border);
	}
	.detail-row .type-body {
		max-width: 40rem;
	}
	@media (min-width: 768px) {
		.detail-row {
			grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
			gap: clamp(2rem, 5vw, 5rem);
		}
	}
</style>
