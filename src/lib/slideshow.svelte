<script lang="ts">
	import { onMount } from 'svelte';
	import type { SlideImage } from '$lib/slideshow-images';

	let {
		images,
		interval = 6000,
		class: className = ''
	}: {
		images: SlideImage[];
		interval?: number;
		class?: string;
	} = $props();

	let active = $state(0);
	/** Slides that are fading out; they keep their animation running until the fade ends. */
	let leaving = $state<number[]>([]);
	let tabHidden = $state(false);
	let reducedMotion = $state(false);
	let el = $state<HTMLElement | null>(null);

	/** Shuffled viewing order (indices into `images`); null until hydration so
	   SSR and the client render the same initial DOM (no hydration mismatch). */
	let order = $state<number[] | null>(null);
	const displayImages = $derived(order ? order.map((i) => images[i]) : images);

	onMount(() => {
		const indices = images.map((_, i) => i);
		// Fisher-Yates shuffle.
		for (let i = indices.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[indices[i], indices[j]] = [indices[j], indices[i]];
		}
		order = indices;
	});

	function goTo(index: number) {
		const n = images.length;
		if (n < 2) return;
		const next = ((index % n) + n) % n;
		if (next === active) return;
		const prev = active;
		active = next;
		leaving = [...leaving, prev];
		// Match the opacity transition duration (1s) plus a small buffer.
		setTimeout(() => {
			leaving = leaving.filter((x) => x !== prev);
		}, 1100);
	}

	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const onChange = (e: MediaQueryListEvent) => (reducedMotion = e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	$effect(() => {
		const onVisibility = () => (tabHidden = document.hidden);
		document.addEventListener('visibilitychange', onVisibility);
		return () => document.removeEventListener('visibilitychange', onVisibility);
	});

	$effect(() => {
		if (images.length < 2 || tabHidden || reducedMotion) return;
		// Depend on `active` so manual navigation restarts the autoplay timer.
		void active;
		const id = setInterval(() => {
			// Pause while the user hovers the frame or has focus inside it.
			if (el && (el.matches(':hover') || el.contains(document.activeElement))) return;
			goTo(active + 1);
		}, interval);
		return () => clearInterval(id);
	});
</script>

{#if images.length > 0}
	<div
		bind:this={el}
		class="slideshow group {className}"
		role="group"
		aria-roledescription="carousel"
		aria-label="Noctalia screenshots"
		style:--slide-duration="{interval + 1000}ms"
	>
		{#each displayImages as image, i (image.src)}
			<div
				class="slideshow__slide {i === active ? 'slideshow__slide--active' : ''} {leaving.includes(
					i
				)
					? 'slideshow__slide--leaving'
					: ''}"
				role="group"
				aria-roledescription="slide"
				aria-label="{i + 1} of {images.length}"
				aria-hidden={i !== active}
			>
				<img
					class="slideshow__backdrop-img"
					src={image.src}
					alt=""
					aria-hidden="true"
					loading={i === 0 ? 'eager' : 'lazy'}
					decoding="async"
					draggable="false"
				/>
				<img
					class="slideshow__img"
					src={image.src}
					alt={image.alt}
					loading={i === 0 ? 'eager' : 'lazy'}
					decoding="async"
					draggable="false"
				/>
			</div>
		{/each}

		{#if images.length > 1}
			<div
				class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent"
				aria-hidden="true"
			></div>

			<button
				type="button"
				class="slideshow__arrow left-3"
				aria-label="Previous slide"
				onclick={() => goTo(active - 1)}
			>
				<i class="ti ti-chevron-left text-xl leading-none" aria-hidden="true"></i>
			</button>
			<button
				type="button"
				class="slideshow__arrow right-3"
				aria-label="Next slide"
				onclick={() => goTo(active + 1)}
			>
				<i class="ti ti-chevron-right text-xl leading-none" aria-hidden="true"></i>
			</button>

			<div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
				{#each displayImages as image, i (image.src)}
					<button
						type="button"
						class="slideshow__dot {i === active ? 'slideshow__dot--active' : ''}"
						aria-label="Go to slide {i + 1}"
						aria-current={i === active ? 'true' : undefined}
						onclick={() => goTo(i)}
					></button>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.slideshow {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		outline: none;
	}

	.slideshow__slide {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 1s ease-in-out;
		pointer-events: none;
	}

	/* Incoming slide crossfades on top of the outgoing one. */
	.slideshow__slide--active {
		opacity: 1;
		z-index: 2;
	}

	/* Outgoing slide: fades out underneath while its drift animation keeps
	   running, so there is no transform snap just before the next slide shows. */
	.slideshow__slide--leaving {
		opacity: 0;
		z-index: 1;
	}

	.slideshow__backdrop-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(48px) brightness(0.45) saturate(1.3);
		transform: scale(1.25);
		user-select: none;
	}

	/* The screenshot itself is always shown in its entirety: contain, never cover.
	   Base transform is the full-frame state, used under reduced motion. */
	.slideshow__img {
		position: relative;
		width: 100%;
		height: 100%;
		object-fit: contain;
		user-select: none;
	}

	/* One continuous drift per slide — no settle, no pause, constant velocity.
	   The scale never exceeds 1, so the full screenshot (bar included) is
	   visible at every moment. Odd slides dolly in, even slides dolly out.
	   Leaving slides keep drifting while they fade out underneath. */
	@media (prefers-reduced-motion: no-preference) {
		.slideshow__slide--active .slideshow__backdrop-img,
		.slideshow__slide--leaving .slideshow__backdrop-img {
			animation: slideshow-drift-backdrop var(--slide-duration, 7s) linear both;
		}

		.slideshow__slide--active .slideshow__img,
		.slideshow__slide--leaving .slideshow__img {
			animation: slideshow-drift-in var(--slide-duration, 7s) linear both;
		}

		.slideshow__slide--active:nth-child(even) .slideshow__img,
		.slideshow__slide--leaving:nth-child(even) .slideshow__img {
			animation-name: slideshow-drift-out;
		}
	}

	@keyframes slideshow-drift-backdrop {
		from {
			transform: scale(1.24);
		}
		to {
			transform: scale(1.32);
		}
	}

	@keyframes slideshow-drift-in {
		from {
			transform: scale(0.94);
		}
		to {
			transform: scale(1);
		}
	}

	@keyframes slideshow-drift-out {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(0.94);
		}
	}

	.slideshow__arrow {
		position: absolute;
		top: 50%;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		margin-top: -1.25rem;
		border-radius: 9999px;
		border: 1px solid rgb(255 255 255 / 0.14);
		background: rgb(0 0 0 / 0.45);
		color: #fff;
		backdrop-filter: blur(6px);
		cursor: pointer;
		opacity: 0;
		transition:
			opacity 0.25s ease,
			background 0.25s ease,
			transform 0.25s ease;
	}

	.slideshow__arrow:hover {
		background: rgb(0 0 0 / 0.65);
		transform: scale(1.06);
	}

	.slideshow__arrow:focus-visible {
		opacity: 1;
		outline: 2px solid rgb(255 255 255 / 0.7);
		outline-offset: 2px;
	}

	.slideshow:hover .slideshow__arrow,
	.slideshow:focus-within .slideshow__arrow {
		opacity: 1;
	}

	.slideshow__dot {
		z-index: 2;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		border: none;
		padding: 0;
		background: rgb(255 255 255 / 0.4);
		cursor: pointer;
		transition:
			background 0.25s ease,
			transform 0.25s ease;
	}

	.slideshow__dot:hover {
		background: rgb(255 255 255 / 0.7);
	}

	.slideshow__dot--active {
		background: #fff;
		transform: scale(1.25);
	}

	.slideshow__dot:focus-visible {
		outline: 2px solid rgb(255 255 255 / 0.7);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.slideshow__slide {
			transition: none;
		}
	}
</style>
