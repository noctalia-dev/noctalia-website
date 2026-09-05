<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
	import Fuse from 'fuse.js';
	
	interface Plugin {
		id: string;
		name: string;
		version: string;
		author: string;
		description: string;
		icon?: string;
		tags?: string[];
		source: string;
		repo: string;
		updatedAt?: number | null;
	}

	let { data } = $props<{ data: { plugins: Plugin[] } }>();

	let plugins = $state<Plugin[]>([]);
	let allPlugins = $state<Plugin[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let searchQuery = $state('');
	let fuse: Fuse<Plugin> | null = $state(null);
	let selectedTag = $state('');
	let selectedCompositor = $state('');
	let availableTags = $state<string[]>([]);
	let availableCompositors = $state<string[]>([]);
	let sortOption = $state<'name' | 'updated'>('name');

	const COMPOSITORS = ['niri', 'hyprland', 'umbriel', 'mangowc', 'sway', 'labwc', 'scroll'];

	function parseFiltersFromUrl(url: URL) {
		const parsedQuery = url.searchParams.get('q') ?? '';
		const compositorParam = url.searchParams.get('compositor')?.trim() ?? '';
		const tagParam = url.searchParams.get('tag')?.trim() ?? '';

		let parsedCompositor =
			compositorParam && availableCompositors.includes(compositorParam) ? compositorParam : '';
		let parsedTag = '';

		if (tagParam) {
			if (availableCompositors.includes(tagParam) && !parsedCompositor) {
				parsedCompositor = tagParam;
			} else if (availableTags.includes(tagParam)) {
				parsedTag = tagParam;
			}
		}

		return {
			searchQuery: parsedQuery,
			selectedTag: parsedTag,
			selectedCompositor: parsedCompositor
		};
	}

	function buildPluginsUrl(query: string, tag: string, compositor: string): string {
		const params = new URLSearchParams();
		const trimmedQuery = query.trim();

		if (trimmedQuery) params.set('q', trimmedQuery);
		if (compositor) params.set('compositor', compositor);
		if (tag) params.set('tag', tag);

		const qs = params.toString();
		return qs ? `/plugins?${qs}` : '/plugins';
	}

	function pluginsPathFromUrl(url: URL): string {
		const parsed = parseFiltersFromUrl(url);
		return buildPluginsUrl(parsed.searchQuery, parsed.selectedTag, parsed.selectedCompositor);
	}

	function applyFiltersFromUrl(url: URL) {
		const parsed = parseFiltersFromUrl(url);
		searchQuery = parsed.searchQuery;
		selectedTag = parsed.selectedTag;
		selectedCompositor = parsed.selectedCompositor;
	}

	function sortPlugins(items: Plugin[]): Plugin[] {
		return items.sort((a, b) => {
			if (sortOption === 'updated') {
				const byUpdated = (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
				if (byUpdated !== 0) return byUpdated;
			}
			return a.name.localeCompare(b.name);
		});
	}

	// Split the filtered list into the two sources rendered as separate sections.
	let officialPlugins = $derived(sortPlugins(plugins.filter((plugin) => plugin.source === 'official')));
	let communityPlugins = $derived(sortPlugins(plugins.filter((plugin) => plugin.source !== 'official')));
	// Does the catalog contain any community plugins at all (ignoring filters)?
	let hasCommunitySource = $derived(allPlugins.some((plugin) => plugin.source !== 'official'));
	let isFiltering = $derived(
		Boolean(searchQuery || selectedTag || selectedCompositor)
	);

	let totalOfficialCount = $derived(allPlugins.filter(p => p.source === 'official').length);
	let totalCommunityCount = $derived(allPlugins.filter(p => p.source !== 'official').length);
	let totalPluginCount = $derived(allPlugins.length);

	onMount(() => {
		// Preserve catalog order
		allPlugins = data.plugins;

		// Keep compositor compatibility separate from descriptive tags.
		const tagSet = new Set<string>();
		const compositorSet = new Set<string>();
		allPlugins.forEach((plugin) => {
			plugin.tags?.forEach((tag) => {
				if (isCompositorTag(tag)) compositorSet.add(tag);
				else tagSet.add(tag);
			});
		});
		availableTags = Array.from(tagSet).sort();
		availableCompositors = Array.from(compositorSet).sort(
			(a, b) => COMPOSITORS.indexOf(a) - COMPOSITORS.indexOf(b)
		);

		// Initialize Fuse.js for fuzzy search
		fuse = new Fuse(allPlugins, {
			keys: [
				{ name: 'name', weight: 0.5 },
				{ name: 'description', weight: 0.3 },
				{ name: 'author', weight: 0.2 },
				{ name: 'id', weight: 0.1 },
				{ name: 'tags', weight: 0.4 }
			],
			threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
			includeScore: true,
			minMatchCharLength: 2
		});

		plugins = allPlugins;
		applyFiltersFromUrl($page.url);
	});

	afterNavigate((navigation) => {
		if (navigation.type !== 'popstate' || navigation.to?.url.pathname !== '/plugins') return;
		applyFiltersFromUrl(navigation.to.url);
	});

	$effect(() => {
		if (!fuse) return;

		const target = buildPluginsUrl(searchQuery, selectedTag, selectedCompositor);
		if (target === pluginsPathFromUrl($page.url)) return;

		const timer = setTimeout(() => {
			const latest = buildPluginsUrl(searchQuery, selectedTag, selectedCompositor);
			if (latest !== pluginsPathFromUrl($page.url)) {
				goto(latest, { replaceState: true, keepFocus: true, noScroll: true });
			}
		}, 250);

		return () => clearTimeout(timer);
	});

	$effect(() => {
		let filtered = allPlugins;

		if (selectedTag) {
			filtered = filtered.filter((plugin) => plugin.tags?.includes(selectedTag));
		}

		if (selectedCompositor) {
			filtered = filtered.filter((plugin) => plugin.tags?.includes(selectedCompositor));
		}

		// Apply search filter
		if (fuse && searchQuery.trim()) {
			const results = fuse.search(searchQuery);
			const searchIds = new Set(results.map(r => r.item.id));
			filtered = filtered.filter(plugin => searchIds.has(plugin.id));
		}

		plugins = filtered;
	});

	function toggleTag(tag: string) {
		selectedTag = selectedTag === tag ? '' : tag;
	}

	function toggleCompositor(compositor: string) {
		selectedCompositor = selectedCompositor === compositor ? '' : compositor;
	}

	function clearFilters() {
		selectedTag = '';
		selectedCompositor = '';
		searchQuery = '';
	}

	function isCompositorTag(tag: string): boolean {
		return COMPOSITORS.includes(tag.toLowerCase());
	}

	function formatCompositor(compositor: string): string {
		if (compositor === 'mangowc') return 'MangoWC';
		return compositor.charAt(0).toUpperCase() + compositor.slice(1);
	}

	function getIconClass(plugin: Plugin): string {
		const icon = plugin.icon?.trim();
		return `ti ti-${icon && /^[a-z0-9-]+$/.test(icon) ? icon : 'puzzle'}`;
	}

	function ensureTablerIcon(node: HTMLElement, iconClass: string) {
		let frame = 0;

		function check(nextIconClass: string) {
			iconClass = nextIconClass;
			cancelAnimationFrame(frame);
			node.classList.remove('ti-puzzle');
			frame = requestAnimationFrame(() => {
				const content = getComputedStyle(node, '::before').content;
				if (!content || content === 'none' || content === 'normal' || content === '""') {
					node.classList.add('ti-puzzle');
				}
			});
		}

		check(iconClass);
		return {
			update: check,
			destroy: () => cancelAnimationFrame(frame)
		};
	}

	function getPreviewUrl(plugin: Plugin): string {
		return `https://raw.githubusercontent.com/noctalia-dev/${plugin.repo}/main/${plugin.id}/thumbnail.webp`;
	}

	function handleImageError(e: Event) {
		const target = e.target as HTMLImageElement;
		target.style.display = 'none';
		const placeholder = target.nextElementSibling as HTMLElement;
		if (placeholder) placeholder.style.display = 'flex';
	}
</script>

<SiteHeader />

<main class="plugins-page site-main">
	<div class="site-shell w-full">
		<div class="page-header">
			<h1 class="font-sans text-4xl font-semibold tracking-tight text-fg md:text-5xl">Plugins</h1>
			<p class="page-subtitle mt-3 text-fg-dim md:text-lg">
				Extend Noctalia with official and community plugins
				{#if totalPluginCount > 0}
					<span class="page-subtitle-count">· {totalPluginCount} available</span>
				{/if}
			</p>
		</div>
		
		{#if loading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Loading plugins...</p>
			</div>
		{:else if error}
			<div class="error-state">
				<p>Error: {error}</p>
			</div>
		{:else}
			<div class="catalog-controls">
				<div class="search-section">
					<div class="search-container">
						<i class="ti ti-search search-icon" aria-hidden="true"></i>
						<input
							type="search"
							class="search-input"
							placeholder="Search plugins by name, description or author..."
							aria-label="Search plugins"
							bind:value={searchQuery}
							autocomplete="off"
						/>
						{#if searchQuery}
							<button
								class="search-clear"
								onclick={() => (searchQuery = '')}
								aria-label="Clear search"
							>
								<i class="ti ti-x text-lg leading-none" aria-hidden="true"></i>
							</button>
						{/if}
					</div>
				</div>

				<div class="filters-heading">
					<div class="filters-title">
						<i class="ti ti-adjustments-horizontal" aria-hidden="true"></i>
						<span>Filter plugins</span>
					</div>
					<label class="sort-control">
						<span>Sort by</span>
						<select bind:value={sortOption}>
							<option value="name">Name</option>
							<option value="updated">Recently updated</option>
						</select>
					</label>
				</div>

				<div class="filter-groups">
					{#if availableCompositors.length > 0}
						<div class="filter-group compositor-group">
							<span class="filter-label">
								<i class="ti ti-device-desktop" aria-hidden="true"></i>
								Compositor
							</span>
							<div class="tag-filters">
								<button
									class="tag-chip compositor-chip"
									class:selected={!selectedCompositor}
									aria-pressed={!selectedCompositor}
									onclick={() => (selectedCompositor = '')}
								>
									Any
								</button>
								{#each availableCompositors as compositor}
									<button
										class="tag-chip compositor-chip"
										class:selected={selectedCompositor === compositor}
										aria-pressed={selectedCompositor === compositor}
										onclick={() => toggleCompositor(compositor)}
									>
										{formatCompositor(compositor)}
									</button>
								{/each}
							</div>
						</div>
					{/if}
					<div class="filter-group">
						<span class="filter-label">Tags</span>
						<div class="tag-filters">
							<button
								class="tag-chip"
								class:selected={!selectedTag}
								aria-pressed={!selectedTag}
								onclick={() => (selectedTag = '')}
							>
								All
							</button>
							{#each availableTags as tag}
								<button
									class="tag-chip"
									class:selected={selectedTag === tag}
									aria-pressed={selectedTag === tag}
									onclick={() => toggleTag(tag)}
								>
									{tag}
								</button>
							{/each}
						</div>
					</div>

				</div>

				{#if isFiltering}
					<div class="search-results-info">
						Found {plugins.length} {plugins.length === 1 ? 'plugin' : 'plugins'}
						<button class="clear-filters-btn" onclick={clearFilters}>Clear filters</button>
					</div>
				{/if}
			</div>
			
				{#snippet pluginCard(plugin: Plugin)}
					<a href="/plugins/{plugin.source}/{plugin.id}" class="plugin-card">
						<div class="plugin-preview">
							<img
								src={getPreviewUrl(plugin)}
								alt={plugin.name}
								onerror={handleImageError}
							/>
							<div class="preview-placeholder" style="display: none;">
								<i
									class={`${getIconClass(plugin)} placeholder-icon`}
									use:ensureTablerIcon={getIconClass(plugin)}
									aria-hidden="true"
								></i>
							</div>
							<div class="preview-overlay">
								<span class="preview-text">View Details</span>
							</div>
						</div>
						<div class="plugin-info">
							<div class="plugin-name-row">
								<span class="plugin-icon" aria-hidden="true">
									<i
										class={getIconClass(plugin)}
										use:ensureTablerIcon={getIconClass(plugin)}
									></i>
								</span>
								<h3 class="plugin-name">{plugin.name}</h3>
								{#if plugin.source === 'official'}
									<span class="official-badge" title="Official Plugin">
										<i class="ti ti-shield-check text-base leading-none" aria-hidden="true"></i>
									</span>
								{/if}
							</div>
							<p class="plugin-description">{plugin.description}</p>
							{#if plugin.tags && plugin.tags.length > 0}
								<div class="plugin-tags">
									{#each plugin.tags as tag}
										<span class="plugin-tag" class:compositor={isCompositorTag(tag)}>
											{#if isCompositorTag(tag)}
												<i class="ti ti-device-desktop" aria-hidden="true"></i>
											{/if}
											{isCompositorTag(tag) ? formatCompositor(tag) : tag}
										</span>
									{/each}
								</div>
							{/if}
							<div class="plugin-footer">
								<span class="plugin-author">{plugin.author.split('<')[0].trim()}</span>
								<span class="plugin-version">v{plugin.version}</span>
							</div>
						</div>
					</a>
				{/snippet}

				{#if isFiltering && plugins.length === 0}
					<div class="no-results">
						<i class="ti ti-search-off no-results-icon" aria-hidden="true"></i>
						<h3>No plugins found</h3>
						<p>Try adjusting your filters or <button class="clear-search-link" onclick={clearFilters}>clear all filters</button></p>
					</div>
				{:else}
					<div class="plugins-section">
						<h2 class="section-title">
							Official Plugins
							{#if totalOfficialCount > 0}
								<span class="section-count">
									{#if isFiltering}({officialPlugins.length} of {totalOfficialCount}){:else}({totalOfficialCount}){/if}
								</span>
							{/if}
						</h2>
						{#if officialPlugins.length > 0}
							<div class="plugins-grid">
								{#each officialPlugins as plugin}
									{@render pluginCard(plugin)}
								{/each}
							</div>
						{:else}
							<p class="source-empty">No official plugins match your filters.</p>
						{/if}
					</div>

					<hr class="source-separator" />

					<div class="plugins-section">
						<h2 class="section-title">
							Community Plugins
							{#if totalCommunityCount > 0}
								<span class="section-count">
									{#if isFiltering}({communityPlugins.length} of {totalCommunityCount}){:else}({totalCommunityCount}){/if}
								</span>
							{/if}
						</h2>
						{#if communityPlugins.length > 0}
							<div class="plugins-grid">
								{#each communityPlugins as plugin}
									{@render pluginCard(plugin)}
								{/each}
							</div>
						{:else if isFiltering}
							<p class="source-empty">No community plugins match your filters.</p>
						{:else}
							<div class="source-coming-soon">
								<div class="coming-soon-icon">🌱</div>
								<h3>Community plugins are coming soon</h3>
								<p>Build your own and share it with the Noctalia community.</p>
							</div>
						{/if}
					</div>
				{/if}
		{/if}
	</div>
</main>

<SiteFooter />
<ScrollToTop />

<style>
	.plugins-page {
		min-height: 60vh;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}
	
	.catalog-controls {
		padding: 1.25rem;
		border: 1px solid var(--mOutline);
		border-radius: 1.25rem;
		background: var(--mSurfaceVariant);
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.04);
	}

	.search-section {
		margin-bottom: 1.5rem;
	}
	
	.search-container {
		position: relative;
		display: flex;
		align-items: center;
		max-width: 600px;
		margin: 0 auto;
		background: var(--mSurfaceVariant);
		border: 2px solid var(--mOutline);
		border-radius: 1rem;
		padding: 0.75rem 1rem;
		transition: all 0.3s ease;
	}
	
	.search-container:focus-within {
		border-color: var(--mPrimary);
		box-shadow: 0 0 0 4px rgba(255, 245, 155, 0.1);
	}
	
	:global([data-theme='light']) .search-container:focus-within {
		box-shadow: 0 0 0 4px rgba(93, 101, 245, 0.1);
	}
	
	.search-icon {
		color: var(--mOnSurfaceVariant);
		font-size: 1.25rem;
		line-height: 1;
		margin-right: 0.75rem;
		flex-shrink: 0;
	}
	
	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		color: var(--mOnSurface);
		font-size: 1rem;
		font-family: inherit;
		padding: 0;
	}
	
	.search-input::placeholder {
		color: var(--mOnSurfaceVariant);
		opacity: 0.6;
	}
	
	.search-clear {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 0.5rem;
		background: transparent;
		border: none;
		color: var(--mOnSurfaceVariant);
		cursor: pointer;
		transition: all 0.2s ease;
		margin-left: 0.5rem;
		flex-shrink: 0;
	}
	
	.search-clear:hover {
		background: var(--mSurface);
		color: var(--mOnSurface);
	}

	.filters-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--mOutline);
	}

	.filters-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--mOnSurface);
		font-weight: 650;
	}

	.filters-title .ti {
		color: var(--mPrimary);
		font-size: 1.125rem;
	}

	.sort-control {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		color: var(--mOnSurfaceVariant);
		font-size: 0.875rem;
	}

	.sort-control select {
		border: 1px solid var(--mOutline);
		border-radius: 0.625rem;
		background: var(--mSurface);
		color: var(--mOnSurface);
		font: inherit;
		padding: 0.5rem 2rem 0.5rem 0.75rem;
		cursor: pointer;
	}

	.sort-control select:focus-visible {
		outline: 2px solid var(--mPrimary);
		outline-offset: 2px;
	}

	.filter-groups {
		display: grid;
		gap: 1rem;
		margin-top: 1.25rem;
	}

	.filter-group {
		display: grid;
		grid-template-columns: 7rem 1fr;
		align-items: start;
		gap: 1rem;
	}

	.filter-label {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding-top: 0.5rem;
		color: var(--mOnSurfaceVariant);
		font-size: 0.8125rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.filter-group + .filter-group {
		padding-top: 1rem;
		border-top: 1px solid var(--mOutline);
	}
	
	.search-results-info {
		text-align: center;
		margin-top: 1rem;
		color: var(--mOnSurfaceVariant);
		font-size: 0.9375rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.clear-filters-btn {
		background: transparent;
		border: 1px solid var(--mOutline);
		color: var(--mOnSurfaceVariant);
		padding: 0.25rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.clear-filters-btn:hover {
		background: var(--mSurfaceVariant);
		border-color: var(--mPrimary);
		color: var(--mPrimary);
	}

	.tag-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: flex-start;
	}

	.tag-chip {
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		border: 1px solid rgb(33 33 95 / 0.75);
		background: rgb(17 17 45 / 0.88);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		color: var(--mOnSurfaceVariant);
		font-size: 0.875rem;
		cursor: pointer;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease,
			box-shadow 0.2s ease;
		flex: 0 0 auto;
		text-align: center;
		min-width: fit-content;
		max-width: 12rem;
		box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.05);
	}

	.tag-chip:hover {
		border-color: rgb(255 245 155 / 0.35);
		background: rgb(21 21 56 / 0.92);
		color: var(--mPrimary);
		box-shadow:
			inset 0 1px 0 0 rgb(255 255 255 / 0.06),
			0 0 20px -8px rgb(255 245 155 / 0.15);
	}

	.tag-chip.selected {
		background: var(--mPrimary);
		border-color: rgb(255 245 155 / 0.55);
		color: var(--mOnPrimary);
		box-shadow:
			0 8px 24px -10px rgb(255 245 155 / 0.35),
			inset 0 1px 0 0 rgb(255 255 255 / 0.25);
	}

	.compositor-chip {
		border-color: color-mix(in srgb, var(--mPrimary) 28%, var(--mOutline));
	}

	.compositor-chip:not(.selected) {
		color: var(--mPrimary);
	}

	.no-results {
		text-align: center;
		padding: 4rem 2rem;
		color: var(--mOnSurfaceVariant);
	}
	
	.no-results-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.5;
	}
	
	.no-results h3 {
		font-size: 1.5rem;
		color: var(--mOnSurface);
		margin-bottom: 0.5rem;
	}
	
	.no-results p {
		font-size: 1rem;
		line-height: 1.6;
	}
	
	.clear-search-link {
		background: none;
		border: none;
		color: var(--mPrimary);
		cursor: pointer;
		text-decoration: underline;
		font-family: inherit;
		font-size: inherit;
		padding: 0;
	}
	
	.clear-search-link:hover {
		color: var(--mPrimary);
		opacity: 0.8;
	}
	
	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		gap: 1rem;
		color: var(--mOnSurfaceVariant);
	}
	
	.spinner {
		width: 48px;
		height: 48px;
		border: 3px solid var(--mOutline);
		border-top-color: var(--mPrimary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	
	.plugins-section {
		margin-top: 4rem;
	}

	.section-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--mOnSurface);
		margin-bottom: 2rem;
		letter-spacing: -0.02em;
	}

	.section-count {
		font-size: 1.25rem;
		font-weight: 500;
		color: var(--mOnSurfaceVariant);
		margin-left: 0.5rem;
		letter-spacing: 0;
	}

	.page-subtitle-count {
		font-size: 0.9em;
		opacity: 0.75;
		margin-left: 0.35rem;
	}

	.source-separator {
		margin-top: 4rem;
		border: none;
		border-top: 1px solid var(--mOutline);
	}

	.source-empty {
		color: var(--mOnSurfaceVariant);
		font-size: 1rem;
	}

	.source-coming-soon {
		text-align: center;
		padding: 3rem 2rem;
		border: 1px dashed var(--mOutline);
		border-radius: 1rem;
		background: var(--mSurfaceVariant);
		color: var(--mOnSurfaceVariant);
	}

	.coming-soon-icon {
		font-size: 3rem;
		margin-bottom: 0.75rem;
		opacity: 0.7;
	}

	.source-coming-soon h3 {
		font-size: 1.5rem;
		color: var(--mOnSurface);
		margin-bottom: 0.5rem;
	}

	.source-coming-soon p {
		font-size: 1rem;
		line-height: 1.6;
	}

	.plugins-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2rem;
	}
	
	.plugin-card {
		border-radius: 1rem;
		background: var(--mSurfaceVariant);
		border: 1px solid var(--mOutline);
		overflow: hidden;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		flex-direction: column;
		text-align: left;
		padding: 0;
		width: 100%;
		text-decoration: none;
		color: inherit;
	}
	
	.plugin-card:hover {
		transform: translateY(-4px);
		border-color: var(--mPrimary);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2), 0 0 24px rgba(255, 245, 155, 0.15);
	}
	
	:global([data-theme='light']) .plugin-card:hover {
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1), 0 0 24px rgba(93, 101, 245, 0.1);
	}
	
	.plugin-preview {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--mSurface);
	}
	
	.plugin-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}
	
	.plugin-card:hover .plugin-preview img {
		transform: scale(1.05);
	}
	
	.preview-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--mSurfaceVariant), var(--mSurface));
		color: var(--mOnSurfaceVariant);
		gap: 0.5rem;
	}
	
	.placeholder-icon {
		font-size: 3rem;
		opacity: 0.5;
	}
	
	.preview-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s ease;
		backdrop-filter: blur(4px);
	}
	
	.plugin-card:hover .preview-overlay {
		opacity: 1;
	}
	
	.preview-text {
		color: white;
		font-weight: 600;
		font-size: 1.125rem;
	}
	
	.plugin-info {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		flex: 1;
	}
	
	.plugin-name-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.plugin-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid color-mix(in srgb, var(--mPrimary) 30%, var(--mOutline));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--mPrimary) 10%, transparent);
		color: var(--mPrimary);
		font-size: 1.125rem;
		flex-shrink: 0;
	}

	.plugin-name {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--mOnSurface);
		letter-spacing: -0.01em;
	}

	.official-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--mPrimary);
		flex-shrink: 0;
	}

	.official-badge .ti {
		filter: drop-shadow(0 0 4px rgba(255, 245, 155, 0.4));
	}

	:global([data-theme='light']) .official-badge .ti {
		filter: drop-shadow(0 0 4px rgba(93, 101, 245, 0.3));
	}

	.plugin-description {
		color: var(--mOnSurfaceVariant);
		line-height: 1.6;
		font-size: 0.9375rem;
		flex: 1;
	}

	.plugin-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin-top: 0.25rem;
	}

	.plugin-tag {
		padding: 0.125rem 0.5rem;
		border-radius: 1rem;
		background: var(--mSurface);
		color: var(--mOnSurfaceVariant);
		font-size: 0.75rem;
		border: 1px solid var(--mOutline);
	}

	.plugin-tag.compositor {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		border-color: color-mix(in srgb, var(--mPrimary) 30%, var(--mOutline));
		color: var(--mPrimary);
	}
	
	.plugin-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 0.75rem;
		border-top: 1px solid var(--mOutline);
	}
	
	.plugin-author {
		color: var(--mOnSurfaceVariant);
		font-size: 0.875rem;
	}
	
	.plugin-version {
		color: var(--mPrimary);
		font-size: 0.875rem;
		font-weight: 600;
		background: rgba(255, 245, 155, 0.15);
		padding: 0.25rem 0.75rem;
		border-radius: 0.375rem;
	}
	
	:global([data-theme='light']) .plugin-version {
		background: rgba(93, 101, 245, 0.1);
		color: var(--mPrimary);
	}
	
	@media (max-width: 1200px) {
		.plugins-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 900px) {
		.plugins-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.catalog-controls {
			padding: 1rem;
		}

		.filters-heading {
			align-items: flex-start;
			flex-direction: column;
		}

		.filter-group {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.filter-label {
			padding-top: 0;
		}

		.plugins-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
