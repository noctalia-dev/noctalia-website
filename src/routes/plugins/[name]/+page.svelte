<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { marked } from 'marked';

	interface Plugin {
		id: string;
		name: string;
		version: string;
		author: string;
		description: string;
		repository: string;
		minNoctaliaVersion: string;
		license: string;
		lastUpdated: string;
		tags?: string[];
	}

	let { data } = $props<{ data: { plugin: Plugin; readme: string | null } }>();


	function getPreviewUrl(pluginId: string, format: 'png' | 'jpg' = 'png'): string {
		return `https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/${pluginId}/preview.${format}`;
	}

	function handleImageError(e: Event, pluginId: string) {
		const target = e.target as HTMLImageElement;
		const currentSrc = target.src;

		if (currentSrc.includes('.png')) {
			target.src = getPreviewUrl(pluginId, 'jpg');
			target.onerror = () => {
				target.style.display = 'none';
				const placeholder = target.nextElementSibling as HTMLElement;
				if (placeholder) placeholder.style.display = 'flex';
			};
		} else {
			target.style.display = 'none';
			const placeholder = target.nextElementSibling as HTMLElement;
			if (placeholder) placeholder.style.display = 'flex';
		}
	}

	function getPluginUrl(pluginId: string): string {
		const plugin = data.plugin;
		if (plugin?.repository.includes('AdrienPiechocki')) {
			return `https://github.com/AdrienPiechocki/noctalia-virtual-keyboard-plugin`;
		}
		return `https://github.com/noctalia-dev/noctalia-plugins/tree/main/${pluginId}`;
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}

	function renderMarkdown(content: string): string {
		return marked.parse(content, { async: false }) as string;
	}
</script>

<nav class="nav fade-in">
	<div class="nav-container">
		<a href="/" class="nav-brand">
			<img src="https://assets.noctalia.dev/noctalia-logo.svg" alt="Noctalia" class="nav-logo" />
			<div class="nav-brand-text">
				<span class="logo">Noctalia</span>
				<span class="tagline">quiet by design</span>
			</div>
		</a>
		<div class="nav-links">
			<a href="/" class="nav-link">Home</a>
			<a href="/plugins" class="nav-link active">Plugins</a>
			<a href="/themes" class="nav-link">Themes</a>
		</div>
		<ThemeToggle />
	</div>
</nav>

<section class="plugin-page">
	<div class="container">
		<a href="/plugins" class="back-btn">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M19 12H5"></path>
				<path d="M12 19l-7-7 7-7"></path>
			</svg>
			Back to plugins
		</a>

		<div class="hero-section">
			<div class="hero-image">
				<img
					src={getPreviewUrl(data.plugin.id)}
					alt={data.plugin.name}
					onerror={(e) => handleImageError(e, data.plugin.id)}
				/>
				<div class="preview-placeholder" style="display: none;">
					<div class="placeholder-icon">📦</div>
				</div>
			</div>
			<div class="hero-overlay"></div>
			<div class="hero-content">
				<h1 class="hero-title">{data.plugin.name}</h1>
				<p class="hero-description">{data.plugin.description}</p>
			</div>
		</div>

		<div class="badge-row">
			<span class="badge">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 20h9"></path>
					<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
				</svg>
				v{data.plugin.version}
			</span>
			<span class="badge">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
					<circle cx="12" cy="7" r="4"></circle>
				</svg>
				{data.plugin.author}
			</span>
			<span class="badge">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
					<polyline points="14 2 14 8 20 8"></polyline>
					<line x1="16" y1="13" x2="8" y2="13"></line>
					<line x1="16" y1="17" x2="8" y2="17"></line>
					<polyline points="10 9 9 9 8 9"></polyline>
				</svg>
				{data.plugin.license}
			</span>
			<span class="badge">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
					<line x1="16" y1="2" x2="16" y2="6"></line>
					<line x1="8" y1="2" x2="8" y2="6"></line>
					<line x1="3" y1="10" x2="21" y2="10"></line>
				</svg>
				{formatDate(data.plugin.lastUpdated)}
			</span>
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
				href={getPluginUrl(data.plugin.id)}
				target="_blank"
				rel="noopener noreferrer"
				class="github-btn"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
					<path d="M9 18c-4.51 2-5-2-7-2"></path>
				</svg>
				View on GitHub
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="7" y1="17" x2="17" y2="7"></line>
					<polyline points="7 7 17 7 17 17"></polyline>
				</svg>
			</a>
		</div>
	</div>
