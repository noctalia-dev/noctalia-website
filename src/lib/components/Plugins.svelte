<script lang="ts">
	import { onMount } from 'svelte';
	
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
	
	interface Registry {
		version: number;
		plugins: Plugin[];
	}
	
	let { open = $bindable(false) } = $props();
	let plugins = $state<Plugin[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let selectedPlugin = $state<Plugin | null>(null);
	
	onMount(() => {
		// Handle escape key
		window.addEventListener('keydown', handleKeydown);
		
		// Fetch plugins
		(async () => {
			try {
				const response = await fetch('https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/registry.json');
				if (!response.ok) throw new Error('Failed to fetch plugins');
				const data: Registry = await response.json();
				plugins = data.plugins;
				loading = false;
			} catch (err) {
				error = err instanceof Error ? err.message : 'Failed to load plugins';
				loading = false;
			}
		})();
		
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
	
	function getPreviewUrl(pluginId: string, format: 'png' | 'jpg' = 'png'): string {
		return `https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/${pluginId}/preview.${format}`;
	}
	
	function handleImageError(e: Event, pluginId: string) {
		const target = e.target as HTMLImageElement;
		const currentSrc = target.src;
		
		// Try jpg if png failed, or hide if both failed
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
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}
	
	function closeModal() {
		selectedPlugin = null;
	}
	
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			open = false;
			selectedPlugin = null;
		}
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			open = false;
			selectedPlugin = null;
		}
	}
</script>

{#if open}
	<div 
		class="plugins-overlay" 
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && (open = false)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="plugins-title"
		tabindex="-1"
	>
		<div class="plugins-modal" class:loading>
			<div class="modal-header">
				<div class="header-content">
					<h2 class="modal-title" id="plugins-title">Plugins</h2>
					<p class="modal-subtitle">Extend Noctalia with community plugins</p>
				</div>
				<button class="close-btn" onclick={() => open = false} aria-label="Close">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 6L6 18"></path>
						<path d="M6 6l12 12"></path>
					</svg>
				</button>
			</div>
			
			<div class="modal-content">
				{#if loading}
					<div class="loading-state">
						<div class="spinner"></div>
						<p>Loading plugins...</p>
					</div>
				{:else if error}
					<div class="error-state">
						<p>Error: {error}</p>
					</div>
				{:else if selectedPlugin}
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
									src={getPreviewUrl(selectedPlugin.id)} 
									alt={selectedPlugin.name}
									onerror={(e) => handleImageError(e, selectedPlugin!.id)}
								/>
								<div class="preview-placeholder" style="display: none;">
									<div class="placeholder-icon">📦</div>
									<p>No preview available</p>
								</div>
							</div>
							
							<div class="detail-info">
								<h3 class="detail-name">{selectedPlugin.name}</h3>
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
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.plugins-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		animation: fadeIn 0.3s ease;
	}
	
	.plugins-modal {
		width: 100%;
		max-width: 1200px;
		max-height: 90vh;
		background: var(--mSurface);
		border-radius: 1.5rem;
		border: 1px solid var(--mOutline);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: slideUp 0.3s ease;
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem;
		border-bottom: 1px solid var(--mOutline);
		background: var(--mSurfaceVariant);
	}
	
	.header-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.modal-title {
		font-size: 2rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.02em;
	}
	
	.modal-subtitle {
		color: var(--mOnSurfaceVariant);
		font-size: 1rem;
	}
	
	.close-btn {
		width: 40px;
		height: 40px;
		border-radius: 0.5rem;
		background: transparent;
		border: 1px solid var(--mOutline);
		color: var(--mOnSurfaceVariant);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.close-btn:hover {
		background: var(--mSecondary);
		color: var(--mOnSecondary);
		border-color: var(--mSecondary);
		transform: scale(1.05);
	}
	
	.modal-content {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
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
	
	.plugins-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
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
	
	.plugin-detail {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
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
		gap: 2rem;
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
		font-size: 2rem;
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
	}
	
	.detail-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(255, 245, 155, 0.3);
	}
	
	@media (max-width: 768px) {
		.plugins-overlay {
			padding: 1rem;
		}
		
		.modal-header {
			padding: 1.5rem;
		}
		
		.modal-title {
			font-size: 1.5rem;
		}
		
		.modal-content {
			padding: 1.5rem;
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

