import { building } from '$app/environment';
import type { ServerLoadEvent } from '@sveltejs/kit';
import { resolveSeoForPathname } from '$lib/resolve-seo-for-path.server';
import { SEO_EMBED_PREVIEW } from '$lib/seo';

export async function load({ url }: ServerLoadEvent) {
	// `url.searchParams` is not available during prerender; dev/SSR use the real query.
	const raw = !building ? url.searchParams.get('path')?.trim() || '/' : '/';
	const preview = await resolveSeoForPathname(raw);
	return { seo: SEO_EMBED_PREVIEW, preview };
}
