<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import Reveal from '$lib/reveal.svelte';
	import ProjectIntro from '$lib/project-intro.svelte';
	import SectionHeading from '$lib/section-heading.svelte';
	import StarHistory from '$lib/star-history.svelte';
	import PageOutro from '$lib/page-outro.svelte';
	import GreeterPreview from '$lib/home/GreeterPreview.svelte';
	import { PRODUCTS } from '$lib/products';

	const greeter = PRODUCTS.find((product) => product.id === 'greeter')!;
	const shell = PRODUCTS.find((product) => product.id === 'noctalia')!;
	const umbriel = PRODUCTS.find((product) => product.id === 'umbriel')!;

	const details = [
		{
			title: 'A place to start',
			body: 'Pick a user and a Wayland session. Greeter handles the sign-in screen; greetd handles authentication and starts your session.'
		},
		{
			title: 'Already feels familiar',
			body: 'Optionally sync your wallpaper, colors, and font from Noctalia. Your login screen and desktop can share the same look.'
		},
		{
			title: 'Keep your hands on the keys',
			body: 'Navigate users, sessions, and sign-in controls from the keyboard. Mouse controls are there when you need them.'
		}
	];
</script>

<SiteHeader />

<main class="page-sections">
	<ProjectIntro
		title="Greeter"
		eyebrow={greeter.role}
		logoUrl={greeter.logoUrl}
		summary="The first screen of your day should feel like yours, too."
		detail="Choose your user, sign in, and step into your Wayland session. A quiet welcome, with the same visual language as Noctalia."
	>
		{#snippet actions()}
			<a href={greeter.docsUrl} target="_blank" rel="noopener noreferrer" class="action-primary"
				>Set up Greeter <span aria-hidden="true">↗</span></a
			>
			<a href={greeter.repoUrl} target="_blank" rel="noopener noreferrer" class="action-secondary"
				><i class="ti ti-brand-github" aria-hidden="true"></i> Source code</a
			>
		{/snippet}
	</ProjectIntro>

	<section id="details" class="site-shell scroll-mt-24" aria-labelledby="details-title">
		<SectionHeading
			number={1}
			id="details-title"
			label="Sign in"
			title="From login to your own space"
			lead="A small screen with a few details that make it feel like part of your desktop."
		/>
		<div class="details-grid">
			<ul class="detail-rows">
				{#each details as detail, i (detail.title)}
					<li>
						<Reveal delay={i * 60}>
							<div class="detail-row">
								<h3 class="type-card-title">{detail.title}</h3>
								<p class="type-body">{detail.body}</p>
							</div>
						</Reveal>
					</li>
				{/each}
			</ul>
			<Reveal delay={90}><GreeterPreview /></Reveal>
		</div>
	</section>

	<StarHistory
		number={2}
		name="Greeter"
		repo="noctalia-dev/noctalia-greeter"
		chartUrl="https://api.noctalia.dev/stars-animated/greeter"
	/>

	<PageOutro
		title="On the other side of login"
		body="Noctalia Shell brings the bar, launcher, and desktop controls; Umbriel arranges your windows."
		links={[
			{ href: '/shell', label: 'Shell', logo: shell.logoUrl },
			{ href: '/umbriel', label: 'Compositor', logo: umbriel.logoUrl }
		]}
	/>
</main>

<SiteFooter />

<style>
	.details-grid {
		display: grid;
		gap: 2.5rem;
		align-items: center;
	}
	.detail-rows {
		border-top: 1px solid var(--color-border);
	}
	.detail-row {
		display: grid;
		gap: 0.375rem;
		padding-block: 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	@media (min-width: 900px) {
		.details-grid {
			grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
			gap: clamp(2rem, 5vw, 5rem);
		}
	}
</style>
