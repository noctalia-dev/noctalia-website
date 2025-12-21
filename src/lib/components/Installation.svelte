<script lang="ts">
	import { onMount } from 'svelte';
	
	let mounted = $state(false);
	
	onMount(() => {
		mounted = true;
	});
	
	const installCommands = [
		{ label: 'Niri', command: 'niri install noctalia' },
		{ label: 'Hyprland', command: 'hyprctl install noctalia' },
		{ label: 'Sway', command: 'sway install noctalia' },
		{ label: 'MangoWC', command: 'mangowc install noctalia' }
	];
	
	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		// You could add a toast notification here
	}
</script>

<section class="installation" id="installation">
	<div class="container">
		<div class="section-header" class:visible={mounted}>
			<h2 class="section-title">Quick Install</h2>
			<p class="section-description">
				Get started with Noctalia in just a few commands
			</p>
		</div>
		
		<div class="install-grid" class:visible={mounted}>
			{#each installCommands as item}
				<div class="install-card">
					<div class="install-header">
						<h3 class="install-label">{item.label}</h3>
						<button 
							class="copy-btn" 
							onclick={() => copyToClipboard(item.command)}
							aria-label="Copy command"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
								<path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2"></path>
							</svg>
						</button>
					</div>
					<div class="install-command-wrapper">
						<span class="command-prompt">$</span>
						<code class="install-command">{item.command}</code>
					</div>
				</div>
			{/each}
		</div>
		
		<div class="install-note" class:visible={mounted}>
			<p>
				For detailed installation instructions and customization options, check out our 
				<a href="https://github.com/noctalia-dev/noctalia" target="_blank" rel="noopener noreferrer">documentation</a>.
			</p>
		</div>
	</div>
</section>

<style>
	.installation {
		position: relative;
		background: linear-gradient(180deg, var(--mSurfaceVariant) 0%, var(--mSurface) 100%);
	}
	
	.section-header {
		text-align: center;
		margin-bottom: 4rem;
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease, transform 0.6s ease;
	}
	
	.section-header.visible {
		opacity: 1;
		transform: translateY(0);
	}
	
	.section-title {
		font-size: 3rem;
		font-weight: 700;
		margin-bottom: 1.25rem;
		background: linear-gradient(135deg, var(--mOnSurface), var(--mSecondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.02em;
	}
	
	.section-description {
		font-size: 1.25rem;
		color: var(--mOnSurfaceVariant);
		max-width: 700px;
		margin: 0 auto;
		line-height: 1.7;
	}
	
	.install-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.75rem;
		margin-bottom: 4rem;
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease, transform 0.6s ease;
	}
	
	.install-grid.visible {
		opacity: 1;
		transform: translateY(0);
	}
	
	.install-card {
		padding: 2rem;
		border-radius: 1rem;
		backdrop-filter: blur(10px);
		background: color-mix(in srgb, var(--mSurfaceVariant) 90%, var(--mSurface) 10%);
		border: 1px solid var(--mOutline);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}
	
	.install-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--mPrimary), var(--mSecondary));
		transform: scaleX(0);
		transition: transform 0.3s ease;
	}
	
	.install-card:hover {
		border-color: var(--mSecondary);
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), 0 0 24px rgba(169, 174, 254, 0.1);
		background: color-mix(in srgb, var(--mSurfaceVariant) 95%, var(--mSurface) 5%);
	}
	
	.install-card:hover::before {
		transform: scaleX(1);
	}
	
	.install-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
	}
	
	.install-label {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--mOnSurface);
		letter-spacing: -0.01em;
	}
	
	.copy-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 0.5rem;
		background-color: transparent;
		color: var(--mOnSurfaceVariant);
		border: 1px solid var(--mOutline);
		transition: all 0.2s ease;
	}
	
	.copy-btn:hover {
		background: linear-gradient(135deg, var(--mSecondary), var(--mTertiary));
		color: var(--mOnSecondary);
		border-color: transparent;
		transform: scale(1.1);
	}
	
	.install-command-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		background: rgba(var(--mSurface-rgb, 7, 7, 34), 0.8);
		border-radius: 0.75rem;
		border: 1px solid var(--mOutline);
	}
	
	.command-prompt {
		color: var(--mOnSurfaceVariant);
		opacity: 0.6;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace;
		font-size: 0.9375rem;
		font-weight: 600;
		user-select: none;
	}
	
	.install-command {
		flex: 1;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace;
		font-size: 0.9375rem;
		color: var(--mTertiary);
		word-break: break-all;
		line-height: 1.6;
		overflow-x: auto;
	}
	
	.install-note {
		text-align: center;
		color: var(--mOnSurfaceVariant);
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s;
	}
	
	.install-note.visible {
		opacity: 1;
		transform: translateY(0);
	}
	
	.install-note a {
		color: var(--mSecondary);
		text-decoration: underline;
	}
	
	.install-note a:hover {
		color: var(--mHover);
	}
	
	@media (max-width: 768px) {
		.install-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

