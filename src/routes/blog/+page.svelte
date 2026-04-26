<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
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

<main class="site-main">
	<div class="site-shell">
		<header class="mb-12 text-center">
			<h1 class="font-sans text-4xl font-semibold tracking-tight text-fg md:text-5xl">Blog</h1>
			<p class="mt-3 text-fg-dim md:text-lg">News from the Noctalia team.</p>
		</header>

		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.posts as post}
				<a
					href="/blog/{post.slug}"
					class="card-surface group flex flex-col gap-3 p-6 transition hover:border-accent/40 hover:shadow-[0_12px_40px_-12px_rgb(255_245_155/0.12)]"
				>
					<div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-fg-dim">
						<span>{formatDate(post.publishedAt)}</span>
						<span>·</span>
						<span>by {post.author}</span>
					</div>
					<h2 class="text-lg font-semibold tracking-tight text-fg group-hover:text-accent md:text-xl">
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
