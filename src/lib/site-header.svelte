<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { getTheme, toggleTheme, type Theme } from '$lib/theme';
	import { DOCS_BASE_URL } from '$lib/site-constants';

	const logoUrl = 'https://assets.noctalia.dev/noctalia-logo.svg';

	const siteNav = [
		{ href: '/#family', label: 'Projects' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/changelogs', label: 'Changelog' },
		{ href: '/plugins', label: 'Plugins' },
		{ href: '/palettes', label: 'Palettes' }
	] as const;

	function navActive(href: string, pathname: string): boolean {
		return pathname === href || pathname.startsWith(`${href}/`);
	}

	const linkBase =
		'inline-flex h-10 min-w-20 items-center justify-center whitespace-nowrap rounded-md px-3.5 text-sm font-medium transition duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep';
	const linkIdle = 'text-fg-dim hover:bg-surface-2/80 hover:text-accent';
	const linkActive = 'nav-pill-active bg-surface-2/95 text-accent';

	let themeMode = $state<Theme>('dark');

	onMount(() => {
		themeMode = getTheme();
		const onStorage = (e: StorageEvent) => {
			if (e.key === 'theme') themeMode = getTheme();
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	});

	function onThemeToggle() {
		themeMode = toggleTheme();
	}

	const iconButtonBase =
		'h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/55 bg-surface-2/50 text-fg outline-none transition hover:border-border hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep';
	const themeToggleClass = `inline-flex ${iconButtonBase}`;
	/** RSS lives in the footer too, so drop it from the crowded mobile bar. */
	const rssLinkClass = `hidden sm:inline-flex ${iconButtonBase}`;

	let mobileMenuTriggerRef = $state<HTMLButtonElement | null>(null);

	function onMobileMenuCloseAutoFocus(e: Event) {
		e.preventDefault();
		queueMicrotask(() => mobileMenuTriggerRef?.focus({ preventScroll: true }));
	}
</script>

<header
	class="site-header-chrome sticky top-0 border-b border-border/40 bg-void-deep/[0.92] backdrop-blur-xl backdrop-saturate-125"
>
	<div
		class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-5 lg:grid lg:grid-cols-[1fr_auto_1fr]"
	>
		<a
			href="/"
			class="group flex min-w-0 shrink-0 items-center gap-2.5 justify-self-start text-fg outline-none transition hover:text-accent focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep sm:gap-3"
		>
			<img
				src={logoUrl}
				alt=""
				class="h-9 w-9 shrink-0 drop-shadow-[0_4px_14px_rgb(255_245_155/0.22)] transition group-hover:drop-shadow-[0_6px_20px_rgb(255_245_155/0.35)] sm:h-10 sm:w-10"
				width="40"
				height="40"
			/>
			<span class="flex min-w-0 flex-col leading-tight">
				<span class="text-base font-semibold tracking-tight sm:text-[17px]">Noctalia</span>
				<span class="hidden text-[11px] font-medium uppercase tracking-[0.12em] text-fg-dim sm:block">
					quiet by design
				</span>
			</span>
		</a>

		<nav
			class="hidden items-center gap-1 justify-self-center min-[880px]:flex lg:gap-2"
			aria-label="Site pages"
		>
			{#each siteNav as link (link.href)}
				<a
					href={link.href}
					class="{linkBase} {navActive(link.href, page.url.pathname) ? linkActive : linkIdle}"
					aria-current={navActive(link.href, page.url.pathname) ? 'page' : undefined}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="flex shrink-0 items-center justify-end gap-2 justify-self-end md:gap-2.5">
			<a
				href="/rss.xml"
				target="_blank"
				rel="noopener noreferrer"
				class={rssLinkClass}
				aria-label="Open RSS feed"
				title="RSS feed"
			>
				<i class="ti ti-rss text-base leading-none" aria-hidden="true"></i>
			</a>
			<button
				type="button"
				class={themeToggleClass}
				onclick={onThemeToggle}
				aria-label={themeMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				aria-pressed={themeMode === 'light'}
				>
					{#if themeMode === 'dark'}
						<i class="ti ti-sun text-base leading-none" aria-hidden="true"></i>
					{:else}
						<i class="ti ti-moon text-base leading-none" aria-hidden="true"></i>
					{/if}
				</button>
			<a
				href={DOCS_BASE_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-primary-glow inline-flex h-10 min-w-28 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-on-accent outline-none transition duration-200 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep active:brightness-95"
			>
				Get started
			</a>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					bind:ref={mobileMenuTriggerRef}
					class="{themeToggleClass} min-[880px]:hidden"
					aria-label="Open menu"
				>
					<i class="ti ti-menu-2 text-base leading-none" aria-hidden="true"></i>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						align="end"
						sideOffset={6}
						class="z-[200] min-w-[11.5rem] rounded-md border border-border/50 bg-void-deep p-1 shadow-card outline-none"
						onCloseAutoFocus={onMobileMenuCloseAutoFocus}
					>
						{#each siteNav as link (link.href)}
							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a
										{...props}
										href={link.href}
										class="flex w-full cursor-pointer rounded-sm px-3 py-2 text-left text-[13px] outline-none data-[highlighted]:bg-surface-2/90 {navActive(
											link.href,
											page.url.pathname
										)
											? 'text-accent'
											: 'text-fg'}"
										aria-current={navActive(link.href, page.url.pathname) ? 'page' : undefined}
									>
										{link.label}
									</a>
								{/snippet}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</div>
	</div>
</header>
