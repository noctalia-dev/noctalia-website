<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { getTheme, toggleTheme, type Theme } from '$lib/theme';
	import { DOCS_BASE_URL, GITHUB_ORG_URL } from '$lib/site-constants';
	import { PRODUCTS } from '$lib/products';

	const projectNav = PRODUCTS.map((p) => ({
		href: p.pageUrl ?? p.docsUrl,
		label: p.navLabel,
		role: p.fullName,
		logo: p.logoUrl
	}));
	const siteNav = [...projectNav, { href: '/plugins', label: 'Plugins' }, { href: '/blog', label: 'Blog' }];
	const moreNav = [
		{ href: '/plugins', label: 'Plugins' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/changelogs', label: 'Releases' },
		{ href: '/ethos', label: 'Our ethos' }
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
	let menuOpen = $state(false);
	let menuButton = $state<HTMLButtonElement | null>(null);
	let menuPanel = $state<HTMLElement | null>(null);

	onMount(() => {
		themeMode = getTheme();
		const onStorage = (event: StorageEvent) => {
			if (event.key === 'theme') themeMode = getTheme();
		};
		const onResize = () => {
			if (window.innerWidth >= 900) menuOpen = false;
		};
		window.addEventListener('storage', onStorage);
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('storage', onStorage);
			window.removeEventListener('resize', onResize);
		};
	});
	afterNavigate(() => (menuOpen = false));

	async function toggleMenu() {
		menuOpen = !menuOpen;
		if (menuOpen) {
			await tick();
			menuPanel?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
		}
	}
	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && menuOpen) {
			menuOpen = false;
			menuButton?.focus({ preventScroll: true });
		}
	}
	function onPointerdown(event: PointerEvent) {
		if (!menuOpen) return;
		const target = event.target as Node;
		if (!menuPanel?.contains(target) && !menuButton?.contains(target)) menuOpen = false;
	}
</script>

<svelte:window onkeydown={onKeydown} onpointerdown={onPointerdown} />

<header
	class="site-header-chrome sticky top-0 border-b border-border/40 bg-void-deep/[0.94] backdrop-blur-xl"
