<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		delay = 0,
		children
	}: { class?: string; delay?: number; children: Snippet } = $props();

	let el = $state<HTMLElement | null>(null);
	let visible = $state(false);

	$effect(() => {
		const node = el;
		if (!node || typeof IntersectionObserver === 'undefined') {
			visible = true;
			return;
		}
		const obs = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						visible = true;
						obs.disconnect();
						break;
					}
				}
			},
			{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
		);
		obs.observe(node);
		return () => obs.disconnect();
	});
</script>

<div
	bind:this={el}
	class="reveal {className} {visible ? 'reveal-visible' : ''}"
	style:transition-delay="{visible ? `${delay}ms` : '0ms'}"
>
	{@render children()}
</div>
