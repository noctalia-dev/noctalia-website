<script lang="ts">
	import SiteHeader from '#lib/site-header.svelte';
	import ProjectIntro from '#lib/project-intro.svelte';
	import SectionHeading from '#lib/section-heading.svelte';
	import SiteFooter from '#lib/site-footer.svelte';
	import ScrollToTop from '#lib/scroll-to-top.svelte';
	import { GITHUB_ORG_URL } from '#lib/site-constants.js';
	import type { Contributor, CONTRIBUTOR_REPOS } from '#lib/contributors.server.js';
	import type { Translator } from '#lib/translators.server.js';

	let { data }: {
		data: {
			contributors: Contributor[];
			translators: Translator[];
			repos: typeof CONTRIBUTOR_REPOS;
			translateUrl: string;
		};
	} = $props();

	const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });

	function formatCount(count: number): string {
		return count.toLocaleString('en-US');
	}

	function plural(count: number, one: string, many: string): string {
		return `${formatCount(count)} ${count === 1 ? one : many}`;
	}

	function repoLabel(id: string): string {
		return data.repos.find((repo) => repo.id === id)?.label ?? id;
	}

	function languageName(code: string): string {
		try {
			return languageNames.of(code) ?? code;
		} catch {
			return code;
		}
	}

	const footnoteText = $derived(
		[
			data.contributors.length > 0 ? plural(data.contributors.length, 'contributor', 'contributors') : '',
			data.translators.length > 0 ? plural(data.translators.length, 'translator', 'translators') : ''
		]
			.filter(Boolean)
			.join(' · ')
	);

	// Single-commit contributors get a compact name list instead of a full card.
	const featuredContributors = $derived(data.contributors.filter((c) => c.contributions > 1));
	const singleCommitContributors = $derived(data.contributors.filter((c) => c.contributions <= 1));

	function languageNamesOf(locales: string[]): string[] {
		return locales.map(languageName);
	}

	function languageSummary(locales: string[]): string {
		return locales.length > 2 ? `${locales.length} languages` : languageNamesOf(locales).join(', ');
	}
</script>

