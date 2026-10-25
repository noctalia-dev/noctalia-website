<script lang="ts">
	import { onMount } from 'svelte';
	import LayoutShowcase from '$lib/umbriel/LayoutShowcase.svelte';

	let frame = $state<HTMLDivElement>();
	let phase = $state(0);
	let paused = $state(false);
	let reducedMotion = $state(true);
	let visible = $state(false);
	let pageVisible = $state(true);
	let clockTime = $state('--:--');
	let clockDate = $state('');
	const captions = [
		'Choose your session.',
		'From login to desktop.',
		'Your windows, in a scrolling workspace.'
	];

	onMount(() => {
		const timeFormatter = new Intl.DateTimeFormat(undefined, {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
		const dateFormatter = new Intl.DateTimeFormat(undefined, {
			weekday: 'long',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
		const updateClock = () => {
			const now = new Date();
			clockTime = timeFormatter.format(now);
			clockDate = dateFormatter.format(now);
		};
		updateClock();
		const clockTimer = window.setInterval(updateClock, 1000);
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => {
			reducedMotion = preference.matches;
			if (reducedMotion) phase = 0;
		};
		const updateVisibility = () => {
			pageVisible = !document.hidden;
			if (pageVisible) updateClock();
		};
		updatePreference();
		updateVisibility();
		preference.addEventListener('change', updatePreference);
		document.addEventListener('visibilitychange', updateVisibility);
		const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
			threshold: 0.25
		});
		if (frame) observer.observe(frame);
		return () => {
			window.clearInterval(clockTimer);
			preference.removeEventListener('change', updatePreference);
			document.removeEventListener('visibilitychange', updateVisibility);
			observer.disconnect();
		};
	});

	$effect(() => {
		const currentPhase = phase;
		if (paused || reducedMotion || !visible || !pageVisible) return;
		const timer = window.setTimeout(
			() => (phase = (currentPhase + 1) % 3),
			[2800, 1100, 4600][currentPhase]
		);
		return () => window.clearTimeout(timer);
	});
</script>

<div
	class="greeter-preview"
	bind:this={frame}
	data-greeter-phase={phase}
	class:is-paused={paused || !visible || !pageVisible}
	class:reduced-motion={reducedMotion}
>
	<div class="preview-label">
		<span></span> From sign-in to your space <span class="preview-code">GREETER / 03</span>
	</div>
	<div
		class="welcome"
		role="img"
		aria-label="Illustration based on Noctalia Greeter’s actual interface: a clock above the centered user and password panel, a session selector below, a color scheme control at the top right, and power controls at the bottom right. The sequence then shows the same scrolling Umbriel layout, with windows arranged in a horizontal ribbon."
	>
		<div class="scene" aria-hidden="true">
			<!-- Login layout mirrors GreeterSurface::layoutScene; the desktop reuses Umbriel’s demo. -->
			<div class="login-scene">
				<div class="scheme-selector">
					<i class="ti ti-palette"></i><i class="ti ti-chevron-down"></i>
				</div>
				<div class="greeter-clock"><span>{clockTime}</span><span>{clockDate}</span></div>
				<div class="login-panel">
					<span class="back-arrow"><i class="ti ti-arrow-left"></i></span>
					<div class="user-identity"><i class="ti ti-user"></i><span>noctalia</span></div>
					<div class="password-row">
						<div class="password-field"><span class="input-caret"></span>Type password</div>
						<span class="login-arrow"><i class="ti ti-arrow-right"></i></span>
					</div>
					<div class="session-selector">
						<i class="ti ti-device-desktop"></i><span>Umbriel</span><i class="ti ti-chevron-down"
						></i>
					</div>
				</div>
				<img
					class="greeter-brand"
					src="https://assets.noctalia.dev/noctalia-logo.svg"
					alt=""
					width="64"
					height="64"
					loading="lazy"
				/>
				<div class="power-controls">
					<span><i class="ti ti-reload"></i></span><span><i class="ti ti-power"></i></span>
				</div>
			</div>
			<div class="desktop-scene">
				<LayoutShowcase
					compact
					presentation
					playing={!paused && visible && pageVisible && phase === 2}
				/>
			</div>
		</div>
	</div>
	<div class="preview-caption">
		<a href="/greeter"
			>Greeter → Umbriel <span class="illustration-label">· illustration</span>
			<span aria-hidden="true">↗</span></a
		>
		{#if reducedMotion}
			<span class="motion-status">Reduced motion</span>
		{:else}
			<button
				class="greeter-motion-toggle"
				type="button"
				aria-label={paused ? 'Play Greeter animation' : 'Pause Greeter animation'}
				aria-pressed={paused}
				onclick={() => (paused = !paused)}
				><span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>{paused ? 'Play' : 'Pause'}</button
			>
		{/if}
	</div>
	<p class="sequence-label" aria-hidden="true">
		{reducedMotion ? 'Sign in with Greeter. Arrive in Umbriel.' : captions[phase]}
	</p>
</div>

<style>
	.greeter-preview {
		display: block;
		width: 100%;
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: var(--color-void-deep);
		font-family: inherit;
	}
	.preview-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.9rem 1rem;
		border-bottom: 1px solid var(--color-border);
		font-size: 0.6rem;
		color: var(--color-fg-dim);
	}
	.preview-label > span:first-child {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--color-accent-2);
	}
	.preview-code {
		margin-left: auto;
	}
	.welcome {
		position: relative;
		overflow: hidden;
		aspect-ratio: 16 / 9;
		background: color-mix(in srgb, var(--color-surface) 75%, var(--color-void-deep));
		container-type: inline-size;
	}
	.scene {
		position: absolute;
		inset: 0;
	}
	/* Geometry follows greeter_surface.cpp at a 960 × 540 logical viewport. */
	.login-scene {
		--greeter-surface: #070722;
		--greeter-surface-variant: #11112d;
		--greeter-outline: #21215f;
		--greeter-fg: #f3edf7;
		--greeter-muted: #7c80b4;
		--greeter-primary: #fff59b;
		position: absolute;
		inset: 0;
		background: var(--greeter-surface);
		color: var(--greeter-fg);
		transition: opacity 450ms ease;
	}
	.scheme-selector {
		position: absolute;
		top: 1.667cqw;
		right: 1.667cqw;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 6.25cqw;
		height: 3.125cqw;
		padding-inline: 1.25cqw;
		border: 1px solid var(--greeter-outline);
		border-radius: 0.9375cqw;
		background: var(--greeter-surface-variant);
		color: var(--greeter-muted);
		font-size: 1.458cqw;
	}
	.greeter-clock {
		position: absolute;
		left: 50%;
		bottom: calc(50% + 15.312cqw);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.417cqw;
		transform: translateX(-50%);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.greeter-clock > span:first-child {
		font-size: 5cqw;
		font-weight: 400;
		line-height: 1.15;
	}
	.greeter-clock > span:last-child {
		font-size: 1.458cqw;
		line-height: 1.25;
		color: var(--greeter-muted);
	}
	.login-panel {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 45.833cqw;
		padding: 1.667cqw;
		border: 1px solid var(--greeter-outline);
		border-radius: 1.25cqw;
		background: var(--greeter-surface-variant);
		transform: translate(-50%, -50%);
	}
	.back-arrow {
		position: absolute;
		top: 1.667cqw;
		left: 1.667cqw;
		display: grid;
		place-items: center;
		width: 3.75cqw;
		height: 3.75cqw;
		border: 1px solid var(--greeter-outline);
		border-radius: 0.625cqw;
		font-size: 1.667cqw;
	}
	.user-identity {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 0.833cqw;
		padding-bottom: 2.292cqw;
	}
	.user-identity > i {
		display: grid;
		place-items: center;
		height: 6.667cqw;
		font-size: 6.667cqw;
		line-height: 1;
	}
	.user-identity > span {
		margin-top: 1.25cqw;
		font-size: 1.667cqw;
		font-weight: 700;
		line-height: 2.083cqw;
	}
	.password-row {
		display: flex;
		gap: 0.833cqw;
		height: 3.75cqw;
	}
	.password-field {
		position: relative;
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
		padding-inline: 1.458cqw;
		border: 1px solid var(--greeter-primary);
		border-radius: 0.625cqw;
		background: var(--greeter-surface);
		color: var(--greeter-muted);
		font-size: 1.458cqw;
	}
	.input-caret {
		position: absolute;
		left: 1.458cqw;
		top: 1.05cqw;
		width: 1px;
		height: 1.667cqw;
		background: var(--greeter-primary);
	}
	.login-arrow {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 3.75cqw;
		height: 3.75cqw;
		border-radius: 0.625cqw;
		background: var(--greeter-primary);
		color: #0e0e43;
		font-size: 1.667cqw;
	}
	.session-selector {
		display: flex;
		align-items: center;
		gap: 0.833cqw;
		height: 4.583cqw;
		margin-top: 0.833cqw;
		padding-inline: 1.25cqw;
		border: 1px solid var(--greeter-outline);
		border-radius: 0.9375cqw;
		background: var(--greeter-surface);
		font-size: 1.458cqw;
	}
	.session-selector > i {
		color: var(--greeter-muted);
	}
	.session-selector > i:last-child {
		margin-left: auto;
	}
	.greeter-brand {
		position: absolute;
		left: 50%;
		bottom: 1.667cqw;
		width: 6.667cqw;
		height: 6.667cqw;
		transform: translateX(-50%);
	}
	.power-controls {
		position: absolute;
		right: 1.667cqw;
		bottom: 1.667cqw;
		display: flex;
		gap: 0.833cqw;
	}
	.power-controls > span {
		display: grid;
		place-items: center;
		width: 3.75cqw;
		height: 3.75cqw;
		border: 1px solid var(--greeter-outline);
		border-radius: 50%;
		background: color-mix(in srgb, var(--greeter-surface) 78%, transparent);
		font-size: 1.875cqw;
	}
	[data-greeter-phase='1'] .login-scene {
		opacity: 0.65;
	}
	[data-greeter-phase='2'] .login-scene {
		opacity: 0;
	}
	.desktop-scene {
		position: absolute;
		inset: 0;
		opacity: 0;
		pointer-events: none;
		transition: opacity 450ms ease;
	}
	[data-greeter-phase='2'] .desktop-scene {
		opacity: 1;
	}

	.preview-caption {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem 0;
		font-size: 0.65rem;
		color: var(--color-fg-dim);
	}
	.preview-caption a {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding-block: 0.25rem;
		border-radius: 2px;
	}
	.preview-caption a > span:last-child {
		margin-left: 0.4rem;
		color: var(--color-accent);
	}
	.preview-caption a:hover {
		color: var(--color-accent-2);
	}
	.illustration-label {
		color: var(--color-fg-dim);
	}
	.greeter-motion-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		flex-shrink: 0;
		padding: 0.25rem;
		border-radius: 2px;
		font: inherit;
		color: var(--color-fg-dim);
		cursor: pointer;
	}
	.greeter-motion-toggle:hover {
		color: var(--color-accent-2);
	}
	.sequence-label {
		padding: 0.3rem 1rem 0.9rem;
		font-size: 0.6rem;
		color: var(--color-fg-dim);
	}
	.motion-status {
		font-size: 0.6rem;
	}
	@media (prefers-reduced-motion: reduce) {
		.greeter-preview *,
		.greeter-preview *::before {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (max-width: 420px) {
		.preview-caption {
			gap: 0.4rem;
			padding-inline: 0.8rem;
		}
		.preview-caption a {
			gap: 0.2rem;
		}
		.sequence-label {
			padding-inline: 0.8rem;
		}
	}
</style>
