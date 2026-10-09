<script lang="ts">
	import { pluginMetricKey } from '$lib/plugin-identity';
	import { pluginMetrics } from '$lib/plugin-metrics';

	let { source, catalogId, badge = false } = $props<{
		source: string;
		catalogId: string;
		badge?: boolean;
	}>();

	const key = $derived(pluginMetricKey(source, catalogId));
	const count = $derived(key === null ? undefined : $pluginMetrics?.get(key)?.recommendations);
</script>

{#if count !== undefined}
	<span class="plugin-recommendations" class:badge>
		<i class="ti ti-thumb-up" aria-hidden="true"></i>
		<span>{count}</span>
		<span class="sr-only">{count === 1 ? 'recommendation' : 'recommendations'}</span>
	</span>
{/if}

<style>
	.plugin-recommendations {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--mOnSurface);
		font-size: var(--plugin-meta-font-size, 0.875rem);
		font-weight: 500;
		white-space: nowrap;
	}

	.plugin-recommendations .ti {
		color: var(--mPrimary);
		line-height: 1;
		opacity: 0.8;
	}

	.plugin-recommendations.badge {
		padding: var(--plugin-meta-vertical-padding, 0.5rem) var(--plugin-meta-horizontal-padding, 1rem);
		background: var(--mSurfaceVariant);
		border: 1px solid var(--mOutline);
		border-radius: 2rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}
</style>
