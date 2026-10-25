<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import Reveal from '$lib/reveal.svelte';
	import Family from '$lib/home/Family.svelte';
	import ProjectIntro from '$lib/project-intro.svelte';
	import { DOCS_BASE_URL } from '$lib/site-constants';
	import PluginPreview from '$lib/home/PluginPreview.svelte';
	import { GITHUB_ORG_URL } from '$lib/site-constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SiteHeader />

<main class="project-home">
	<ProjectIntro
		title="Noctalia"
		eyebrow="The Noctalia projects"
		logoUrl="https://assets.noctalia.dev/noctalia-logo.svg"
		summary="A family of projects that feel like one desktop."
		detail="Our native Wayland desktop shell, compositor, and login screen share one look, one palette, and one philosophy. Each is tunable to your setup. Use them together, or choose the pieces you need."
		anchorHref="#family"
		anchorLabel="Meet the projects"
		back={false}
	>
		{#snippet actions()}
			<div class="intro-actions">
				<a
					href={DOCS_BASE_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="intro-action intro-action--primary"
					>Get started <span aria-hidden="true">↗</span></a
				>
				<a href={GITHUB_ORG_URL} target="_blank" rel="noopener noreferrer" class="intro-action"
					><i class="ti ti-brand-github text-lg" aria-hidden="true"></i> Source code</a
				>
				<a class="intro-action" href="/blog">Blog <span aria-hidden="true">↗</span></a>
				<a class="intro-action" href="/changelogs">Releases <span aria-hidden="true">↗</span></a>
			</div>
		{/snippet}
	</ProjectIntro>

	<section class="directory-shell" aria-label="Our projects">
		<Family stars={data.stars} />
	</section>

	<section class="directory-shell" aria-labelledby="plugins-title">
		<Reveal>
			<div class="plugin-row">
				<div class="plugin-copy">
					<a href="/plugins" class="plugin-overview">
						<p class="plugin-marker">04 <span>/ THE SHELL ECOSYSTEM</span></p>
						<h2 id="plugins-title">Plugins.</h2>
						<p class="plugin-intro">A few more things your desktop can do.</p>
						<p class="plugin-description">
							Small additions for Noctalia Shell, made by the team and the community. Find something
							useful in the catalog, or build a plugin of your own.
						</p>
					</a>
					<a class="directory-link mt-6 text-accent" href="/plugins"
						>Open the catalog <span aria-hidden="true">→</span></a
					>
				</div>
				<div class="plugin-panel">
					<PluginPreview count={data.pluginCount} />
				</div>
			</div>
		</Reveal>
	</section>

	<section class="directory-shell directory-more" aria-label="Community">
		<Reveal delay={70}>
			<div class="community-note">
				<p>Made by people who use it.<br /><span>Come build a desktop with us.</span></p>
				<div class="flex flex-wrap gap-x-7 gap-y-4">
					<a class="directory-link" href={GITHUB_ORG_URL} target="_blank" rel="noopener noreferrer"
						>Find us on GitHub <span aria-hidden="true">↗</span></a
					>
					<a
						class="directory-link"
						href="https://discord.noctalia.dev"
						target="_blank"
						rel="noopener noreferrer">Join the conversation <span aria-hidden="true">↗</span></a
					>
				</div>
			</div>
		</Reveal>
	</section>
</main>

<SiteFooter />

<style>
	.intro-actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.65rem;
		width: 100%;
		max-width: 38rem;
	}
	.intro-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		height: 2.75rem;
		padding-inline: 0.65rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background: var(--color-surface-2);
		font-size: 0.8rem;
		font-weight: 600;
		white-space: nowrap;
		color: var(--color-fg);
		transition:
			border-color 180ms,
			background 180ms,
			transform 180ms;
	}
	.intro-action:hover {
		border-color: var(--color-accent);
		background: color-mix(in srgb, var(--color-accent) 8%, var(--color-surface));
		transform: translateY(-1px);
	}
	.intro-action--primary {
		border-color: var(--color-accent);
		background: var(--color-accent);
		color: var(--color-on-accent);
	}
	.intro-action--primary:hover {
		background: var(--color-accent);
		color: var(--color-on-accent);
	}
	@media (min-width: 1000px) {
		.intro-actions {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	.directory-shell {
		width: 100%;
		max-width: 90rem;
		margin-inline: auto;
		padding-inline: 1rem;
	}
	.directory-link {
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		border-radius: 2px;
		min-height: 2.75rem;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-fg);
		text-decoration: none;
		transition: color 180ms;
	}
	.directory-link:hover {
		color: var(--color-accent);
	}
	.directory-link span {
		color: var(--color-accent);
	}
	.directory-more {
		padding-block: 3rem 4rem;
	}
	.plugin-row {
		display: grid;
		grid-template-columns: 2fr 3fr;
		gap: clamp(2rem, 5vw, 5rem);
		align-items: center;
		padding-block: 3rem;
		border-bottom: 1px solid var(--color-border);
	}
	.plugin-marker {
		font: 500 1rem var(--font-sans);
		letter-spacing: 0.07em;
		color: var(--color-accent);
	}
	.plugin-marker span {
		color: var(--color-fg-dim);
		margin-left: 0.5rem;
	}
	.plugin-row h2 {
		margin-top: 1.5rem;
		font-size: 2.5rem;
		letter-spacing: -0.055em;
		font-weight: 600;
	}
	.plugin-intro {
		margin-top: 1.3rem;
		font-size: 1.125rem;
		line-height: 1.6;
	}
	.plugin-description {
		max-width: 25rem;
		margin-top: 0.6rem;
		font-size: 1rem;
		line-height: 1.8;
		color: var(--color-fg-dim);
	}
	.plugin-panel {
		min-width: 0;
	}
	.plugin-overview {
		display: block;
		border-radius: 4px;
	}
	.plugin-overview h2 {
		transition: color 180ms;
	}
	.plugin-overview:hover h2,
	.plugin-overview:focus-visible h2 {
		color: var(--color-accent);
	}
	@media (min-width: 761px) {
		.plugin-row {
			grid-template-columns: 3fr 2fr;
		}
		.plugin-copy {
			grid-column: 2;
			grid-row: 1;
		}
		.plugin-panel {
			grid-column: 1;
			grid-row: 1;
		}
	}
	.community-note {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
		margin-top: 0;
	}
	.community-note p {
		font-size: 1rem;
		line-height: 1.8;
	}
	.community-note p span {
		color: var(--color-fg-dim);
	}
	@media (min-width: 640px) {
		.directory-shell {
			padding-inline: 1.25rem;
		}
	}
	@media (max-width: 760px) {
		.plugin-row {
			grid-template-columns: 1fr;
			gap: 1rem;
			padding-block: 2.5rem;
		}
		.directory-more {
			padding-top: 3rem;
		}
	}
</style>
