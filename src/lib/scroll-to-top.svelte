<script lang="ts">
	import { onMount } from 'svelte';

	let visible = $state(false);

	onMount(() => {
		const onScroll = () => {
			visible = window.scrollY > 400;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener('scroll', onScroll);
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<button
	type="button"
	class="fixed bottom-6 right-6 z-[60] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-accent/35 bg-accent text-on-accent shadow-card transition duration-300 hover:brightness-105 active:brightness-95 md:bottom-8 md:right-8 {visible
		? 'pointer-events-auto translate-y-0 opacity-100'
		: 'pointer-events-none translate-y-3 opacity-0'}"
		onclick={scrollToTop}
		aria-label="Scroll to top"
	>
		<i class="ti ti-chevron-up text-xl leading-none" aria-hidden="true"></i>
	</button>
