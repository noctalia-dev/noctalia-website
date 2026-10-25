<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import Reveal from '$lib/reveal.svelte';
	import Family from '$lib/home/Family.svelte';
	import HomeHero from '$lib/home/HomeHero.svelte';
	import PluginPreview from '$lib/home/PluginPreview.svelte';
	import { GITHUB_ORG_URL } from '$lib/site-constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SiteHeader />

<main class="project-home">
	<HomeHero />

	<section class="directory-shell" aria-label="Our projects">
		<Family stars={data.stars} />
	</section>

	<section id="plugins" class="directory-shell" aria-labelledby="plugins-title">
		<Reveal>
			<div class="plugin-row">
				<div class="plugin-copy">
					<a href="/plugins" class="plugin-overview">
						<p class="eyebrow plugin-marker"><span>04</span> / Shell ecosystem</p>
						<div class="plugin-name">
							<i class="ti ti-puzzle" aria-hidden="true"></i>
							<h2 id="plugins-title">Plugins</h2>
						</div>
						<p class="plugin-intro">A few more things your desktop can do.</p>
						<p class="plugin-description">
							Small additions for Noctalia Shell, made by the team and the community. Find something
							useful in the catalog, or build a plugin of your own.
						</p>
					</a>
					<a class="plugin-link" href="/plugins">Open the catalog <span aria-hidden="true">→</span></a>
				</div>
				<div class="plugin-panel">
					<PluginPreview count={data.pluginCount} />
				</div>
			</div>
		</Reveal>
	</section>

	<section class="directory-shell" aria-labelledby="community-title">
		<Reveal delay={70}>
			<div class="community">
				<div>
					<h2 id="community-title">Made by people who use it.</h2>
					<p>
						Free and open source, built by a small team in our spare time.
						<a href="/ethos" class="ethos-link">Read how we work <span aria-hidden="true">→</span></a>
					</p>
				</div>
				<div class="community-actions">
					<a href="https://discord.noctalia.dev" target="_blank" rel="noopener noreferrer"
						><i class="ti ti-brand-discord" aria-hidden="true"></i> Join the Discord</a
					>
					<a href={GITHUB_ORG_URL} target="_blank" rel="noopener noreferrer"
						><i class="ti ti-brand-github" aria-hidden="true"></i> Find us on GitHub</a
					>
				</div>
			</div>
		</Reveal>
	</section>
</main>

<SiteFooter />

<style>
	.directory-shell {
		width: 100%;
		max-width: 90rem;
		margin-inline: auto;
		padding-inline: 1rem;
	}
	.plugin-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		align-items: center;
		padding-block: 2.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	.plugin-marker > span {
		margin-right: 0.35rem;
		color: var(--color-accent);
	}
	.plugin-name {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 1.25rem;
	}
	.plugin-name i {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		font-size: 2.25rem;
		color: var(--color-accent-3);
	}
	.plugin-name h2 {
		font-size: 2.5rem;
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: -0.055em;
		transition: color 180ms;
	}
	.plugin-intro {
		margin-top: 1.25rem;
		font-size: 1.125rem;
		line-height: 1.5;
	}
	.plugin-description {
		max-width: 25rem;
		margin-top: 0.6rem;
		font-size: 1rem;
		line-height: 1.65;
		color: var(--color-fg-dim);
	}
	.plugin-panel {
		min-width: 0;
	}
	.plugin-overview {
		display: block;
		border-radius: 4px;
	}
	.plugin-overview:hover h2,
	.plugin-overview:focus-visible h2 {
		color: var(--color-accent);
	}
	.plugin-link {
		display: inline-flex;
		align-items: center;
		gap: 1.4rem;
		min-height: 2.75rem;
		margin-top: 1.8rem;
		padding-block: 0.5rem;
		border-bottom: 1px solid color-mix(in srgb, var(--color-accent) 35%, transparent);
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-accent);
	}
	.plugin-link:hover {
		color: var(--color-accent-2);
	}
	.community {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem 2rem;
		padding-block: 3.5rem 4.5rem;
	}
	.community h2 {
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: -0.03em;
	}
	.community p {
		margin-top: 0.375rem;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--color-fg-dim);
	}
	.ethos-link {
		color: var(--color-fg);
		font-weight: 500;
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--color-accent) 50%, transparent);
		text-underline-offset: 0.25em;
		transition:
			color 180ms,
			text-decoration-color 180ms;
	}
	.ethos-link:hover {
		color: var(--color-accent);
		text-decoration-color: currentColor;
	}
	.community-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.community-actions a {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		height: 2.75rem;
		padding-inline: 1.125rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-surface-2);
		font-size: 0.9375rem;
		font-weight: 600;
		transition:
			border-color 180ms,
			color 180ms;
	}
	.community-actions a i {
		font-size: 1.125rem;
		color: var(--color-accent-3);
	}
	.community-actions a:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}
	@media (min-width: 640px) {
		.directory-shell {
			padding-inline: 1.25rem;
		}
	}
	@media (min-width: 761px) {
		.plugin-row {
			grid-template-columns: 3fr 2fr;
			gap: clamp(2rem, 5vw, 5rem);
			padding-block: 3.5rem;
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
</style>
