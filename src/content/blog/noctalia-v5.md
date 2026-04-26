---
title: Announcing Noctalia v5
description: Rewritten for total control and peak performance.
publishedAt: 2026-04-24
author: Noctalia Team
tags: announcement, rewrite, v5
---

Today, we’re officially talking about **Noctalia v5** - a ground-up rewrite in C++ designed for total control and long-term stability.

[![Noctalia v5 preview](/v5.png)](/v5.png)

Transitions are rarely easy, but they are often necessary. After about a year of building Noctalia on our first-generation Qt-based stack, we’ve reached a crossroads.

While that architecture allowed us to prototype quickly and grow our community, we eventually hit a wall where the toolkit's abstractions began to conflict with our vision for a lean, high-performance Wayland shell.

### Why the switch?

The move to our own implementation isn't about "language wars"; it’s about ownership. When you build on a general-purpose UI toolkit, you inherit its assumptions, its overhead, and its quirks. By moving away from Qt, we get to own the whole stack - the event loop, rendering, input handling, all of it.

Here's what pushed us over the edge:

* **Memory usage was out of hand.** The old stack was eating roughly **300 MB of RAM per monitor**. That's a heavy tax, especially for multi-monitor setups or older hardware. In v5, we're already down to about **one-sixth of that** while delivering the same core features.
* **Packaging was a nightmare.** Every Qt update meant recompiling the old shell build. Dependency mismatches were common. Dropping Qt entirely means v5 is much easier to package and much less likely to break when your distro updates.
* **JavaScript overhead added up.** Launchers, widgets, and logic fragments stacked up over time. v5 cuts out the complex bindings and engine overhead, giving us direct control over performance.

### Built for performance, not compromise

One of our core goals has always been that Noctalia should run well on your machine, whether it's a beefy workstation or a modest laptop. With the old stack, we were starting to feel the pull between "adding cool features" and "staying lightweight." We didn't want to keep making that trade-off.

**v5 lets us do both.**

Because this architecture is shaped specifically around Noctalia - rather than a toolkit designed to serve a million different use cases - we get:

* **More deterministic behavior.** We’ve replaced "magic" background property updates with explicit, predictable logic, eliminating the resource spikes and logic headaches that come with toolkit-managed bindings.
* **A cleaner foundation** for the plugin system we've been planning.
* **A codebase we can maintain long-term**, with all the lessons from the past year baked in from day one.

### The honest trade-offs

A rewrite isn't free, and we want to be upfront about what this means:

1. **Old plugins won't work.** If you built something with QML, it will need to be ported. We know that stings, but the new plugin system will be worth the effort. While the workflow will be different, the performance gains will more than make up for it.
2. **Feature adjustments.** Some UI elements, like the attached panel on the bar, are being re-evaluated. If we decide to drop or change a feature, it’s strictly to ensure peak performance and stability.

### What about Noctalia V4?
With development shifting to v5, Noctalia V4 is entering maintenance mode and its codebase will be frozen. We want to be honest with you: we don't have the staff or the bandwidth to actively maintain two versions in parallel, and there will most likely be no new releases of V4 going forward. While we'll do our best to address issues where we can, don't expect the same level of support as before. The path forward is v5.

### What comes next

That earlier stack did its job. It proved our ideas had legs and brought us a community we're incredibly grateful for. v5 is about taking those ideas and giving them a home that can last, no matter how far we take it.

It won't be perfect on day one. But it's going to be faster, more stable, and built to grow with you for years to come.

Thanks for sticking with us. The best is yet to come.