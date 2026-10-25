<script lang="ts">
	import { onMount } from 'svelte';

	let {
		compact = false,
		presentation = false,
		playing = true,
		href
	}: { compact?: boolean; presentation?: boolean; playing?: boolean; href?: string } = $props();

	type LayoutId = 'scrolling' | 'dwindle' | 'master' | 'floating';
	type Rectangle = { x: number; y: number; w: number; h: number };

	const layouts: { id: LayoutId; name: string; hint: string; description: string }[] = [
		{
			id: 'scrolling',
			name: 'Scrolling',
			hint: 'Follow your focus',
			description:
				'Keep your windows in a horizontal ribbon. Move to the next app and the workspace follows, giving each window room to breathe.'
		},
		{
			id: 'dwindle',
			name: 'Dwindle',
			hint: 'Make room as you go',
			description:
				'Open a window and split the available space. Each new app gets its own place, with no windows covering one another.'
		},
		{
			id: 'master',
			name: 'Master',
			hint: 'One task, front and center',
			description:
				'Give your main app the larger area and keep the others beside it. Swap a different window into the main area whenever your focus changes.'
		},
		{
			id: 'floating',
			name: 'Floating',
			hint: 'A familiar kind of freedom',
			description:
				'Move and resize windows wherever you like, just as on a traditional desktop. Snap them to an edge when you want a little more order.'
		}
	];

	const apps = [
		{ name: 'Browser', icon: 'ti-world', tone: 'mint' },
		{ name: 'Editor', icon: 'ti-code', tone: 'gold' },
		{ name: 'Files', icon: 'ti-folder', tone: 'lavender' },
		{ name: 'Terminal', icon: 'ti-terminal-2', tone: 'mint' },
		{ name: 'Notes', icon: 'ti-notes', tone: 'gold' }
	];

	let selected = $state<LayoutId>('scrolling');
	let phase = $state(0);
	let paused = $state(false);
	/** Compact mode tours every layout until the visitor picks one. */
	let pinned = $state(false);
	/** Home-page card: compact, interactive, and the desktop doubles as the card. */
	const card = $derived(compact && !presentation);
	const stepMs = $derived(card ? 1100 : 1700);
	const touring = $derived(card && !pinned);
	let reducedMotion = $state(true);
	let visible = $state(false);
	let frame = $state<HTMLDivElement>();
	let workspace = $state<HTMLDivElement>();
	let selectionAnimation: Animation | undefined;
	const layoutId = $derived(presentation ? 'scrolling' : selected);
	const active = $derived(layouts.find((layout) => layout.id === layoutId)!);
	const cycleLength = $derived(layoutId === 'dwindle' ? 5 : layoutId === 'master' ? 4 : 3);
	const displayPhase = $derived(reducedMotion ? cycleLength - 1 : phase);
	const demoApps = $derived(layoutId === 'dwindle' ? apps : apps.slice(0, 4));
	const visibleWindowCount = $derived(
		layoutId === 'master' || layoutId === 'dwindle' ? displayPhase + 1 : 4
	);
	const focused = $derived(displayPhase);
	const progress = $derived(
		layoutId === 'scrolling'
			? [
					'Start with a little space.',
					'Your next window comes into view.',
					'Keep going. There’s room ahead.'
				][displayPhase]
			: layoutId === 'dwindle'
				? [
						'One window. All the space.',
						'Open another. Split the workspace.',
						'The next window divides the right side.',
						'Keep splitting the newest space.',
						'Five windows. Every one has a place.'
					][displayPhase]
				: layoutId === 'master'
					? [
							'One window takes the full workspace.',
							'Open a second beside the main window.',
							'More windows share the side column.',
							'One main window. Three alongside.'
						][displayPhase]
					: [
							'Your windows, where you want them.',
							'Move a window. Make it yours.',
							'Snap to the edges for a tidy view.'
						][displayPhase]
	);

	function rectangles(): Rectangle[] {
		if (layoutId === 'scrolling') {
			return demoApps.map((_, index) => ({
				x: 4 + index * 59 - displayPhase * 59,
				y: 8,
				w: 56,
				h: 84
			}));
		}
		if (layoutId === 'dwindle') {
			// Every new window splits the most recently created area, alternating axes.
			return [
				{ x: 4, y: 7, w: displayPhase === 0 ? 92 : 45, h: 86 },
				{ x: 51, y: 7, w: 45, h: displayPhase < 2 ? 86 : 42 },
				{ x: 51, y: 51, w: displayPhase < 3 ? 45 : 21.5, h: 42 },
				{ x: 74.5, y: 51, w: 21.5, h: displayPhase < 4 ? 42 : 20 },
				{ x: 74.5, y: 73, w: 21.5, h: 20 }
			];
		}
		if (layoutId === 'master') {
			const companions = Math.max(1, displayPhase);
			const companionHeight = (86 - (companions - 1) * 2) / companions;
			return demoApps.map((_, index) =>
				index === 0
					? { x: 4, y: 7, w: displayPhase === 0 ? 92 : 58, h: 86 }
					: { x: 64, y: 7 + (index - 1) * (companionHeight + 2), w: 32, h: companionHeight }
			);
		}
		if (displayPhase === 2) {
			return [
				{ x: 4, y: 7, w: 44, h: 86 },
				{ x: 50, y: 7, w: 46, h: 86 },
				{ x: 56, y: 12, w: 30, h: 42 },
				{ x: 16, y: 53, w: 35, h: 38 }
			];
		}
		return [
			{ x: 7, y: 12, w: 49, h: 62 },
			{ x: displayPhase === 1 ? 21 : 43, y: displayPhase === 1 ? 17 : 30, w: 48, h: 61 },
			{ x: 58, y: 8, w: 30, h: 44 },
			{ x: 16, y: 53, w: 35, h: 38 }
		];
	}

	const windows = $derived(rectangles());

	function select(id: LayoutId) {
		if (card) pinned = true;
		if (id === selected) return;
		selected = id;
		phase = 0;
		selectionAnimation?.cancel();
		if (reducedMotion || presentation || !workspace) return;
		selectionAnimation = workspace.animate(
			[
				{ opacity: 0.45, transform: 'translateY(8px)', filter: 'blur(2px)' },
				{ opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }
			],
			{ duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
		);
	}

	onMount(() => {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => {
			reducedMotion = preference.matches;
			if (reducedMotion) selectionAnimation?.cancel();
		};
		updatePreference();
		preference.addEventListener('change', updatePreference);
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
			},
			{ threshold: 0.15 }
		);
		if (frame) observer.observe(frame);
		return () => {
			selectionAnimation?.cancel();
			preference.removeEventListener('change', updatePreference);
			observer.disconnect();
		};
	});

	$effect(() => {
		// Restart the sequence when the visitor selects another layout.
		layoutId;
		cycleLength;
		if (paused || reducedMotion || !visible || !playing) return;
		const timer = window.setInterval(() => {
			if (phase + 1 < cycleLength) {
				phase += 1;
			} else if (touring) {
				const next = layouts[(layouts.findIndex((l) => l.id === selected) + 1) % layouts.length];
				selected = next.id;
				phase = 0;
			} else {
				phase = 0;
			}
		}, stepMs);
		return () => window.clearInterval(timer);
	});
