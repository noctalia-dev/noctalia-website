<script lang="ts">
	/**
	 * Luciole preview. Screenshots in `src/lib/assets/luciole/` play as a slideshow (sorted by
	 * filename, first is the poster); with none, a mock window stands in.
	 */
	import Slideshow from '#lib/slideshow.svelte';
	import type { SlideImage } from '#lib/slideshow-images.js';

	let { href }: { href?: string } = $props();

	const modules = import.meta.glob('../assets/luciole/*.{png,jpg,jpeg,webp,avif}', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;
	const screenshots: SlideImage[] = Object.keys(modules)
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
		.map((path) => {
			const words = (path.split('/').pop() ?? '')
				.replace(/\.[^.]+$/, '')
				.replace(/^\d+[-_]*/, '')
				.replace(/[-_]+/g, ' ')
				.trim();
			return {
				src: modules[path],
				alt: words ? `Luciole screenshot - ${words}` : 'Luciole screenshot'
			};
		});

	const places = ['Home', 'Desktop', 'Downloads', 'Trash'];
	const files = [
		{ icon: 'ti-folder', name: 'Documents' },
		{ icon: 'ti-folder', name: 'Downloads' },
		{ icon: 'ti-folder', name: 'Music' },
		{ icon: 'ti-folder', name: 'Pictures' },
		{ icon: 'ti-folder', name: 'Projects' },
		{ icon: 'ti-photo', name: 'aurora.webp' },
		{ icon: 'ti-photo', name: 'night.jpg' },
		{ icon: 'ti-file-text', name: 'notes.md' },
		{ icon: 'ti-file-zip', name: 'backup.zip' }
	];
</script>

{#snippet label()}
	<div class="visual-label"><span class="status-dot"></span> Your files, without the wait</div>
{/snippet}

{#if screenshots.length > 0}
	<div class="luciole-visual luciole-visual--slides">
		{@render label()}
		<Slideshow
			images={screenshots}
			interval={5000}
			{href}
			label="Luciole screenshots"
			linkLabel="Explore Luciole"
		/>
	</div>
{:else}
	{#snippet mock()}
		{@render label()}
		<div class="window" aria-hidden="true">
			<ul class="sidebar">
				{#each places as place, i (place)}
					<li class:active={i === 0}>{place}</li>
				{/each}
			</ul>
			<ul class="grid">
				{#each files as file (file.name)}
					<li>
						<i class="ti {file.icon}"></i>
						<span>{file.name}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/snippet}
	{#if href}
		<a class="luciole-visual" {href} aria-label="Explore Luciole">{@render mock()}</a>
	{:else}
		<div class="luciole-visual">{@render mock()}</div>
	{/if}
{/if}

<style>
	.luciole-visual {
		display: block;
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--color-void-deep) 85%, transparent);
		transition: border-color 200ms;
	}
	a.luciole-visual:hover,
	.luciole-visual--slides:hover {
		border-color: color-mix(in srgb, var(--color-accent) 35%, var(--color-border));
	}
	.visual-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.9rem 1rem;
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color-fg-dim);
		border-bottom: 1px solid var(--color-border);
	}
	.status-dot {
		display: inline-block;
		height: 5px;
		width: 5px;
		border-radius: 50%;
		background: var(--color-accent-2);
	}
	.luciole-visual--slides {
		--slideshow-corner-radius: 0;
	}
	.window {
		display: grid;
		grid-template-columns: minmax(6rem, 1fr) 3fr;
		min-height: 18rem;
	}
	.sidebar {
		display: grid;
		align-content: start;
		gap: 0.25rem;
		padding: 1rem 0.75rem;
		border-right: 1px solid var(--color-border);
		font-size: 0.8125rem;
		color: var(--color-fg-dim);
	}
	.sidebar li {
		padding: 0.35rem 0.6rem;
		border-radius: 0.35rem;
	}
	.sidebar li.active {
		color: var(--color-accent);
		background: color-mix(in srgb, var(--color-accent) 12%, transparent);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
		padding: 1.25rem;
	}
	.grid li {
		display: grid;
		justify-items: center;
		gap: 0.4rem;
		padding: 0.6rem 0.25rem;
		border-radius: 0.35rem;
		font-size: 0.75rem;
		color: var(--color-fg-dim);
		text-align: center;
	}
	.grid li span {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.grid i {
		font-size: 2rem;
		color: var(--color-accent);
	}
	.grid li:nth-child(n + 6) i {
		color: var(--color-fg-dim);
	}
</style>
