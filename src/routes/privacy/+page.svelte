<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
</script>

<SiteHeader />

<main class="site-main">
	<div class="site-shell--narrow">
		<header class="mb-10 text-center md:mb-12">
			<h1 class="font-sans text-4xl font-semibold tracking-tight text-fg md:text-5xl">
				Privacy Policy
			</h1>
			<p class="mt-3 text-fg-dim">Last updated: May 30, 2026</p>
		</header>

		<div class="card-surface space-y-10 p-6 md:p-10">
			<p class="text-lg leading-relaxed text-fg-dim">
				We believe that open source software should be transparent about what it does. This policy
				describes exactly what data Noctalia Shell collects or accesses, why we collect or access
				it, and how we handle it.
			</p>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					Core principles
				</h2>
				<ul class="list-none space-y-2 text-fg-dim">
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Telemetry is opt-in:</strong> Telemetry is disabled by default. You
						choose whether to enable it.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Calendar access is optional:</strong> Google Calendar access is used
						only when you connect your Google account.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Calendar data stays local:</strong> Noctalia Shell reads calendar
						data locally on your device. Calendar content is not sent to or stored on Noctalia servers.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Short telemetry retention:</strong> Telemetry data is kept for a maximum
						of 30 days, then permanently deleted.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					Telemetry data we collect
				</h2>
				<p class="text-fg-dim">When you opt in to telemetry, we collect:</p>
				<ul class="list-none space-y-2 text-fg-dim">
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Instance ID:</strong> A random identifier to distinguish installations
						(not tied to your identity).
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Version:</strong> Noctalia Shell version.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">System info:</strong> Compositor (e.g., Niri, Hyprland), OS name and
						version, total RAM.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Monitor info:</strong> Resolution (width, height) and scale factor
						for each connected monitor.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">UI settings:</strong> Scale ratio and font scale factors.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					Why we collect telemetry
				</h2>
				<p class="text-fg-dim">
					Telemetry helps us make better decisions about Noctalia Shell development:
				</p>
				<ul class="list-none space-y-2 text-fg-dim">
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Compositor &amp; OS data:</strong> Helps us prioritize support and
						testing for the most used environments.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Monitor &amp; UI settings:</strong> Helps us understand real-world
						display configurations and optimize layouts.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Version info:</strong> Helps us track adoption of new releases and
						identify upgrade issues.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					What telemetry does not collect
				</h2>
				<ul class="list-none space-y-2 text-fg-dim">
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Personal information (name, email, IP address, location).
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						File contents, feature usage, or keystrokes.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Any data that can identify you personally.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					Telemetry storage &amp; retention
				</h2>
				<ul class="list-none space-y-2 text-fg-dim">
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Telemetry data is stored securely at
						<a
							href="https://noctalia.dev"
							class="text-accent underline-offset-4 hover:underline"
							target="_blank"
							rel="noopener noreferrer">noctalia.dev</a
						>
						on our private bare metal server hosted at OVH - Canada.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Data is automatically deleted after 30 days.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						We do not share or sell telemetry data to third parties.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					Google Calendar OAuth
				</h2>
				<p class="text-fg-dim">
					The Google Calendar integration is optional and requires you to sign in with Google and
					approve the requested calendar permissions.
				</p>
				<ul class="list-none space-y-2 text-fg-dim">
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Noctalia Shell reads your Google Calendar data locally on your device to display
						calendar information in the shell.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Our OAuth broker at <span class="text-fg">api.noctalia.dev</span> only relays OAuth tokens
						required to complete the Google sign-in and token refresh flow.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<span class="font-medium text-fg"
							>For Google Calendar OAuth, api.noctalia.dev stores nothing:</span
						>
						it does not store OAuth tokens, Google account details, or calendar content.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						No calendar content, including event titles, descriptions, attendees, locations, times,
						or calendar lists, is sent to or stored on Noctalia servers.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Calendar data is not used for telemetry, analytics, advertising, or sold or shared with
						third parties.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					Your control
				</h2>
				<ul class="list-none space-y-2 text-fg-dim">
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						You can disable telemetry at any time in Noctalia Shell settings.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						You can disconnect Google Calendar in Noctalia Shell or revoke Noctalia's access from
						your Google Account at any time.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						The telemetry module is fully open-source and auditable in our
						<a
							href="https://github.com/noctalia-dev/noctalia-shell"
							class="text-accent underline-offset-4 hover:underline"
							target="_blank"
							rel="noopener noreferrer">GitHub repository</a
						>.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					Right to deletion
				</h2>
				<p class="text-fg-dim">
					You have the right to request deletion of telemetry data associated with your Instance ID
					at any time. Contact us on
					<a
						href="https://discord.noctalia.dev"
						class="text-accent underline-offset-4 hover:underline"
						target="_blank"
						rel="noopener noreferrer">Discord</a
					>
					with your Instance ID and we will remove that telemetry data from our servers. Noctalia servers
					do not store Google Calendar content or OAuth tokens, so there is no calendar data to delete
					from Noctalia servers.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					Contact
				</h2>
				<p class="text-fg-dim">
					For questions or concerns, open an issue on our
					<a
						href="https://github.com/noctalia-dev/noctalia-shell"
						class="text-accent underline-offset-4 hover:underline"
						target="_blank"
						rel="noopener noreferrer">GitHub repository</a
					>.
				</p>
			</section>
		</div>
	</div>
</main>

<SiteFooter />
<ScrollToTop />
