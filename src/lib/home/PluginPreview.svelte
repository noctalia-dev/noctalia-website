<script lang="ts">
	import AnimatedCount from '$lib/animated-count.svelte';
	let { count }: { count: number | null } = $props();
</script>

<a href="/plugins" class="plugin-preview" aria-label="Browse the plugin catalog">
	<div class="visual-label">
		<span class="status-dot"></span> Made by the team and the community
	</div>
	<div class="wall">
		<img
			src="/plugin-wall.webp"
			alt=""
			width="1600"
			height="900"
			loading="lazy"
			decoding="async"
		/>
		{#if count != null}
			<div class="wall-count">
				<strong><AnimatedCount value={count} /></strong><span>plugins<br />for your Shell</span>
			</div>
		{/if}
	</div>
	<div class="visual-caption">Browse the catalog <span aria-hidden="true">→</span></div>
</a>

<style>
	.plugin-preview {
		display: block;
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--color-void-deep) 85%, transparent);
		transition: border-color 200ms;
	}
	.plugin-preview:hover {
		border-color: var(--color-accent-2);
	}
	.visual-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.9rem 1rem;
		border-bottom: 1px solid var(--color-border);
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color-fg-dim);
	}
	.status-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--color-accent-2);
	}
	.wall {
		position: relative;
		container-type: inline-size;
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}
	.wall img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.plugin-preview:hover .wall img {
		transform: scale(1.04);
	}
	.wall-count {
		position: absolute;
		bottom: 5%;
		left: 3.5%;
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 0.75rem 1.125rem;
		border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--color-void-deep) 82%, transparent);
		backdrop-filter: blur(12px);
		box-shadow: 0 20px 60px -10px rgb(0 0 0 / 0.6);
		white-space: nowrap;
	}
	.wall-count strong {
		font-size: clamp(1.75rem, 5.5cqw, 2.75rem);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.04em;
		color: var(--color-accent);
	}
	.wall-count > span {
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color-fg-dim);
	}
	.visual-caption {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 1rem;
		border-top: 1px solid var(--color-border);
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color-fg-dim);
	}
	.visual-caption > span {
		color: var(--color-accent);
	}
	@media (prefers-reduced-motion: reduce) {
		.wall img {
			transition: none;
		}
	}
</style>
