<script lang="ts">
	import { onMount } from 'svelte';
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
	import { marked } from 'marked';
	import type { GithubRelease } from '$lib/releases.server';

	let { data } = $props<{ data: { releases: GithubRelease[] } }>();

	let detailsEls: Record<string, HTMLDetailsElement> = {};

	function formatDate(dateString: string): string {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function renderMarkdown(content: string): string {
		return marked.parse(content, { async: false }) as string;
	}

	/**
	 * Browsers auto-open an ancestor <details> when a fragment link targets a descendant
	 * (the `id` lives on <summary>, which qualifies), but this is a belt-and-suspenders
	 * backstop for older engines and for re-clicking a permalink whose hash didn't change.
	 */
	function openFromHash(smooth: boolean) {
		const tag = decodeURIComponent(window.location.hash.slice(1));
		const target = tag && detailsEls[tag];
		if (!target) return;
		target.open = true;
		target.querySelector('summary')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
	}

	onMount(() => {
		openFromHash(false);
		const onHashChange = () => openFromHash(true);
		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
	});
</script>

<SiteHeader />

<main class="site-main">
	<div class="site-shell">
		<header class="mb-12 text-center">
			<h1 class="font-sans text-4xl font-semibold tracking-tight text-fg md:text-5xl">Changelog</h1>
			<p class="mt-3 text-fg-dim md:text-lg">Release notes for Noctalia v5 and later.</p>
		</header>

		<div class="mx-auto flex max-w-4xl flex-col gap-4">
			{#each data.releases as release, i (release.tagName)}
				<details
					bind:this={detailsEls[release.tagName]}
					class="card-surface group overflow-hidden"
					open={i === 0}
				>
					<summary
						id={release.tagName}
						class="flex scroll-mt-24 cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-6 py-5 outline-none target:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent/45 md:px-8"
					>
						<i
							class="ti ti-chevron-right text-fg-dim transition-transform group-open:rotate-90"
							aria-hidden="true"
						></i>
						<h2 class="text-lg font-semibold tracking-tight text-fg md:text-xl">
							{release.tagName}
						</h2>
						<a
							href="#{release.tagName}"
							class="text-fg-dim/0 transition group-hover:text-fg-dim hover:!text-accent"
							aria-label="Link to {release.tagName}"
						>
							<i class="ti ti-link text-sm" aria-hidden="true"></i>
						</a>
						{#if release.prerelease}
							<span
								class="rounded-full border border-accent-2/30 bg-accent-2/10 px-2 py-0.5 text-[11px] font-medium text-accent-2"
							>
								Pre-release
							</span>
						{/if}
						<span class="ml-auto text-sm text-fg-dim">{formatDate(release.publishedAt)}</span>
					</summary>

					<div class="border-t border-border/35 px-6 py-6 md:px-8">
						<article
							class="prose prose-invert prose-headings:font-sans prose-headings:tracking-tight prose-a:text-accent prose-a:underline-offset-4 prose-strong:text-fg prose-code:rounded prose-code:bg-void-deep/90 prose-code:px-1 prose-code:py-0.5 prose-code:text-accent-2 prose-pre:border prose-pre:border-border/50 max-w-none text-fg-dim prose-headings:text-fg"
						>
							{@html renderMarkdown(release.body)}
						</article>
						<a
							href={release.htmlUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
						>
							View on GitHub →
						</a>
					</div>
				</details>
			{:else}
				<p class="text-center text-fg-dim">No releases found.</p>
			{/each}
		</div>
	</div>
</main>

<SiteFooter />
<ScrollToTop />
