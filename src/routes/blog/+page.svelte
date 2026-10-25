<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import ProjectIntro from '$lib/project-intro.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
	import type { BlogPost } from '$lib/blog';

	let { data } = $props<{ data: { posts: BlogPost[] } }>();

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<SiteHeader />

<main class="pb-24">
	<ProjectIntro
		title="Blog"
		eyebrow="News & updates"
		logoUrl="https://assets.noctalia.dev/noctalia-logo.svg"
		summary="News from the Noctalia team."
		detail="Project announcements and updates from the people building Noctalia."
	/>

	<div class="site-shell pt-12 md:pt-16">
		<div class="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,20rem),1fr))]">
			{#each data.posts as post}
				<a
					href="/blog/{post.slug}"
					class="card-surface card-surface-hover group flex flex-col gap-3 p-6"
				>
					<div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-fg-dim">
						<span>{formatDate(post.publishedAt)}</span>
						<span>·</span>
						<span>by {post.author}</span>
					</div>
					<h2
						class="text-lg font-semibold tracking-tight text-fg group-hover:text-accent md:text-xl"
					>
						{post.title}
					</h2>
					<p class="line-clamp-3 text-sm leading-relaxed text-fg-dim">{post.description}</p>
					{#if post.tags.length}
						<div class="mt-auto flex flex-wrap gap-2 pt-1">
							{#each post.tags as tag}
								<span
									class="rounded-full border border-border/60 bg-void-deep/40 px-2 py-0.5 text-[11px] font-medium text-fg-dim"
								>
									{tag}
								</span>
							{/each}
						</div>
					{/if}
					<span class="text-sm font-semibold text-accent">Read article →</span>
				</a>
			{/each}
		</div>
	</div>
</main>

<SiteFooter />
<ScrollToTop />
