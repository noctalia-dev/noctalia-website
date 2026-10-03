<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
	import { marked } from 'marked';
	import type { GithubRelease } from '$lib/releases.server';

	let { data } = $props<{
		data: {
			release: GithubRelease;
			newerRelease: GithubRelease | null;
			olderRelease: GithubRelease | null;
		};
	}>();

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		});
	}

	function renderMarkdown(content: string): string {
		return marked.parse(content, { async: false }) as string;
	}

	function releaseHref(tagName: string): string {
		return `/changelogs/${encodeURIComponent(tagName)}`;
	}
</script>

<SiteHeader />

<main class="release-page">
	<div class="release-shell">
		<a class="release-back" href="/changelogs">
			<i class="ti ti-arrow-left" aria-hidden="true"></i>
			Back to changelog
		</a>

		<header class="release-hero">
			<div class="release-hero__meta">
				<span class="release-hero__signal" aria-hidden="true"></span>
				<span>Noctalia</span>
				<span aria-hidden="true">·</span>
				<time datetime={data.release.publishedAt}>{formatDate(data.release.publishedAt)}</time>
				{#if data.release.prerelease}<span class="release-status">Pre-release</span>{/if}
			</div>

			<div class="release-hero__title-row">
				<h1>{data.release.tagName}</h1>
				<a
					class="release-github-link"
					href={data.release.htmlUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					<i class="ti ti-brand-github" aria-hidden="true"></i>
					GitHub release
					<i class="ti ti-arrow-up-right" aria-hidden="true"></i>
				</a>
			</div>
		</header>

		<div class="release-content-grid">
			<aside aria-label="Release overview">
				<div class="release-facts">
					<p>Release overview</p>
					<dl>
						<div><dt>Version</dt><dd>{data.release.tagName}</dd></div>
						<div><dt>Published</dt><dd>{formatDate(data.release.publishedAt)}</dd></div>
					</dl>
				</div>
			</aside>

			<article class="release-body prose prose-invert max-w-none prose-headings:font-sans prose-headings:tracking-tight prose-headings:text-fg prose-h2:text-2xl prose-h3:text-xl prose-p:text-fg-dim prose-li:text-fg-dim prose-a:text-accent prose-a:underline-offset-4 prose-strong:text-fg prose-code:rounded prose-code:bg-void-deep/90 prose-code:px-1 prose-code:py-0.5 prose-code:text-accent-2 prose-pre:border prose-pre:border-border/50">
				{@html renderMarkdown(data.release.body)}
			</article>
		</div>

		<nav class="release-pagination" aria-label="Other releases">
			{#if data.olderRelease}
				<a href={releaseHref(data.olderRelease.tagName)}>
					<span><i class="ti ti-arrow-left" aria-hidden="true"></i> Older</span>
					<strong>{data.olderRelease.tagName}</strong>
				</a>
			{:else}<span></span>{/if}
			{#if data.newerRelease}
				<a class="release-pagination__newer" href={releaseHref(data.newerRelease.tagName)}>
					<span>Newer <i class="ti ti-arrow-right" aria-hidden="true"></i></span>
					<strong>{data.newerRelease.tagName}</strong>
				</a>
			{/if}
		</nav>
	</div>
</main>

<SiteFooter />
<ScrollToTop />

<style>
	.release-page { padding: clamp(2.5rem, 6vw, 5rem) 0 7rem; }
	.release-shell { width: min(100% - 2rem, 70rem); margin-inline: auto; }
	.release-back {
		display: inline-flex; align-items: center; gap: .5rem; padding: .45rem 0;
		font-size: .8rem; font-weight: 620; color: var(--color-fg-dim); transition: color 180ms ease;
	}
	.release-back:hover { color: var(--color-accent); }
	.release-hero {
		position: relative;
		margin-top: 2rem;
		padding: clamp(2rem, 4vw, 3.25rem) 0;
		border-top: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
	}
	.release-hero::before {
		content: '';
		position: absolute;
		inset: -1px auto auto 0;
		width: 8rem;
		height: 1px;
		background: linear-gradient(90deg, var(--color-accent-2), var(--color-accent), transparent);
	}
	.release-hero__meta { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; font-family: var(--font-mono); font-size: .69rem; letter-spacing: .045em; text-transform: uppercase; color: var(--color-fg-dim); }
	.release-hero__signal { width: .45rem; height: .45rem; margin-right: .2rem; border-radius: 999px; background: var(--color-accent-2); box-shadow: 0 0 .8rem color-mix(in srgb, var(--color-accent-2) 65%, transparent); }
	.release-status { padding: .18rem .48rem; border: 1px solid color-mix(in srgb, var(--color-accent-3) 35%, transparent); border-radius: 999px; color: var(--color-accent-3); }
	.release-hero__title-row { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-top: 1.25rem; }
	.release-hero h1 { margin: 0; font-family: var(--font-mono); font-size: clamp(2.5rem, 6vw, 4.4rem); font-weight: 620; line-height: .95; letter-spacing: -.07em; color: var(--color-fg); }
	.release-github-link { display: inline-flex; align-items: center; gap: .5rem; min-height: 2.65rem; padding: .55rem .8rem; border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent); border-radius: var(--radius-md); background: color-mix(in srgb, var(--color-surface-2) 55%, transparent); font-size: .76rem; font-weight: 650; color: var(--color-fg); transition: color 180ms ease, border-color 180ms ease, transform 180ms ease; }
	.release-github-link:hover { transform: translateY(-1px); border-color: color-mix(in srgb, var(--color-accent) 38%, transparent); color: var(--color-accent); }
	.release-content-grid { display: grid; gap: clamp(2rem, 6vw, 5rem); padding: clamp(2.75rem, 5vw, 4.5rem) 0; }
	.release-facts { position: sticky; top: 6rem; }
	.release-facts > p { margin: 0 0 1.1rem; font-family: var(--font-mono); font-size: .68rem; font-weight: 650; letter-spacing: .12em; text-transform: uppercase; color: var(--color-accent-2); }
	.release-facts dl { margin: 0; }
	.release-facts dl > div { padding: .8rem 0; border-top: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent); }
	.release-facts dl > div:last-child { border-bottom: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent); }
	.release-facts dt { font-size: .7rem; color: var(--color-fg-dim); }
	.release-facts dd { margin: .25rem 0 0; font-family: var(--font-mono); font-size: .78rem; color: var(--color-fg); }
	.release-body {
		min-width: 0;
		padding: clamp(1.5rem, 3vw, 2.5rem);
		border: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
		border-radius: var(--radius-md);
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--color-surface) 68%, transparent),
			color-mix(in srgb, var(--color-accent-2) 2.5%, transparent)
		);
	}
	.release-body :global(h2:first-child), .release-body :global(h3:first-child) { margin-top: 0; }
	.release-body :global(h2) { margin-top: 2.8em; padding-top: .5em; border-top: 1px solid color-mix(in srgb, var(--color-border) 55%, transparent); }
	.release-body :global(h3) { margin-top: 2em; color: var(--color-accent); }
	.release-body :global(li::marker) { color: var(--color-accent-2); }
	.release-pagination { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding-top: 2rem; border-top: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent); }
	.release-pagination a { display: flex; flex-direction: column; gap: .4rem; padding: 1.2rem; border: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent); border-radius: var(--radius-md); background: color-mix(in srgb, var(--color-surface-2) 42%, transparent); transition: border-color 180ms ease, transform 180ms ease; }
	.release-pagination a:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--color-accent) 38%, transparent); }
	.release-pagination span { display: flex; align-items: center; gap: .4rem; font-size: .7rem; color: var(--color-fg-dim); }
	.release-pagination strong { font-family: var(--font-mono); font-size: .9rem; color: var(--color-fg); }
	.release-pagination__newer { align-items: end; text-align: right; }
	@media (min-width: 800px) { .release-content-grid { grid-template-columns: 11rem minmax(0, 1fr); } }
	@media (max-width: 540px) {
		.release-shell { width: min(100% - 2rem, 70rem); }
		.release-hero { padding: 1.75rem 0; }
		.release-hero__title-row { align-items: start; flex-direction: column; gap: 1.25rem; }
		.release-hero h1 { overflow-wrap: anywhere; }
		.release-body { padding: 1.25rem; }
		.release-pagination { grid-template-columns: 1fr; }
		.release-pagination > span:empty { display: none; }
	}
</style>
