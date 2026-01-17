<script lang="ts">
import { onMount } from 'svelte';
import Navbar from '$lib/components/Navbar.svelte';
import Footer from '$lib/components/Footer.svelte';
import ScrollToTop from '$lib/components/ScrollToTop.svelte';
import Fuse from 'fuse.js';

interface ThemeItem {
	name: string;
	path: string;
	html_url: string;
	swatches: string[];
	darkSwatches: string[];
	lightSwatches: string[];
}

let { data } = $props<{ data: { coreThemes: ThemeItem[], communityThemes: ThemeItem[] } }>();
let coreThemes = $state<ThemeItem[]>([]);
let communityThemes = $state<ThemeItem[]>([]);
let allCoreThemes = $state<ThemeItem[]>([]);
let allCommunityThemes = $state<ThemeItem[]>([]);
let searchQuery = $state('');
let fuse: Fuse<ThemeItem & { isCore: boolean }> | null = $state(null);
let isDarkMode = $state(true);

onMount(() => {
	allCoreThemes = data.coreThemes || [];
	allCommunityThemes = data.communityThemes || [];
	coreThemes = allCoreThemes.slice();
	communityThemes = allCommunityThemes.slice();

	// Combine both for search, tagging each with isCore
	const allThemes = [
		...allCoreThemes.map(t => ({ ...t, isCore: true })),
		...allCommunityThemes.map(t => ({ ...t, isCore: false }))
	];

	fuse = new Fuse(allThemes, {
		keys: ['name'],
		threshold: 0.35,
		includeScore: true
	});

	// Detect current theme mode
	const currentTheme = document.documentElement.getAttribute('data-theme');
	isDarkMode = currentTheme !== 'light';

	// Listen for theme changes
	const observer = new MutationObserver(() => {
		const theme = document.documentElement.getAttribute('data-theme');
		isDarkMode = theme !== 'light';
	});

	observer.observe(document.documentElement, { attributes: true });
	return () => observer.disconnect();
});

$effect(() => {
	if (!searchQuery.trim() || !fuse) {
		coreThemes = allCoreThemes.slice();
		communityThemes = allCommunityThemes.slice();
		return;
	}
	const results = fuse.search(searchQuery).map((r) => r.item);
	coreThemes = results.filter(t => t.isCore);
	communityThemes = results.filter(t => !t.isCore);
});

function getSwatches(theme: ThemeItem): string[] {
	return isDarkMode ? theme.darkSwatches : theme.lightSwatches;
}

</script>

<Navbar activePage="themes" />

<section class="themes-page">
	<div class="container">
		<div class="page-header">
			<h1 class="page-title">Themes</h1>
			<p class="page-subtitle">Explore color schemes for Noctalia Shell.</p>
		</div>

		<div class="search-section">
			<div class="search-container">
				<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m21 21-4.35-4.35"></path>
				</svg>
				<input
					type="text"
					class="search-input"
					placeholder="Search themes by name..."
					bind:value={searchQuery}
					autocomplete="off"
				/>
				{#if searchQuery}
					<button
						class="search-clear"
						onclick={() => searchQuery = ''}
						aria-label="Clear search"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M18 6L6 18"></path>
							<path d="M6 6l12 12"></path>
						</svg>
					</button>
				{/if}
			</div>
			{#if searchQuery}
				<div class="search-results-info">
					Found {coreThemes.length + communityThemes.length} {coreThemes.length + communityThemes.length === 1 ? 'theme' : 'themes'}
				</div>
			{/if}
		</div>

		{#if coreThemes.length === 0 && communityThemes.length === 0}
			<div class="empty">No themes found.</div>
		{:else}
			{#if coreThemes.length > 0}
				<div class="section">
					<h2 class="section-title">Core Themes</h2>
					<p class="section-subtitle">Built-in color schemes included with Noctalia.</p>
					<div class="themes-grid">
						{#each coreThemes as theme}
							<a class="theme-card" href={theme.html_url} target="_blank" rel="noopener noreferrer">
								<div class="theme-card-header">
									<h3 class="theme-name">{theme.name}</h3>
								</div>
								<div class="swatches">
									{#each getSwatches(theme) as col}
										<div class="swatch" style="background:{col}" title={col}></div>
									{/each}
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}

			{#if communityThemes.length > 0}
				<div class="section">
					<h2 class="section-title">Community Themes</h2>
					<p class="section-subtitle">Color schemes created by the community, downloadable within Noctalia.</p>
					<div class="themes-grid">
						{#each communityThemes as theme}
							<a class="theme-card" href={theme.html_url} target="_blank" rel="noopener noreferrer">
								<div class="theme-card-header">
									<h3 class="theme-name">{theme.name}</h3>
								</div>
								<div class="swatches">
									{#each getSwatches(theme) as col}
										<div class="swatch" style="background:{col}" title={col}></div>
									{/each}
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>
</section>

<Footer />
<ScrollToTop />

<style>
	/* Page-specific styles */
		.container { max-width:1200px; margin:2rem auto; padding:0 2rem }
		.page-header {
			text-align: center;
			margin-bottom: 4rem;
		}

		.page-title {
			font-size: 3.5rem;
			font-weight: 700;
			background: linear-gradient(135deg, var(--mPrimary), var(--mPrimary));
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			letter-spacing: -0.02em;
			margin-bottom: 1rem;
		}

		.page-subtitle {
			font-size: 1.25rem;
			color: var(--mOnSurfaceVariant);
		}

		.search-section {
			margin-bottom: 3rem;
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

		.search-results-info {
			text-align: center;
			margin-top: 1rem;
			color: var(--mOnSurfaceVariant);
			font-size: 0.9375rem;
		}

	.section {
		margin-bottom: 3rem;
	}

	.section-title {
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--mOnSurface);
		margin-bottom: 0.5rem;
	}

	.section-subtitle {
		font-size: 1rem;
		color: var(--mOnSurfaceVariant);
		margin-bottom: 1.5rem;
	}

	.themes-grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap:1.5rem }
	.theme-card {
		background: var(--mSurface);
		border: 1.5px solid var(--mOutline);
		padding: 1.25rem;
		border-radius: 1rem;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-decoration: none;
		color: inherit;
		position: relative;
		overflow: hidden;
	}

	.theme-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--mPrimary), transparent);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.theme-card:hover {
		transform: translateY(-8px);
		border-color: var(--mPrimary);
		box-shadow: 0 16px 40px rgba(255, 245, 155, 0.15), 0 0 0 1px rgba(255, 245, 155, 0.2);
	}

	:global([data-theme='light']) .theme-card:hover {
		box-shadow: 0 16px 40px rgba(93, 101, 245, 0.15), 0 0 0 1px rgba(93, 101, 245, 0.2);
	}

	.theme-card-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: relative;
		z-index: 1;
	}

	.theme-name {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--mOnSurface);
		letter-spacing: -0.01em;
	}

	.swatches {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		position: relative;
		z-index: 1;
	}

	.swatch {
		width: 100%;
		aspect-ratio: 1;
		border-radius: 10px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow: none;
		transition: transform 0.2s ease;
	}

	.theme-card:hover .swatch {
		transform: scale(1.05);
	}

	.empty { padding:2rem; text-align:center; color:var(--mOnSurfaceVariant) }

	@media (max-width: 768px) {
		.themes-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
		.theme-card { padding: 1rem; }
		.theme-name { font-size: 1rem; }
		.swatches { gap: 6px; }
	}

	@media (max-width:640px) {
		.search-container { min-width: 160px }
		.swatch { width:36px; height:36px }
	}

</style>