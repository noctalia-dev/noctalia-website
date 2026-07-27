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
	let hovered = $state(false);
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

	/** True only for keyboard focus — a mouse click on a dot/arrow leaves focus
	  on the button, which would otherwise pause autoplay forever. */
	function keyboardFocusInside() {
		const ae = document.activeElement;
		return !!el && !!ae && el.contains(ae) && ae.matches(':focus-visible');
	}

	// --- Autoplay -------------------------------------------------------------
	// setTimeout chain (not setInterval) so the countdown can freeze on hover /
	// tab-hidden and later resume with the time that was actually left, instead
	// of restarting a full interval (which looked stuck: the drift animation had
	// already finished while hovered, then nothing moved for a whole cycle).
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	let dueAt = 0;
	/** ms left until the next advance; meaningful while the timer is stopped.
	   Set to a full cycle whenever a new slide is scheduled (see the effect). */
	let remaining = 0;
	/** Slide the current timer/`remaining` belongs to; -1 = none scheduled yet. */
	let scheduledFor = -1;

	function stopTimer() {
		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
			timeoutId = undefined;
		}
	}

	function startTimer(ms: number) {
		stopTimer();
		dueAt = Date.now() + ms;
		timeoutId = setTimeout(onAutoplayTick, ms);
	}

	function onAutoplayTick() {
		timeoutId = undefined;
		// Keyboard focus on a dot/arrow pauses autoplay; retry a full cycle later
		// instead of advancing under the user's fingers.
		if (keyboardFocusInside()) {
			startTimer(interval);
			return;
		}
		goTo(active + 1); // changes `active`, which re-arms the timer via the effect
	}

	$effect(() => {
		const slide = active; // depend on `active`: navigation restarts the cycle
		if (scheduledFor !== slide) {
			scheduledFor = slide;
			remaining = interval;
		}
		if (images.length < 2 || tabHidden || reducedMotion || hovered) return;
		startTimer(remaining);
		return () => {
			// Freezing (hover, hidden tab, …): keep whatever time was left so a
			// later resume continues the cycle from where it stopped.
			remaining = Math.max(dueAt - Date.now(), 0);
			stopTimer();
		};
	});

	function onMouseLeave() {
		// Just unpause — the autoplay effect resumes the countdown with the time
		// that was left when the hover started. Never advance here: page zoom
		// moves the element out from under the cursor and would force a new image
		// on every zoom step.
		hovered = false;
	}
</script>

{#if images.length > 0}
	<div
		bind:this={el}
		class="slideshow group {className}"
		role="group"
		aria-roledescription="carousel"
		aria-label="Noctalia screenshots"
		style:--slide-duration="{interval + 1000}ms"
		onmouseenter={() => (hovered = true)}
		onmouseleave={onMouseLeave}
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
		/* Corner rounding for the screenshots and the outer frame (via overflow:
		   hidden). Inherited from the card wrapper in home-page.svelte when used
		   there; the fallback keeps standalone usage rounded too. Override on the
		   component or an ancestor to test different values. */
		border-radius: var(--slideshow-corner-radius, 0.75rem);
	}

	.slideshow__slide {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
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

	/* The screenshot is sized by its intrinsic aspect ratio (like object-fit:
	   contain) so the element box hugs the image exactly. That lets the
	   border-radius mask the actual image corners — hiding the black corners
	   some screenshots have — regardless of aspect ratio (16:9, 16:10, 4:3…). */
	.slideshow__img {
		position: relative;
		max-width: 100%;
		max-height: 100%;
		border-radius: var(--slideshow-corner-radius, 0.75rem);
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

		/* Freeze the drift while hovered, in lockstep with the JS countdown, so
		   the slide visibly continues from where it stopped on mouse leave. */
		.slideshow:hover .slideshow__backdrop-img,
		.slideshow:hover .slideshow__img {
			animation-play-state: paused;
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