</script>

<div
	class="layout-lab"
	class:compact
	class:card
	class:presentation
	bind:this={frame}
	data-layout={layoutId}
	data-phase={displayPhase}
	data-window-count={visibleWindowCount}
>
	{#if card}
		<div class="compact-bar">
			<span class="bar-label"><span class="status-dot"></span> Four ways to arrange windows</span>
			<div class="compact-tabs" role="group" aria-label="Choose a window layout">
				{#each layouts as layout (layout.id)}
					<button
						type="button"
						class="compact-tab"
						class:selected={layoutId === layout.id}
						aria-pressed={layoutId === layout.id}
						onclick={() => select(layout.id)}
					>
						{layout.name}
						{#if layoutId === layout.id}
							{#key layoutId}
								<span
									class="tab-indicator"
									class:progress={touring && !reducedMotion}
									class:halted={paused || !visible}
									style:animation-duration="{cycleLength * stepMs}ms"
									aria-hidden="true"
								></span>
							{/key}
						{/if}
					</button>
				{/each}
			</div>
			{#if reducedMotion}
				<span class="motion-note">Reduced motion</span>
			{:else}
				<button
					class="motion-toggle"
					type="button"
					onclick={() => (paused = !paused)}
					aria-label={paused ? 'Play layout animation' : 'Pause layout animation'}
					title={paused ? 'Play' : 'Pause'}
				>
					<i class="ti {paused ? 'ti-player-play' : 'ti-player-pause'}" aria-hidden="true"></i>
				</button>
			{/if}
		</div>
	{:else if !presentation}
		<div class="layout-choices" role="group" aria-label="Choose a window layout">
			{#each layouts as layout, index (layout.id)}
				<button
					type="button"
					class="layout-choice"
					class:selected={layoutId === layout.id}
					aria-pressed={layoutId === layout.id}
					onclick={() => select(layout.id)}
				>
					<span class="choice-number" aria-hidden="true">0{index + 1}</span>
					<span class="choice-copy">
						<span class="choice-name">{layout.name}</span>
						<span class="choice-hint">{layout.hint}</span>
					</span>
					<span class="choice-arrow" aria-hidden="true">↗</span>
				</button>
			{/each}
		</div>
	{/if}

	<div class="layout-preview">
		<svelte:element
			this={href ? 'a' : 'div'}
			{href}
			class="desktop"
			role={href ? undefined : 'img'}
			aria-label="{href
				? 'Explore Umbriel: '
				: ''}{active.name} window layout: {active.description}"
		>
			{#if !card}
				<div class="desktop-bar" aria-hidden="true">
					<span class="desktop-brand"><span class="desktop-moon"></span> umbriel</span>
					<span class="workspace-indicator"><span class="workspace-dot"></span> workspace 01</span>
					<span class="desktop-indicators"
						><i class="ti ti-volume-2"></i><i class="ti ti-wifi"></i></span
					>
				</div>
			{/if}
			<div class="desktop-workspace" bind:this={workspace} aria-hidden="true">
				{#if !presentation && !compact}
					<div class="workspace-watermark"><span>make room</span><span>for your day.</span></div>
				{/if}
				{#each demoApps as app, index (app.name)}
					{@const rectangle = windows[index]}
					<div
						class="demo-window {app.tone}"
						class:focused={focused === index}
						data-window-visible={index < visibleWindowCount}
						style:opacity={index < visibleWindowCount ? 1 : 0}
						style:transform={index < visibleWindowCount ? 'none' : 'translateY(0.5rem) scale(0.96)'}
						style:left="{rectangle.x}%"
						style:top="{rectangle.y}%"
						style:width="{rectangle.w}%"
						style:height="{rectangle.h}%"
						style:z-index={layoutId === 'floating' && displayPhase === 2
							? 5 - index
							: focused === index
								? 5
								: index + 1}
					>
						<div class="window-title">
							<span class="window-app"><i class="ti {app.icon}"></i><span>{app.name}</span></span>
							<span class="window-actions"><span></span><span></span></span>
						</div>
						<div class="window-content">
							{#if index === 0}
								<div class="browser-address"><span></span></div>
								<div class="browser-headline"></div>
								<div class="browser-subtitle"></div>
								<div class="browser-grid"><span></span><span></span><span></span></div>
								<div class="content-line"></div>
								<div class="content-line short"></div>
							{:else if index === 1}
								<div class="editor-content">
									{#each [68, 42, 80, 58, 36, 72, 48] as width, line}
										<div class="editor-line">
											<span class="line-number">{line + 1}</span><span style:width="{width}%"
											></span>
										</div>
									{/each}
								</div>
							{:else if index === 2}
								<div class="file-path"><span></span><span></span></div>
								<div class="file-grid">
									{#each Array(6) as _}<span><i class="ti ti-folder-filled"></i><span></span></span
										>{/each}
								</div>
							{:else if index === 3}
								<div class="terminal-line">
									<span>~</span><span class="terminal-prompt">❯</span><span class="terminal-command"
									></span>
								</div>
								<div class="content-line short"></div>
								<div class="content-line"></div>
								<div class="terminal-line">
									<span>~</span><span class="terminal-prompt">❯</span><span class="terminal-cursor"
									></span>
								</div>
							{:else}
								<div class="notes-heading"></div>
								<div class="content-line"></div>
								<div class="content-line short"></div>
								<div class="content-line"></div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</svelte:element>

		{#if card}
			<div class="compact-caption">
				<span aria-hidden="true">{progress}</span>
				{#if href}<a href="{href}#layouts">See all four <span aria-hidden="true">↗</span></a>{/if}
			</div>
		{:else if !presentation}
			<div class="preview-caption">
				<div class="sequence-caption" aria-hidden="true">
					<span class="sequence-dots"
						>{#each Array.from({ length: cycleLength }, (_, index) => index) as step}<span
								class:current={step === displayPhase}
							></span>{/each}</span
					>
					<span>{progress}</span>
				</div>
				{#if reducedMotion}
					<span class="motion-note">Reduced motion</span>
				{:else}
					<button
						class="motion-toggle"
						type="button"
						onclick={() => (paused = !paused)}
						aria-label={paused ? 'Play layout animation' : 'Pause layout animation'}
					>
						<i class="ti {paused ? 'ti-player-play' : 'ti-player-pause'}" aria-hidden="true"></i>
						{paused ? 'Play' : 'Pause'}
					</button>
				{/if}
			</div>
		{/if}
	</div>

	{#if !compact && !presentation}
		<div class="layout-description" aria-live="polite" aria-atomic="true">
			<p class="description-name">{active.name}<span aria-hidden="true"> /</span></p>
			<p>{active.description}</p>
		</div>
		<p class="demo-note">
			An illustration of window behavior. Pick a different layout for each workspace.
		</p>
	{/if}
</div>

<style>
	.layout-lab {
		display: grid;
		grid-template-columns: minmax(13rem, 0.8fr) minmax(0, 2.2fr);
		column-gap: 2.5rem;
		row-gap: 1.75rem;
	}
	.layout-choices {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.layout-choice {
		display: flex;
		align-items: baseline;
		gap: 0.9rem;
		width: 100%;
		padding: 1.4rem 0.25rem;
		border-bottom: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
		text-align: left;
		color: var(--color-fg-dim);
		cursor: pointer;
		transition: color 200ms;
	}
	.layout-choice:first-child {
		border-top: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
	}
	.layout-choice:hover,
	.layout-choice.selected {
		color: var(--color-fg);
	}
	.choice-number {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		opacity: 0.7;
	}
	.selected .choice-number {
		color: var(--color-accent-2);
		opacity: 1;
	}
	.choice-copy {
		flex: 1;
	}
	.choice-name {
		position: relative;
		display: block;
		width: fit-content;
		font-size: 1.15rem;
		font-weight: 600;
		letter-spacing: -0.03em;
	}
	.choice-name::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -0.18rem;
		height: 1px;
		background: var(--color-accent-2);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.selected .choice-name::after {
		transform: scaleX(1);
	}
	.choice-hint {
		display: block;
		margin-top: 0.25rem;
		font-size: 0.75rem;
		color: var(--color-fg-dim);
	}
	.choice-arrow {
		color: var(--color-accent-2);
		opacity: 0;
		transform: translate(-4px, 4px);
		transition:
			opacity 200ms,
			transform 200ms;
	}
	.selected .choice-arrow {
		opacity: 1;
		transform: none;
	}
	.layout-preview {
		min-width: 0;
	}
	.desktop {
		display: block;
		container-type: inline-size;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--color-accent-3) 30%, var(--color-border));
		border-radius: 0.8rem;
		background: var(--color-void-deep);
		box-shadow:
			0 22px 65px -30px rgb(0 0 0 / 0.65),
			0 0 50px -35px var(--color-accent-3);
	}
	.desktop-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		height: 2.6rem;
		padding: 0 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
		font-family: var(--font-mono);
		font-size: 0.65rem;
		color: var(--color-fg-dim);
	}
	.desktop-brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-fg);
	}
	.desktop-moon {
		display: inline-block;
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		box-shadow: inset 0.22rem -0.1rem 0 0 var(--color-accent-3);
		transform: rotate(-25deg);
	}
	.workspace-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
	.workspace-dot {
		width: 0.3rem;
		height: 0.3rem;
		border-radius: 50%;
		background: var(--color-accent-2);
	}
	.desktop-indicators {
		display: flex;
		gap: 0.7rem;
	}
	.desktop-workspace {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background:
			radial-gradient(
				ellipse at 75% 80%,
				color-mix(in srgb, var(--color-accent-3) 9%, transparent),
				transparent 65%
			),
			radial-gradient(
				ellipse at 20% 0%,
				color-mix(in srgb, var(--color-accent-2) 5%, transparent),
				transparent 70%
			);
	}
	.workspace-watermark {
		position: absolute;
		right: 7%;
		bottom: 11%;
		display: grid;
		color: color-mix(in srgb, var(--color-fg-dim) 24%, transparent);
		font-size: 5cqw;
		font-weight: 500;
		line-height: 1.15;
		letter-spacing: -0.05em;
	}
	.demo-window {
		--window-tone: var(--color-accent-2);
		position: absolute;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-width: 0;
		border: 1px solid color-mix(in srgb, var(--window-tone) 25%, var(--color-border));
		border-radius: 0.45rem;
		background: color-mix(in srgb, var(--color-void) 97%, var(--window-tone));
		box-shadow: 0 5px 15px rgb(0 0 0 / 0.17);
		transition:
			left 450ms cubic-bezier(0.22, 1, 0.36, 1),
			top 450ms cubic-bezier(0.22, 1, 0.36, 1),
			width 450ms cubic-bezier(0.22, 1, 0.36, 1),
			height 450ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 300ms,
			box-shadow 300ms,
			opacity 350ms ease,
			transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.demo-window.gold {
		--window-tone: var(--color-accent);
	}
	.demo-window.lavender {
		--window-tone: var(--color-accent-3);
	}
	.demo-window.focused {
		border-color: color-mix(in srgb, var(--window-tone) 85%, var(--color-border));
		box-shadow:
			0 0 0 1px color-mix(in srgb, var(--window-tone) 10%, transparent),
			0 7px 25px rgb(0 0 0 / 0.22);
	}
	.window-title {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.2rem;
		height: clamp(1.25rem, 4.7cqw, 2.15rem);
		padding: 0 3.5%;
		border-bottom: 1px solid color-mix(in srgb, var(--window-tone) 13%, transparent);
		background: color-mix(in srgb, var(--window-tone) 5%, transparent);
		font-size: clamp(0.45rem, 1.5cqw, 0.72rem);
	}
	.window-app {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		min-width: 0;
		white-space: nowrap;
	}
	.window-app i {
		color: var(--window-tone);
		font-size: 1.15em;
	}
	.window-actions {
		display: flex;
		gap: 0.3rem;
	}
	.window-actions span {
		width: 0.25rem;
		height: 0.25rem;
		border-radius: 50%;
		background: var(--window-tone);
		opacity: 0.35;
	}
	.window-content {
		flex: 1;
		overflow: hidden;
		padding: 6%;
	}
	.browser-address {
		width: 100%;
		height: 1.8cqw;
		border-radius: 0.2rem;
		background: color-mix(in srgb, var(--color-fg-dim) 10%, transparent);
		padding: 0.65cqw;
	}
	.browser-address span {
		display: block;
		width: 45%;
		height: 0.35cqw;
		background: color-mix(in srgb, var(--color-fg-dim) 35%, transparent);
	}
	.browser-headline {
		margin-top: 9%;
		width: 68%;
		height: 2.5cqw;
		border-radius: 0.15rem;
		background: color-mix(in srgb, var(--window-tone) 55%, transparent);
	}
	.browser-subtitle {
		margin-top: 4%;
		width: 44%;
		height: 0.7cqw;
		background: color-mix(in srgb, var(--color-fg-dim) 35%, transparent);
	}
	.browser-grid {
		display: flex;
		gap: 5%;
		margin: 10% 0;
	}
	.browser-grid span {
		width: 30%;
		aspect-ratio: 1.25;
		border: 1px solid color-mix(in srgb, var(--window-tone) 15%, transparent);
		border-radius: 0.2rem;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--window-tone) 15%, transparent),
			color-mix(in srgb, var(--color-accent-3) 8%, transparent)
		);
	}
	.browser-grid span:nth-child(2) {
		opacity: 0.7;
	}
	.browser-grid span:nth-child(3) {
		opacity: 0.4;
	}
	.content-line {
		height: 0.6cqw;
		width: 86%;
		margin-top: 5%;
		background: color-mix(in srgb, var(--color-fg-dim) 25%, transparent);
		border-radius: 1rem;
	}
	.content-line.short {
		width: 61%;
	}
	.editor-content {
		display: grid;
		gap: 1.4cqw;
		padding-top: 2%;
	}
	.editor-line {
		display: flex;
		align-items: center;
		gap: 8%;
	}
	.line-number {
		width: 1em;
		font-family: var(--font-mono);
		color: var(--color-fg-dim);
		font-size: clamp(0.4rem, 1.2cqw, 0.65rem);
		opacity: 0.55;
	}
	.editor-line > span:last-child {
		display: block;
		height: 0.7cqw;
		background: color-mix(in srgb, var(--window-tone) 47%, transparent);
		border-radius: 1rem;
	}
	.editor-line:nth-child(3n) > span:last-child {
		background: color-mix(in srgb, var(--color-accent-3) 50%, transparent);
	}
	.editor-line:nth-child(3n + 2) > span:last-child {
		margin-left: 9%;
		background: color-mix(in srgb, var(--color-accent-2) 37%, transparent);
	}
	.file-path {
		display: flex;
		gap: 8%;
		padding-bottom: 9%;
		border-bottom: 1px solid color-mix(in srgb, var(--window-tone) 12%, transparent);
	}
	.file-path span {
		height: 0.7cqw;
		width: 30%;
		background: color-mix(in srgb, var(--window-tone) 30%, transparent);
		border-radius: 1rem;
	}
	.file-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.7cqw 12%;
		margin-top: 10%;
	}
	.file-grid > span {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 0.6cqw;
	}
	.file-grid i {
		color: color-mix(in srgb, var(--window-tone) 60%, transparent);
		font-size: 3cqw;
	}
	.file-grid span span {
		display: block;
		width: 80%;
		height: 0.4cqw;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--color-fg-dim) 30%, transparent);
	}
	.terminal-line {
		display: flex;
		align-items: center;
		gap: 0.8cqw;
		font-family: var(--font-mono);
		font-size: clamp(0.5rem, 1.5cqw, 0.8rem);
		color: var(--color-accent-3);
	}
	.terminal-line + .terminal-line,
	.content-line + .terminal-line {
		margin-top: 11%;
	}
	.terminal-prompt {
		color: var(--window-tone);
	}
	.terminal-command {
		display: block;
		width: 50%;
		height: 0.7cqw;
		background: color-mix(in srgb, var(--color-fg) 35%, transparent);
		border-radius: 1rem;
	}
	.terminal-cursor {
		width: 0.7cqw;
		height: 1.3cqw;
		background: var(--window-tone);
		opacity: 0.7;
	}
	.notes-heading {
		width: 65%;
		height: 1cqw;
		margin-bottom: 12%;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--window-tone) 50%, transparent);
	}

	.preview-caption {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.7rem;
		min-height: 2.75rem;
		font-size: 0.7rem;
		color: var(--color-fg-dim);
	}
	.sequence-caption {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}
	.sequence-dots {
		display: flex;
		flex-shrink: 0;
		gap: 0.25rem;
	}
	.sequence-dots span {
		width: 0.3rem;
		height: 0.3rem;
		border-radius: 50%;
		background: var(--color-fg-dim);
		opacity: 0.35;
	}
	.sequence-dots span.current {
		background: var(--color-accent-2);
		opacity: 1;
	}
	.motion-toggle {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		gap: 0.3rem;
		padding: 0.35rem 0.25rem;
		cursor: pointer;
		color: var(--color-fg-dim);
	}
	.motion-toggle:hover {
		color: var(--color-accent-2);
	}
	.motion-note {
		flex-shrink: 0;
		font-size: 0.65rem;
	}
	.layout-description {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: minmax(13rem, 0.8fr) minmax(0, 2.2fr);
		column-gap: 2.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
	}
	.description-name {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-accent-2);
	}
	.description-name span {
		color: var(--color-fg-dim);
		margin-left: 0.4rem;
	}
	.layout-description > p:last-child {
		max-width: 42rem;
		font-size: 0.9rem;
		line-height: 1.8;
		color: var(--color-fg-dim);
	}
	.demo-note {
		grid-column: 2;
		margin-top: -0.75rem;
		font-size: 0.7rem;
		color: var(--color-fg-dim);
		opacity: 0.8;
	}
	.compact .desktop-bar {
		height: 2.2rem;
		font-size: 0.6rem;
		padding: 0 0.8rem;
	}
	/* Compact (home page): the desktop is the card; one bar on top, one caption below. */
	.layout-lab.card {
		display: block;
	}
	.compact-bar {
		display: flex;
		align-items: stretch;
		gap: 0.75rem;
		height: 3rem;
		padding-inline: 1rem 0.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	.bar-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-right: auto;
		min-width: 0;
		font-size: 0.8125rem;
		line-height: 1.4;
		white-space: nowrap;
		color: var(--color-fg-dim);
	}
	.status-dot {
		flex-shrink: 0;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--color-accent-2);
	}
	.compact-tabs {
		display: flex;
		align-items: stretch;
	}
	.compact-tab {
		position: relative;
		display: flex;
		align-items: center;
		padding-inline: 0.625rem;
		font-size: 0.8125rem;
		font-weight: 500;
		line-height: 1;
		color: var(--color-fg-dim);
		cursor: pointer;
		transition: color 180ms;
	}
	.compact-tab:hover {
		color: var(--color-fg);
	}
	.compact-tab.selected {
		color: var(--color-accent);
	}
	/* Sits on the bar's bottom border; fills over the sequence while touring. */
	.tab-indicator {
		position: absolute;
		left: 0.625rem;
		right: 0.625rem;
		bottom: -1px;
		height: 2px;
		background: var(--color-accent);
		transform-origin: left;
	}
	.tab-indicator.progress {
		transform: scaleX(0);
		animation-name: tab-progress;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}
	.tab-indicator.halted {
		animation-play-state: paused;
	}
	@keyframes tab-progress {
		to {
			transform: scaleX(1);
		}
	}
	.compact-bar .motion-toggle {
		align-self: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border-radius: 4px;
		font-size: 1rem;
	}
	.compact-bar .motion-note {
		align-self: center;
		font-size: 0.75rem;
	}
	.card .desktop {
		border: 0;
		border-radius: 0;
		box-shadow: none;
		background: transparent;
	}
	.card .window-title {
		height: clamp(1rem, 3.6cqw, 1.6rem);
	}
	.card .window-content {
		opacity: 0.55;
	}
	.card .demo-window {
		box-shadow: none;
	}
	.compact-caption {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 1rem;
		border-top: 1px solid var(--color-border);
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color-fg-dim);
	}
	.compact-caption a {
		flex-shrink: 0;
		color: var(--color-fg-dim);
		transition: color 180ms;
	}
	.compact-caption a span {
		color: var(--color-accent);
	}
	.compact-caption a:hover {
		color: var(--color-accent);
	}
	@media (max-width: 480px) {
		.compact-bar .bar-label {
			display: none;
		}
		.compact-bar {
			justify-content: space-between;
			padding-left: 0.375rem;
		}
		.compact-tab {
			padding-inline: 0.5rem;
			font-size: 0.75rem;
		}
		.tab-indicator {
			left: 0.5rem;
			right: 0.5rem;
		}
	}
	.layout-lab.presentation {
		display: block;
		width: 100%;
		height: 100%;
	}
	.presentation .layout-preview {
		height: 100%;
	}
	.presentation .desktop {
		display: flex;
		flex-direction: column;
		height: 100%;
		border: 0;
		border-radius: 0;
		box-shadow: none;
	}
	.presentation .desktop-bar {
		flex-shrink: 0;
	}
	.presentation .desktop-workspace {
		flex: 1;
		min-height: 0;
		aspect-ratio: auto;
	}
	@media (max-width: 800px) {
		.layout-lab {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
		.layout-choices {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			border-top: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
		}
		.layout-choice {
			gap: 0.35rem;
			padding: 1rem 0.25rem;
		}
		.layout-choice:first-child {
			border-top: 0;
		}
		.choice-number {
			font-size: 0.6rem;
		}
		.choice-name {
			font-size: 0.85rem;
		}
		.choice-hint,
		.choice-arrow {
			display: none;
		}
		.layout-description {
			grid-column: 1;
			grid-template-columns: 1fr;
			gap: 0.55rem;
			padding-top: 1rem;
		}
		.demo-note {
			grid-column: 1;
			margin-top: 0;
		}
	}
	@media (max-width: 420px) {
		.choice-number {
			display: none;
		}
		.layout-choice {
			justify-content: center;
			text-align: center;
		}
		.choice-name {
			font-size: 0.78rem;
		}
		.desktop-bar {
			padding: 0 0.65rem;
			height: 2.2rem;
			font-size: 0.55rem;
		}
		.desktop-indicators {
			gap: 0.4rem;
		}
		.preview-caption {
			font-size: 0.62rem;
		}
		.sequence-caption {
			gap: 0.4rem;
		}
		.sequence-dots {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.layout-choice,
		.choice-name::after,
		.choice-arrow,
		.demo-window {
			transition: none;
		}
	}
</style>