</section>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 100;
		border-bottom: 1px solid var(--mOutline);
		backdrop-filter: blur(20px) saturate(180%);
		background: rgba(var(--mSurface-rgb, 7, 7, 34), 0.7);
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	:global([data-theme='light']) .nav {
		background: rgba(230, 232, 250, 0.85);
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
	}

	.nav-brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
	}

	.nav-logo {
		width: 40px;
		height: 40px;
		transition: transform 0.3s ease;
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
	}

	.nav-logo:hover {
		transform: scale(1.1) rotate(5deg);
	}

	.nav-brand-text {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--mPrimary), var(--mPrimary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.tagline {
		font-size: 0.75rem;
		color: var(--mOnSurfaceVariant);
		font-weight: 300;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.8;
	}

	:global([data-theme='light']) .tagline {
		color: var(--mOnSurface);
		opacity: 0.9;
		font-weight: 500;
	}

	.nav-links {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		flex: 1;
		justify-content: center;
	}

	.nav-link {
		color: var(--mOnSurfaceVariant);
		text-decoration: none;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	:global([data-theme='light']) .nav-link:not(:hover):not(.active) {
		color: var(--mOnSurface);
		opacity: 0.9;
		font-weight: 600;
	}

	.nav-link::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--mPrimary);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 0;
	}

	.nav-link:hover {
		color: var(--mPrimary);
		background: rgba(255, 245, 155, 0.15);
		transform: translateY(-2px);
	}

	:global([data-theme='light']) .nav-link:hover {
		color: var(--mPrimary);
		background: rgba(93, 101, 245, 0.1);
	}

	.nav-link:hover::before {
		opacity: 0.1;
	}

	.nav-link.active {
		color: var(--mPrimary);
		background: rgba(255, 245, 155, 0.15);
		box-shadow: 0 2px 8px rgba(255, 245, 155, 0.2);
	}

	:global([data-theme='light']) .nav-link.active {
		color: var(--mPrimary);
		background: rgba(93, 101, 245, 0.1);
		box-shadow: 0 2px 8px rgba(93, 101, 245, 0.15);
	}

	.nav-link.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 1rem;
		right: 1rem;
		height: 2px;
		background: linear-gradient(90deg, var(--mPrimary), var(--mPrimary));
		border-radius: 2px;
		box-shadow: 0 0 8px rgba(255, 245, 155, 0.5);
	}

	:global([data-theme='light']) .nav-link.active::after {
		background: linear-gradient(90deg, var(--mPrimary), var(--mPrimary));
		box-shadow: 0 0 8px rgba(93, 101, 245, 0.4);
	}

	.plugin-page {
		min-height: 100vh;
		padding: 2rem 0 4rem;
		background: linear-gradient(180deg, var(--mSurface) 0%, var(--mSurfaceVariant) 100%);
	}

	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 2rem;
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

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.85) 0%,
			rgba(0, 0, 0, 0.4) 50%,
			rgba(0, 0, 0, 0.1) 100%
		);
	}

	.hero-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 2rem;
	}

	.hero-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 0.5rem;
		letter-spacing: -0.02em;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.hero-description {
		font-size: 1.125rem;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.6;
		max-width: 600px;
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

	.badge svg {
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
		.nav-container {
			padding: 1rem;
			flex-wrap: wrap;
		}

		.nav-links {
			order: 3;
			width: 100%;
			justify-content: flex-start;
		}

		.container {
			padding: 0 1rem;
		}

		.hero-section {
			aspect-ratio: 4 / 3;
		}

		.hero-title {
			font-size: 1.75rem;
		}

		.hero-description {
			font-size: 1rem;
		}

		.hero-content {
			padding: 1.5rem;
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
