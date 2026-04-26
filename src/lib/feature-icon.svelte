<script lang="ts">
	import type { FeatureIconId } from '$lib/feature-icons';

	let {
		id,
		class: className = 'h-7 w-7 shrink-0 text-accent-2/90'
	}: {
		id: FeatureIconId;
		class?: string;
	} = $props();

	const stroke = 1.65;
</script>

<!-- Stroke icons (Lucide-style) for a calmer, on-brand look than emoji -->
{#if id === 'wayland'}
	<svg
		class={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width={stroke}
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path
			d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
		/>
		<path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
		<path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
	</svg>
{:else if id === 'minimal'}
	<svg
		class={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width={stroke}
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="10" />
		<circle cx="12" cy="12" r="3" />
	</svg>
{:else if id === 'custom'}
	<svg
		class={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width={stroke}
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path
			d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
		/>
	</svg>
{:else if id === 'compositors'}
	<svg
		class={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width={stroke}
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<rect x="2" y="4" width="20" height="16" rx="2" />
		<path d="M6 8h.01M10 8h.01M14 8h.01" />
		<path d="M6 12h12" />
	</svg>
{:else if id === 'plugins'}
	<svg
		class={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width={stroke}
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<rect x="3" y="3" width="7" height="7" rx="1.25" />
		<rect x="14" y="3" width="7" height="7" rx="1.25" />
		<rect x="3" y="14" width="7" height="7" rx="1.25" />
		<rect x="14" y="14" width="7" height="7" rx="1.25" />
	</svg>
{:else if id === 'releases'}
	<svg
		class={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width={stroke}
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path
			d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
		/>
		<path
			d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
		/>
		<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
		<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
	</svg>
{/if}
