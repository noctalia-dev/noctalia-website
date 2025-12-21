<script lang="ts">
	import { onMount } from 'svelte';
	import { setupScrollAnimation } from '$lib/utils/scrollAnimations';
	
	let mounted = $state(false);
	let statsVisible = $state(false);
	let statsRef: HTMLElement;
	let pluginCount = $state<number | null>(null);
	
	onMount(async () => {
		mounted = true;
		// Fallback: show content after a short delay if scroll detection doesn't work
		setTimeout(() => {
			if (!statsVisible) {
				statsVisible = true;
			}
		}, 500);
		
		setTimeout(() => {
			if (statsRef) {
				setupScrollAnimation(statsRef, (visible) => {
					statsVisible = visible;
				}, { threshold: 0.2 });
			}
		}, 100);
		
		// Fetch plugin count
		try {
			const response = await fetch('https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/registry.json');
			if (!response.ok) throw new Error('Failed to fetch plugins');
			const data = await response.json();
			pluginCount = data.plugins?.length || 0;
		} catch (err) {
			pluginCount = null;
		}
	});
	
	const stats = $derived([
		{
			value: '5+',
			label: 'Compositors Supported',
			icon: '🪟',
			description: 'Niri, Hyprland, Sway, MangoWC, and labwc'
		},
		{
			value: '100%',
			label: 'Customizable',
			icon: '🎨',
			description: 'Every aspect can be tailored to your style'
		},
		{
			value: pluginCount !== null ? `${pluginCount}+` : '...',
			label: 'Plugins Available',
			icon: '🧩',
			description: pluginCount !== null 
				? `${pluginCount} community plugins to extend functionality`
				: 'Extend functionality with community plugins'
		}
	]);
</script>

<section class="stats" class:visible={statsVisible} bind:this={statsRef}>
	<div class="container">
		<div class="stats-grid">
			{#each stats as stat, i}
				<div class="stat-card" style="animation-delay: {i * 0.1}s">
					<div class="stat-icon">{stat.icon}</div>
					<div class="stat-value">{stat.value}</div>
					<div class="stat-label">{stat.label}</div>
					<div class="stat-description">{stat.description}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.stats {
		position: relative;
		padding: 5rem 0;
		background: linear-gradient(180deg, var(--mSurfaceVariant) 0%, var(--mSurface) 100%);
		overflow: hidden;
	}
	
	.stats::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--mOutline), transparent);
	}
	
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		opacity: 0;
		transform: translateY(30px);
		transition: opacity 0.8s ease, transform 0.8s ease;
	}
	
	.stats.visible .stats-grid {
		opacity: 1;
		transform: translateY(0);
	}
	
	.stat-card {
		padding: 2.5rem 2rem;
		border-radius: 1.5rem;
		backdrop-filter: blur(10px);
		background: color-mix(in srgb, var(--mSurface) 85%, var(--mSurfaceVariant) 15%);
		border: 1px solid var(--mOutline);
		text-align: center;
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
		opacity: 0;
		transform: translateY(20px) scale(0.95);
	}
	
	.stats.visible .stat-card {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
	
	.stat-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--mPrimary), var(--mSecondary), var(--mTertiary));
		background-size: 200% 100%;
		transform: scaleX(0);
		transition: transform 0.5s ease;
		animation: shimmer 3s ease-in-out infinite;
	}
	
	.stat-card::after {
		content: '';
		position: absolute;
		inset: -2px;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary), var(--mTertiary));
		opacity: 0;
		filter: blur(20px);
		z-index: -1;
		transition: opacity 0.5s ease;
	}
	
	.stat-card:hover {
		transform: translateY(-12px) scale(1.05);
		border-color: var(--mSecondary);
		background: color-mix(in srgb, var(--mSurface) 95%, var(--mSurfaceVariant) 5%);
		box-shadow: 
			0 24px 60px rgba(0, 0, 0, 0.25), 
			0 0 60px rgba(169, 174, 254, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}
	
	.stat-card:hover::before {
		transform: scaleX(1);
	}
	
	.stat-card:hover::after {
		opacity: 0.3;
	}
	
	.stat-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
		line-height: 1;
		display: inline-block;
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
		transform-origin: center;
	}
	
	.stat-card:hover .stat-icon {
		transform: scale(1.2) rotate(8deg) translateY(-4px);
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(255, 245, 155, 0.3));
	}
	
	.stat-value {
		font-size: 3.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary), var(--mTertiary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 0.75rem;
		line-height: 1;
		letter-spacing: -0.02em;
	}
	
	.stat-label {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--mOnSurface);
		margin-bottom: 0.75rem;
		letter-spacing: -0.01em;
	}
	
	.stat-description {
		color: var(--mOnSurfaceVariant);
		font-size: 0.9375rem;
		line-height: 1.6;
		opacity: 0.9;
	}
	
	@media (max-width: 768px) {
		.stats {
			padding: 3rem 0;
		}
		
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}
		
		.stat-card {
			padding: 1.5rem 1rem;
		}
		
		.stat-value {
			font-size: 2.5rem;
		}
		
		.stat-label {
			font-size: 1.125rem;
		}
		
		.stat-icon {
			font-size: 2.5rem;
		}
	}
	
	@media (max-width: 480px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

