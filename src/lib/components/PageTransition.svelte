<script lang="ts">
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	
	let isNavigating = $state(false);
	let showLoader = $state(false);
	
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	
	$effect(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
		
		if ($navigating) {
			showLoader = true;
			// Small delay to ensure smooth transition
			timeoutId = setTimeout(() => {
				isNavigating = true;
			}, 10);
		} else if (showLoader) {
			// Delay hiding to allow animation to complete
			isNavigating = false;
			timeoutId = setTimeout(() => {
				showLoader = false;
			}, 400);
		}
		
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});
</script>

{#if showLoader}
	<div class="page-transition" class:active={isNavigating}>
		<div class="loader-container">
			<div class="logo-loader">
				<img src="https://assets.noctalia.dev/noctalia-logo.svg" alt="Noctalia" />
			</div>
			<div class="loader-text">Noctalia</div>
			<div class="loader-dots">
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dot"></div>
			</div>
		</div>
		<div class="loader-background"></div>
	</div>
{/if}

<style>
	.page-transition {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	.page-transition.active {
		opacity: 1;
		pointer-events: all;
	}
	
	.loader-background {
		position: absolute;
		inset: 0;
		background: var(--mSurface);
		backdrop-filter: blur(30px) saturate(180%);
		opacity: 0.98;
		animation: backgroundFade 0.4s ease;
	}
	
	@keyframes backgroundFade {
		from {
			opacity: 0;
		}
		to {
			opacity: 0.98;
		}
	}
	
	.loader-container {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		transform: scale(0.8) translateY(20px);
		opacity: 0;
		transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
	}
	
	.page-transition.active .loader-container {
		transform: scale(1) translateY(0);
		opacity: 1;
	}
	
	.logo-loader {
		width: 80px;
		height: 80px;
		position: relative;
		animation: logoSpin 3s ease-in-out infinite;
		filter: drop-shadow(0 0 20px rgba(255, 245, 155, 0.5)) drop-shadow(0 0 40px rgba(169, 174, 254, 0.3));
	}
	
	.logo-loader img {
		width: 100%;
		height: 100%;
		animation: logoFloat 2s ease-in-out infinite;
		transition: transform 0.3s ease;
	}
	
	.page-transition.active .logo-loader img {
		animation: logoFloat 2s ease-in-out infinite, logoPulse 2s ease-in-out infinite;
	}
	
	@keyframes logoPulse {
		0%, 100% {
			filter: brightness(1);
		}
		50% {
			filter: brightness(1.2);
		}
	}
	
	@keyframes logoSpin {
		0%, 100% {
			transform: rotate(0deg) scale(1);
		}
		25% {
			transform: rotate(5deg) scale(1.1);
		}
		50% {
			transform: rotate(0deg) scale(1.05);
		}
		75% {
			transform: rotate(-5deg) scale(1.1);
		}
	}
	
	@keyframes logoFloat {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
	
	.loader-text {
		font-size: 1.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary), var(--mTertiary));
		background-size: 200% 200%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.02em;
		animation: textShimmer 2s ease-in-out infinite;
	}
	
	@keyframes textShimmer {
		0%, 100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}
	
	.loader-dots {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}
	
	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary));
		animation: dotBounce 1.4s ease-in-out infinite;
		box-shadow: 0 0 10px rgba(255, 245, 155, 0.5);
	}
	
	.dot:nth-child(1) {
		animation-delay: 0s;
	}
	
	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}
	
	.dot:nth-child(3) {
		animation-delay: 0.4s;
	}
	
	@keyframes dotBounce {
		0%, 80%, 100% {
			transform: translateY(0) scale(1);
			opacity: 0.7;
		}
		40% {
			transform: translateY(-20px) scale(1.2);
			opacity: 1;
		}
	}
</style>

