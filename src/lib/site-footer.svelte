<script lang="ts">
	import { DOCS_BASE_URL } from '$lib/site-constants';

	const logoUrl = 'https://assets.noctalia.dev/noctalia-logo.svg';
	const supportUrl = 'https://buymeacoffee.com/noctalia';

	const links = [
		{ href: '/blog', label: 'Blog', external: false },
		{ href: '/changelogs', label: 'Changelog', external: false },
		{ href: '/plugins', label: 'Plugins', external: false },
		{ href: '/palettes', label: 'Palettes', external: false },
		{ href: '/contributors', label: 'Contributors', external: false },
		{ href: DOCS_BASE_URL, label: 'Docs', external: true },
		{ href: 'https://discord.noctalia.dev', label: 'Discord', external: true },
		{
			href: 'https://github.com/noctalia-dev/noctalia',
			label: 'GitHub',
			external: true
		},
		{ href: '/rss.xml', label: 'RSS Feed', external: false },
		{ href: '/privacy', label: 'Privacy', external: false }
	] as const;
</script>

<footer
	class="site-footer-chrome relative mt-auto border-t border-border/50 backdrop-blur-xl backdrop-saturate-125"
>
	<div class="site-footer-accent-line pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden="true"
	></div>

	<div class="mx-auto max-w-6xl px-4 py-7 sm:px-5 sm:py-8">
		<div
			class="flex flex-col items-stretch gap-6 sm:items-center lg:flex-row lg:justify-between lg:gap-8"
		>
			<div class="flex items-center gap-3 sm:justify-center lg:justify-start">
				<img
					src={logoUrl}
					alt=""
					class="h-9 w-9 shrink-0 drop-shadow-[0_4px_16px_rgb(255_245_155/0.2)]"
					width="36"
					height="36"
				/>
				<div class="min-w-0">
					<p class="font-sans text-sm font-semibold tracking-tight text-fg">Noctalia</p>
					<p class="text-[10px] font-medium uppercase tracking-[0.12em] text-fg-dim">
						quiet by design
					</p>
					<p class="mt-1 max-w-[14rem] text-[11px] leading-snug text-fg-dim/90 sm:max-w-none">
						Wayland shell · built on modern tech
					</p>
				</div>
			</div>

			<nav
				class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-fg-dim lg:gap-x-5"
				aria-label="Footer"
			>
				{#each links as link, i (link.href)}
					{#if i > 0}
						<span class="hidden text-border/80 sm:inline" aria-hidden="true">·</span>
					{/if}
					<a
						href={link.href}
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noopener noreferrer' : undefined}
						class="whitespace-nowrap transition hover:text-accent"
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<div class="flex justify-center lg:justify-end">
				<a
					href={supportUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="btn-primary-glow inline-flex w-full max-w-[16rem] items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-center text-sm font-semibold text-on-accent transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 sm:w-auto sm:max-w-none"
				>
					<span class="text-base leading-none" aria-hidden="true">❤️</span>
					Support the project
				</a>
			</div>
		</div>
	</div>
</footer>
