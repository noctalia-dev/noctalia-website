<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ScrollToTop from '$lib/components/ScrollToTop.svelte';
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

<Navbar activePage="blog" />

<section class="post-page">
	<div class="container">
		<a href="/blog" class="back-link">Back to blog</a>

		<header class="post-header">
			<h1>{data.post.title}</h1>
			<p>{data.post.description}</p>
			<div class="post-meta">
				<span>{formatDate(data.post.publishedAt)}</span>
				<span>by {data.post.author}</span>
			</div>
		</header>

		<article class="post-body">
			{@html renderMarkdown(data.post.content)}
		</article>

		<div class="post-tags">
			{#each data.post.tags as tag}
				<span class="tag">{tag}</span>
			{/each}
		</div>
	</div>
</section>

<Footer />
<ScrollToTop />

<style>
	.post-page {
		min-height: 100vh;
		padding: 2.5rem 0 4rem;
		background: linear-gradient(180deg, var(--mSurface) 0%, var(--mSurfaceVariant) 100%);
	}

	.container {
		max-width: 980px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-bottom: 1.25rem;
		text-decoration: none;
		color: var(--mPrimary);
		padding: 0.3rem 0.55rem;
		border-radius: 0.5rem;
		transition: background 0.2s ease;
	}

	.back-link:hover {
		background: color-mix(in srgb, var(--mPrimary) 15%, transparent);
	}

	.post-header {
		margin-bottom: 1.5rem;
	}

	.post-header h1 {
		font-size: clamp(2rem, 4vw, 3rem);
		line-height: 1.2;
		letter-spacing: -0.03em;
		margin-bottom: 0.65rem;
		color: var(--mOnSurface);
	}

	.post-header p {
		color: var(--mOnSurfaceVariant);
		font-size: 1.1rem;
		line-height: 1.6;
	}

	.post-meta {
		display: flex;
		gap: 1rem;
		color: var(--mOnSurfaceVariant);
		font-size: 0.9rem;
		margin-top: 1rem;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin-top: 1rem;
	}

	.tag {
		font-size: 0.78rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		border: 1px solid var(--mOutline);
		background: color-mix(in srgb, var(--mPrimary) 12%, transparent);
		color: var(--mPrimary);
	}

	.post-body {
		background: linear-gradient(170deg, var(--mSurface) 0%, var(--mSurfaceVariant) 100%);
		border: 1px solid var(--mOutline);
		border-radius: 1rem;
		padding: 2rem;
		line-height: 1.8;
		color: var(--mOnSurface);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
	}

	.post-body :global(h1),
	.post-body :global(h2),
	.post-body :global(h3) {
		margin: 1.7rem 0 0.65rem;
		line-height: 1.3;
		letter-spacing: -0.02em;
		color: var(--mOnSurface);
	}

	.post-body :global(h1) {
		font-size: 2rem;
	}

	.post-body :global(h2) {
		font-size: 1.55rem;
	}

	.post-body :global(h3) {
		font-size: 1.25rem;
	}

	.post-body :global(p),
	.post-body :global(ul),
	.post-body :global(ol) {
		margin-bottom: 1rem;
	}

	.post-body :global(ul),
	.post-body :global(ol) {
		padding-left: 1.3rem;
	}

	.post-body :global(li) {
		margin-bottom: 0.45rem;
	}

	.post-body :global(strong) {
		color: var(--mOnSurface);
	}

	.post-body :global(hr) {
		border: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--mOutline), transparent);
		margin: 2rem 0;
	}

	.post-body :global(a) {
		color: var(--mPrimary);
		text-underline-offset: 2px;
	}

	.post-body :global(img) {
		display: block;
		width: 100%;
		max-width: 100%;
		height: auto;
		margin: 1.25rem 0;
		border-radius: 0.75rem;
	}

	.post-body :global(blockquote) {
		margin: 1.2rem 0;
		padding: 0.7rem 1rem;
		border-left: 3px solid var(--mPrimary);
		background: color-mix(in srgb, var(--mPrimary) 8%, transparent);
		border-radius: 0 0.5rem 0.5rem 0;
	}

	@media (max-width: 768px) {
		.container {
			padding: 0 1rem;
		}

		.post-body {
			padding: 1.25rem;
		}
	}
</style>
