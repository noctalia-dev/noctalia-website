<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import SiteHeader from '$lib/site-header.svelte';
	import ProjectIntro from '$lib/project-intro.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
	import Fuse from 'fuse.js';
	import PluginRecommendations from '$lib/plugin-recommendations.svelte';
	import { pluginMetricKey } from '$lib/plugin-identity';
	import { pluginMetrics, refreshPluginMetrics } from '$lib/plugin-metrics';

	interface Plugin {
		id: string;
		catalogId: string;
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
	let selectedTags = $state<string[]>([]);
	let selectedCompositors = $state<string[]>([]);
	let availableTags = $state<string[]>([]);
	let availableCompositors = $state<string[]>([]);
	let sortOption = $state<'name' | 'updated' | 'recommendations' | 'trending'>('name');

	const COMPOSITORS = ['niri', 'hyprland', 'umbriel', 'mangowc', 'sway', 'labwc', 'scroll'];

	function sortPlugins(items: Plugin[]): Plugin[] {
		return items.sort((a, b) => {
			if (sortOption === 'updated') {
				const byUpdated = (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
				if (byUpdated !== 0) return byUpdated;
			}
			if (sortOption === 'recommendations' || sortOption === 'trending') {
				const field = sortOption === 'recommendations' ? 'recommendations' : 'trendingScore';
				const aKey = pluginMetricKey(a.source, a.catalogId);
				const bKey = pluginMetricKey(b.source, b.catalogId);
				const aValue = aKey === null ? undefined : $pluginMetrics?.get(aKey)?.[field];
				const bValue = bKey === null ? undefined : $pluginMetrics?.get(bKey)?.[field];
				if (aValue === undefined && bValue !== undefined) return 1;
				if (aValue !== undefined && bValue === undefined) return -1;
				if (aValue !== undefined && bValue !== undefined && aValue !== bValue) {
					return bValue - aValue;
				}
			}
			return a.name.localeCompare(b.name);
		});
	}

	// Split the filtered list into the two sources rendered as separate sections.
	let officialPlugins = $derived(
		sortPlugins(plugins.filter((plugin) => plugin.source === 'official'))
	);
	let communityPlugins = $derived(
		sortPlugins(plugins.filter((plugin) => plugin.source !== 'official'))
	);
	// Does the catalog contain any community plugins at all (ignoring filters)?
	let hasCommunitySource = $derived(allPlugins.some((plugin) => plugin.source !== 'official'));
	let isFiltering = $derived(
		Boolean(searchQuery || selectedTags.length > 0 || selectedCompositors.length > 0)
	);

	let totalOfficialCount = $derived(allPlugins.filter((p) => p.source === 'official').length);
	let totalCommunityCount = $derived(allPlugins.filter((p) => p.source !== 'official').length);
	let totalPluginCount = $derived(allPlugins.length);

	onMount(() => {
		void refreshPluginMetrics();
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

		// Preserve direct links to either a regular tag or a compositor.
		const urlTag = $page.url.searchParams.get('tag');
		if (urlTag && availableCompositors.includes(urlTag)) {
			selectedCompositors = [urlTag];
		} else if (urlTag && availableTags.includes(urlTag)) {
			selectedTags = [urlTag];
		}
	});

	$effect(() => {
		let filtered = allPlugins;

		// Apply tag filter (OR logic - show plugins matching any selected tag)
		if (selectedTags.length > 0) {
			filtered = filtered.filter((plugin) =>
				selectedTags.some((tag) => plugin.tags?.includes(tag))
			);
		}

		// Filter groups combine with AND, while each group permits one active choice.
		if (selectedCompositors.length > 0) {
			filtered = filtered.filter((plugin) =>
				selectedCompositors.some((compositor) => plugin.tags?.includes(compositor))
			);
		}

		// Apply search filter
		if (fuse && searchQuery.trim()) {
			const results = fuse.search(searchQuery);
			const searchIds = new Set(results.map((r) => r.item.id));
			filtered = filtered.filter((plugin) => searchIds.has(plugin.id));
		}

		plugins = filtered;
	});

	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = [];
		} else {
			selectedTags = [tag];
		}
	}

	function toggleCompositor(compositor: string) {
		if (selectedCompositors.includes(compositor)) {
			selectedCompositors = [];
		} else {
			selectedCompositors = [compositor];
		}
	}

	function clearFilters() {
		selectedTags = [];
		selectedCompositors = [];
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

<main class="plugins-page pb-20 md:pb-28">
	<ProjectIntro
		title="Plugins"
		eyebrow="Noctalia Shell ecosystem"
		logoUrl="https://assets.noctalia.dev/noctalia-logo.svg"
		summary="Add the tools that make your desktop yours."
		detail="Browse official and community plugins for Noctalia Shell. Find widgets, integrations, and small utilities, then narrow the catalog to your compositor and the way you work."
		anchorHref="#catalog"
		anchorLabel="Explore the catalog"
	>
		{#snippet actions()}
			<a
				href="#catalog"
				class="btn-primary-glow inline-flex items-center gap-3 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:brightness-105"
			>
				Browse plugins <span aria-hidden="true">↓</span>
			</a>
			<a
				href="https://github.com/noctalia-dev/community-plugins"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-fg-dim transition-colors hover:text-accent-2"
			>
				Share a plugin <span aria-hidden="true">↗</span>
			</a>
		{/snippet}
	</ProjectIntro>

	<section id="catalog" class="site-shell catalog-shell" aria-label="Plugin catalog">
		<div class="catalog-heading">
			<p>Official &amp; community</p>
			{#if totalPluginCount > 0}<p>{totalPluginCount} plugins to explore</p>{/if}
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
							placeholder="Search by name, description, or author"
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
						<span>Find your fit</span>
					</div>
					<label class="sort-control">
						<span>Sort by</span>
						<select bind:value={sortOption}>
							<option value="name">Name</option>
							<option value="updated">Recently updated</option>
							{#if $pluginMetrics !== null}
								<option value="recommendations">Most upvoted</option>
								<option value="trending">Trending</option>
							{/if}
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
									class:selected={selectedCompositors.length === 0}
									aria-pressed={selectedCompositors.length === 0}
									onclick={() => (selectedCompositors = [])}
								>
									Any
								</button>
								{#each availableCompositors as compositor}
									<button
										class="tag-chip compositor-chip"
										class:selected={selectedCompositors.includes(compositor)}
										aria-pressed={selectedCompositors.includes(compositor)}
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
								class:selected={selectedTags.length === 0}
								aria-pressed={selectedTags.length === 0}
								onclick={() => (selectedTags = [])}
							>
								All
							</button>
							{#each availableTags as tag}
								<button
									class="tag-chip"
									class:selected={selectedTags.includes(tag)}
									aria-pressed={selectedTags.includes(tag)}
									onclick={() => toggleTag(tag)}
								>
									{tag}
								</button>
							{/each}
						</div>
					</div>
				</div>

				{#if isFiltering}
					<div class="search-results-info" role="status">
						Found {plugins.length}
						{plugins.length === 1 ? 'plugin' : 'plugins'}
						<button class="clear-filters-btn" onclick={clearFilters}>Clear filters</button>
					</div>
				{/if}
			</div>

			{#snippet pluginCard(plugin: Plugin)}
				<a href="/plugins/{plugin.source}/{plugin.id}" class="plugin-card">
					<div class="plugin-preview">
						<img
							src={getPreviewUrl(plugin)}
							alt=""
							loading="lazy"
							decoding="async"
							onerror={handleImageError}
						/>
						<div class="preview-placeholder" style="display: none;">
							<i
								class={`${getIconClass(plugin)} placeholder-icon`}
								use:ensureTablerIcon={getIconClass(plugin)}
								aria-hidden="true"
							></i>
						</div>
						<span class="preview-arrow" aria-hidden="true">↗</span>
					</div>
					<div class="plugin-info">
						<div class="plugin-name-row">
							<span class="plugin-icon" aria-hidden="true">
								<i class={getIconClass(plugin)} use:ensureTablerIcon={getIconClass(plugin)}></i>
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
							<span class="plugin-author" title={plugin.author.split('<')[0].trim()}>
								<i class="ti ti-user" aria-hidden="true"></i>
								<span class="plugin-author-name">{plugin.author.split('<')[0].trim()}</span>
							</span>
							<span class="plugin-stats">
								<PluginRecommendations source={plugin.source} catalogId={plugin.catalogId} badge />
								<span class="plugin-version">v{plugin.version}</span>
							</span>
						</div>
					</div>
				</a>
			{/snippet}

			{#if isFiltering && plugins.length === 0}
				<div class="no-results">
					<i class="ti ti-search-off no-results-icon" aria-hidden="true"></i>
					<h3>No plugins found</h3>
					<p>
						Try adjusting your filters or <button class="clear-search-link" onclick={clearFilters}
							>clear all filters</button
						>
					</p>
				</div>
			{:else}
				<div class="plugins-section">
					<h2 class="section-title font-sans text-3xl font-semibold tracking-tight md:text-4xl">
						Official plugins
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
					<h2 class="section-title font-sans text-3xl font-semibold tracking-tight md:text-4xl">
						Community plugins
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
							<i class="ti ti-puzzle coming-soon-icon" aria-hidden="true"></i>
							<h3>There’s room for your idea.</h3>
							<p>Build your own and share it with the Noctalia community.</p>
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	</section>
</main>

<SiteFooter />
<ScrollToTop />

<style>
	.plugins-page {
		min-height: 60vh;
	}
	.catalog-shell {
		padding-top: 3rem;
		scroll-margin-top: 6rem;
	}
	.catalog-heading {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem 2rem;
		margin-bottom: 1.5rem;
		font-size: 0.75rem;
		color: var(--color-fg-dim);
	}
	.catalog-heading p:first-child {
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-accent-2);
	}
	.catalog-controls {
		padding-bottom: 1.75rem;
		border-bottom: 1px solid var(--color-border);
	}
	.search-section {
		margin-bottom: 1.75rem;
	}
	.search-container {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0.9rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background: color-mix(in srgb, var(--color-void) 75%, transparent);
		transition:
			border-color 180ms,
			box-shadow 180ms;
	}
	.search-container:focus-within {
		border-color: var(--color-accent-2);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent-2) 12%, transparent);
	}
	.search-icon {
		flex-shrink: 0;
		margin-right: 0.75rem;
		font-size: 1.15rem;
		line-height: 1;
		color: var(--color-fg-dim);
	}
	.search-input {
		flex: 1;
		min-width: 0;
		padding: 0;
		border: none;
		outline: none;
		background: transparent;
		font: inherit;
		font-size: 0.95rem;
		color: var(--color-fg);
	}
	.search-input::placeholder {
		color: var(--color-fg-dim);
	}
	.search-clear {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		margin-left: 0.5rem;
		border-radius: 0.2rem;
		color: var(--color-fg-dim);
		cursor: pointer;
	}
	.search-clear:hover {
		color: var(--color-accent-2);
	}
	.filters-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.filters-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--color-fg);
	}
	.filters-title .ti {
		color: var(--color-accent-2);
		font-size: 1.1rem;
	}
	.sort-control {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		font-size: 0.75rem;
		color: var(--color-fg-dim);
	}
	.sort-control select {
		padding: 0.5rem 1.8rem 0.5rem 0.65rem;
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		background: var(--color-void);
		font: inherit;
		color: var(--color-fg);
		cursor: pointer;
	}
	.sort-control select:focus-visible {
		outline: 2px solid var(--color-accent-2);
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
		padding-top: 0.4rem;
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--color-fg-dim);
	}
	.tag-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.tag-chip {
		padding: 0.35rem 0.7rem;
		border: 1px solid transparent;
		border-radius: 0.25rem;
		background: transparent;
		font: inherit;
		font-size: 0.75rem;
		text-align: center;
		color: var(--color-fg-dim);
		cursor: pointer;
		transition:
			border-color 180ms,
			background-color 180ms,
			color 180ms;
	}
	.tag-chip:hover {
		color: var(--color-fg);
		border-color: var(--color-border);
	}
	.tag-chip.selected {
		border-color: color-mix(in srgb, var(--color-accent-2) 35%, transparent);
		background: color-mix(in srgb, var(--color-accent-2) 8%, transparent);
		color: var(--color-accent-2);
	}
	.search-results-info {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1.5rem;
		font-size: 0.8rem;
		color: var(--color-fg-dim);
	}
	.clear-filters-btn,
	.clear-search-link {
		padding: 0;
		border-radius: 0.15rem;
		font: inherit;
		color: var(--color-accent-2);
		text-decoration: underline;
		text-underline-offset: 0.25rem;
		cursor: pointer;
	}
	.clear-filters-btn:hover,
	.clear-search-link:hover {
		color: var(--color-accent);
	}
	.plugins-section {
		margin-top: 3.5rem;
	}
	.section-title {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem 1rem;
		margin-bottom: 2rem;
		color: var(--color-fg);
	}
	.section-count {
		font-size: 0.85rem;
		font-weight: 400;
		color: var(--color-fg-dim);
		letter-spacing: 0;
	}
	.source-separator {
		margin-top: 3.5rem;
		border: none;
		border-top: 1px solid var(--color-border);
	}
	.source-empty {
		color: var(--color-fg-dim);
		font-size: 0.95rem;
	}
	.plugins-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1.5rem;
	}
	.plugin-card {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-width: 0;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--color-border) 75%, transparent);
		border-radius: 0.375rem;
		background: color-mix(in srgb, var(--color-void) 60%, transparent);
		text-align: left;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 180ms,
			background-color 180ms;
	}
	.plugin-card:hover,
	.plugin-card:focus-visible {
		border-color: color-mix(in srgb, var(--color-accent-2) 55%, var(--color-border));
		background: color-mix(in srgb, var(--color-void) 90%, transparent);
	}
	.plugin-card:focus-visible {
		outline: 2px solid var(--color-accent-2);
		outline-offset: 4px;
	}
	.plugin-preview {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--color-void);
		border-bottom: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
	}
	.plugin-preview img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.preview-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background:
			radial-gradient(
				ellipse at 70% 100%,
				color-mix(in srgb, var(--color-accent-3) 12%, transparent),
				transparent 70%
			),
			var(--color-void);
		color: var(--color-accent-3);
	}
	.placeholder-icon {
		font-size: 3rem;
		opacity: 0.5;
	}
	.preview-arrow {
		position: absolute;
		right: 0.75rem;
		bottom: 0.65rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.7rem;
		height: 1.7rem;
		border: 1px solid color-mix(in srgb, var(--color-accent-2) 35%, transparent);
		border-radius: 50%;
		background: var(--color-void-deep);
		color: var(--color-accent-2);
		opacity: 0;
		transform: translate(-0.2rem, 0.2rem);
		transition:
			opacity 180ms,
			transform 180ms;
	}
	.plugin-card:hover .preview-arrow,
	.plugin-card:focus-visible .preview-arrow {
		opacity: 1;
		transform: none;
	}
	.plugin-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 0.8rem;
		padding: 1.15rem;
	}
	.plugin-name-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}
	.plugin-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--color-accent-2);
		font-size: 1.15rem;
	}
	.plugin-name {
		min-width: 0;
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.4;
		letter-spacing: -0.02em;
		overflow-wrap: anywhere;
		color: var(--color-fg);
	}
	.official-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--color-accent-2);
	}
	.plugin-description {
		flex: 1;
		font-size: 0.875rem;
		line-height: 1.7;
		color: var(--color-fg-dim);
	}
	.plugin-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 0.5rem;
	}
	.plugin-tag {
		padding: 0.1rem 0.35rem;
		border: 1px solid color-mix(in srgb, var(--color-border) 75%, transparent);
		border-radius: 0.2rem;
		font-size: 0.65rem;
		color: var(--color-fg-dim);
	}
	.plugin-tag.compositor {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		color: var(--color-accent-2);
		border-color: color-mix(in srgb, var(--color-accent-2) 22%, var(--color-border));
	}
	.plugin-footer {
		--plugin-meta-font-size: 0.72rem;
		--plugin-meta-horizontal-padding: 0.4rem;
		--plugin-meta-vertical-padding: 0.2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding-top: 0.8rem;
		border-top: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
	}
	.plugin-author {
		display: inline-flex;
		flex: 1 1 0;
		align-items: center;
		gap: 0.3rem;
		min-width: 0;
		color: var(--color-fg-dim);
		font-size: var(--plugin-meta-font-size);
	}
	.plugin-author .ti {
		flex-shrink: 0;
	}
	.plugin-author-name {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.plugin-stats {
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		gap: 0.4rem;
	}
	.plugin-version {
		font-size: var(--plugin-meta-font-size);
		font-weight: 500;
		color: var(--color-fg-dim);
	}
	.no-results,
	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 4rem 1rem;
		color: var(--color-fg-dim);
		text-align: center;
	}
	.no-results-icon {
		font-size: 2rem;
		opacity: 0.6;
	}
	.no-results h3,
	.source-coming-soon h3 {
		font-size: 1.25rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: var(--color-fg);
	}
	.no-results p,
	.source-coming-soon p {
		font-size: 0.9rem;
		line-height: 1.7;
	}
	.source-coming-soon {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 2rem 0;
		color: var(--color-fg-dim);
	}
	.coming-soon-icon {
		font-size: 1.5rem;
		color: var(--color-accent-2);
	}
	.spinner {
		width: 2rem;
		height: 2rem;
		border: 2px solid var(--color-border);
		border-top-color: var(--color-accent-2);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (max-width: 1200px) {
		.plugins-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (max-width: 900px) {
		.plugins-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.catalog-shell {
			padding-top: 2.5rem;
		}
		.filters-heading {
			align-items: flex-start;
			flex-direction: column;
		}
		.sort-control {
			justify-content: space-between;
			width: 100%;
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
			gap: 1.25rem;
		}
		.plugin-info {
			padding: 1.15rem;
		}
		.plugin-description {
			font-size: 0.875rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.search-container,
		.tag-chip,
		.plugin-card,
		.preview-arrow {
			transition: none;
		}
		.spinner {
			animation: none;
		}
	}
</style>
