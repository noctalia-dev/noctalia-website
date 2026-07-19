<script lang="ts">
	import HomePage from '$lib/home/home-page.svelte';

	let { data } = $props<{ data: { pluginCount: number; releaseCount: number } }>();
</script>

<HomePage {data} media="slideshow" />
