import { DEFAULT_DESCRIPTION, DEFAULT_OG_TITLE, SITE_NAME } from '$lib/site-constants';

export type PageSeo = {
	title: string;
	description: string;
	/** Short label for the embed-preview badge; also the mint line on the OG art (e.g. Blog, Home). */
	pathLabel: string;
	ogType?: 'website' | 'article';
	/** Filled by `prebuild` → `node scripts/build-og.mjs` (same path the script writes under `static/`). */
	ogImagePath: string;
};

/** Result of resolving metadata for a pathname (shared with embed preview). */
export type PathSeoPreview = {
	seo: PageSeo;
	normalizedPath: string;
	notFound: boolean;
	/** True when the path is not a known prerendered route. */
	unknown: boolean;
};

export const SEO_HOME: PageSeo = {
	title: DEFAULT_OG_TITLE,
	description: DEFAULT_DESCRIPTION,
	pathLabel: 'Home',
	ogImagePath: '/og.webp'
};

export const SEO_BLOG_INDEX: PageSeo = {
	title: `Blog  -  ${SITE_NAME}`,
	description: 'News from the Noctalia team.',
	pathLabel: 'Blog',
	ogImagePath: '/og/blog.webp'
};

export const SEO_PLUGINS_INDEX: PageSeo = {
	title: `Plugins  -  ${SITE_NAME}`,
	description: 'Browse community and official plugins to extend your Noctalia setup.',
	pathLabel: 'Plugins',
	ogImagePath: '/og/plugins.webp'
};

export const SEO_THEMES: PageSeo = {
	title: `Palettes  -  ${SITE_NAME}`,
	description: 'Explore color palettes for Noctalia Shell.',
	pathLabel: 'Palettes',
	ogImagePath: '/og/palettes.webp'
};

export const SEO_PRIVACY: PageSeo = {
	title: `Privacy  -  ${SITE_NAME}`,
	description:
		'What Noctalia Shell collects, how Google Calendar OAuth works, and your rights. Open source and transparent.',
	pathLabel: 'Privacy',
	ogImagePath: '/og/privacy.webp'
};

export const SEO_EMBED_PREVIEW: PageSeo = {
	title: `Embed preview  -  ${SITE_NAME}`,
	description:
		'Preview how link unfurls can look. For development only; crawlers use each URL’s own HTML.',
	pathLabel: 'Dev',
	ogImagePath: '/og.webp'
};

export function seoBlogPost(post: { slug: string; title: string; description: string }): PageSeo {
	return {
		title: `${post.title}  -  ${SITE_NAME}`,
		description: post.description || `Blog  —  ${SITE_NAME}`,
		/** Mint line on OG art; matches the post title (not the literal words “Blog post”). */
		pathLabel: post.title,
		ogType: 'article',
		ogImagePath: `/og/blog/${post.slug}.webp`
	};
}

export function seoPlugin(plugin: { id: string; name: string; description: string }): PageSeo {
	/** Embeds / OG mint line: reads like “Plugin: Tailscale” under “Noctalia”. */
	const pathLabel = 'Plugin: ' + plugin.name;
	return {
		title: `${plugin.name}  -  ${SITE_NAME}`,
		description: plugin.description,
		pathLabel,
		ogImagePath: `/og/plugin/${plugin.id}.webp`
	};
}
