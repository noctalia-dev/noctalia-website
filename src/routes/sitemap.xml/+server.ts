import type { RequestHandler } from './$types';
import { getRegistryPlugins, isValidPlugin } from '$lib/plugins-registry.server';
import { getAllBlogPosts } from '$lib/blog';
import { SITE_ORIGIN } from '$lib/site-constants';

export const prerender = true;

const STATIC_PAGES = [
	{ path: '/',             priority: '1.0', changefreq: 'weekly' },
	{ path: '/plugins',      priority: '0.9', changefreq: 'daily'  },
	{ path: '/palettes',     priority: '0.8', changefreq: 'weekly' },
	{ path: '/blog',         priority: '0.8', changefreq: 'weekly' },
	{ path: '/contributors', priority: '0.5', changefreq: 'monthly'},
	{ path: '/privacy',      priority: '0.3', changefreq: 'yearly' },
];

function url(loc: string, opts: { lastmod?: string; changefreq: string; priority: string }) {
	return [
		'\t<url>',
		`\t\t<loc>${loc}</loc>`,
		opts.lastmod ? `\t\t<lastmod>${opts.lastmod}</lastmod>` : '',
		`\t\t<changefreq>${opts.changefreq}</changefreq>`,
		`\t\t<priority>${opts.priority}</priority>`,
		'\t</url>',
	].filter(Boolean).join('\n');
}

export const GET: RequestHandler = async () => {
	const [plugins, posts] = await Promise.all([getRegistryPlugins(), getAllBlogPosts()]);

	const entries = [
		...STATIC_PAGES.map((p) => url(`${SITE_ORIGIN}${p.path}`, p)),
		...plugins.filter(isValidPlugin).map((p) =>
			url(`${SITE_ORIGIN}/plugins/${p.id}`, {
				lastmod: typeof p.lastUpdated === 'string' ? p.lastUpdated.slice(0, 10) : undefined,
				changefreq: 'monthly',
				priority: '0.7',
			})
		),
		...posts.map((p) =>
			url(`${SITE_ORIGIN}/blog/${p.slug}`, {
				lastmod: p.publishedAt,
				changefreq: 'yearly',
				priority: '0.6',
			})
		),
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' },
	});
};
