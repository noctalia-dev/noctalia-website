<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
	import type { Contributor } from '$lib/contributors.server';

	let { data } = $props<{
		data: { contributors: Contributor[]; repoUrl: string };
	}>();

	function formatContributions(count: number): string {
		return count.toLocaleString('en-US');
	}
</script>

<SiteHeader />

<main class="site-main">
	<div class="site-shell">
		<header class="mb-12 text-center">
			<h1 class="font-sans text-4xl font-semibold tracking-tight text-fg md:text-5xl">Contributors</h1>
			<p class="mt-3 text-fg-dim md:text-lg">
				The people who help build
				<a
					href={data.repoUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium text-accent transition hover:brightness-110"
				>
					Noctalia
				</a>.
			</p>
			{#if data.contributors.length > 0}
				<p class="mt-2 text-sm text-fg-dim">
					{data.contributors.length}
					{data.contributors.length === 1 ? 'contributor' : 'contributors'} on GitHub
				</p>
			{/if}
		</header>

		{#if data.contributors.length === 0}
			<div class="card-surface px-6 py-10 text-center text-fg-dim">
				<p>Contributors could not be loaded right now.</p>
				<p class="mt-2">
					<a
						href={data.repoUrl}
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
				{#each data.contributors as contributor (contributor.login)}
					<a
						href={contributor.profileUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="card-surface card-surface-hover group flex flex-col items-center gap-3 p-5 text-center"
					>
						<img
							src={contributor.avatarUrl}
							alt=""
							width="80"
							height="80"
							loading="lazy"
							class="h-20 w-20 rounded-full border-2 border-border/60 transition group-hover:border-accent/50"
						/>
						<div class="min-w-0">
							<p class="truncate font-semibold tracking-tight text-fg group-hover:text-accent">
								{contributor.login}
							</p>
							<p class="mt-0.5 text-xs text-fg-dim">
								{formatContributions(contributor.contributions)}
								{contributor.contributions === 1 ? 'commit' : 'commits'}
							</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</main>

<SiteFooter />
<ScrollToTop />
