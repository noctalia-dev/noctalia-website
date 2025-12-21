<script lang="ts">
	import { onMount } from 'svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
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
	}
	
	let { data } = $props<{ data: { plugins: Plugin[] } }>();
	
	let plugins = $state<Plugin[]>([]);
	let allPlugins = $state<Plugin[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let selectedPlugin = $state<Plugin | null>(null);
	let latestUpdate = $state<Plugin | null>(null);
	let searchQuery = $state('');
	let fuse: Fuse<Plugin> | null = $state(null);
	
	onMount(() => {
		// Sort plugins by last updated
		allPlugins = data.plugins.sort((a, b) => 
			new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
		);
		
		// Initialize Fuse.js for fuzzy search
		fuse = new Fuse(allPlugins, {
			keys: [
				{ name: 'name', weight: 0.5 },
				{ name: 'description', weight: 0.3 },
				{ name: 'author', weight: 0.2 },
				{ name: 'id', weight: 0.1 }
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
	});
	
	$effect(() => {
		if (!fuse || !searchQuery.trim()) {
			plugins = allPlugins;
			return;
		}
		
		const results = fuse.search(searchQuery);
		plugins = results.map(result => result.item);
	});
	
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
		const plugin = plugins.find(p => p.id === pluginId);
		if (plugin?.repository.includes('AdrienPiechocki')) {
			return `https://github.com/AdrienPiechocki/noctalia-virtual-keyboard-plugin`;
		}
		return `https://github.com/noctalia-dev/noctalia-plugins/tree/main/${pluginId}`;
	}
	
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
		</div>
		<ThemeToggle />
	</div>
</nav>

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
						placeholder="Search plugins by name, description, or author..."
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
				{#if searchQuery}
					<div class="search-results-info">
						Found {plugins.length} {plugins.length === 1 ? 'plugin' : 'plugins'}
					</div>
				{/if}
			</div>
			
			{#if latestUpdate && !selectedPlugin && !searchQuery}
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
								<button 
									class="btn btn-primary"
									onclick={() => selectedPlugin = latestUpdate}
								>
									View Details
								</button>
								<a 
									href={getPluginUrl(latestUpdate.id)} 
									target="_blank" 
									rel="noopener noreferrer"
									class="btn btn-secondary"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
										<path d="M9 18c-4.51 2-5-2-7-2"></path>
									</svg>
									GitHub
								</a>
							</div>
						</div>
					</div>
				</div>
			{/if}
			
			{#if selectedPlugin}
				<div class="plugin-detail">
					<button class="back-btn" onclick={() => selectedPlugin = null}>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M19 12H5"></path>
							<path d="M12 19l-7-7 7-7"></path>
						</svg>
						Back to plugins
					</button>
					
					<div class="detail-content">
						<div class="detail-preview">
							<img 
								src={getPreviewUrl(selectedPlugin!.id)} 
								alt={selectedPlugin!.name}
								onerror={(e) => handleImageError(e, selectedPlugin!.id)}
							/>
							<div class="preview-placeholder" style="display: none;">
								<div class="placeholder-icon">📦</div>
								<p>No preview available</p>
							</div>
						</div>
						
						<div class="detail-info">
							<h2 class="detail-name">{selectedPlugin.name}</h2>
							<p class="detail-description">{selectedPlugin.description}</p>
							
							<div class="detail-meta">
								<div class="meta-item">
									<span class="meta-label">Version</span>
									<span class="meta-value">{selectedPlugin.version}</span>
								</div>
								<div class="meta-item">
									<span class="meta-label">Author</span>
									<span class="meta-value">{selectedPlugin.author}</span>
								</div>
								<div class="meta-item">
									<span class="meta-label">License</span>
									<span class="meta-value">{selectedPlugin.license}</span>
								</div>
								<div class="meta-item">
									<span class="meta-label">Updated</span>
									<span class="meta-value">{formatDate(selectedPlugin.lastUpdated)}</span>
								</div>
								<div class="meta-item">
									<span class="meta-label">Min Version</span>
									<span class="meta-value">{selectedPlugin.minNoctaliaVersion}</span>
								</div>
							</div>
							
							<a 
								href={getPluginUrl(selectedPlugin.id)} 
								target="_blank" 
								rel="noopener noreferrer"
								class="detail-link"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
									<path d="M9 18c-4.51 2-5-2-7-2"></path>
								</svg>
								View on GitHub
							</a>
						</div>
					</div>
				</div>
			{:else}
				<div class="plugins-section">
					<h2 class="section-title">
						{searchQuery ? 'Search Results' : 'All Plugins'}
					</h2>
					{#if plugins.length === 0 && searchQuery}
						<div class="no-results">
							<div class="no-results-icon">🔍</div>
							<h3>No plugins found</h3>
							<p>Try adjusting your search query or <button class="clear-search-link" onclick={() => searchQuery = ''}>clear the search</button></p>
						</div>
					{:else}
						<div class="plugins-grid">
						{#each plugins as plugin}
							<button 
								class="plugin-card" 
								onclick={() => selectedPlugin = plugin}
								onkeydown={(e) => e.key === 'Enter' && (selectedPlugin = plugin)}
								type="button"
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
									<div class="plugin-footer">
										<span class="plugin-author">{plugin.author.split('<')[0].trim()}</span>
										<span class="plugin-version">v{plugin.version}</span>
									</div>
									<div class="plugin-updated">
										Updated {formatRelativeDate(plugin.lastUpdated)}
									</div>
								</div>
							</button>
						{/each}
						</div>
					{/if}
				</div>
			{/if}
		{/if}
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
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary));
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
		color: var(--mPrimary);
		opacity: 1;
		font-weight: 400;
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
		color: var(--mPrimary);
		opacity: 1;
		font-weight: 600;
	}
	
	.nav-link::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--mSecondary), var(--mTertiary));
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 0;
	}
	
	.nav-link:hover {
		color: var(--mSecondary);
		background: rgba(169, 174, 254, 0.2);
		transform: translateY(-2px);
	}
	
	.nav-link:hover::before {
		opacity: 0.1;
	}
	
	.nav-link.active {
		color: var(--mSecondary);
		background: rgba(169, 174, 254, 0.15);
		box-shadow: 0 2px 8px rgba(169, 174, 254, 0.2);
	}
	
	.nav-link.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 1rem;
		right: 1rem;
		height: 2px;
		background: linear-gradient(90deg, var(--mSecondary), var(--mTertiary));
		border-radius: 2px;
		box-shadow: 0 0 8px rgba(169, 174, 254, 0.5);
	}
	
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
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary), var(--mTertiary));
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
		border-color: var(--mSecondary);
		box-shadow: 0 0 0 4px rgba(169, 174, 254, 0.1);
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
		color: var(--mSecondary);
		cursor: pointer;
		text-decoration: underline;
		font-family: inherit;
		font-size: inherit;
		padding: 0;
	}
	
	.clear-search-link:hover {
		color: var(--mTertiary);
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
		border-top-color: var(--mSecondary);
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
	
	.latest-update::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--mPrimary), var(--mSecondary), var(--mTertiary));
	}
	
	.latest-badge {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary));
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
		background: rgba(169, 174, 254, 0.2);
		color: var(--mSecondary);
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 0.9375rem;
	}
	
	.latest-author {
		color: var(--mOnSurfaceVariant);
		font-size: 0.9375rem;
	}
	
	.latest-date {
		color: var(--mTertiary);
		font-size: 0.9375rem;
		font-weight: 500;
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
	}
	
	.plugin-card:hover {
		transform: translateY(-4px);
		border-color: var(--mSecondary);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2), 0 0 24px rgba(169, 174, 254, 0.1);
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
		color: var(--mSecondary);
		font-size: 0.875rem;
		font-weight: 600;
		background: rgba(169, 174, 254, 0.1);
		padding: 0.25rem 0.75rem;
		border-radius: 0.375rem;
	}
	
	.plugin-updated {
		font-size: 0.75rem;
		color: var(--mOnSurfaceVariant);
		opacity: 0.7;
		margin-top: 0.5rem;
	}
	
	.plugin-detail {
		display: flex;
		flex-direction: column;
		gap: 2rem;
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
	}
	
	.back-btn:hover {
		background: var(--mSecondary);
		color: var(--mOnSecondary);
		border-color: var(--mSecondary);
	}
	
	.detail-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
	}
	
	.detail-preview {
		border-radius: 1rem;
		overflow: hidden;
		background: var(--mSurfaceVariant);
		border: 1px solid var(--mOutline);
		aspect-ratio: 16 / 9;
		position: relative;
	}
	
	.detail-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.detail-info {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	
	.detail-name {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--mOnSurface);
		letter-spacing: -0.02em;
	}
	
	.detail-description {
		font-size: 1.125rem;
		color: var(--mOnSurfaceVariant);
		line-height: 1.7;
	}
	
	.detail-meta {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		padding: 1.5rem;
		background: var(--mSurfaceVariant);
		border-radius: 0.75rem;
		border: 1px solid var(--mOutline);
	}
	
	.meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	
	.meta-label {
		font-size: 0.75rem;
		color: var(--mOnSurfaceVariant);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 500;
	}
	
	.meta-value {
		font-size: 1rem;
		color: var(--mOnSurface);
		font-weight: 600;
	}
	
	.detail-link {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary));
		color: var(--mOnPrimary);
		border-radius: 0.75rem;
		font-weight: 600;
		transition: all 0.2s ease;
		width: fit-content;
		text-decoration: none;
	}
	
	.detail-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(255, 245, 155, 0.3);
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
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary));
		color: var(--mOnPrimary);
		box-shadow: 0 4px 20px rgba(255, 245, 155, 0.3);
	}
	
	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px rgba(255, 245, 155, 0.4);
	}
	
	.btn-secondary {
		background: transparent;
		color: var(--mSecondary);
		border: 2px solid var(--mOutline);
	}
	
	.btn-secondary:hover {
		background: var(--mSecondary);
		color: var(--mOnSecondary);
		border-color: var(--mSecondary);
	}
	
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
		
		.detail-content {
			grid-template-columns: 1fr;
		}
		
		.detail-meta {
			grid-template-columns: 1fr;
		}
	}
</style>

