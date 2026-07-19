<script lang="ts">
	import SiteHeader from '$lib/site-header.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import ScrollToTop from '$lib/scroll-to-top.svelte';
</script>

<SiteHeader />

<main class="site-main">
	<div class="site-shell">
		<header class="mb-10 text-center md:mb-12">
			<h1 class="font-sans text-4xl font-semibold tracking-tight text-fg md:text-5xl">
				Our Ethos
			</h1>
			<p class="mt-3 text-fg-dim">How we work with the people who use and build Noctalia.</p>
		</header>

		<div class="mx-auto max-w-4xl card-surface space-y-10 p-6 md:p-10">
			<p class="text-lg leading-relaxed text-fg-dim">
				Noctalia is free and open source, built and maintained by a small team in our spare time.
				What you get from us - the software, the fixes, the features - is a gift, not a service
				we owe you. We enjoy building this and we want to keep enjoying it, so here is how we
				think about that relationship.
			</p>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					What you can expect from us
				</h2>
				<ul class="list-none space-y-2 text-fg-dim">
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Working software, freely licensed:</strong> no strings attached,
						no paywall, no bait and switch.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Feature requests we genuinely consider:</strong> we read them,
						we discuss them, and we've already shipped plenty of user-requested features when they
						fit the project.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Bug fixes, as our time allows:</strong> real bugs get fixed. Not
						always immediately, but they don't get ignored either.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						<strong class="text-fg">Honesty about our limits:</strong> if something isn't going to
						happen, we'll say so instead of leaving you hanging.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					What we don't promise
				</h2>
				<p class="text-fg-dim">
					A gift exchange is not a support contract. That means:
				</p>
				<ul class="list-none space-y-2 text-fg-dim">
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						No one is owed a specific review timeline, merge date, or release for their PR or
						feature request.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						No guaranteed response time on Discord, GitHub issues, or anywhere else.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						No commitment that a given feature, plugin, or PR will land at all, even if it's
						well-made - it also has to fit where the project is going.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					On following up
				</h2>
				<p class="text-fg-dim">
					We're a small team maintaining this alongside our own jobs and lives. If you've opened
					a PR or issue, one polite nudge after a reasonable wait is completely fine - things do
					fall through the cracks and a reminder helps.
				</p>
				<p class="text-fg-dim">
					Pinging us daily on Discord with "please review my PR" does not speed things up. It
					doesn't jump the queue - if anything, it takes time away from actually reviewing code,
					which slows everyone down. Ask once, then trust us to get to it. We will.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					How to actually help your PR get attention
				</h2>
				<ul class="list-none space-y-2 text-fg-dim">
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Keep it small and focused. One change, one purpose - it's easier to review and easier
						to merge.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Explain the "why", not just the "what". A clear description saves us the time of
						reverse-engineering your intent.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Follow the existing code style and conventions already in the repository.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						For bugs, include clear reproduction steps. "It's broken" is much harder to act on
						than "here's exactly how to trigger it".
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Be patient. Patience is, in practice, the single biggest thing that helps.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					A few ground rules
				</h2>
				<ul class="list-none space-y-2 text-fg-dim">
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Be respectful. Disagreement about a design decision is fine; hostility, entitlement,
						or pressure tactics are not.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						No harassment of maintainers or other contributors, on Discord, GitHub, or anywhere
						else connected to this project.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						Repeated demands after a maintainer has already answered aren't persistence, they're
						pressure - and they don't work on us.
					</li>
					<li
						class="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
					>
						We'll mute, remove, or ban anyone who makes the community a worse place to be in.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					Give back if you can
				</h2>
				<p class="text-fg-dim">
					If Noctalia is useful to you, we'd love your help - code, documentation, testing,
					translations, or well-written bug reports all genuinely move the project forward. But
					you don't have to contribute anything at all. The software stays free either way. That's
					the exchange: we give what we can, you take what you need, and anything you give back is
					a gift too - not a debt being repaid.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="border-b border-border/40 pb-2 font-sans text-xl font-semibold text-fg">
					Contact
				</h2>
				<p class="text-fg-dim">
					Questions about any of this? Reach us on
					<a
						href="https://discord.noctalia.dev"
						class="text-accent underline-offset-4 hover:underline"
						target="_blank"
						rel="noopener noreferrer">Discord</a
					>
					or open an issue on our
					<a
						href="https://github.com/noctalia-dev/noctalia"
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
