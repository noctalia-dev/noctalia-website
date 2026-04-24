<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ScrollToTop from '$lib/components/ScrollToTop.svelte';
	import type { BlogPost } from '$lib/blog';

	let { data } = $props<{ data: { posts: BlogPost[] } }>();

	function formatDate(dateString: string): string {
		const [year, month, day] = dateString.slice(0, 10).split('-').map(Number);
		return new Date(year, month - 1, day).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
	</script>

<Navbar activePage="blog" />

<section class="blog-page">
	<div class="container">
		<div class="page-header">
			<h1 class="page-title">Blog</h1>
			<div class="page-kicker">News from the Noctalia team.</div>
		</div>

		<div class="posts-grid">
			{#each data.posts as post}
				<a href="/blog/{post.slug}" class="post-card">
					<div class="post-meta">
						<span>{formatDate(post.publishedAt)}</span>
						<span>by {post.author}</span>
					</div>
					<h2 class="post-title">{post.title}</h2>
					<p class="post-description">{post.description}</p>
					<div class="post-tags">
						{#each post.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
					<span class="read-more">Read article →</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<Footer />
<ScrollToTop />

<style>
	.blog-page {
		min-height: 100vh;
		padding: 4rem 0;
		background: linear-gradient(180deg, var(--mSurface) 0%, var(--mSurfaceVariant) 100%);
	}

	.container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3.25rem;
	}

	.page-title {
		font-size: 3.5rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		background: linear-gradient(135deg, var(--mPrimary), var(--mOnSurface));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 0.75rem;
	}

	.page-subtitle {
		font-size: 1.15rem;
		color: var(--mOnSurfaceVariant);
		margin-bottom: 1rem;
	}

	.page-kicker {
		display: inline-block;
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--mOutline);
		border-radius: 999px;
		font-size: 0.8rem;
		color: var(--mPrimary);
		background: color-mix(in srgb, var(--mPrimary) 10%, transparent);
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.25rem;
	}

	.post-card {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		padding: 1.5rem;
		border: 1px solid var(--mOutline);
		border-radius: 1rem;
		background: linear-gradient(160deg, var(--mSurface) 0%, var(--mSurfaceVariant) 100%);
		text-decoration: none;
		color: inherit;
		transition: all 0.25s ease;
		position: relative;
		overflow: hidden;
	}

	.post-card:hover {
		transform: translateY(-5px);
		border-color: var(--mPrimary);
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.18),
			0 0 0 1px color-mix(in srgb, var(--mPrimary) 35%, transparent);
	}

	.post-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(120deg, transparent 0%, color-mix(in srgb, var(--mPrimary) 12%, transparent) 100%);
		opacity: 0;
		transition: opacity 0.25s ease;
		pointer-events: none;
	}

	.post-card:hover::before {
		opacity: 1;
	}

	.post-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.85rem;
		color: var(--mOnSurfaceVariant);
	}

	.post-title {
		font-size: 1.35rem;
		font-weight: 650;
		color: var(--mOnSurface);
		letter-spacing: -0.01em;
		line-height: 1.3;
	}

	.post-description {
		color: var(--mOnSurfaceVariant);
		line-height: 1.6;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: auto;
	}

	.tag {
		font-size: 0.75rem;
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--mSurfaceVariant) 70%, transparent);
		border: 1px solid var(--mOutline);
		color: var(--mOnSurfaceVariant);
	}

	.read-more {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--mPrimary);
		margin-top: 0.35rem;
	}

	@media (max-width: 768px) {
		.container {
			padding: 0 1rem;
		}

		.page-title {
			font-size: 2.5rem;
		}
	}
</style>
