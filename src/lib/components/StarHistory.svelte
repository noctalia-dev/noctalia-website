<script lang="ts">
	import { onMount } from 'svelte';
	import { setupScrollAnimation } from '$lib/utils/scrollAnimations';

	let mounted = $state(false);
	let contentVisible = $state(false);
	let headerRef: HTMLElement;
	let graphRef: HTMLElement;

	onMount(() => {
		mounted = true;
		setTimeout(() => {
			if (!contentVisible) {
				contentVisible = true;
			}
		}, 500);

		setTimeout(() => {
			if (graphRef) {
				setupScrollAnimation(graphRef, (visible) => {
					contentVisible = visible;
				}, { threshold: 0.2 });
			}
		}, 100);
	});
</script>

<section class="star-history" id="stars">
	<div class="container">
		<div class="section-header" class:visible={mounted} bind:this={headerRef}>
			<h2 class="section-title">Star History</h2>
			<p class="section-description">
				Watch the community grow over time
			</p>
		</div>

		<div class="graph-wrapper" class:visible={contentVisible} bind:this={graphRef}>
			<div class="graph-glow"></div>
			<img
				src="https://api.noctalia.dev/stars"
				alt="GitHub star history graph for noctalia-shell"
				class="star-graph"
				loading="lazy"
			/>
		</div>
	</div>
</section>

<style>
	.star-history {
		position: relative;
		overflow: hidden;
		background: linear-gradient(180deg, var(--mSurfaceVariant) 0%, var(--mSurface) 100%);
	}

	.star-history::before {
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
		margin-bottom: 4rem;
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.8s ease, transform 0.8s ease;
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

	.graph-wrapper {
		position: relative;
		border-radius: 1.5rem;
		overflow: hidden;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.3),
			0 0 80px rgba(169, 174, 254, 0.1);
		border: 1px solid var(--mOutline);
		background: var(--mSurface);
		transition: transform 0.5s ease, box-shadow 0.5s ease;
		opacity: 0;
		transform: translateY(40px);
		transition: opacity 1s ease 0.2s, transform 1s ease 0.2s;
	}

	.graph-wrapper.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.graph-wrapper:hover {
		box-shadow:
			0 24px 70px rgba(0, 0, 0, 0.35),
			0 0 100px rgba(169, 174, 254, 0.15);
	}

	.graph-glow {
		position: absolute;
		inset: -2px;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary), var(--mTertiary));
		opacity: 0;
		filter: blur(30px);
		z-index: -1;
		transition: opacity 0.5s ease;
		animation: pulse 3s ease-in-out infinite;
	}

	.graph-wrapper:hover .graph-glow {
		opacity: 0.3;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 0.1;
		}
		50% {
			opacity: 0.2;
		}
	}

	.star-graph {
		width: 100%;
		height: auto;
		display: block;
		border-radius: 1.5rem;
	}

	@media (max-width: 768px) {
		.section-title {
			font-size: 2rem;
		}
	}
</style>
