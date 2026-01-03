<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Features from '$lib/components/Features.svelte';
	import Showcase from '$lib/components/Showcase.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ScrollToTop from '$lib/components/ScrollToTop.svelte';

	let { data } = $props<{ data: { pluginCount: number; releaseCount: number } }>();
</script>

<Navbar activePage="home" />

<Hero />
<Showcase />
<Features pluginCount={data.pluginCount} releaseCount={data.releaseCount} />
<Footer />
<ScrollToTop />