{#snippet tooltip(rows: { label: string; value?: string }[])}
	<div class="card-tooltip" aria-hidden="true">
		{#each rows as row (row.label)}
			<div class="card-tooltip-row">
				<span>{row.label}</span>
				{#if row.value}<span class="card-tooltip-value">{row.value}</span>{/if}
			</div>
		{/each}
	</div>
{/snippet}

<SiteHeader />

<main class="pb-24">
	<ProjectIntro
		title="Contributors"
		eyebrow="Community"
		logoUrl="https://assets.noctalia.dev/noctalia-logo.svg"
		summary="The people who help build Noctalia."
		detail="Code contributors across Noctalia, Umbriel, Luciole, and the official plugins, plus the translators who bring it to other languages."
	>
		{#snippet actions()}
			<a href={GITHUB_ORG_URL} target="_blank" rel="noopener noreferrer" class="action-secondary"
				><i class="ti ti-brand-github" aria-hidden="true"></i> Noctalia on GitHub</a
			>
			<a href="/ethos" class="action-secondary">How we work <span aria-hidden="true">→</span></a>
		{/snippet}
		{#snippet footnote()}
			{#if footnoteText}
				<p>{footnoteText}</p>
			{/if}
		{/snippet}
	</ProjectIntro>

	<section class="site-shell pt-12 md:pt-16" aria-labelledby="code-title">
		<SectionHeading number={1} id="code-title" label="Code" title="Contributors" />
		{#if data.contributors.length === 0}
			<div class="card-surface px-6 py-10 text-center text-fg-dim">
				<p>Contributors could not be loaded right now.</p>
				<p class="mt-2">
					<a
						href={GITHUB_ORG_URL}
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium text-accent transition hover:brightness-110"
					>
						View contributors on GitHub
					</a>
				</p>
			</div>
		{:else}
			<div
				class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,11rem),1fr))] sm:gap-5"
			>
				{#each featuredContributors as contributor (contributor.login)}
					<a
						href={contributor.profileUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="card-surface card-surface-hover group flex flex-col items-center gap-3 p-5 text-center hover:z-10 focus-visible:z-10"
					>
						{@render tooltip(
							contributor.repos.map((repo) => ({
								label: repoLabel(repo.id),
								value: formatCount(repo.contributions)
							}))
						)}
						<img
							src={contributor.avatarUrl}
							alt=""
							width="80"
							height="80"
							loading="lazy"
							class="h-20 w-20 rounded-full border-2 border-border/60 transition group-hover:border-accent/50"
						/>
						<div class="w-full min-w-0">
							<p
								class="font-semibold tracking-tight [overflow-wrap:anywhere] text-fg group-hover:text-accent"
							>
								{contributor.login}
							</p>
							<p class="mt-0.5 text-xs text-fg-dim">
								{plural(contributor.contributions, 'commit', 'commits')}
							</p>
						</div>
					</a>
				{/each}
			</div>
			{#if singleCommitContributors.length > 0}
				<div class="mt-10">
					<p class="text-sm text-fg-dim">
						Plus {plural(singleCommitContributors.length, 'contributor', 'contributors')} with a single commit:
					</p>
					<ul class="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
						{#each singleCommitContributors as contributor (contributor.login)}
							<li>
								<a
									href={contributor.profileUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="text-fg transition hover:text-accent">{contributor.login}</a
								>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		{/if}
	</section>

	<section class="site-shell pt-16 md:pt-24" aria-labelledby="translators-title">
		<SectionHeading
			number={2}
			id="translators-title"
			label="Special mentions"
			title="Translators"
			lead="Thanks to everyone translating Noctalia on i18n.noctalia.dev."
		/>
		{#if data.translators.length === 0}
			<div class="card-surface px-6 py-10 text-center text-fg-dim">
				<p>Translators could not be loaded right now.</p>
				<p class="mt-2">
					<a
						href={data.translateUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium text-accent transition hover:brightness-110"
					>
						Help translate Noctalia
					</a>
				</p>
			</div>
		{:else}
			<div
				class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,11rem),1fr))] sm:gap-5"
			>
				{#each data.translators as translator (translator.login)}
					<a
						href={translator.profileUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="card-surface card-surface-hover group flex flex-col items-center gap-3 p-5 text-center hover:z-10 focus-visible:z-10"
					>
						{#if translator.locales.length > 2}
							{@render tooltip(languageNamesOf(translator.locales).map((label) => ({ label })))}
						{/if}
						<img
							src={translator.avatarUrl}
							alt=""
							width="80"
							height="80"
							loading="lazy"
							class="h-20 w-20 rounded-full border-2 border-border/60 transition group-hover:border-accent/50"
						/>
						<div class="w-full min-w-0">
							<p
								class="font-semibold tracking-tight [overflow-wrap:anywhere] text-fg group-hover:text-accent"
							>
								{translator.name ?? translator.login}
							</p>
							<p class="mt-0.5 text-xs text-fg-dim">
								{plural(translator.strings, 'string', 'strings')}
							</p>
							{#if translator.locales.length > 0}
								<p class="mt-1 text-xs text-fg-dim">
									{languageSummary(translator.locales)}
								</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</main>

<SiteFooter />
<ScrollToTop />

<style>
	.card-tooltip {
		position: absolute;
		bottom: calc(100% + 0.5rem);
		left: 50%;
		z-index: 20;
		min-width: 10rem;
		max-width: 16rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-void);
		box-shadow: var(--shadow-card-hover);
		color: var(--color-fg);
		font-size: 0.75rem;
		line-height: 1.5;
		text-align: left;
		pointer-events: none;
		opacity: 0;
		transform: translate(-50%, 0.25rem);
		transition:
			opacity 150ms ease,
			transform 150ms ease;
	}
	.card-tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		width: 0.5rem;
		height: 0.5rem;
		background: var(--color-void);
		border-right: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
		transform: translate(-50%, -50%) rotate(45deg);
	}
	:global(.group:hover) > .card-tooltip,
	:global(.group:focus-visible) > .card-tooltip {
		opacity: 1;
		transform: translate(-50%, 0);
	}
	.card-tooltip-row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}
	.card-tooltip-value {
		color: var(--color-fg-dim);
		font-variant-numeric: tabular-nums;
	}
	@media (hover: none) {
		.card-tooltip {
			display: none;
		}
	}
</style>
