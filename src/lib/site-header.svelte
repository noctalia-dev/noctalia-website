<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { getTheme, toggleTheme, type Theme } from '$lib/theme';
	import { DOCS_BASE_URL, GITHUB_ORG_URL } from '$lib/site-constants';

	const siteNav = [
		{ href: '/', label: 'Home' },
		{ href: '/shell', label: 'Shell' },
		{ href: '/umbriel', label: 'Compositor' },
		{ href: '/greeter', label: 'Greeter' },
		{ href: '/plugins', label: 'Plugins' }
	];
	const docsUrl = $derived(
		page.url.pathname.startsWith('/umbriel')
			? `${DOCS_BASE_URL}/umbriel/`
			: page.url.pathname.startsWith('/shell')
				? `${DOCS_BASE_URL}/noctalia/`
				: page.url.pathname.startsWith('/greeter')
					? `${DOCS_BASE_URL}/greeter/`
					: DOCS_BASE_URL
	);
	const navActive = (href: string) =>
		page.url.pathname === href || (href !== '/' && page.url.pathname.startsWith(`${href}/`));
	let themeMode = $state<Theme>('dark');
	let menuTrigger = $state<HTMLButtonElement | null>(null);
	onMount(() => {
		themeMode = getTheme();
		const onStorage = (event: StorageEvent) => {
			if (event.key === 'theme') themeMode = getTheme();
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	});
	function closeMenu(event: Event) {
		event.preventDefault();
		queueMicrotask(() => menuTrigger?.focus({ preventScroll: true }));
	}
</script>

<header
	class="site-header-chrome sticky top-0 border-b border-border/40 bg-void-deep/[0.94] backdrop-blur-xl"
>
	<div class="header-row">
		<a href="/" class="header-brand" aria-label="Noctalia home">
			<img src="https://assets.noctalia.dev/noctalia-logo.svg" alt="" width="40" height="40" />
			<span><strong>Noctalia</strong><span class="brand-tagline">quiet by design</span></span>
		</a>
		<nav class="primary-nav" aria-label="Site pages">
			{#each siteNav as link (link.href)}
				<a
					href={link.href}
					class:active={navActive(link.href)}
					aria-current={navActive(link.href) ? 'page' : undefined}>{link.label}</a
				>
			{/each}
		</nav>
		<div class="header-actions">
			<a
				href={GITHUB_ORG_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="header-icon"
				aria-label="Noctalia on GitHub"
				title="GitHub"><i class="ti ti-brand-github" aria-hidden="true"></i></a
			>
			<a
				href="/ethos"
				class="header-icon"
				aria-label="Our Ethos"
				title="Our Ethos"
				aria-current={navActive('/ethos') ? 'page' : undefined}
				><i class="ti ti-compass" aria-hidden="true"></i></a
			>
			<button
				type="button"
				class="header-icon"
				onclick={() => (themeMode = toggleTheme())}
				aria-label={themeMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				aria-pressed={themeMode === 'light'}
				><i class="ti {themeMode === 'dark' ? 'ti-sun' : 'ti-moon'}" aria-hidden="true"></i></button
			>
			<a href={docsUrl} target="_blank" rel="noopener noreferrer" class="header-docs"
				>Get started <span aria-hidden="true">↗</span></a
			>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					bind:ref={menuTrigger}
					class="header-icon menu-trigger"
					aria-label="Open menu"
					><i class="ti ti-menu-2" aria-hidden="true"></i></DropdownMenu.Trigger
				>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						align="end"
						sideOffset={8}
						class="z-[200] min-w-48 rounded-md border border-border bg-void-deep p-1.5 shadow-card outline-none"
						onCloseAutoFocus={closeMenu}
					>
						{#each siteNav as link (link.href)}
							<DropdownMenu.Item>
								{#snippet child({ props })}<a
										{...props}
										href={link.href}
										class="block cursor-pointer rounded-sm px-3 py-2.5 text-sm outline-none data-[highlighted]:bg-surface-2 {navActive(
											link.href
										)
											? 'text-accent'
											: 'text-fg'}"
										aria-current={navActive(link.href) ? 'page' : undefined}>{link.label}</a
									>{/snippet}
							</DropdownMenu.Item>
						{/each}
						<DropdownMenu.Item
							>{#snippet child({ props })}<a
									{...props}
									href={docsUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="block cursor-pointer rounded-sm px-3 py-2.5 text-sm text-fg outline-none data-[highlighted]:bg-surface-2"
									>Documentation ↗</a
								>{/snippet}</DropdownMenu.Item
						>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</div>
	</div>
</header>

<style>
	.header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		max-width: 90rem;
		height: 4.5rem;
		margin-inline: auto;
		padding-inline: 1.25rem;
	}
	.header-brand {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		gap: 0.7rem;
		border-radius: 3px;
	}
	.header-brand img {
		width: 2.5rem;
		height: 2.5rem;
	}
	.header-brand strong {
		display: block;
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: -0.035em;
	}
	.brand-tagline {
		display: block;
		margin-top: 0.15rem;
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-fg-dim);
	}
	.primary-nav {
		display: flex;
		align-items: center;
		gap: 0.15rem;
	}
	.primary-nav a {
		display: inline-flex;
		align-items: center;
		height: 2.5rem;
		padding-inline: 0.8rem;
		border-radius: 4px;
		font-size: 0.95rem;
		font-weight: 500;
		white-space: nowrap;
		color: var(--color-fg-dim);
		transition:
			color 180ms,
			background 180ms;
	}
	.primary-nav a:hover {
		color: var(--color-accent);
		background: var(--color-surface-2);
	}
	.primary-nav a.active {
		color: var(--color-accent);
		background: var(--color-surface-2);
	}
	.header-actions {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		gap: 0.25rem;
	}
	.header-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 4px;
		font-size: 1rem;
		color: var(--color-fg-dim);
		transition:
			background 180ms,
			color 180ms;
	}
	.header-icon:hover {
		color: var(--color-accent);
		background: var(--color-surface-2);
	}
	.header-docs {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		margin-left: 0.5rem;
		padding: 0.65rem 0.9rem;
		border-radius: 4px;
		color: var(--color-on-accent);
		background: var(--color-accent);
		font-size: 0.8rem;
		font-weight: 600;
		white-space: nowrap;
	}
	.header-docs:hover {
		filter: brightness(1.06);
	}
	:global(.menu-trigger) {
		display: none;
	}
	@media (max-width: 899px) {
		.primary-nav {
			display: none;
		}
		:global(.menu-trigger) {
			display: inline-flex;
		}
	}
	@media (max-width: 639px) {
		.header-row {
			height: 4rem;
			padding-inline: 1rem;
			gap: 0.5rem;
		}
		.header-brand {
			gap: 0.5rem;
		}
		.header-brand img {
			width: 2rem;
			height: 2rem;
		}
		.header-brand strong {
			font-size: 0.9rem;
		}
		.brand-tagline,
		.header-docs {
			display: none;
		}
		.header-actions {
			gap: 0;
		}
	}
</style>
