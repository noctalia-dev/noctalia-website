<script lang="ts">
	import HomePage from '$lib/home/home-page.svelte';

	let { data } = $props<{ data: { pluginCount: number; releaseCount: number } }>();
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<HomePage {data} media="slideshow" />
