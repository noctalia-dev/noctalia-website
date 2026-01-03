<script lang="ts">
	import { onMount } from 'svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Features from '$lib/components/Features.svelte';
	import Showcase from '$lib/components/Showcase.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ScrollToTop from '$lib/components/ScrollToTop.svelte';
	
	let { data } = $props<{ data: { pluginCount: number; releaseCount: number } }>();
	
	let navRef: HTMLElement;
	let scrolled = $state(false);
	
	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};
		
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<nav class="nav fade-in" class:scrolled={scrolled} bind:this={navRef}>
	<div class="nav-container">
		<a href="/" class="nav-brand">
			<img src="https://assets.noctalia.dev/noctalia-logo.svg" alt="Noctalia" class="nav-logo" />
			<div class="nav-brand-text">
				<span class="logo">Noctalia</span>
				<span class="tagline">quiet by design</span>
			</div>
		</a>
		<div class="nav-links">
			<a href="/" class="nav-link active">Home</a>
			<a href="/plugins" class="nav-link">Plugins</a>
			<a href="/themes" class="nav-link">Themes</a>
		</div>
		<ThemeToggle />
	</div>
</nav>

<Hero />
<Showcase />
<Features pluginCount={data.pluginCount} releaseCount={data.releaseCount} />
<Footer />
<ScrollToTop />

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 100;
		border-bottom: 1px solid var(--mOutline);
		backdrop-filter: blur(20px) saturate(180%);
		background: rgba(var(--mSurface-rgb, 7, 7, 34), 0.7);
		box-shadow: 
			0 4px 24px rgba(0, 0, 0, 0.1),
			0 0 0 1px rgba(255, 255, 255, 0.05) inset;
		transition: all 0.3s ease;
	}
	
	:global([data-theme='light']) .nav {
		background: rgba(230, 232, 250, 0.85);
		box-shadow: 
			0 4px 24px rgba(0, 0, 0, 0.05),
			0 0 0 1px rgba(107, 114, 212, 0.2) inset;
	}
	
	.nav.scrolled {
		background: rgba(var(--mSurface-rgb, 7, 7, 34), 0.9);
		box-shadow: 
			0 8px 32px rgba(0, 0, 0, 0.2),
			0 0 0 1px rgba(255, 255, 255, 0.08) inset;
	}
	
	:global([data-theme='light']) .nav.scrolled {
		background: rgba(230, 232, 250, 0.95);
		box-shadow: 
			0 8px 32px rgba(0, 0, 0, 0.1),
			0 0 0 1px rgba(107, 114, 212, 0.3) inset;
	}
	
	.nav::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, 
			transparent, 
			var(--mOutline), 
			var(--mSecondary), 
			var(--mOutline), 
			transparent
		);
		opacity: 0.5;
	}
	
	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
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
	
	@media (max-width: 768px) {
		.nav-container {
			padding: 1rem;
		}
		
		.nav-logo {
			width: 32px;
			height: 32px;
		}
		
		.logo {
			font-size: 1.25rem;
		}
		
		.tagline {
			font-size: 0.625rem;
		}
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
	
	:global([data-theme='light']) .nav-link.active {
		color: var(--mPrimary);
		background: rgba(93, 101, 245, 0.1);
		box-shadow: 0 2px 8px rgba(93, 101, 245, 0.15);
	}
	
	:global([data-theme='light']) .nav-link.active::after {
		background: linear-gradient(90deg, var(--mPrimary), var(--mPrimary));
		box-shadow: 0 0 8px rgba(93, 101, 245, 0.4);
	}
	
	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}
	}
</style>
