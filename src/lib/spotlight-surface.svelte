<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tag = 'article' | 'div' | 'section';

	let {
		tag = 'article',
		class: className = '',
		children
	}: {
		tag?: Tag;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<svelte:element this={tag} class="spotlight-surface {className}">
	<div class="spotlight-surface__glow" aria-hidden="true"></div>
	<div class="spotlight-surface__content">
		{@render children()}
	</div>
</svelte:element>
