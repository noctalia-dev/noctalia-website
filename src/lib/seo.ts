import { SITE_NAME } from '#lib/site-constants.js';
import { SEO_CHANGELOG_INDEX } from '#lib/seo-pages.js';

export type PageSeo = {
	title: string;
	description: string;
	/** Mint line on the OG art (e.g. Blog, Home). */
	pathLabel: string;
	ogType?: 'website' | 'article';
	/** Filled by `prebuild` → `node scripts/build-og.mjs` (same path the script writes under `static/`). */
	ogImagePath: string;
};

export const SEO_NOT_FOUND: PageSeo = {
	title: `Page not found  -  ${SITE_NAME}`,
	description: 'This page does not exist or was moved.',
	pathLabel: 'Not found',
	ogImagePath: '/og.webp'
};

export function seoBlogPost(post: { slug: string; title: string; description: string }): PageSeo {
	return {
		title: `${post.title}  -  ${SITE_NAME}`,
		description: post.description || `Blog - ${SITE_NAME}`,
		/** Mint line on OG art; matches the post title (not the literal words “Blog post”). */
		pathLabel: post.title,
		ogType: 'article',
		ogImagePath: `/og/blog/${post.slug}.webp`
	};
}

export function seoChangelogRelease(release: { tagName: string }): PageSeo {
	return {
		title: `${release.tagName} release notes  -  ${SITE_NAME}`,
		description: `What changed in Noctalia ${release.tagName}.`,
		pathLabel: `Release ${release.tagName}`,
		ogType: 'article',
		ogImagePath: SEO_CHANGELOG_INDEX.ogImagePath
	};
}

export function seoPlugin(plugin: {
	id: string;
	source: string;
	name: string;
	description: string;
}): PageSeo {
	/** Embeds / OG mint line: reads like “Plugin: Tailscale” under “Noctalia”. */
	const pathLabel = 'Plugin: ' + plugin.name;
	return {
		title: `${plugin.name}  -  ${SITE_NAME}`,
		description: plugin.description,
		pathLabel,
		ogImagePath: `/og/plugin/${plugin.source}/${plugin.id}.webp`
	};
}
