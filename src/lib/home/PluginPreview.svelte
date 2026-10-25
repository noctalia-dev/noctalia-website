<script lang="ts">
	import AnimatedCount from '$lib/animated-count.svelte';
	let { count }: { count: number | null } = $props();
	let imageFailed = $state(false);
	const pluginHref = '/plugins/official/wallpaper_depth';
</script>

<div class="plugin-preview" aria-label="Wallpaper Depth plugin preview">
	<div class="thumbnail-stage">
		{#if !imageFailed}
			<a href={pluginHref} class="thumbnail-link" aria-label="View Wallpaper Depth plugin">
				<img
					src="/previews/wallpaper-depth.webp"
					alt="Wallpaper Depth plugin thumbnail"
					width="960"
					height="540"
					loading="lazy"
					onerror={() => (imageFailed = true)}
				/>
			</a>
		{:else}
			<a href={pluginHref} class="thumbnail-fallback"
				><img
					src="https://assets.noctalia.dev/noctalia-logo.svg"
					alt=""
					width="80"
					height="80"
				/><strong>Wallpaper Depth</strong><span>A plugin for Noctalia Shell</span></a
			>
		{/if}
		{#if count != null}
			<a
				href="/plugins"
				class="thumbnail-count"
				aria-label="Browse {count} plugins for Noctalia Shell"
				><strong><AnimatedCount value={count} /></strong><span>plugins<br />for your Shell</span></a
			>
		{/if}
	</div>
	<div class="preview-controls">
		<a href={pluginHref} class="preview-name">Wallpaper Depth <span aria-hidden="true">↗</span></a>
	</div>
</div>

<style>
	.plugin-preview {
		width: 100%;
		min-width: 0;
	}
	.thumbnail-stage {
		position: relative;
		container-type: inline-size;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: #070722;
	}
	.thumbnail-link {
		display: block;
		width: 100%;
		height: 100%;
	}
	.thumbnail-link img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.thumbnail-count {
		position: absolute;
		top: 5%;
		right: 3%;
		display: flex;
		align-items: center;
		gap: 1.5cqw;
		padding: 1cqw 1.5cqw;
		border: 1px solid rgb(169 174 254 / 0.18);
		border-radius: 0.4rem;
		background: rgb(7 7 34 / 0.82);
		backdrop-filter: blur(12px);
		box-shadow: 0 3px 14px #0002;
		color: #f3edf7;
	}
	.thumbnail-count strong {
		font-size: 4.7cqw;
		line-height: 1;
		letter-spacing: -0.055em;
		font-weight: 600;
		color: #fff59b;
	}
	.thumbnail-count > span {
		font-size: clamp(0.55rem, 1.55cqw, 0.75rem);
		line-height: 1.4;
		color: #c5c4e5;
	}
	.thumbnail-fallback {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		background: radial-gradient(ellipse at 75% 20%, #a9aefe20, transparent 60%), #070722;
		color: #f3edf7;
	}
	.thumbnail-fallback img {
		width: 10%;
		height: auto;
	}
	.thumbnail-fallback strong {
		font-size: clamp(1rem, 4cqw, 2rem);
		font-weight: 500;
		letter-spacing: -0.03em;
	}
	.thumbnail-fallback > span {
		font-size: clamp(0.7rem, 1.7cqw, 0.85rem);
		color: #a9a6c4;
	}
	.preview-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-block: 0.6rem;
		border-bottom: 1px solid var(--color-border);
	}
	.preview-name {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		min-width: 0;
		font-size: 0.75rem;
		color: var(--color-fg-dim);
	}
	.preview-name:hover {
		color: var(--color-accent);
	}
	.preview-name > span {
		color: var(--color-accent);
	}
</style>
