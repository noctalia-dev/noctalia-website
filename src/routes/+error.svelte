<script lang="ts">
	import { page } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Navbar />

<main class="error-page">
	<div class="container">
		<div class="error-code">{page.status}</div>
		<h1 class="error-title">
			{#if page.status === 404}
				Page not found
			{:else}
				Something went wrong
			{/if}
		</h1>
		<p class="error-message">
			{#if page.status === 404}
				The page you're looking for doesn't exist or has been moved.
			{:else}
				{page.error?.message || 'An unexpected error occurred.'}
			{/if}
		</p>
		<a href="/" class="home-btn">Back to Home</a>
	</div>
</main>

<Footer />

<style>
	.error-page {
		min-height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.container {
		text-align: center;
		max-width: 500px;
	}

	.error-code {
		font-size: 8rem;
		font-weight: 800;
		line-height: 1;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 1rem;
		letter-spacing: -0.04em;
	}

	.error-title {
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--mOnSurface);
		margin-bottom: 0.75rem;
	}

	.error-message {
		font-size: 1.1rem;
		color: var(--mOnSurfaceVariant);
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.home-btn {
		display: inline-block;
		padding: 0.75rem 2rem;
		background: var(--mPrimary);
		color: var(--mOnPrimary);
		text-decoration: none;
		border-radius: 2rem;
		font-weight: 600;
		font-size: 0.95rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 8px rgba(169, 174, 254, 0.2);
	}

	.home-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(169, 174, 254, 0.4);
	}

	@media (max-width: 768px) {
		.error-code {
			font-size: 5rem;
		}

		.error-title {
			font-size: 1.35rem;
		}
	}
</style>
