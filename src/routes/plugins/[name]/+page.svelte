<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
	import { marked } from 'marked';

	interface Plugin {
		id: string;
		name: string;
		version: string;
		author: string;
		description: string;
		minNoctalia: string;
		tags?: string[];
		official?: boolean;
		repo: string;
	}

	let { data } = $props<{ data: { plugin: Plugin; readme: string | null } }>();


	function getPreviewUrl(): string {
		return `https://raw.githubusercontent.com/noctalia-dev/${data.plugin.repo}/main/${data.plugin.id}/thumbnail.webp`;
	}

	function handleImageError(e: Event) {
		const target = e.target as HTMLImageElement;
		target.style.display = 'none';
		const placeholder = target.nextElementSibling as HTMLElement;
		if (placeholder) placeholder.style.display = 'flex';
	}

	function getPluginUrl(): string {
		return `https://github.com/noctalia-dev/${data.plugin.repo}/tree/main/${data.plugin.id}`;
	}

	function renderMarkdown(content: string): string {
		return marked.parse(content, { async: false }) as string;
	}
</script>

<SiteHeader />

	<main class="plugin-page site-main--article">
		<div class="plugin-inner">
			<a href="/plugins" class="back-btn">
				<i class="ti ti-arrow-left text-xl leading-none" aria-hidden="true"></i>
				Back to plugins
			</a>

		<div class="hero-section">
			<div class="hero-image">
				<img
					src={getPreviewUrl()}
					alt={data.plugin.name}
					onerror={(e) => handleImageError(e)}
				/>
				<div class="preview-placeholder" style="display: none;">
					<div class="placeholder-icon">📦</div>
				</div>
			</div>
		</div>

			<div class="badge-row">
				<span class="badge">
					<i class="ti ti-edit text-sm leading-none" aria-hidden="true"></i>
					v{data.plugin.version}
				</span>
				<span class="badge">
					<i class="ti ti-user text-sm leading-none" aria-hidden="true"></i>
					{data.plugin.author}
				</span>
				{#if data.plugin.minNoctalia}
					<span class="badge">
						<i class="ti ti-versions text-sm leading-none" aria-hidden="true"></i>
						Requires Noctalia {data.plugin.minNoctalia}+
					</span>
				{/if}
			</div>

		{#if data.plugin.tags && data.plugin.tags.length > 0}
			<div class="tag-row">
				{#each data.plugin.tags as tag}
					<a href="/plugins?tag={tag}" class="tag-badge">{tag}</a>
				{/each}
			</div>
		{/if}

		{#if data.readme}
			<div class="about-section">
				<h2 class="section-title">About</h2>
				<div class="readme-content">
					{@html renderMarkdown(data.readme)}
				</div>
			</div>
		{/if}

		<div class="actions">
			<a
				href={getPluginUrl()}
				target="_blank"
				rel="noopener noreferrer"
				class="github-btn"
				>
					<i class="ti ti-brand-github text-xl leading-none" aria-hidden="true"></i>
					View on GitHub
					<i class="ti ti-external-link text-base leading-none" aria-hidden="true"></i>
				</a>
			</div>
	</div>
</main>

<SiteFooter />
<ScrollToTop />

<style>
	.plugin-page {
		min-height: 70vh;
	}

	.plugin-inner {
		box-sizing: border-box;
		max-width: 56rem;
		margin-left: auto;
		margin-right: auto;
		width: 100%;
		padding-left: 1rem;
		padding-right: 1rem;
	}

	@media (min-width: 640px) {
		.plugin-inner {
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}
	}

	.back-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: transparent;
		border: 1px solid var(--mOutline);
		border-radius: 0.5rem;
		color: var(--mOnSurfaceVariant);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9375rem;
		font-weight: 500;
		width: fit-content;
		text-decoration: none;
		margin-bottom: 2rem;
	}

	.back-btn:hover {
		background: var(--mPrimary);
		color: var(--mOnPrimary);
		border-color: var(--mPrimary);
	}

	/* Hero Section */
	.hero-section {
		position: relative;
		border-radius: 1.5rem;
		overflow: hidden;
		margin-bottom: 1.5rem;
		aspect-ratio: 16 / 9;
		background: var(--mSurfaceVariant);
		border: 1px solid var(--mOutline);
	}

	.hero-image {
		position: absolute;
		inset: 0;
	}

	.hero-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.preview-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--mSurfaceVariant), var(--mSurface));
		color: var(--mOnSurfaceVariant);
	}

	.placeholder-icon {
		font-size: 4rem;
		opacity: 0.5;
	}

	/* Badge Row */
	.badge-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	/* Tag Row */
	.tag-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.tag-badge {
		padding: 0.375rem 0.875rem;
		border-radius: 2rem;
		background: transparent;
		border: 1px solid var(--mPrimary);
		color: var(--mPrimary);
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.tag-badge:hover {
		background: var(--mPrimary);
		color: var(--mOnPrimary);
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--mSurfaceVariant);
		border: 1px solid var(--mOutline);
		border-radius: 2rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--mOnSurface);
	}

	.badge .ti {
		color: var(--mPrimary);
		opacity: 0.8;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--mOnSurface);
		margin-bottom: 1rem;
	}

	/* About Section */
	.about-section {
		background: var(--mSurfaceVariant);
		border: 1px solid var(--mOutline);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.readme-content {
		color: var(--mOnSurface);
		line-height: 1.7;
	}

	.readme-content :global(h1),
	.readme-content :global(h2),
	.readme-content :global(h3),
	.readme-content :global(h4),
	.readme-content :global(h5),
	.readme-content :global(h6) {
		color: var(--mOnSurface);
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		font-weight: 600;
	}

	.readme-content :global(h1) {
		font-size: 1.75rem;
		border-bottom: 1px solid var(--mOutline);
		padding-bottom: 0.5rem;
	}

	.readme-content :global(h2) {
		font-size: 1.5rem;
		border-bottom: 1px solid var(--mOutline);
		padding-bottom: 0.5rem;
	}

	.readme-content :global(h3) {
		font-size: 1.25rem;
	}

	.readme-content :global(p) {
		margin-bottom: 1rem;
	}

	.readme-content :global(ul),
	.readme-content :global(ol) {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	.readme-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.readme-content :global(code) {
		background: var(--mSurface);
		padding: 0.2rem 0.4rem;
		border-radius: 0.25rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.875em;
		color: var(--mPrimary);
	}

	.readme-content :global(pre) {
		background: var(--mSurface);
		border: 1px solid var(--mOutline);
		border-radius: 0.75rem;
		padding: 1rem;
		overflow-x: auto;
		margin-bottom: 1rem;
	}

	.readme-content :global(pre code) {
		background: transparent;
		padding: 0;
		color: var(--mOnSurface);
	}

	.readme-content :global(a) {
		color: var(--mPrimary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.readme-content :global(a:hover) {
		opacity: 0.8;
	}

	.readme-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		margin: 1rem 0;
	}

	.readme-content :global(blockquote) {
		border-left: 4px solid var(--mPrimary);
		padding-left: 1rem;
		margin: 1rem 0;
		color: var(--mOnSurfaceVariant);
		font-style: italic;
	}

	.readme-content :global(hr) {
		border: none;
		border-top: 1px solid var(--mOutline);
		margin: 2rem 0;
	}

	.readme-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1rem;
	}

	.readme-content :global(th),
	.readme-content :global(td) {
		border: 1px solid var(--mOutline);
		padding: 0.75rem;
		text-align: left;
	}

	.readme-content :global(th) {
		background: var(--mSurface);
		font-weight: 600;
	}

	/* Actions */
	.actions {
		display: flex;
		justify-content: center;
	}

	.github-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		background: var(--mPrimary);
		color: var(--mOnPrimary);
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 1rem;
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.github-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(255, 245, 155, 0.3);
		filter: brightness(1.1);
	}

	:global([data-theme='light']) .github-btn:hover {
		box-shadow: 0 8px 24px rgba(93, 101, 245, 0.35);
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.hero-section {
			aspect-ratio: 4 / 3;
		}

		.badge-row {
			gap: 0.5rem;
		}

		.badge {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}
	}
</style>
