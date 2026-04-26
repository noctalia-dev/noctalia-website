<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
	import { marked } from 'marked';
	import type { BlogPost } from '$lib/blog';

	let { data } = $props<{ data: { post: BlogPost } }>();

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function renderMarkdown(content: string): string {
		return marked.parse(content, { async: false }) as string;
	}
</script>

<SiteHeader />

<main class="site-main--article">
	<div class="blog-post-shell">
		<a
			href="/blog"
			class="mb-6 inline-flex items-center gap-2 rounded-md border border-border/55 bg-surface-2/50 px-3 py-2 text-sm font-medium text-fg-dim outline-none transition hover:border-accent/35 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep"
		>
			← Back to blog
		</a>

		<div class="card-surface overflow-hidden">
			<header class="border-b border-border/35 px-6 py-8 md:px-10 md:py-10">
				<h1 class="font-sans text-3xl font-semibold tracking-tight text-fg md:text-4xl">
					{data.post.title}
				</h1>
				<p class="mt-3 text-lg text-fg-dim">{data.post.description}</p>
				<div class="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-dim">
					<span>{formatDate(data.post.publishedAt)}</span>
					<span>·</span>
					<span>by {data.post.author}</span>
				</div>
				{#if data.post.tags.length}
					<div class="mt-4 flex flex-wrap gap-2">
						{#each data.post.tags as tag}
							<span
								class="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
							>
								{tag}
							</span>
						{/each}
					</div>
				{/if}
			</header>

			<article
				class="prose prose-invert prose-headings:font-sans prose-headings:tracking-tight prose-a:text-accent prose-a:underline-offset-4 prose-strong:text-fg prose-code:rounded prose-code:bg-void-deep/90 prose-code:px-1 prose-code:py-0.5 prose-code:text-accent-2 prose-pre:border prose-pre:border-border/50 max-w-none px-6 py-8 text-fg-dim prose-headings:text-fg md:px-10 md:py-10"
			>
				{@html renderMarkdown(data.post.content)}
			</article>
		</div>
	</div>
</main>

<SiteFooter />
<ScrollToTop />
