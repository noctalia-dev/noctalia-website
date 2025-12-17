<script lang="ts">
	import { onMount } from 'svelte';
	
	let mounted = $state(false);
	
	onMount(() => {
		mounted = true;
	});
	
	const links = [
		{ label: 'GitHub', href: 'https://github.com/noctalia-dev/noctalia', icon: 'github' },
		{ label: 'Documentation', href: 'https://docs.noctalia.dev', icon: 'docs' },
		{ label: 'Discord', href: 'https://discord.noctalia.dev', icon: 'discord' }
	];
</script>

<footer class="footer" class:visible={mounted}>
	<div class="container">
		<div class="footer-content">
			<div class="footer-brand">
				<span class="footer-logo">Noctalia</span>
				<span class="footer-tagline">quiet by design</span>
			</div>
			
			<div class="footer-links">
				{#each links as link}
					<a 
						href={link.href} 
						target="_blank" 
						rel="noopener noreferrer"
						class="footer-link"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</div>
		
		<div class="footer-bottom">
			<p class="footer-copyright">
				Built with ❤️ for the Wayland community
			</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: linear-gradient(180deg, var(--mSurface) 0%, var(--mSurfaceVariant) 100%);
		border-top: 1px solid var(--mOutline);
		padding: 4rem 0 2.5rem;
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease, transform 0.6s ease;
		position: relative;
	}
	
	.footer::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--mOutline), transparent);
	}
	
	.footer.visible {
		opacity: 1;
		transform: translateY(0);
	}
	
	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3rem;
		flex-wrap: wrap;
		gap: 2rem;
	}
	
	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.footer-logo {
		font-size: 1.75rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.02em;
	}
	
	.footer-tagline {
		font-size: 0.75rem;
		color: var(--mOnSurfaceVariant);
		font-weight: 300;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		opacity: 0.8;
	}
	
	.footer-links {
		display: flex;
		gap: 2.5rem;
		flex-wrap: wrap;
	}
	
	.footer-link {
		color: var(--mOnSurfaceVariant);
		font-weight: 600;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		font-size: 1.0625rem;
		padding: 0.5rem 0;
	}
	
	.footer-link::before {
		content: '';
		position: absolute;
		inset: -4px -8px;
		background: linear-gradient(135deg, var(--mSecondary), var(--mTertiary));
		opacity: 0;
		border-radius: 0.5rem;
		transition: opacity 0.3s ease;
		z-index: -1;
	}
	
	.footer-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--mSecondary), var(--mTertiary));
		transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: 2px;
		box-shadow: 0 0 8px rgba(169, 174, 254, 0.5);
	}
	
	.footer-link:hover {
		color: var(--mSecondary);
		transform: translateY(-3px);
		text-shadow: 0 0 8px rgba(169, 174, 254, 0.3);
	}
	
	.footer-link:hover::before {
		opacity: 0.1;
	}
	
	.footer-link:hover::after {
		width: 100%;
	}
	
	.footer-bottom {
		text-align: center;
		padding-top: 2.5rem;
		border-top: 1px solid var(--mOutline);
		position: relative;
	}
	
	.footer-bottom::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--mOutline), transparent);
	}
	
	.footer-copyright {
		color: var(--mOnSurfaceVariant);
		font-size: 0.9375rem;
		opacity: 0.8;
	}
	
	@media (max-width: 768px) {
		.footer-content {
			flex-direction: column;
			align-items: flex-start;
		}
		
		.footer-links {
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>

