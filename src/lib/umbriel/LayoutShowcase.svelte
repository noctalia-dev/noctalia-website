<script lang="ts">
	import { onMount } from 'svelte';

	let {
		compact = false,
		href
	}: {
		/** Home-page card: tabs in the top bar instead of the side list. */
		compact?: boolean;
		href?: string;
	} = $props();

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
	/** The demo tours every layout until the visitor picks one. */
	let pinned = $state(false);
	const stepMs = 1100;
	const touring = $derived(!pinned);
	let reducedMotion = $state(true);
	let visible = $state(false);
	let frame = $state<HTMLDivElement>();
	let workspace = $state<HTMLDivElement>();
	let selectionAnimation: Animation | undefined;
	const layoutId = $derived(selected);
	const active = $derived(layouts.find((layout) => layout.id === layoutId)!);
	const cycleLength = $derived(
		layoutId === 'dwindle' ? 5 : layoutId === 'master' || layoutId === 'scrolling' ? 4 : 3
	);
	const displayPhase = $derived(reducedMotion ? cycleLength - 1 : phase);
	const demoApps = $derived(layoutId === 'dwindle' ? apps : apps.slice(0, 4));
	const visibleWindowCount = $derived(
		layoutId === 'master' || layoutId === 'dwindle' ? displayPhase + 1 : 4
	);
	// Scrolling focuses Browser, then the stacked Terminal, then Files (twice: normal, then widened).
	const focused = $derived(layoutId === 'scrolling' ? [0, 3, 2, 2][displayPhase] : displayPhase);
	const progress = $derived(
		layoutId === 'scrolling'
			? [
					'Each window gets a column, as wide as you like.',
					'Stack two windows in one column.',
					'Move on. The strip scrolls to the next column.',
					'Widen the focused column when it needs room.'
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
			// Columns live on an endless horizontal strip; the view scrolls to keep focus visible.
			const offset = [0, 6, 58, 100][displayPhase];
			const stacked = displayPhase >= 1;
			const strip: Rectangle[] = [
				{ x: 4, y: 7, w: 58, h: 86 },
				{ x: 64, y: 7, w: 38, h: stacked ? 42 : 86 },
				{ x: 104, y: 7, w: displayPhase === 3 ? 92 : 50, h: 86 },
				stacked ? { x: 64, y: 51, w: 38, h: 42 } : { x: 156, y: 7, w: 38, h: 86 }
			];
			return strip.map((rect) => ({ ...rect, x: rect.x - offset }));
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
		pinned = true;
		if (id === selected) return;
		selected = id;
		phase = 0;
		selectionAnimation?.cancel();
		if (reducedMotion || !workspace) return;
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
		if (paused || reducedMotion || !visible) return;
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

{#snippet motionControl()}
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
{/snippet}

{#snippet progressIndicator()}
	{#key layoutId}
		<span
			class="tab-indicator"
			class:progress={touring && !reducedMotion}
			class:halted={paused || !visible}
			style:animation-duration="{cycleLength * stepMs}ms"
			aria-hidden="true"
		></span>
	{/key}
{/snippet}

<div
	class="layout-lab"
	class:compact
	bind:this={frame}
	data-layout={layoutId}
	data-phase={displayPhase}
	data-window-count={visibleWindowCount}
>
	{#if compact}
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
						{#if layoutId === layout.id}{@render progressIndicator()}{/if}
					</button>
				{/each}
			</div>
			{@render motionControl()}
		</div>
	{:else}
		<div class="layout-choices" role="group" aria-label="Choose a window layout">
			{#each layouts as layout (layout.id)}
				<button
					type="button"
					class="layout-choice"
					class:selected={layoutId === layout.id}
					aria-pressed={layoutId === layout.id}
					onclick={() => select(layout.id)}
				>
					<span class="choice-name">{layout.name}</span>
					<span class="choice-hint">{layout.hint}</span>
					{#if layoutId === layout.id}
						<span class="choice-description">{layout.description}</span>
						{@render progressIndicator()}
					{/if}
				</button>
			{/each}
		</div>
	{/if}

	<div class="layout-preview">
		{#if !compact}
			<div class="frame-bar">
				<span class="bar-label"><span class="status-dot"></span> {progress}</span>
				{@render motionControl()}
			</div>
		{/if}
		<svelte:element
			this={href ? 'a' : 'div'}
			{href}
			class="desktop"
			role={href ? undefined : 'img'}
			aria-label="{href
				? 'Explore Umbriel: '
				: ''}{active.name} window layout: {active.description}"
		>
			<div class="desktop-workspace" bind:this={workspace} aria-hidden="true">
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

		{#if compact}
			<div class="compact-caption">
				<span aria-hidden="true">{progress}</span>
				{#if href}<a href="{href}#layouts">See all four <span aria-hidden="true">↗</span></a>{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.layout-lab {
		display: grid;
		grid-template-columns: minmax(14rem, 0.8fr) minmax(0, 2.2fr);
		gap: clamp(1.5rem, 3vw, 2.5rem);
		align-items: center;
	}
	.layout-lab.compact {
		display: block;
	}

	/* Full mode: a list of layouts beside a framed demo. */
	.layout-choices {
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--color-border);
	}
	.layout-choice {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		padding: 1.125rem 0.25rem;
		border-bottom: 1px solid var(--color-border);
		text-align: left;
		color: var(--color-fg-dim);
		cursor: pointer;
		transition: color 180ms;
	}
	.layout-choice:hover,
	.layout-choice.selected {
		color: var(--color-fg);
	}
	.choice-name {
		font-size: 1.125rem;
		font-weight: 600;
		line-height: 1.35;
		letter-spacing: -0.02em;
	}
	.layout-choice.selected .choice-name {
		color: var(--color-accent);
	}
	.choice-hint {
		margin-top: 0.125rem;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-fg-dim);
	}
	.choice-description {
		margin-top: 0.625rem;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--color-fg-dim);
	}
	.layout-choice .tab-indicator {
		left: 0;
		right: 0;
	}

	/* The demo frame: one bar, then the desktop edge to edge. */
	.layout-preview {
		min-width: 0;
	}
	.layout-lab:not(.compact) .layout-preview {
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--color-void-deep) 85%, transparent);
	}
	.frame-bar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		height: 3rem;
		padding-inline: 1rem 0.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	.desktop {
		display: block;
		container-type: inline-size;
		overflow: hidden;
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

	/* Shared bar pieces (compact card bar and full-mode frame bar). */
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
		overflow: hidden;
		font-size: 0.8125rem;
		line-height: 1.4;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--color-fg-dim);
	}
	.status-dot {
		flex-shrink: 0;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--color-accent-2);
	}
	.motion-toggle {
		display: inline-flex;
		align-self: center;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		border-radius: 4px;
		font-size: 1rem;
		color: var(--color-fg-dim);
		cursor: pointer;
		transition: color 180ms;
	}
	.motion-toggle:hover {
		color: var(--color-accent-2);
	}
	.motion-note {
		align-self: center;
		flex-shrink: 0;
		font-size: 0.75rem;
		color: var(--color-fg-dim);
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
	/* Sits on the bottom border of its tab or list row; fills over the sequence while touring. */
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
	.window-title {
		height: clamp(1rem, 3.6cqw, 1.6rem);
	}
	.window-content {
		opacity: 0.55;
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
	@media (max-width: 860px) {
		.layout-lab {
			grid-template-columns: 1fr;
		}
		.layout-choices {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		.layout-choice {
			align-items: center;
			padding: 0.875rem 0.25rem;
			text-align: center;
		}
		.choice-name {
			font-size: 0.9375rem;
		}
		.choice-hint,
		.choice-description {
			display: none;
		}
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
		.compact-tab .tab-indicator {
			left: 0.5rem;
			right: 0.5rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.layout-choice,
		.demo-window {
			transition: none;
		}
	}
</style>
