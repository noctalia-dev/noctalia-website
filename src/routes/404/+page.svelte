<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';

	const links = [
		{ href: '/', label: 'Home', icon: 'ti ti-home' },
		{ href: '/plugins', label: 'Plugins', icon: 'ti ti-puzzle' },
		{ href: '/palettes', label: 'Palettes', icon: 'ti ti-palette' },
		{ href: '/blog', label: 'Blog', icon: 'ti ti-news' }
	];
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<SiteHeader />

<main class="site-main">
	<div class="site-shell--narrow">
		<div class="card-surface p-8 text-center md:p-12">
			<p class="font-mono text-sm font-semibold tracking-[0.3em] text-accent">404</p>

			<h1 class="mt-4 font-sans text-4xl font-semibold tracking-tight text-fg md:text-5xl">
				Page not found
			</h1>

			<p class="mx-auto mt-4 max-w-md text-lg leading-relaxed text-fg-dim">
				The page you are looking for does not exist, or it moved somewhere else.
			</p>

			<div class="mt-10 flex flex-wrap justify-center gap-3">
				{#each links as link (link.href)}
					<a
						href={link.href}
						class="card-surface-hover inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-fg outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-accent"
					>
						<i class={link.icon} aria-hidden="true"></i>
						{link.label}
					</a>
				{/each}
			</div>
		</div>
	</div>
</main>

<SiteFooter />
