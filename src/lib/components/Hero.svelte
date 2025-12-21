<script lang="ts">
	import { onMount } from 'svelte';
	
	let mounted = $state(false);
	
	onMount(() => {
		mounted = true;
	});
</script>

<section class="hero">
	<div class="hero-background">
		<div class="gradient-orb orb-1"></div>
		<div class="gradient-orb orb-2"></div>
		<div class="gradient-orb orb-3"></div>
		<div class="grid-pattern"></div>
	</div>
	
	<div class="container">
		<div class="hero-content" class:visible={mounted}>
			<div class="logo-large">
				<img src="https://assets.noctalia.dev/noctalia-logo.svg" alt="Noctalia" class="hero-logo" />
				<div class="logo-text-wrapper">
					<span class="logo-text">Noctalia</span>
					<span class="logo-subtitle">quiet by design</span>
				</div>
			</div>
			
			<h1 class="hero-title">
				A beautiful, minimal desktop shell<br />
				for <span class="highlight">Wayland</span>
			</h1>
			
			<p class="hero-description">
				Built on Quickshell with a warm lavender aesthetic that you can easily customize to match your vibe.
			</p>
			
			<div class="hero-actions">
				<a href="/plugins" class="btn btn-primary">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 2L2 7l10 5 10-5-10-5z"></path>
						<path d="M2 17l10 5 10-5"></path>
						<path d="M2 12l10 5 10-5"></path>
					</svg>
					<span>Plugins</span>
				</a>
				<a href="https://docs.noctalia.dev" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
					</svg>
					<span>Documentation</span>
				</a>
				<a href="https://github.com/noctalia-dev/noctalia-shell" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
						<path d="M9 18c-4.51 2-5-2-7-2"></path>
					</svg>
					<span>GitHub</span>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		padding: 2rem 0;
	}
	
	.hero-background {
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		will-change: transform;
	}
	
	.gradient-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.25;
		animation: float 20s ease-in-out infinite, glow 8s ease-in-out infinite;
		will-change: transform, opacity;
	}
	
	.orb-1 {
		width: 600px;
		height: 600px;
		background: radial-gradient(circle, var(--mPrimary), transparent);
		top: -200px;
		left: -200px;
		animation-delay: 0s;
	}
	
	.orb-2 {
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, var(--mSecondary), transparent);
		bottom: -150px;
		right: -150px;
		animation-delay: -7s;
	}
	
	.orb-3 {
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, var(--mTertiary), transparent);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation-delay: -14s;
	}
	
	@keyframes float {
		0%, 100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(30px, -30px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
	}
	
	.grid-pattern {
		position: absolute;
		inset: 0;
		background-image: 
			linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
		background-size: 50px 50px;
		opacity: 0.5;
		animation: gridMove 20s linear infinite;
	}
	
	@keyframes gridMove {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 50px 50px;
		}
	}
	
	.hero-content {
		position: relative;
		z-index: 1;
		text-align: center;
		max-width: 900px;
		margin: 0 auto;
		opacity: 0;
		transform: translateY(30px);
		transition: opacity 0.8s ease, transform 0.8s ease;
	}
	
	.hero-content.visible {
		opacity: 1;
		transform: translateY(0);
	}
	
	.logo-large {
		margin-bottom: 3rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}
	
	.hero-logo {
		width: 120px;
		height: 120px;
		filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 40px rgba(255, 245, 155, 0.3));
		animation: logoFloat 6s ease-in-out infinite, logoGlow 4s ease-in-out infinite;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
	}
	
	.hero-logo::after {
		content: '';
		position: absolute;
		inset: -10px;
		background: radial-gradient(circle, var(--mPrimary), transparent);
		opacity: 0;
		filter: blur(20px);
		transition: opacity 0.4s ease;
		z-index: -1;
	}
	
	.hero-logo:hover {
		transform: scale(1.15) rotate(8deg);
		filter: drop-shadow(0 12px 48px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 60px rgba(255, 245, 155, 0.5));
	}
	
	.hero-logo:hover::after {
		opacity: 0.6;
	}
	
	@keyframes logoFloat {
		0%, 100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-10px) rotate(2deg);
		}
	}
	
	@keyframes logoGlow {
		0%, 100% {
			filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 40px rgba(255, 245, 155, 0.3));
		}
		50% {
			filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 60px rgba(255, 245, 155, 0.5));
		}
	}
	
	.logo-text-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	
	.logo-text {
		display: block;
		font-size: 4.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--mPrimary) 0%, var(--mSecondary) 50%, var(--mTertiary) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.03em;
		line-height: 1;
		text-shadow: 0 0 40px rgba(255, 245, 155, 0.3);
		position: relative;
	}
	
	.logo-subtitle {
		display: block;
		font-size: 0.875rem;
		color: var(--mOnSurfaceVariant);
		font-weight: 300;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		opacity: 0.8;
	}
	
	:global([data-theme='light']) .logo-subtitle {
		color: var(--mPrimary);
		opacity: 1;
		font-weight: 400;
	}
	
	.hero-title {
		font-size: 3.5rem;
		font-weight: 700;
		line-height: 1.1;
		margin-bottom: 2rem;
		color: var(--mOnSurface);
		letter-spacing: -0.02em;
	}
	
	.highlight {
		background: linear-gradient(135deg, var(--mSecondary), var(--mTertiary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		position: relative;
		display: inline-block;
	}
	
	.highlight::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 3px;
		background: linear-gradient(90deg, var(--mSecondary), var(--mTertiary));
		background-size: 200% 100%;
		border-radius: 2px;
		opacity: 0.5;
		animation: shimmer 3s ease-in-out infinite;
		box-shadow: 0 0 10px rgba(169, 174, 254, 0.5);
	}
	
	.hero-description {
		font-size: 1.25rem;
		color: var(--sl-color-text);
		margin-bottom: 2.5rem;
		line-height: 1.7;
		text-shadow: 
			0 2px 12px rgba(0, 0, 0, 0.8),
			0 0 20px rgba(0, 0, 0, 0.4);
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
		font-weight: 400;
		position: relative;
		z-index: 1;
	}
	
	:global([data-theme='light']) .hero-description {
		text-shadow: 
			0 1px 4px rgba(0, 0, 0, 0.1),
			0 0 8px rgba(0, 0, 0, 0.05);
	}
	
	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 3rem;
		flex-wrap: wrap;
	}
	
	.btn-primary {
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary));
		color: var(--mOnPrimary);
		padding: 1.125rem 2.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		border-radius: 0.75rem;
		box-shadow: 0 4px 20px rgba(255, 245, 155, 0.3);
		position: relative;
		overflow: hidden;
	}
	
	.btn-primary::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--mSecondary), var(--mTertiary));
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	
	.btn-primary:hover::before {
		opacity: 1;
	}
	
	.btn-primary span,
	.btn-primary svg {
		position: relative;
		z-index: 1;
	}
	
	.btn-primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(255, 245, 155, 0.4);
	}
	
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1.125rem 2.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		backdrop-filter: blur(10px);
		background: rgba(var(--mSurfaceVariant-rgb, 17, 17, 45), 0.5);
		color: var(--mSecondary);
		border: 2px solid var(--mOutline);
		border-radius: 0.75rem;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
		text-decoration: none;
	}
	
	.btn-secondary::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--mSecondary), var(--mTertiary));
		opacity: 0;
		transition: opacity 0.4s ease;
		z-index: 0;
	}
	
	.btn-secondary svg,
	.btn-secondary span {
		position: relative;
		z-index: 1;
		transition: transform 0.3s ease, color 0.3s ease;
		color: inherit;
	}
	
	.btn-secondary:hover {
		background: linear-gradient(135deg, var(--mSecondary), var(--mTertiary));
		color: var(--mOnSecondary);
		border-color: transparent;
		transform: translateY(-4px) scale(1.02);
		box-shadow: 
			0 12px 40px rgba(169, 174, 254, 0.4),
			0 0 60px rgba(169, 174, 254, 0.2);
	}
	
	.btn-secondary:hover::before {
		opacity: 0;
	}
	
	.btn-secondary:hover svg,
	.btn-secondary:hover span {
		color: var(--mOnSecondary);
		transform: translateX(4px);
	}
	
	.btn-secondary:active {
		transform: translateY(-2px) scale(0.98);
	}
	
	@media (max-width: 768px) {
		.hero {
			min-height: 90vh;
		}
		
		.hero-logo {
			width: 80px;
			height: 80px;
		}
		
		.hero-title {
			font-size: 2rem;
		}
		
		.logo-text {
			font-size: 2.5rem;
		}
		
		.hero-description {
			font-size: 1.125rem;
		}
		
		.hero-actions {
			flex-direction: column;
			align-items: stretch;
		}
		
		.btn-primary,
		.btn-secondary {
			width: 100%;
			justify-content: center;
		}
		
		.orb-1,
		.orb-2,
		.orb-3 {
			width: 300px;
			height: 300px;
		}
	}
</style>

