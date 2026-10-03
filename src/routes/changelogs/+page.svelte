<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
	import { PRODUCTS } from '$lib/products';
	import type { GithubRelease } from '$lib/releases.server';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	type ProjectId = 'noctalia' | 'umbriel';

	let { data } = $props<{ data: { releases: GithubRelease[] } }>();
	let activeProject = $state<ProjectId>('noctalia');
	let reducedMotion = $state(false);

	const latest = $derived(data.releases[0]);
	const umbriel = PRODUCTS.find((product) => product.id === 'umbriel')!;

	onMount(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => (reducedMotion = media.matches);
		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	});

	function formatDate(dateString: string): string {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC'
		});
	}

	function releaseHref(tagName: string): string {
		return `/changelogs/${encodeURIComponent(tagName)}`;
	}

	function openProject(project: ProjectId) {
		activeProject = project;
		document.getElementById('release-archive')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<SiteHeader />

<main class="changelog-page">
	<section class="site-shell changelog-hero">
		<div class="changelog-hero__copy">
			<p class="section-eyebrow">
				<span class="section-eyebrow__signal" aria-hidden="true"></span>
				Release notes
			</p>
			<h1>Releases from <span>our projects.</span></h1>
			<p class="changelog-intro">
				Follow releases across our family of native Wayland projects.
			</p>
			<a class="rss-button" href="/rss.xml" target="_blank" rel="noopener noreferrer">
				<i class="ti ti-rss" aria-hidden="true"></i>
				Subscribe to releases
			</a>
		</div>

		<div class="project-release-grid" aria-label="Latest project releases">
			{#if latest}
				<a
					class="project-release-card project-release-card--noctalia"
					href={releaseHref(latest.tagName)}
					aria-label="Read the latest Noctalia release, {latest.tagName}"
				>
					<div class="project-release-card__topline">
						<span class="project-release-card__project">
							<span class="project-dot" aria-hidden="true"></span>
							Noctalia
						</span>
						<span>Latest release</span>
					</div>
					<strong>{latest.tagName}</strong>
					<div class="project-release-card__footer">
						<span>{formatDate(latest.publishedAt)}</span>
						<span class="project-release-card__action">
							Open release <i class="ti ti-arrow-up-right" aria-hidden="true"></i>
						</span>
					</div>
				</a>
			{/if}

			<button
				type="button"
				class="project-release-card project-release-card--umbriel"
				onclick={() => openProject('umbriel')}
				aria-label="View the Umbriel release placeholder"
			>
				<div class="project-release-card__topline">
					<span class="project-release-card__project">
						<span class="project-dot" aria-hidden="true"></span>
						Umbriel
					</span>
					<span>Latest release</span>
				</div>
				<strong>Coming soon</strong>
				<div class="project-release-card__footer">
					<span>Release archive placeholder</span>
					<span class="project-release-card__action">
						View project <i class="ti ti-arrow-right" aria-hidden="true"></i>
					</span>
				</div>
			</button>
		</div>
	</section>

	<section id="release-archive" class="site-shell release-section" aria-labelledby="release-archive-title">
		<header class="release-section__header">
			<div>
				<p class="section-eyebrow">Project archive</p>
				<h2 id="release-archive-title">All releases</h2>
			</div>
		</header>

		<div class="project-tabs" aria-label="Release project">
			<span
				class:project-tabs__indicator--umbriel={activeProject === 'umbriel'}
				class="project-tabs__indicator"
				aria-hidden="true"
			></span>
			<button
				type="button"
				class:project-tab--active={activeProject === 'noctalia'}
				class="project-tab"
				aria-pressed={activeProject === 'noctalia'}
				onclick={() => (activeProject = 'noctalia')}
			>
				<span class="project-dot" aria-hidden="true"></span>
				<span>Noctalia</span>
				<small>{data.releases.length}</small>
			</button>
			<button
				type="button"
				class:project-tab--active={activeProject === 'umbriel'}
				class="project-tab project-tab--umbriel"
				aria-pressed={activeProject === 'umbriel'}
				onclick={() => (activeProject = 'umbriel')}
			>
				<span class="project-dot" aria-hidden="true"></span>
				<span>Umbriel</span>
				<small>Soon</small>
			</button>
		</div>

		{#if activeProject === 'noctalia'}
			<div
				class="project-panel project-panel--releases"
				aria-live="polite"
				in:fade={{ duration: reducedMotion ? 0 : 180, delay: reducedMotion ? 0 : 70 }}
				out:fade={{ duration: reducedMotion ? 0 : 110 }}
			>
				{#if data.releases.length}
					<ol class="release-list">
						{#each data.releases as release, index (release.tagName)}
							<li
								id={release.tagName}
								class:release-list__item--latest={index === 0}
								class="release-list__item"
							>
								<a
									class="release-list__link"
									href={releaseHref(release.tagName)}
									aria-label="Read {release.tagName} release notes"
								>
					<span class="release-list__number" aria-hidden="true">
						{String(index + 1).padStart(2, '0')}
					</span>
					<div>
						<div class="release-list__meta">
							<time datetime={release.publishedAt}>{formatDate(release.publishedAt)}</time>
							{#if index === 0}
								<span class="release-badge release-badge--latest">Latest</span>
							{/if}
							{#if release.prerelease}<span class="release-badge">Pre-release</span>{/if}
						</div>
						<h3>{release.tagName}</h3>
					</div>
								</a>
							</li>
						{/each}
					</ol>
				{:else}
					<p class="release-empty">No Noctalia releases found.</p>
				{/if}
			</div>
		{:else}
			<div
				class="project-panel project-placeholder"
				aria-live="polite"
				in:fade={{ duration: reducedMotion ? 0 : 180, delay: reducedMotion ? 0 : 70 }}
				out:fade={{ duration: reducedMotion ? 0 : 110 }}
			>
				<span class="project-placeholder__glyph" aria-hidden="true">
					<img src={umbriel.logoUrl} alt="" width="52" height="52" />
				</span>
				<h3>No releases yet.</h3>
				<p>
					Umbriel is still taking shape. Its release notes will appear here with the first tagged
					release.
				</p>
				<a href="https://github.com/noctalia-dev/umbriel" target="_blank" rel="noopener noreferrer">
					View Umbriel on GitHub <i class="ti ti-arrow-up-right" aria-hidden="true"></i>
				</a>
			</div>
		{/if}
	</section>
</main>

<SiteFooter />
<ScrollToTop />

<style>
	.changelog-page {
		padding-bottom: 7rem;
	}

	.changelog-hero {
		max-width: 72rem;
		padding-top: clamp(4rem, 8vw, 7rem);
		padding-bottom: clamp(5rem, 9vw, 7rem);
	}

	.changelog-hero__copy {
		max-width: 46rem;
	}

	.section-eyebrow {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		margin: 0 0 1.25rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 650;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-accent-2);
	}

	.section-eyebrow__signal {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 999px;
		background: var(--color-accent-2);
		box-shadow:
			0 0 0 0.3rem color-mix(in srgb, var(--color-accent-2) 12%, transparent),
			0 0 1.2rem color-mix(in srgb, var(--color-accent-2) 60%, transparent);
	}

	.changelog-hero h1 {
		margin: 0;
		font-size: clamp(3.2rem, 6vw, 5.2rem);
		font-weight: 620;
		line-height: 0.93;
		letter-spacing: -0.065em;
		color: var(--color-fg);
		text-wrap: balance;
	}

	.changelog-hero h1 span {
		color: var(--color-accent);
	}

	.changelog-intro {
		max-width: 42rem;
		margin: 1.75rem 0 0;
		font-size: clamp(1rem, 2vw, 1.18rem);
		line-height: 1.75;
		color: var(--color-fg-dim);
	}

	.rss-button {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		min-height: 2.75rem;
		margin-top: 1.8rem;
		padding: 0.6rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--color-surface-2) 60%, transparent);
		font-size: 0.8rem;
		font-weight: 650;
		color: var(--color-fg);
		transition: border-color 180ms ease, color 180ms ease, transform 180ms ease;
	}

	.rss-button:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
		color: var(--color-accent);
	}

	.project-release-grid {
		display: grid;
		gap: 1rem;
		margin-top: clamp(3rem, 6vw, 4.5rem);
	}

	.project-release-card {
		position: relative;
		display: block;
		width: 100%;
		overflow: hidden;
		padding: clamp(1.15rem, 2vw, 1.4rem);
		border: 1px solid color-mix(in srgb, var(--project-accent) 22%, var(--color-border));
		border-radius: var(--radius-md);
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--color-surface) 96%, transparent),
			color-mix(in srgb, var(--project-accent) 5%, var(--color-surface))
		);
		box-shadow: var(--shadow-card);
		text-align: left;
		color: var(--color-fg);
		cursor: pointer;
		transition: transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease;
	}

	.project-release-card::before {
		content: '';
		position: absolute;
		inset: 0 auto auto 0;
		width: 48%;
		height: 1px;
		background: linear-gradient(90deg, var(--project-accent), transparent);
	}

	.project-release-card--noctalia {
		--project-accent: var(--color-accent-2);
	}

	.project-release-card--umbriel {
		--project-accent: var(--color-accent-3);
	}

	.project-release-card:hover,
	.project-release-card:focus-visible {
		transform: translateY(-3px);
		border-color: color-mix(in srgb, var(--project-accent) 45%, var(--color-border));
		box-shadow: var(--shadow-card-hover);
	}

	.project-release-card__topline,
	.project-release-card__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		font-family: var(--font-mono);
		font-size: 0.67rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--color-fg-dim);
	}

	.project-release-card__project {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		color: var(--project-accent);
	}

	.project-dot {
		display: inline-block;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: var(--color-accent-2);
		box-shadow: 0 0 0.75rem color-mix(in srgb, var(--color-accent-2) 60%, transparent);
	}

	.project-release-card--umbriel .project-dot,
	.project-tab--umbriel .project-dot {
		background: var(--color-accent-3);
		box-shadow: 0 0 0.75rem color-mix(in srgb, var(--color-accent-3) 60%, transparent);
	}

	.project-release-card strong {
		display: block;
		margin-top: 1.1rem;
		font-family: var(--font-mono);
		font-size: clamp(1.55rem, 3vw, 2.1rem);
		font-weight: 650;
		letter-spacing: -0.055em;
	}

	.project-release-card__footer {
		margin-top: 1.15rem;
	}

	.project-release-card__action {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--project-accent);
	}

	.release-section {
		max-width: 70rem;
		scroll-margin-top: 5rem;
	}

	.release-section__header {
		padding-bottom: 1.15rem;
	}

	.release-section__header .section-eyebrow {
		margin-bottom: 0.45rem;
	}

	.release-section__header h2 {
		margin: 0;
		font-size: clamp(1.8rem, 4vw, 2.65rem);
		font-weight: 620;
		letter-spacing: -0.045em;
	}

	.project-tabs {
		position: relative;
		display: inline-grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.45rem;
		padding: 0.35rem;
		border: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--color-surface-2) 45%, transparent);
	}

	.project-tabs__indicator {
		position: absolute;
		inset: 0.35rem auto 0.35rem 0.35rem;
		width: calc((100% - 1.15rem) / 2);
		border: 1px solid color-mix(in srgb, var(--color-accent) 18%, var(--color-border));
		border-radius: calc(var(--radius-md) - 2px);
		background: var(--color-surface);
		box-shadow: 0 4px 14px -8px rgb(0 0 0 / 0.45);
		pointer-events: none;
		transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.project-tabs__indicator--umbriel {
		transform: translateX(calc(100% + 0.45rem));
	}

	.project-tab {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 9rem;
		min-height: 2.8rem;
		padding: 0.55rem 0.85rem;
		border: 1px solid transparent;
		border-radius: calc(var(--radius-md) - 2px);
		font-size: 0.8rem;
		font-weight: 650;
		color: var(--color-fg-dim);
		cursor: pointer;
		transition: border-color 180ms ease, background 180ms ease, color 180ms ease;
	}

	.project-tab small {
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-border) 45%, transparent);
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 600;
	}

	.project-tab:hover {
		color: var(--color-fg);
	}

	.project-tab--active {
		border-color: transparent;
		background: transparent;
		color: var(--color-fg);
	}

	.project-panel {
		margin-top: 1.25rem;
	}

	.project-panel--releases {
		padding: clamp(0.65rem, 1.5vw, 1rem);
		border: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
		border-radius: var(--radius-md);
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--color-surface) 68%, transparent),
			color-mix(in srgb, var(--color-accent-2) 2.5%, transparent)
		);
	}

	.project-panel--releases .release-list {
		border-bottom: 0;
	}

	.release-list {
		display: grid;
		gap: 0.65rem;
		margin: 0;
		padding: 0;
		border-bottom: 0;
		list-style: none;
	}

	.release-list__item {
		position: relative;
		z-index: 0;
		border: 1px solid color-mix(in srgb, var(--color-border) 48%, transparent);
		border-radius: calc(var(--radius-md) - 1px);
		background: color-mix(in srgb, var(--color-void-deep) 24%, transparent);
		scroll-margin-top: 5.5rem;
		transition: border-color 180ms ease, background 180ms ease;
	}

	.release-list__link {
		display: grid;
		grid-template-columns: 3.2rem minmax(0, 1fr);
		gap: clamp(1rem, 3vw, 2rem);
		padding: clamp(1.25rem, 2.5vw, 1.65rem) clamp(0.9rem, 2vw, 1.25rem);
		border-radius: inherit;
		color: inherit;
	}

	.release-list__item:hover,
	.release-list__item:focus-within {
		border-color: color-mix(in srgb, var(--color-accent) 22%, var(--color-border));
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--color-accent) 5%, var(--color-void-deep)),
			color-mix(in srgb, var(--color-void-deep) 24%, transparent) 75%
		);
	}

	.release-list__number {
		padding-top: 0.1rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-fg-dim);
	}

	.release-list__item--latest .release-list__number {
		color: var(--color-accent-2);
	}

	.release-list__meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.55rem;
		font-family: var(--font-mono);
		font-size: 0.67rem;
		letter-spacing: 0.03em;
		color: var(--color-fg-dim);
	}

	.release-badge {
		padding: 0.18rem 0.45rem;
		border: 1px solid color-mix(in srgb, var(--color-accent-3) 30%, transparent);
		border-radius: 999px;
		color: var(--color-accent-3);
	}

	.release-badge--latest {
		border-color: color-mix(in srgb, var(--color-accent-2) 30%, transparent);
		color: var(--color-accent-2);
	}

	.release-list h3 {
		margin: 0.75rem 0 0;
		font-family: var(--font-mono);
		font-size: clamp(1.45rem, 3vw, 2rem);
		font-weight: 600;
		letter-spacing: -0.045em;
		color: var(--color-fg);
		transition: color 180ms ease;
	}

	.release-list__item:hover h3,
	.release-list__item:focus-within h3 {
		color: var(--color-accent);
	}

	.project-placeholder {
		display: flex;
		min-height: 26rem;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 4rem 1.5rem;
		border: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
		border-radius: var(--radius-md);
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--color-surface) 70%, transparent),
			color-mix(in srgb, var(--color-accent-3) 4%, transparent)
		);
		text-align: center;
	}

	.project-placeholder__glyph {
		display: block;
		width: 3.5rem;
		height: 3.5rem;
		margin-bottom: 1.5rem;
		filter: drop-shadow(0 0 1rem color-mix(in srgb, var(--color-accent-3) 28%, transparent));
	}

	.project-placeholder__glyph img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.project-placeholder h3 {
		margin: 0;
		font-size: clamp(1.6rem, 4vw, 2.35rem);
		font-weight: 620;
		letter-spacing: -0.04em;
	}

	.project-placeholder > p:not(.section-eyebrow) {
		max-width: 35rem;
		margin: 1rem 0 0;
		font-size: 0.9rem;
		line-height: 1.7;
		color: var(--color-fg-dim);
	}

	.project-placeholder a {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		margin-top: 1.5rem;
		font-size: 0.78rem;
		font-weight: 650;
		color: var(--color-accent-3);
	}

	.release-empty {
		padding: 4rem 0;
		border-top: 1px solid var(--color-border);
		color: var(--color-fg-dim);
	}

	@media (min-width: 760px) and (max-width: 999px) {
		.project-release-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1000px) {
		.changelog-hero {
			display: grid;
			grid-template-columns: minmax(0, 38rem) minmax(22rem, 28rem);
			align-items: center;
			justify-content: center;
			gap: 2rem;
		}

		.project-release-grid {
			width: 100%;
			max-width: 28rem;
			justify-self: end;
			margin-top: 0;
		}
	}

	@media (max-width: 640px) {
		.changelog-page {
			padding-bottom: 5rem;
		}

		.changelog-hero {
			padding-top: 3.5rem;
		}

		.changelog-hero h1 {
			font-size: clamp(3rem, 15vw, 4.3rem);
		}

		.project-release-card__footer {
			align-items: start;
			flex-direction: column;
		}

		.project-tabs {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.project-tab {
			justify-content: center;
		}

		.release-list__link {
			grid-template-columns: minmax(0, 1fr);
		}

		.release-list__number {
			display: none;
		}

	}

	@media (prefers-reduced-motion: reduce) {
		.project-tabs__indicator {
			transition: none;
		}

		.rss-button,
		.project-release-card,
		.project-tab,
		.release-list__item {
			transition: none;
		}
	}
</style>
