<script lang="ts">
	import { onMount } from 'svelte';
	
	let visible = $state(false);
	
	onMount(() => {
		const handleScroll = () => {
			visible = window.scrollY > 400;
		};
		
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // Check initial state
		
		return () => window.removeEventListener('scroll', handleScroll);
	});
	
	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<button 
	class="scroll-to-top" 
	class:visible={visible}
	onclick={scrollToTop}
	aria-label="Scroll to top"
>
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<path d="m18 15-6-6-6 6"></path>
	</svg>
</button>

<style>
	.scroll-to-top {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--mPrimary), var(--mSecondary));
		color: var(--mOnPrimary);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transform: translateY(20px) scale(0.8);
		pointer-events: none;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 
			0 4px 20px rgba(255, 245, 155, 0.3),
			0 0 0 1px rgba(255, 255, 255, 0.1) inset;
		z-index: 50;
	}
	
	.scroll-to-top.visible {
		opacity: 1;
		transform: translateY(0) scale(1);
		pointer-events: all;
	}
	
	.scroll-to-top:hover {
		transform: translateY(-4px) scale(1.1);
		box-shadow: 
			0 8px 30px rgba(255, 245, 155, 0.4),
			0 0 0 1px rgba(255, 255, 255, 0.2) inset;
		background: linear-gradient(135deg, var(--mSecondary), var(--mTertiary));
	}
	
	.scroll-to-top:active {
		transform: translateY(-2px) scale(1.05);
	}
	
	@media (max-width: 768px) {
		.scroll-to-top {
			bottom: 1.5rem;
			right: 1.5rem;
			width: 44px;
			height: 44px;
		}
	}
</style>

