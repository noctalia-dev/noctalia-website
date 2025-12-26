<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	
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
	
	let { data } = $props<{ data: { plugin: Plugin } }>();
	
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
	
	function getPluginUrl(plugin: Plugin): string {
		// Use the repository field if it's a full URL, otherwise fall back to the default path
		if (plugin.repository && (plugin.repository.startsWith('http://') || plugin.repository.startsWith('https://'))) {
			return plugin.repository;
		}
		return `https://github.com/noctalia-dev/noctalia-plugins/tree/main/${plugin.id}`;
	}
	
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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

<section class="plugin-detail-page">
	<div class="container">
		<a href="/plugins" class="back-btn">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M19 12H5"></path>
				<path d="M12 19l-7-7 7-7"></path>
			</svg>
			Back to plugins
		</a>
		
		<div class="detail-content">
			<div class="detail-preview">
				<img 
					src={getPreviewUrl(data.plugin.id)} 
					alt={data.plugin.name}
					onerror={(e) => handleImageError(e, data.plugin.id)}
				/>
				<div class="preview-placeholder" style="display: none;">
					<div class="placeholder-icon">📦</div>
					<p>No preview available</p>
				</div>
			</div>
			
			<div class="detail-info">
				<h1 class="detail-name">{data.plugin.name}</h1>
				<p class="detail-description">{data.plugin.description}</p>
				
				<div class="detail-meta">
					<div class="meta-item">
						<span class="meta-label">Version</span>
						<span class="meta-value">{data.plugin.version}</span>
					</div>
					<div class="meta-item">
						<span class="meta-label">Author</span>
						<span class="meta-value">{data.plugin.author}</span>
					</div>
					<div class="meta-item">
						<span class="meta-label">License</span>
						<span class="meta-value">{data.plugin.license}</span>
					</div>
					<div class="meta-item">
						<span class="meta-label">Updated</span>
						<span class="meta-value">{formatDate(data.plugin.lastUpdated)}</span>
					</div>
					<div class="meta-item">
						<span class="meta-label">Min Version</span>
						<span class="meta-value">{data.plugin.minNoctaliaVersion}</span>
					</div>
				</div>
				
				<a 
					href={getPluginUrl(data.plugin)} 
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
	
	.plugin-detail-page {
		min-height: 100vh;
		padding: 4rem 0;
		background: linear-gradient(180deg, var(--mSurface) 0%, var(--mSurfaceVariant) 100%);
	}
	
	.container {
		max-width: 1200px;
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
		margin: 0;
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
		background: var(--mPrimary);
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
		filter: brightness(1.1);
	}
	
	:global([data-theme='light']) .detail-link:hover {
		box-shadow: 0 8px 24px rgba(93, 101, 245, 0.35);
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
		
		.detail-content {
			grid-template-columns: 1fr;
		}
		
		.detail-meta {
			grid-template-columns: 1fr;
		}
	}
</style>

