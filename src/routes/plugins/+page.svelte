<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ScrollToTop from '$lib/components/ScrollToTop.svelte';
	import Fuse from 'fuse.js';
	
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
	
	let { data } = $props<{ data: { plugins: Plugin[] } }>();
	
	let plugins = $state<Plugin[]>([]);
	let allPlugins = $state<Plugin[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let latestUpdate = $state<Plugin | null>(null);
	let searchQuery = $state('');
	let fuse: Fuse<Plugin> | null = $state(null);
	let selectedTags = $state<string[]>([]);
	let availableTags = $state<string[]>([]);
	
	onMount(() => {
		// Sort plugins by last updated
		allPlugins = data.plugins.sort((a: Plugin, b: Plugin) =>
			new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
		);

		// Extract all unique tags
		const tagSet = new Set<string>();
		allPlugins.forEach(plugin => {
			plugin.tags?.forEach(tag => tagSet.add(tag));
		});
		availableTags = Array.from(tagSet).sort();

		// Initialize Fuse.js for fuzzy search
		fuse = new Fuse(allPlugins, {
			keys: [
				{ name: 'name', weight: 0.5 },
				{ name: 'description', weight: 0.3 },
				{ name: 'author', weight: 0.2 },
				{ name: 'id', weight: 0.1 },
				{ name: 'tags', weight: 0.4 }
			],
			threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
			includeScore: true,
			minMatchCharLength: 2
		});

		plugins = allPlugins;

		// Get the most recently updated plugin
		if (plugins.length > 0) {
			latestUpdate = plugins[0];
		}

		// Check for tag query parameter
		const urlTag = $page.url.searchParams.get('tag');
		if (urlTag && availableTags.includes(urlTag)) {
			selectedTags = [urlTag];
		}
	});
	
	$effect(() => {
		let filtered = allPlugins;

		// Apply tag filter (OR logic - show plugins matching any selected tag)
		if (selectedTags.length > 0) {
			filtered = filtered.filter(plugin =>
				selectedTags.some(tag => plugin.tags?.includes(tag))
			);
		}

		// Apply search filter
		if (fuse && searchQuery.trim()) {
			const results = fuse.search(searchQuery);
			const searchIds = new Set(results.map(r => r.item.id));
			filtered = filtered.filter(plugin => searchIds.has(plugin.id));
		}

		plugins = filtered;
	});

	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = [];
		} else {
			selectedTags = [tag];
		}
	}

	function clearFilters() {
		selectedTags = [];
		searchQuery = '';
	}
	
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
		return `https://github.com/noctalia-dev/noctalia-plugins/tree/main/${pluginId}`;
	}
	
	function formatRelativeDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
		return `${Math.floor(diffDays / 365)} years ago`;
	}
</script>

<Navbar activePage="plugins" />