>
	<div class="header-row">
		<a href="/" class="header-brand" aria-label="Noctalia home">
			<img src="https://assets.noctalia.dev/noctalia-logo.svg" alt="" width="32" height="32" />
			<strong>Noctalia</strong>
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
				class="header-icon desktop-only"
				aria-label="Noctalia on GitHub"
				title="GitHub"><i class="ti ti-brand-github" aria-hidden="true"></i></a
			>
			<button
				type="button"
				class="header-icon"
				onclick={() => (themeMode = toggleTheme())}
				aria-label={themeMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				aria-pressed={themeMode === 'light'}
				><i class="ti {themeMode === 'dark' ? 'ti-sun' : 'ti-moon'}" aria-hidden="true"></i></button
			>
			<a
				href={docsUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="header-docs desktop-only"
				>Docs <span aria-hidden="true">↗</span></a
			>
			<button
				type="button"
				bind:this={menuButton}
				class="menu-button"
				aria-expanded={menuOpen}
				aria-controls="site-menu"
				onclick={toggleMenu}
				><i class="ti {menuOpen ? 'ti-x' : 'ti-menu-2'}" aria-hidden="true"></i><span
					class="menu-label">{menuOpen ? 'Close' : 'Menu'}</span
				></button
			>
		</div>
	</div>
	{#if menuOpen}
		<nav id="site-menu" class="menu-panel" aria-label="Site menu" bind:this={menuPanel}>
			<div class="menu-inner">
				<p class="menu-heading">Projects</p>
				<ul class="menu-projects">
					{#each projectNav as link (link.href)}
						<li>
							<a
								href={link.href}
								class="menu-project"
								class:active={navActive(link.href)}
								aria-current={navActive(link.href) ? 'page' : undefined}
							>
								<img src={link.logo} alt="" width="32" height="32" />
								<span><strong>{link.label}</strong><small>{link.role}</small></span>
							</a>
						</li>
					{/each}
				</ul>
				<p class="menu-heading">More</p>
				<ul class="menu-links">
					{#each moreNav as link (link.href)}
						<li>
							<a
								href={link.href}
								class:active={navActive(link.href)}
								aria-current={navActive(link.href) ? 'page' : undefined}>{link.label}</a
							>
						</li>
					{/each}
					<li>
						<a href={docsUrl} target="_blank" rel="noopener noreferrer"
							>Documentation <span aria-hidden="true">↗</span></a
						>
					</li>
					<li>
						<a href={GITHUB_ORG_URL} target="_blank" rel="noopener noreferrer"
							>GitHub <span aria-hidden="true">↗</span></a
						>
					</li>
					<li>
						<a href="https://discord.noctalia.dev" target="_blank" rel="noopener noreferrer"
							>Discord <span aria-hidden="true">↗</span></a
						>
					</li>
				</ul>
			</div>
		</nav>
	{/if}
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
		gap: 0.65rem;
		border-radius: 3px;
	}
	.header-brand img {
		width: 2rem;
		height: 2rem;
	}
	.header-brand strong {
		font-size: 1.0625rem;
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.03em;
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
		font-size: 0.9375rem;
		font-weight: 500;
		white-space: nowrap;
		color: var(--color-fg-dim);
		transition:
			color 180ms,
			background 180ms;
	}
	.primary-nav a:hover,
	.primary-nav a.active {
		color: var(--color-accent);
		background: var(--color-surface-2);
	}
	.header-actions {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		gap: 0.375rem;
	}
	.header-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 4px;
		font-size: 1.125rem;
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
		gap: 0.5rem;
		height: 2.5rem;
		margin-left: 0.25rem;
		padding-inline: 1rem;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 600;
		white-space: nowrap;
		color: var(--color-fg);
		transition:
			border-color 180ms,
			color 180ms;
	}
	.header-docs span {
		color: var(--color-accent);
	}
	.header-docs:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}
	.menu-button {
		display: none;
		align-items: center;
		gap: 0.5rem;
		height: 2.5rem;
		padding-inline: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		background: var(--color-surface-2);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-fg);
		transition: border-color 180ms;
	}
	.menu-button i {
		font-size: 1.125rem;
	}
	.menu-button:hover,
	.menu-button[aria-expanded='true'] {
		border-color: var(--color-accent);
	}
	.menu-panel {
		border-top: 1px solid var(--color-border);
		max-height: calc(100dvh - 4rem);
		overflow-y: auto;
	}
	.menu-inner {
		max-width: 90rem;
		margin-inline: auto;
		padding: 1.25rem 1.25rem 1.5rem;
	}
	.menu-heading {
		margin-bottom: 0.5rem;
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.4;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-fg-dim);
	}
	.menu-projects {
		display: grid;
		gap: 0.25rem;
		margin-bottom: 1.25rem;
	}
	.menu-project {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 0.625rem 0.75rem;
		border-radius: 6px;
		transition: background 180ms;
	}
	.menu-project:hover,
	.menu-project.active {
		background: var(--color-surface-2);
	}
	.menu-project img {
		width: 2rem;
		height: 2rem;
	}
	.menu-project strong {
		display: block;
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.3;
	}
	.menu-project.active strong {
		color: var(--color-accent);
	}
	.menu-project small {
		display: block;
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color-fg-dim);
	}
	.menu-links {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.25rem;
	}
	.menu-links a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.75rem;
		padding-inline: 0.75rem;
		border-radius: 6px;
		font-size: 0.9375rem;
		line-height: 1.4;
		color: var(--color-fg);
	}
	.menu-links a span {
		color: var(--color-accent);
	}
	.menu-links a:hover {
		background: var(--color-surface-2);
	}
	.menu-links a.active {
		color: var(--color-accent);
	}
	@media (max-width: 899px) {
		.primary-nav,
		.desktop-only {
			display: none;
		}
		.menu-button {
			display: inline-flex;
		}
	}
	@media (min-width: 640px) and (max-width: 899px) {
		.menu-projects {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.menu-links {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	@media (max-width: 639px) {
		.header-row {
			height: 4rem;
			padding-inline: 1rem;
		}
		.menu-inner {
			padding-inline: 1rem;
		}
	}
	@media (max-width: 379px) {
		.menu-label {
			display: none;
		}
	}
</style>
