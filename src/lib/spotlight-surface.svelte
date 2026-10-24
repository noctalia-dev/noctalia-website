<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tag = 'article' | 'div' | 'section';

	let {
		tag = 'article',
		href,
		external = false,
		class: className = '',
		style = '',
		children
	}: {
		tag?: Tag;
		/** Renders the whole surface as a link; `tag` is ignored. */
		href?: string;
		/** Open `href` in a new tab. */
		external?: boolean;
		class?: string;
		style?: string;
		children: Snippet;
	} = $props();
</script>

<svelte:element
	this={href ? 'a' : tag}
	{href}
	target={href && external ? '_blank' : undefined}
	rel={href && external ? 'noopener noreferrer' : undefined}
	class="spotlight-surface {className}"
	{style}
>
	<div class="spotlight-surface__glow" aria-hidden="true"></div>
	<div class="spotlight-surface__content">
		{@render children()}
	</div>
</svelte:element>
