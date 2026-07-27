<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tag = 'article' | 'div' | 'section';

	let {
		tag = 'article',
		class: className = '',
		style = '',
		children
	}: {
		tag?: Tag;
		class?: string;
		style?: string;
		children: Snippet;
	} = $props();
</script>

<svelte:element this={tag} class="spotlight-surface {className}" {style}>
	<div class="spotlight-surface__glow" aria-hidden="true"></div>
	<div class="spotlight-surface__content">
		{@render children()}
	</div>
</svelte:element>
