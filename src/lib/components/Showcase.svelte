<script lang="ts">
	import { onMount } from 'svelte';
	import { setupScrollAnimation } from '$lib/utils/scrollAnimations';
	
	let mounted = $state(false);
	let contentVisible = $state(false);
	let showcaseRef: HTMLElement;
	let imageRef: HTMLElement;
	let videoRef: HTMLVideoElement;
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let isDragging = $state(false);
	let isFullscreen = $state(false);
	
	function toggleFullscreen() {
		if (!videoRef) return;
		
		if (!document.fullscreenElement) {
			videoRef.requestFullscreen().then(() => {
				isFullscreen = true;
			}).catch(() => {
				// Fullscreen not supported or denied
			});
		} else {
			document.exitFullscreen().then(() => {
				isFullscreen = false;
			});
		}
	}
	
	onMount(() => {
		mounted = true;
		// Fallback: show content after a short delay if scroll detection doesn't work
		setTimeout(() => {
			if (!contentVisible) {
				contentVisible = true;
			}
		}, 500);
		
		setTimeout(() => {
			if (imageRef) {
				setupScrollAnimation(imageRef, (visible) => {
					contentVisible = visible;
				}, { threshold: 0.2 });
			}
		}, 100);
		
		// Setup video event listeners after a short delay to ensure videoRef is bound
		setTimeout(() => {
			if (videoRef) {
				videoRef.addEventListener('loadedmetadata', () => {
					duration = videoRef.duration;
				});
				videoRef.addEventListener('timeupdate', () => {
					if (!isDragging) {
						currentTime = videoRef.currentTime;
					}
				});
				videoRef.addEventListener('play', () => {
					isPlaying = true;
				});
				videoRef.addEventListener('pause', () => {
					isPlaying = false;
				});
				
				// Listen for fullscreen changes
				document.addEventListener('fullscreenchange', () => {
					isFullscreen = !!document.fullscreenElement;
				});
			}
		}, 200);
	});
	
	function togglePlay() {
		if (videoRef) {
			if (isPlaying) {
				videoRef.pause();
			} else {
				videoRef.play();
			}
		}
	}
	
	function handleProgressClick(e: MouseEvent) {
		if (!videoRef || !duration) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		videoRef.currentTime = percent * duration;
		currentTime = videoRef.currentTime;
	}
	
	function handleMouseDown(e: MouseEvent) {
		if (!videoRef || !duration) return;
		isDragging = true;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		videoRef.currentTime = percent * duration;
		currentTime = videoRef.currentTime;
		
		const handleMouseMove = (moveEvent: MouseEvent) => {
			const newRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			const newPercent = Math.max(0, Math.min(1, (moveEvent.clientX - newRect.left) / newRect.width));
			videoRef.currentTime = newPercent * duration;
			currentTime = videoRef.currentTime;
		};
		
		const handleMouseUp = () => {
			isDragging = false;
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
		
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	}
	
	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
	
	const videoUrl = 'https://github.com/user-attachments/assets/bf46f233-8d66-439a-a1ae-ab0446270f2d';
</script>

<section class="showcase" bind:this={showcaseRef}>
	<div class="container">
		<div class="showcase-header" class:visible={mounted}>
			<h2 class="section-title">See It In Action</h2>
			<p class="section-description">
				Experience the beauty and simplicity of Noctalia's minimalist design
			</p>
		</div>
		
		<div class="showcase-content" class:visible={contentVisible} bind:this={imageRef}>
			<div class="showcase-image-wrapper">
				<div class="showcase-glow"></div>
				<video 
					src={videoUrl}
					loop
					muted
					playsinline
					preload="metadata"
					class="showcase-video"
					bind:this={videoRef}
					onclick={togglePlay}
				>
					Your browser does not support the video tag.
				</video>
				{#if !isPlaying}
					<div class="video-preview-overlay" onclick={togglePlay}>
						<div class="preview-play-button">
							<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<polygon points="5 3 19 12 5 21 5 3"></polygon>
							</svg>
						</div>
					</div>
				{/if}
				<div class="video-controls">
					<button class="play-pause-btn" onclick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
						{#if isPlaying}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="6" y="4" width="4" height="16"></rect>
								<rect x="14" y="4" width="4" height="16"></rect>
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<polygon points="5 3 19 12 5 21 5 3"></polygon>
							</svg>
						{/if}
					</button>
					<div class="progress-container">
						<div 
							class="progress-bar"
							onclick={handleProgressClick}
							onmousedown={handleMouseDown}
							role="slider"
							aria-valuemin="0"
							aria-valuemax={duration}
							aria-valuenow={currentTime}
							tabindex="0"
						>
							<div class="progress-track"></div>
							<div class="progress-filled" style="width: {duration ? (currentTime / duration) * 100 : 0}%"></div>
							<div class="progress-handle" style="left: {duration ? (currentTime / duration) * 100 : 0}%"></div>
						</div>
						<div class="time-display">
							<span>{formatTime(currentTime)}</span>
							<span>{formatTime(duration)}</span>
						</div>
					</div>
					<button class="fullscreen-btn" onclick={toggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
						{#if isFullscreen}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.showcase {
		position: relative;
		padding: 6rem 0;
		background: linear-gradient(180deg, var(--mSurface) 0%, var(--mSurfaceVariant) 100%);
		overflow: hidden;
	}
	
	.showcase::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--mOutline), transparent);
	}
	
	.showcase-header {
		text-align: center;
		margin-bottom: 4rem;
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.8s ease, transform 0.8s ease;
	}
	
	.showcase-header.visible {
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
	
	.showcase-content {
		opacity: 0;
		transform: translateY(40px);
		transition: opacity 1s ease 0.2s, transform 1s ease 0.2s;
	}
	
	.showcase-content.visible {
		opacity: 1;
		transform: translateY(0);
	}
	
	.showcase-image-wrapper {
		position: relative;
		border-radius: 1.5rem;
		overflow: hidden;
		box-shadow: 
			0 20px 60px rgba(0, 0, 0, 0.3),
			0 0 80px rgba(169, 174, 254, 0.1);
		border: 1px solid var(--mOutline);
		background: var(--mSurface);
		transition: transform 0.5s ease, box-shadow 0.5s ease;
	}
	
	.showcase-image-wrapper:hover {
		transform: translateY(-8px) scale(1.01);
		box-shadow: 
			0 30px 80px rgba(0, 0, 0, 0.4),
			0 0 120px rgba(169, 174, 254, 0.2);
	}
	
	.showcase-glow {
		position: absolute;
		inset: -2px;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary), var(--mTertiary));
		opacity: 0;
		filter: blur(30px);
		z-index: -1;
		transition: opacity 0.5s ease;
		animation: pulse 3s ease-in-out infinite;
	}
	
	.showcase-image-wrapper:hover .showcase-glow {
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
	
	.showcase-video {
		width: 100%;
		height: auto;
		display: block;
		transition: transform 0.5s ease;
		border-radius: 1.5rem;
		background: var(--mSurface);
	}
	
	.showcase-image-wrapper:hover .showcase-video {
		transform: scale(1.02);
	}
	
	.video-preview-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, color-mix(in srgb, var(--mSurface) 70%, transparent 30%), color-mix(in srgb, var(--mSurfaceVariant) 70%, transparent 30%));
		backdrop-filter: blur(2px);
		cursor: pointer;
		transition: all 0.3s ease;
		border-radius: 1.5rem;
		z-index: 1;
	}
	
	.video-preview-overlay:hover {
		background: linear-gradient(135deg, color-mix(in srgb, var(--mSurface) 50%, transparent 50%), color-mix(in srgb, var(--mSurfaceVariant) 50%, transparent 50%));
	}
	
	.preview-play-button {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary));
		color: var(--mOnPrimary);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 
			0 8px 32px rgba(255, 245, 155, 0.4),
			0 0 0 4px color-mix(in srgb, var(--mSurface) 30%, transparent 70%);
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}
	
	.video-preview-overlay:hover .preview-play-button {
		transform: scale(1.1);
		box-shadow: 
			0 12px 40px rgba(255, 245, 155, 0.5),
			0 0 0 4px color-mix(in srgb, var(--mSurface) 40%, transparent 60%);
	}
	
	.preview-play-button svg {
		width: 32px;
		height: 32px;
		margin-left: 4px; /* Slight offset for visual centering of play icon */
	}
	
	.video-controls {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1.5rem;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 70%, transparent 100%);
		backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		gap: 1rem;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}
	
	.showcase-image-wrapper:hover .video-controls,
	.video-controls:hover {
		opacity: 1;
		pointer-events: all;
	}
	
	.progress-bar,
	.play-pause-btn {
		pointer-events: all;
	}
	
	.play-pause-btn,
	.fullscreen-btn {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--mSurface) 95%, var(--mSurfaceVariant) 5%);
		border: 2px solid var(--mOutline);
		color: var(--mSecondary);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		flex-shrink: 0;
		padding: 0;
		margin: 0;
	}
	
	.play-pause-btn svg,
	.fullscreen-btn svg {
		display: block;
		width: 20px;
		height: 20px;
		margin: 0;
		padding: 0;
	}
	
	.play-pause-btn:hover,
	.fullscreen-btn:hover {
		background: linear-gradient(135deg, var(--mSecondary), var(--mTertiary));
		color: var(--mOnSecondary);
		border-color: transparent;
		transform: scale(1.1);
		box-shadow: 0 4px 20px rgba(169, 174, 254, 0.4);
	}
	
	.progress-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.progress-bar {
		position: relative;
		height: 6px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 3px;
		cursor: pointer;
		overflow: visible;
	}
	
	.progress-track {
		position: absolute;
		inset: 0;
		border-radius: 3px;
	}
	
	.progress-filled {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: linear-gradient(90deg, var(--mSecondary), var(--mTertiary));
		border-radius: 3px;
		transition: width 0.1s linear;
	}
	
	.progress-handle {
		position: absolute;
		top: 50%;
		width: 14px;
		height: 14px;
		background: var(--mSecondary);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0 0 8px rgba(169, 174, 254, 0.6);
		opacity: 0;
		transition: opacity 0.2s ease, transform 0.2s ease;
	}
	
	.progress-bar:hover .progress-handle {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1.2);
	}
	
	.time-display {
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
	}
	
	@media (max-width: 768px) {
		.showcase {
			padding: 4rem 0;
		}
		
		.section-title {
			font-size: 2rem;
		}
		
		.showcase-features {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
		
		.video-controls {
			padding: 1rem;
		}
		
		.play-pause-btn,
		.fullscreen-btn {
			width: 40px;
			height: 40px;
		}
		
		.play-pause-btn svg,
		.fullscreen-btn svg {
			width: 18px;
			height: 18px;
		}
	}
</style>

