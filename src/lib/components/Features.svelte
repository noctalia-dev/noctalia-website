<script lang="ts">
	import { onMount } from 'svelte';
	import { setupScrollAnimation } from '$lib/utils/scrollAnimations';
	
	let mounted = $state(false);
	let headerVisible = $state(false);
	let gridVisible = $state(false);
	let featuresRef: HTMLElement;
	let headerRef: HTMLElement;
	let gridRef: HTMLElement;
	let { pluginCount = 0, releaseCount = 0 } = $props<{ pluginCount?: number; releaseCount?: number }>();
	
	onMount(() => {
		mounted = true;
		// Fallback: show content after a short delay if scroll detection doesn't work
		setTimeout(() => {
			if (!headerVisible) {
				headerVisible = true;
			}
			if (!gridVisible) {
				gridVisible = true;
			}
		}, 500);
		
		setTimeout(() => {
			if (headerRef) {
				setupScrollAnimation(headerRef, (visible) => {
					headerVisible = visible;
				}, { threshold: 0.2 });
			}
			if (gridRef) {
				setupScrollAnimation(gridRef, (visible) => {
					gridVisible = visible;
				}, { threshold: 0.1 });
			}
		}, 100);
	});
	
	const features = $derived([
		{
			icon: '⚡',
			title: 'Built on Quickshell',
			description: 'High performance foundation for a smooth experience',
			type: 'feature'
		},
		{
			icon: '🎯',
			title: 'Minimalist Design',
			description: 'Clean, uncluttered interface that gets out of your way',
			type: 'feature'
		},
		{
			icon: '🔧',
			title: 'Easily Customizable',
			description: 'Tailor every aspect to match your personal style',
			type: 'feature'
		},
		{
			icon: '🪟',
			value: '5+',
			title: 'Compositors Supported',
			description: 'Niri, Hyprland, Sway, MangoWC, and labwc',
			type: 'stat'
		},
		{
			icon: '🧩',
			value: `${pluginCount}+`,
			title: 'Plugins Available',
			description: `${pluginCount} community plugins to extend functionality`,
			type: 'stat'
		},
		{
			icon: '🚀',
			value: `${releaseCount}+`,
			title: 'Releases',
			description: `${releaseCount} stable releases and counting`,
			type: 'stat'
		}
	]);
</script>

<section class="features" id="features" bind:this={featuresRef}>
	<div class="container">
		<div class="section-header" class:visible={headerVisible} bind:this={headerRef}>
			<h2 class="section-title">Key Features</h2>
			<p class="section-description">
				Everything you need for a beautiful, distraction-free desktop experience
			</p>
		</div>
		
		<div class="features-grid" class:visible={gridVisible} bind:this={gridRef}>
			{#each features as feature, i}
				<div 
					class="feature-card" 
					class:stat-card={feature.type === 'stat'}
					style="animation-delay: {i * 0.1}s"
				>
					<div class="feature-icon">{feature.icon}</div>
					{#if feature.type === 'stat' && feature.value}
						<div class="feature-value">{feature.value}</div>
					{/if}
					<h3 class="feature-title">{feature.title}</h3>
					<p class="feature-description">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.features {
		background: linear-gradient(180deg, var(--mSurface) 0%, var(--mSurfaceVariant) 100%);
		position: relative;
		overflow: hidden;
	}
	
	.features::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--mOutline), transparent);
	}
	
	.section-header {
		text-align: center;
		margin-bottom: 5rem;
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
		color: var(--mOnSurface);
		background: none;
		-webkit-background-clip: unset;
		-webkit-text-fill-color: var(--mOnSurface);
		background-clip: unset;
		letter-spacing: -0.02em;
	}
	
	.section-description {
		font-size: 1.25rem;
		color: var(--mOnSurfaceVariant);
		max-width: 700px;
		margin: 0 auto;
		line-height: 1.7;
	}
	
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
	}
	
	.features-grid.visible {
		opacity: 1;
		transform: translateY(0);
	}
	
	.feature-card {
		padding: 2.5rem;
		border-radius: 1.5rem;
		backdrop-filter: blur(10px);
		background: color-mix(in srgb, var(--mSurface) 90%, var(--mSurfaceVariant) 10%);
		border: 1px solid var(--mOutline);
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 0;
		transform: translateY(30px);
		position: relative;
		overflow: hidden;
		box-shadow: 
			0 4px 16px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}
	
	.features-grid.visible .feature-card {
		opacity: 1;
		transform: translateY(0);
	}
	
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.feature-card::before {
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
	
	.feature-card::after {
		content: '';
		position: absolute;
		inset: -2px;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary), var(--mTertiary));
		opacity: 0;
		filter: blur(20px);
		z-index: -1;
		transition: opacity 0.5s ease;
	}
	
	
	.feature-card:hover {
		transform: translateY(-12px) scale(1.03) rotate(0.5deg);
		border-color: var(--mSecondary);
		box-shadow: 
			0 24px 60px rgba(0, 0, 0, 0.25), 
			0 0 60px rgba(169, 174, 254, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		background: color-mix(in srgb, var(--mSurface) 95%, var(--mSurfaceVariant) 5%);
	}
	
	.feature-card:hover::before {
		transform: scaleX(1);
	}
	
	.feature-card:hover::after {
		opacity: 0.3;
	}
	
	.feature-icon {
		font-size: 3.5rem;
		margin-bottom: 1.5rem;
		line-height: 1;
		display: inline-block;
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
		transform-origin: center;
	}
	
	.feature-card:hover .feature-icon {
		transform: scale(1.15) rotate(8deg) translateY(-4px);
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(255, 245, 155, 0.3));
	}
	
	.feature-title {
		font-size: 1.625rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: var(--mOnSurface);
		letter-spacing: -0.01em;
	}
	
	.feature-description {
		color: var(--mOnSurfaceVariant);
		line-height: 1.7;
		font-size: 1.0625rem;
	}
	
	.feature-card.stat-card {
		text-align: center;
	}
	
	.feature-value {
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
	
	:global([data-theme='light']) .feature-value {
		background: linear-gradient(135deg, #2d3180, #5d65f5, #2d3180);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: contrast(1.1);
	}
	
	.stat-card .feature-icon {
		margin-bottom: 1rem;
	}
	
	.stat-card .feature-title {
		margin-bottom: 0.75rem;
	}
	
	@media (max-width: 768px) {
		.section-title {
			font-size: 2rem;
		}
		
		.features-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
		
		.feature-card {
			padding: 1.5rem;
		}
	}
</style>

