<script lang="ts">
	import type { FeatureIconId } from '#lib/feature-icons.js';

	let {
		id,
		class: className = 'h-7 w-7 shrink-0 text-accent-2/90'
	}: {
		id: FeatureIconId;
		class?: string;
	} = $props();

	// Full `ti-` names so scripts/build-icons.mjs finds them when subsetting the font.
	const iconClassById = {
		wayland: 'ti-stack-2',
		minimal: 'ti-target',
		custom: 'ti-tool',
		compositors: 'ti-browser',
		plugins: 'ti-layout-grid',
		releases: 'ti-rocket'
	} satisfies Record<FeatureIconId, string>;
</script>

<i
	class={`ti ${iconClassById[id]} inline-flex items-center justify-center text-[1.75rem] leading-none ${className}`}
	aria-hidden="true"
></i>
