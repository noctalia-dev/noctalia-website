<script lang="ts">
	import { onMount } from 'svelte';
	let { value }: { value: number } = $props();
	let shown = $state<number | null>(null);
	let element = $state<HTMLSpanElement>();
	const display = $derived((shown ?? value).toLocaleString('en'));

	onMount(() => {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (preference.matches || !element) return;
		let animation = 0;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				let started = 0;
				const tick = (now: number) => {
					started ||= now;
					const progress = Math.min((now - started) / 1150, 1);
					shown = Math.round(value * (1 - (1 - progress) ** 3));
					if (progress < 1) animation = requestAnimationFrame(tick);
				};
				animation = requestAnimationFrame(tick);
			},
			{ threshold: 0.5 }
		);
		observer.observe(element);
		const stop = () => {
			if (preference.matches) {
				cancelAnimationFrame(animation);
				shown = null;
			}
		};
		preference.addEventListener('change', stop);
		return () => {
			observer.disconnect();
			cancelAnimationFrame(animation);
			preference.removeEventListener('change', stop);
		};
	});
</script>

<span bind:this={element} style:font-variant-numeric="tabular-nums"
	><span aria-hidden="true">{display}</span><span class="sr-only">{value.toLocaleString('en')}</span
	></span
>
