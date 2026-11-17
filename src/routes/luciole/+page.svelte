<script lang="ts">
	import SiteHeader from '#lib/site-header.svelte';
	import SiteFooter from '#lib/site-footer.svelte';
	import Reveal from '#lib/reveal.svelte';
	import ProjectIntro from '#lib/project-intro.svelte';
	import SectionHeading from '#lib/section-heading.svelte';
	import PageOutro from '#lib/page-outro.svelte';
	import LucioleVisual from '#lib/home/LucioleVisual.svelte';
	import { PRODUCTS } from '#lib/products.js';

	const luciole = PRODUCTS.find((product) => product.id === 'luciole')!;
	const shell = PRODUCTS.find((product) => product.id === 'noctalia')!;
	const umbriel = PRODUCTS.find((product) => product.id === 'umbriel')!;
	const greeter = PRODUCTS.find((product) => product.id === 'greeter')!;

	const details = [
		{
			title: 'Nothing blocks the window',
			body: 'Listing, file operations, and thumbnail decoding run in the background; images decode in sandboxed helpers.'
		},
		{
			title: 'Views for every folder',
			body: 'Grid, list, and Miller columns, with tabs, split view, adjustable zoom, and previews for images, video, text, and PDFs.'
		},
		{
			title: 'The picker everywhere',
			body: 'Luciole serves as the Open and Save dialog for other apps through xdg-desktop-portal, and handles archives and SFTP, SMB, and WebDAV locations.'
		}
	];
</script>

<SiteHeader />

<main class="page-sections">
	<ProjectIntro
		title="Luciole"
		eyebrow={luciole.role}
		logoUrl={luciole.logoUrl}
		summary="A file manager that keeps up with you."
		detail="Open folders with thousands of files, scroll without a stutter, and watch thumbnails fill in as you go. Native Wayland, no Qt or GTK."
	>
		{#snippet actions()}
			<a href={luciole.docsUrl} target="_blank" rel="noopener noreferrer" class="action-primary"
				>Read the docs <span aria-hidden="true">↗</span></a
			>
			<a href={luciole.repoUrl} target="_blank" rel="noopener noreferrer" class="action-secondary"
				><i class="ti ti-brand-github" aria-hidden="true"></i> Source code</a
			>
		{/snippet}
	</ProjectIntro>

	<section id="details" class="site-shell scroll-mt-24" aria-labelledby="details-title">
		<SectionHeading
			number={1}
			id="details-title"
			label="Browse"
			title="Fast where it counts"
			lead="Built for big folders, many windows, and everyday file work."
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
			<Reveal delay={90}><LucioleVisual /></Reveal>
		</div>
	</section>

	<PageOutro
		title="Part of the family"
		body="Noctalia Shell brings the bar and launcher, Umbriel arranges your windows, and Greeter signs you in."
		links={[
			{ href: '/shell', label: 'Shell', logo: shell.logoUrl },
			{ href: '/umbriel', label: 'Compositor', logo: umbriel.logoUrl },
			{ href: '/greeter', label: 'Greeter', logo: greeter.logoUrl }
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
