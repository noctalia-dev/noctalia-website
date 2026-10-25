<script lang="ts">
	import Reveal from '$lib/reveal.svelte';
	let {
		title,
		body,
		links
	}: {
		title: string;
		body: string;
		links: { href: string; label: string; logo?: string }[];
	} = $props();
</script>

<section class="site-shell" aria-label={title}>
	<Reveal>
		<div class="outro">
			<div>
				<h2>{title}</h2>
				<p>{body}</p>
			</div>
			<div class="outro-links">
				{#each links as link (link.href)}
					<a class="action-secondary" href={link.href}
						>{#if link.logo}<img src={link.logo} alt="" width="20" height="20" />{/if}{link.label}
						<span aria-hidden="true">→</span></a
					>
				{/each}
			</div>
		</div>
	</Reveal>
</section>

<style>
	.outro {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem 2rem;
		padding-block: 3rem 1rem;
		border-top: 1px solid var(--color-border);
	}
	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: -0.03em;
	}
	p {
		max-width: 36rem;
		margin-top: 0.375rem;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--color-fg-dim);
	}
	.outro-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	img {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
