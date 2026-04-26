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

	let el = $state<HTMLElement | null>(null);

	$effect(() => {
		const node = el;
		if (!node || typeof window === 'undefined') return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (window.matchMedia('(pointer: coarse)').matches) return;

		const setCenter = () => {
			node.style.setProperty('--spot-x', '50%');
			node.style.setProperty('--spot-y', '42%');
		};
		setCenter();

		const onMove = (e: PointerEvent) => {
			const r = node.getBoundingClientRect();
			if (r.width < 1 || r.height < 1) return;
			const x = ((e.clientX - r.left) / r.width) * 100;
			const y = ((e.clientY - r.top) / r.height) * 100;
			node.style.setProperty('--spot-x', `${x}%`);
			node.style.setProperty('--spot-y', `${y}%`);
		};

		node.addEventListener('pointermove', onMove, { passive: true });
		return () => {
			node.removeEventListener('pointermove', onMove);
		};
	});
</script>

<svelte:element this={tag} bind:this={el} class="spotlight-surface {className}">
	<div class="spotlight-surface__glow" aria-hidden="true"></div>
	<div class="spotlight-surface__content">
		{@render children()}
	</div>
</svelte:element>
