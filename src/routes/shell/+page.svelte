<script lang="ts">
	import ShellPage from '$lib/home/home-page.svelte';

	let { data } = $props<{ data: { pluginCount: number; releaseCount: number } }>();
</script>

<ShellPage {data} media="slideshow" />
