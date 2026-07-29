<script lang="ts">
	import { DOCS_BASE_URL } from '$lib/site-constants';

	const logoUrl = 'https://assets.noctalia.dev/noctalia-logo.svg';
	const supportUrl = 'https://buymeacoffee.com/noctalia';
	const githubUrl = 'https://github.com/noctalia-dev/noctalia';
	const discordUrl = 'https://discord.noctalia.dev';

	type FooterLink = { href: string; label: string; external?: boolean };

	/** Grouped so the footer reads as columns instead of one long strip of links. */
	const linkGroups: { title: string; links: FooterLink[] }[] = [
		{
			title: 'Explore',
			links: [
				{ href: '/', label: 'Home' },
				{ href: '/blog', label: 'Blog' },
				{ href: '/changelogs', label: 'Changelog' },
				{ href: '/plugins', label: 'Plugins' },
				{ href: '/palettes', label: 'Palettes' }
			]
		},
		{
			title: 'Project',
			links: [
				{ href: DOCS_BASE_URL, label: 'Documentation', external: true },
				{ href: githubUrl, label: 'GitHub', external: true },
				{ href: '/contributors', label: 'Contributors' },
				{ href: '/ethos', label: 'Our Ethos' }
			]
		},
		{
			title: 'Community',
			links: [
				{ href: discordUrl, label: 'Discord', external: true },
				{ href: '/rss.xml', label: 'RSS Feed' }
			]
		}
	];

	/** Static build: baked at prerender time, refreshed on the next deploy. */
	const year = new Date().getFullYear();

	const groupTitleClass = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-fg';
	const footerLinkClass =
		'inline-flex rounded-sm text-sm text-fg-dim outline-none transition hover:text-accent focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep';
</script>

<footer
	class="site-footer-chrome relative mt-auto border-t border-border/50 backdrop-blur-xl backdrop-saturate-125"
>
	<div class="site-footer-accent-line pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden="true"
	></div>

	<div class="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12">
		<div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
			<div class="lg:max-w-sm lg:shrink-0">
				<div class="flex items-center gap-3">
					<img
						src={logoUrl}
						alt=""
						class="h-10 w-10 shrink-0 drop-shadow-[0_4px_16px_rgb(255_245_155/0.2)]"
						width="40"
						height="40"
					/>
					<div class="min-w-0">
						<p class="font-sans text-base font-semibold tracking-tight text-fg">Noctalia</p>
						<p class="text-[10px] font-medium uppercase tracking-[0.12em] text-fg-dim">
							quiet by design
						</p>
					</div>
				</div>
				<p class="mt-4 max-w-sm text-sm leading-relaxed text-fg-dim">
					A sleek, customizable desktop shell crafted for Wayland.
				</p>
				<a
					href={supportUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="btn-primary-glow mt-5 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-accent outline-none transition duration-200 hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep active:translate-y-0 active:brightness-95"
				>
					<span class="text-base leading-none" aria-hidden="true">❤️</span>
					Support the project
				</a>
			</div>

			<div class="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-x-12 lg:flex-1 lg:gap-x-8">
				{#each linkGroups as group (group.title)}
					<nav aria-label={group.title}>
						<p class={groupTitleClass}>{group.title}</p>
						<ul class="mt-4 space-y-1.5">
							{#each group.links as link (link.href)}
								<li>
									<a
										href={link.href}
										target={link.external ? '_blank' : undefined}
										rel={link.external ? 'noopener noreferrer' : undefined}
										class={footerLinkClass}
									>
										{link.label}
									</a>
								</li>
							{/each}
						</ul>
					</nav>
				{/each}
			</div>
		</div>

		<div
			class="mt-10 flex flex-col gap-3 border-t border-border/40 pt-6 text-xs text-fg-dim sm:flex-row sm:items-center sm:justify-between"
		>
			<p>&copy; {year} Noctalia</p>
			<a
				href="/privacy"
				class="rounded-sm outline-none transition hover:text-accent focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep"
			>
				Privacy
			</a>
		</div>
	</div>
</footer>