<section class="plugins-page">
	<div class="container">
		<div class="page-header">
			<h1 class="page-title">Plugins</h1>
			<p class="page-subtitle">Extend Noctalia with community plugins</p>
		</div>
		
		{#if loading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Loading plugins...</p>
			</div>
		{:else if error}
			<div class="error-state">
				<p>Error: {error}</p>
			</div>
		{:else}
			<div class="search-section">
				<div class="search-container">
					<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.35-4.35"></path>
					</svg>
					<input
						type="text"
						class="search-input"
						placeholder="Search plugins by name, description or author..."
						bind:value={searchQuery}
						autocomplete="off"
					/>
					{#if searchQuery}
						<button 
							class="search-clear"
							onclick={() => searchQuery = ''}
							aria-label="Clear search"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M18 6L6 18"></path>
								<path d="M6 6l12 12"></path>
							</svg>
						</button>
					{/if}
				</div>
				{#if searchQuery || selectedTags.length > 0}
					<div class="search-results-info">
						Found {plugins.length} {plugins.length === 1 ? 'plugin' : 'plugins'}
						{#if selectedTags.length > 0 || searchQuery}
							<button class="clear-filters-btn" onclick={clearFilters}>Clear filters</button>
						{/if}
					</div>
				{/if}
			</div>

			{#if availableTags.length > 0}
				<div class="tag-filters">
					{#each availableTags as tag}
						<button
							class="tag-chip"
							class:selected={selectedTags.includes(tag)}
							onclick={() => toggleTag(tag)}
						>
							{tag}
						</button>
					{/each}
				</div>
			{/if}
			
			{#if latestUpdate && !searchQuery && selectedTags.length === 0}
				<div class="latest-update">
					<div class="latest-badge">Latest Update</div>
					<div class="latest-content">
						<div class="latest-preview">
							<img 
								src={getPreviewUrl(latestUpdate!.id)} 
								alt={latestUpdate!.name}
								onerror={(e) => handleImageError(e, latestUpdate!.id)}
							/>
							<div class="preview-placeholder" style="display: none;">
								<div class="placeholder-icon">📦</div>
							</div>
						</div>
						<div class="latest-info">
							<h2 class="latest-name">{latestUpdate.name}</h2>
							<p class="latest-description">{latestUpdate.description}</p>
							<div class="latest-meta">
								<span class="latest-version">v{latestUpdate.version}</span>
								<span class="latest-author">by {latestUpdate.author.split('<')[0].trim()}</span>
								<span class="latest-date">Updated {formatRelativeDate(latestUpdate.lastUpdated)}</span>
							</div>
							<div class="latest-actions">
								<a
									href="/plugins/{latestUpdate.id}"
									class="btn btn-primary"
								>
									View Details
								</a>
							</div>
						</div>
					</div>
				</div>
			{/if}
			
				<div class="plugins-section">
					<h2 class="section-title">
						{searchQuery || selectedTags.length > 0 ? 'Results' : 'All Plugins'}
					</h2>
					{#if plugins.length === 0 && (searchQuery || selectedTags.length > 0)}
						<div class="no-results">
							<div class="no-results-icon">🔍</div>
							<h3>No plugins found</h3>
							<p>Try adjusting your filters or <button class="clear-search-link" onclick={clearFilters}>clear all filters</button></p>
						</div>
					{:else}
						<div class="plugins-grid">
						{#each plugins as plugin}
							<a 
								href="/plugins/{plugin.id}"
								class="plugin-card"
							>
								<div class="plugin-preview">
									<img 
										src={getPreviewUrl(plugin.id)} 
										alt={plugin.name}
										onerror={(e) => handleImageError(e, plugin.id)}
									/>
									<div class="preview-placeholder" style="display: none;">
										<div class="placeholder-icon">📦</div>
									</div>
									<div class="preview-overlay">
										<span class="preview-text">View Details</span>
									</div>
								</div>
								<div class="plugin-info">
									<h3 class="plugin-name">{plugin.name}</h3>
									<p class="plugin-description">{plugin.description}</p>
									{#if plugin.tags && plugin.tags.length > 0}
										<div class="plugin-tags">
											{#each plugin.tags as tag}
												<span class="plugin-tag">{tag}</span>
											{/each}
										</div>
									{/if}
									<div class="plugin-footer">
										<span class="plugin-author">{plugin.author.split('<')[0].trim()}</span>
										<span class="plugin-version">v{plugin.version}</span>
									</div>
									<div class="plugin-updated">
										Updated {formatRelativeDate(plugin.lastUpdated)}
									</div>
								</div>
							</a>
						{/each}
						</div>
					{/if}
				</div>
		{/if}
	</div>
</section>

<Footer />
<ScrollToTop />

<style>
	.plugins-page {
		min-height: 100vh;
		padding: 4rem 0;
		background: linear-gradient(180deg, var(--mSurface) 0%, var(--mSurfaceVariant) 100%);
	}
	
	.page-header {
		text-align: center;
		margin-bottom: 4rem;
	}
	
	.page-title {
		font-size: 3.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--mPrimary), var(--mPrimary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.02em;
		margin-bottom: 1rem;
	}
	
	.page-subtitle {
		font-size: 1.25rem;
		color: var(--mOnSurfaceVariant);
	}
	
	.search-section {
		margin-bottom: 3rem;
	}
	
	.search-container {
		position: relative;
		display: flex;
		align-items: center;
		max-width: 600px;
		margin: 0 auto;
		background: var(--mSurfaceVariant);
		border: 2px solid var(--mOutline);
		border-radius: 1rem;
		padding: 0.75rem 1rem;
		transition: all 0.3s ease;
	}
	
	.search-container:focus-within {
		border-color: var(--mPrimary);
		box-shadow: 0 0 0 4px rgba(255, 245, 155, 0.1);
	}
	
	:global([data-theme='light']) .search-container:focus-within {
		box-shadow: 0 0 0 4px rgba(93, 101, 245, 0.1);
	}
	
	.search-icon {
		color: var(--mOnSurfaceVariant);
		margin-right: 0.75rem;
		flex-shrink: 0;
	}
	
	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		color: var(--mOnSurface);
		font-size: 1rem;
		font-family: inherit;
		padding: 0;
	}
	
	.search-input::placeholder {
		color: var(--mOnSurfaceVariant);
		opacity: 0.6;
	}
	
	.search-clear {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 0.5rem;
		background: transparent;
		border: none;
		color: var(--mOnSurfaceVariant);
		cursor: pointer;
		transition: all 0.2s ease;
		margin-left: 0.5rem;
		flex-shrink: 0;
	}
	
	.search-clear:hover {
		background: var(--mSurface);
		color: var(--mOnSurface);
	}
	
	.search-results-info {
		text-align: center;
		margin-top: 1rem;
		color: var(--mOnSurfaceVariant);
		font-size: 0.9375rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.clear-filters-btn {
		background: transparent;
		border: 1px solid var(--mOutline);
		color: var(--mOnSurfaceVariant);
		padding: 0.25rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.clear-filters-btn:hover {
		background: var(--mSurfaceVariant);
		border-color: var(--mPrimary);
		color: var(--mPrimary);
	}

	.tag-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
		margin-bottom: 2rem;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
	}

	.tag-chip {
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		border: 1px solid var(--mOutline);
		background: transparent;
		color: var(--mOnSurfaceVariant);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
		flex: 1 1 auto;
		text-align: center;
		min-width: fit-content;
	}

	.tag-chip:hover {
		border-color: var(--mPrimary);
		color: var(--mPrimary);
	}

	.tag-chip.selected {
		background: var(--mPrimary);
		border-color: var(--mPrimary);
		color: var(--mOnPrimary);
	}
	
	.no-results {
		text-align: center;
		padding: 4rem 2rem;
		color: var(--mOnSurfaceVariant);
	}
	
	.no-results-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.5;
	}
	
	.no-results h3 {
		font-size: 1.5rem;
		color: var(--mOnSurface);
		margin-bottom: 0.5rem;
	}
	
	.no-results p {
		font-size: 1rem;
		line-height: 1.6;
	}
	
	.clear-search-link {
		background: none;
		border: none;
		color: var(--mPrimary);
		cursor: pointer;
		text-decoration: underline;
		font-family: inherit;
		font-size: inherit;
		padding: 0;
	}
	
	.clear-search-link:hover {
		color: var(--mPrimary);
		opacity: 0.8;
	}
	
	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		gap: 1rem;
		color: var(--mOnSurfaceVariant);
	}
	
	.spinner {
		width: 48px;
		height: 48px;
		border: 3px solid var(--mOutline);
		border-top-color: var(--mPrimary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	
	.latest-update {
		margin-bottom: 4rem;
		padding: 2.5rem;
		border-radius: 1.5rem;
		background: linear-gradient(135deg, var(--mSurfaceVariant), var(--mSurface));
		border: 2px solid var(--mOutline);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		position: relative;
		overflow: hidden;
	}
	
	.latest-badge {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: var(--mPrimary);
		color: var(--mOnPrimary);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.latest-content {
		display: grid;
		grid-template-columns: 400px 1fr;
		gap: 2.5rem;
		align-items: center;
	}
	
	.latest-preview {
		border-radius: 1rem;
		overflow: hidden;
		background: var(--mSurface);
		border: 1px solid var(--mOutline);
		aspect-ratio: 16 / 9;
		position: relative;
	}
	
	.latest-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.latest-info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.latest-name {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--mOnSurface);
		letter-spacing: -0.02em;
	}
	
	.latest-description {
		font-size: 1.125rem;
		color: var(--mOnSurfaceVariant);
		line-height: 1.7;
	}
	
	.latest-meta {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		align-items: center;
	}
	
	.latest-version {
		padding: 0.5rem 1rem;
		background: rgba(255, 245, 155, 0.2);
		color: var(--mPrimary);
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 0.9375rem;
	}
	
	:global([data-theme='light']) .latest-version {
		background: rgba(93, 101, 245, 0.15);
		color: var(--mPrimary);
	}
	
	.latest-author {
		color: var(--mOnSurfaceVariant);
		font-size: 0.9375rem;
	}
	
	.latest-date {
		color: var(--mPrimary);
		font-size: 0.9375rem;
		font-weight: 500;
		opacity: 0.8;
	}
	
	.latest-actions {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}
	
	.plugins-section {
		margin-top: 4rem;
	}
	
	.section-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--mOnSurface);
		margin-bottom: 2rem;
		letter-spacing: -0.02em;
	}
	
	.plugins-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 2rem;
	}
	
	.plugin-card {
		border-radius: 1rem;
		background: var(--mSurfaceVariant);
		border: 1px solid var(--mOutline);
		overflow: hidden;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		flex-direction: column;
		text-align: left;
		padding: 0;
		width: 100%;
		text-decoration: none;
		color: inherit;
	}
	
	.plugin-card:hover {
		transform: translateY(-4px);
		border-color: var(--mPrimary);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2), 0 0 24px rgba(255, 245, 155, 0.15);
	}
	
	:global([data-theme='light']) .plugin-card:hover {
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1), 0 0 24px rgba(93, 101, 245, 0.1);
	}
	
	.plugin-preview {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--mSurface);
	}
	
	.plugin-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}
	
	.plugin-card:hover .plugin-preview img {
		transform: scale(1.05);
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
		gap: 0.5rem;
	}
	
	.placeholder-icon {
		font-size: 3rem;
		opacity: 0.5;
	}
	
	.preview-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s ease;
		backdrop-filter: blur(4px);
	}
	
	.plugin-card:hover .preview-overlay {
		opacity: 1;
	}
	
	.preview-text {
		color: white;
		font-weight: 600;
		font-size: 1.125rem;
	}
	
	.plugin-info {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		flex: 1;
	}
	
	.plugin-name {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--mOnSurface);
		letter-spacing: -0.01em;
	}
	
	.plugin-description {
		color: var(--mOnSurfaceVariant);
		line-height: 1.6;
		font-size: 0.9375rem;
		flex: 1;
	}

	.plugin-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin-top: 0.25rem;
	}

	.plugin-tag {
		padding: 0.125rem 0.5rem;
		border-radius: 1rem;
		background: var(--mSurface);
		color: var(--mOnSurfaceVariant);
		font-size: 0.75rem;
		border: 1px solid var(--mOutline);
	}
	
	.plugin-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 0.75rem;
		border-top: 1px solid var(--mOutline);
	}
	
	.plugin-author {
		color: var(--mOnSurfaceVariant);
		font-size: 0.875rem;
	}
	
	.plugin-version {
		color: var(--mPrimary);
		font-size: 0.875rem;
		font-weight: 600;
		background: rgba(255, 245, 155, 0.15);
		padding: 0.25rem 0.75rem;
		border-radius: 0.375rem;
	}
	
	:global([data-theme='light']) .plugin-version {
		background: rgba(93, 101, 245, 0.1);
		color: var(--mPrimary);
	}
	
	.plugin-updated {
		font-size: 0.75rem;
		color: var(--mOnSurfaceVariant);
		opacity: 0.7;
		margin-top: 0.5rem;
	}
	
	
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.875rem 1.5rem;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 1rem;
		text-decoration: none;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.btn-primary {
		background: var(--mPrimary);
		color: var(--mOnPrimary);
		box-shadow: 0 4px 20px rgba(255, 245, 155, 0.3);
		transition: all 0.3s ease;
	}
	
	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px rgba(255, 245, 155, 0.4);
		filter: brightness(1.1);
	}
	
	:global([data-theme='light']) .btn-primary {
		box-shadow: 0 4px 20px rgba(93, 101, 245, 0.25);
	}
	
	:global([data-theme='light']) .btn-primary:hover {
		box-shadow: 0 8px 30px rgba(93, 101, 245, 0.35);
	}
	
	.btn-secondary {
		background: transparent;
		color: var(--mPrimary);
		border: 2px solid var(--mOutline);
	}
	
	.btn-secondary:hover {
		background: var(--mPrimary);
		color: var(--mOnPrimary);
		border-color: var(--mPrimary);
	}
	
	@media (max-width: 768px) {
		.page-title {
			font-size: 2.5rem;
		}

		.latest-content {
			grid-template-columns: 1fr;
		}

		.latest-preview {
			max-width: 100%;
		}

		.plugins-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

