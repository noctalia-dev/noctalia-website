<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { getTheme, toggleTheme, type Theme } from '$lib/theme';
	import { DOCS_BASE_URL, DOCS_INSTALLATION_URL } from '$lib/site-constants';

	const logoUrl = 'https://assets.noctalia.dev/noctalia-logo.svg';
	const docsInstallUrl = DOCS_INSTALLATION_URL;

	const siteNav = [
		{ href: '/', label: 'Home' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/plugins', label: 'Plugins' },
		{ href: '/themes', label: 'Palettes' }
	] as const;

	function navActive(href: string, pathname: string): boolean {
		if (href === '/') return pathname === '/';
		return pathname === href || pathname.startsWith(`${href}/`);
	}

	const linkBase =
		'whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] font-medium transition duration-200 xl:text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep';
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

	const themeToggleClass =
		'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/55 bg-surface-2/50 text-fg outline-none transition hover:border-border hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep';

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
		class="relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-5"
	>
		<a
			href="/"
			class="relative z-10 group flex min-w-0 shrink-0 items-center gap-2.5 text-fg outline-none transition hover:text-accent focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep sm:gap-3"
		>
			<img
				src={logoUrl}
				alt=""
				class="h-8 w-8 shrink-0 drop-shadow-[0_4px_14px_rgb(255_245_155/0.22)] transition group-hover:drop-shadow-[0_6px_20px_rgb(255_245_155/0.35)] sm:h-9 sm:w-9"
				width="36"
				height="36"
			/>
			<span class="flex min-w-0 flex-col leading-tight">
				<span class="text-[15px] font-semibold tracking-tight sm:text-base">Noctalia</span>
				<span class="hidden text-[10px] font-medium uppercase tracking-[0.12em] text-fg-dim sm:block">
					quiet by design
				</span>
			</span>
		</a>

		<nav
			class="absolute left-1/2 top-1/2 z-[5] hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex lg:gap-2"
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

		<div class="relative z-10 flex shrink-0 items-center justify-end gap-2 md:gap-2.5">
			<button
				type="button"
				class={themeToggleClass}
				onclick={onThemeToggle}
				aria-label={themeMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				aria-pressed={themeMode === 'light'}
			>
				{#if themeMode === 'dark'}
					<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/>
					</svg>
				{:else}
					<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
						/>
					</svg>
				{/if}
			</button>
			<a
				href={DOCS_BASE_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="hidden h-9 items-center rounded-md border border-border/60 bg-surface-2/30 px-2.5 text-xs font-medium text-fg-dim shadow-sm outline-none transition duration-200 hover:border-accent-2/50 hover:text-accent-2 focus-visible:ring-2 focus-visible:ring-accent-2/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep sm:inline-flex md:px-3"
			>
				Docs
			</a>
			<a
				href={docsInstallUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-primary-glow inline-flex h-9 items-center rounded-md bg-accent px-3.5 text-xs font-semibold text-on-accent outline-none transition duration-200 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep active:brightness-95 sm:px-4 sm:text-sm"
			>
				Get started
			</a>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					bind:ref={mobileMenuTriggerRef}
					class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/55 bg-surface-2/50 text-fg outline-none transition hover:border-border hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-void-deep md:hidden"
					aria-label="Open menu"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
					</svg>
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
