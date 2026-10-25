<script lang="ts">
	import Reveal from '$lib/reveal.svelte';
	let {
		number,
		label,
		title,
		lead,
		id
	}: {
		/** Section index on the page, e.g. 1 → "01". */
		number: number;
		label: string;
		title: string;
		lead?: string;
		/** Id for the heading, so the section can use aria-labelledby. */
		id?: string;
	} = $props();
</script>

<Reveal>
	<div class="section-heading">
		<p class="eyebrow"><span>{String(number).padStart(2, '0')}</span> / {label}</p>
		<h2 {id} class="type-section-title">{title}</h2>
		{#if lead}<p class="type-body">{lead}</p>{/if}
	</div>
</Reveal>

<style>
	.section-heading {
		max-width: 44rem;
		margin-bottom: clamp(2rem, 4vw, 2.75rem);
	}
	.eyebrow > span {
		margin-right: 0.35rem;
		color: var(--color-accent);
	}
	h2 {
		margin-top: 1rem;
	}
	.type-body {
		margin-top: 0.875rem;
		max-width: 38rem;
	}
</style>
