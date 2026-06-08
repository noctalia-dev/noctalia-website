<script lang="ts">
	import type { FeatureIconId } from '$lib/feature-icons';

	let {
		id,
		class: className = 'h-7 w-7 shrink-0 text-accent-2/90'
	}: {
		id: FeatureIconId;
		class?: string;
	} = $props();

	const iconNameById = {
		wayland: 'stack-2',
		minimal: 'target',
		custom: 'tool',
		compositors: 'browser',
		plugins: 'layout-grid',
		releases: 'rocket'
	} satisfies Record<FeatureIconId, string>;
</script>

<i
	class={`ti ti-${iconNameById[id]} inline-flex items-center justify-center text-[1.75rem] leading-none ${className}`}
	aria-hidden="true"
></i>
