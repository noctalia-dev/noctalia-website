<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ScrollToTop from '$lib/components/ScrollToTop.svelte';
</script>

<Navbar />

<main class="privacy-page">
	<div class="container">
		<div class="page-header">
			<h1 class="page-title">Privacy Policy</h1>
			<p class="last-updated">Last Updated: January 17, 2026</p>
		</div>

		<div class="content">
			<p class="intro">
				We believe that open source software should be transparent about what it does. This policy describes exactly what data Noctalia Shell collects, why we collect it, and how we handle it.
			</p>

			<section class="policy-section">
				<h2>Core Principles</h2>
				<ul>
					<li><strong>Opt-in only:</strong> Telemetry is disabled by default. You choose to enable it.</li>
					<li><strong>Privacy first:</strong> We collect minimal, non-identifying system information.</li>
					<li><strong>Short retention:</strong> Data is kept for a maximum of 30 days, then permanently deleted.</li>
				</ul>
			</section>

			<section class="policy-section">
				<h2>What We Collect</h2>
				<p>When you opt in, we collect:</p>
				<ul>
					<li><strong>Instance ID:</strong> A random identifier to distinguish installations (not tied to your identity).</li>
					<li><strong>Version:</strong> Noctalia Shell version.</li>
					<li><strong>System Info:</strong> Compositor (e.g., Niri, Hyprland), OS name and version, total RAM.</li>
					<li><strong>Monitor Info:</strong> Resolution (width, height) and scale factor for each connected monitor.</li>
					<li><strong>UI Settings:</strong> Scale ratio and font scale factors.</li>
				</ul>
			</section>

			<section class="policy-section">
				<h2>Why We Collect This</h2>
				<p>This data helps us make better decisions about Noctalia Shell development:</p>
				<ul>
					<li><strong>Compositor & OS data:</strong> Helps us prioritize support and testing for the most used environments.</li>
					<li><strong>Monitor & UI settings:</strong> Helps us understand real-world display configurations and optimize layouts accordingly.</li>
					<li><strong>Version info:</strong> Helps us track adoption of new releases and identify upgrade issues.</li>
				</ul>
			</section>

			<section class="policy-section">
				<h2>What We Do NOT Collect</h2>
				<ul>
					<li>Personal information (name, email, IP address, location).</li>
					<li>File contents, feature usage, or keystrokes.</li>
					<li>Any data that can identify you personally.</li>
				</ul>
			</section>

			<section class="policy-section">
				<h2>Data Storage & Retention</h2>
				<ul>
					<li>All data is stored securely at <a href="https://noctalia.dev" target="_blank" rel="noopener noreferrer">noctalia.dev</a> on our private bare metal server hosted at OVH - Canada.</li>
					<li>Data is automatically deleted after 30 days.</li>
					<li>We do not share or sell data to third parties.</li>
				</ul>
			</section>

			<section class="policy-section">
				<h2>Your Control</h2>
				<ul>
					<li>You can disable telemetry at any time in Noctalia Shell settings.</li>
					<li>The telemetry module is fully open-source and auditable in our <a href="https://github.com/noctalia-dev/noctalia-shell" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</li>
				</ul>
			</section>

			<section class="policy-section">
				<h2>Right to Deletion</h2>
				<p>
					You have the right to request deletion of your data at any time. Contact us on <a href="https://discord.noctalia.dev" target="_blank" rel="noopener noreferrer">Discord</a> with your Instance ID and we will remove your data from our servers.
				</p>
			</section>

			<section class="policy-section">
				<h2>Contact</h2>
				<p>
					For questions or concerns, open an issue on our <a href="https://github.com/noctalia-dev/noctalia-shell" target="_blank" rel="noopener noreferrer">GitHub repository</a>.
				</p>
			</section>
		</div>
	</div>
</main>

<Footer />
<ScrollToTop />

<style>
	.privacy-page {
		min-height: 100vh;
		padding: 2rem 0 4rem;
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-title {
		font-size: 3rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--mPrimary), var(--mPrimary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.02em;
		margin-bottom: 1rem;
	}

	.last-updated {
		font-size: 1rem;
		color: var(--mOnSurfaceVariant);
	}

	.content {
		background: var(--mSurface);
		border: 1px solid var(--mOutline);
		border-radius: 1.5rem;
		padding: 2.5rem;
	}

	.intro {
		color: var(--mOnSurfaceVariant);
		font-size: 1.125rem;
		line-height: 1.7;
		margin-bottom: 2rem;
	}

	.policy-section {
		margin-bottom: 2.5rem;
		padding: 0;
	}

	.policy-section:last-child {
		margin-bottom: 0;
	}

	.policy-section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--mOnSurface);
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--mOutline);
	}

	.policy-section p {
		color: var(--mOnSurfaceVariant);
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	.policy-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.policy-section li {
		color: var(--mOnSurfaceVariant);
		line-height: 1.7;
		padding: 0.5rem 0;
		padding-left: 1.5rem;
		position: relative;
	}

	.policy-section li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 1rem;
		width: 6px;
		height: 6px;
		background: var(--mPrimary);
		border-radius: 50%;
	}

	.policy-section li strong {
		color: var(--mOnSurface);
	}

	.policy-section a {
		color: var(--mPrimary);
		text-decoration: none;
		transition: opacity 0.2s ease;
	}

	.policy-section a:hover {
		opacity: 0.8;
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.page-title {
			font-size: 2.25rem;
		}

		.content {
			padding: 1.5rem;
			border-radius: 1rem;
		}

		.policy-section h2 {
			font-size: 1.25rem;
		}
	}
</style>
