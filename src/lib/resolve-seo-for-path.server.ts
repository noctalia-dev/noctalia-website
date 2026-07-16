import { getBlogPostBySlug } from '$lib/blog';
import { getRegistryPlugins, isValidPlugin } from '$lib/plugins-registry.server';
import { SITE_NAME } from '$lib/site-constants';
import {
	type PathSeoPreview,
	SEO_BLOG_INDEX,
	SEO_CHANGELOG_INDEX,
	SEO_CONTRIBUTORS,
	SEO_EMBED_PREVIEW,
	SEO_HOME,
	SEO_PLUGINS_INDEX,
	SEO_PRIVACY,
	SEO_PALETTES,
	seoBlogPost,
	seoPlugin
} from '$lib/seo';

function normalizePathname(raw: string): string {
	const t = raw.trim() || '/';
	if (!t.startsWith('/')) return `/${t.replace(/^\/+/, '')}`;
	// drop query/hash in case someone double-pasted
	return t.split('?')[0].split('#')[0] || '/';
}

/**
 * Resolves the same title/description the site would attach to a route, for the embed mockup.
 * Does not need to run in the same request as the real page.
 */
export async function resolveSeoForPathname(pathInput: string): Promise<PathSeoPreview> {
	const normalizedPath = normalizePathname(pathInput);
	const segments = normalizedPath.split('/').filter(Boolean);
	const [a, b, c] = segments;

	if (normalizedPath === '/' || normalizedPath === '') {
		return { seo: SEO_HOME, normalizedPath: '/', notFound: false, unknown: false };
	}
	if (normalizedPath === '/embed-preview') {
		return { seo: SEO_EMBED_PREVIEW, normalizedPath, notFound: false, unknown: false };
	}
	if (a === 'blog' && !b) {
		return { seo: SEO_BLOG_INDEX, normalizedPath, notFound: false, unknown: false };
	}
	if (a === 'blog' && b) {
		const post = await getBlogPostBySlug(b);
		if (!post) {
			return {
				seo: {
					title: `Not found  -  ${SITE_NAME}`,
					description: 'This blog post does not exist or was removed.',
					pathLabel: 'Blog',
					ogType: 'website' as const,
					ogImagePath: '/og.webp'
				},
				normalizedPath,
				notFound: true,
				unknown: false
			};
		}
		return { seo: seoBlogPost(post), normalizedPath, notFound: false, unknown: false };
	}
	if (normalizedPath === '/changelogs' || normalizedPath === '/changelogs/') {
		return { seo: SEO_CHANGELOG_INDEX, normalizedPath: '/changelogs', notFound: false, unknown: false };
	}
	if (normalizedPath === '/plugins' || normalizedPath === '/plugins/') {
		return { seo: SEO_PLUGINS_INDEX, normalizedPath: '/plugins', notFound: false, unknown: false };
	}
	if (a === 'plugins' && b && c) {
		// /plugins/<source>/<plugin> - a folder name is unique only within its source.
		const plugins = await getRegistryPlugins();
		const raw = plugins.find((p) => p.source === b && p.id === c);
		if (!raw || !isValidPlugin(raw)) {
			return {
				seo: {
					title: `Not found  -  ${SITE_NAME}`,
					description: 'This plugin is not in the public registry.',
					pathLabel: 'Plugin',
					ogType: 'website' as const,
					ogImagePath: '/og.webp'
				},
				normalizedPath,
				notFound: true,
				unknown: false
			};
		}
		return { seo: seoPlugin(raw), normalizedPath, notFound: false, unknown: false };
	}
	if (normalizedPath === '/palettes' || normalizedPath === '/palettes/') {
		return { seo: SEO_PALETTES, normalizedPath: '/palettes', notFound: false, unknown: false };
	}
	if (normalizedPath === '/privacy' || normalizedPath === '/privacy/') {
		return { seo: SEO_PRIVACY, normalizedPath: '/privacy', notFound: false, unknown: false };
	}
	if (normalizedPath === '/contributors' || normalizedPath === '/contributors/') {
		return { seo: SEO_CONTRIBUTORS, normalizedPath: '/contributors', notFound: false, unknown: false };
	}

	// e.g. /docs deep links, future routes
	return {
		seo: SEO_HOME,
		normalizedPath,
		notFound: false,
		unknown: true
	};
}
