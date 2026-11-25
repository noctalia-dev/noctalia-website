// src/routes/rss.xml/+server.ts
import { getAllBlogPosts } from '#lib/blog.js';
import { renderMarkdown } from '#lib/markdown.js';
import { getChangelogReleases } from '#lib/releases.server.js';
import { SITE_ORIGIN as SITE_URL } from '#lib/site-constants.js';
import type { RequestHandler } from './$types';

export const prerender = true;

function escapeXml(str: string) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async () => {
	const posts = (await getAllBlogPosts()).map((post) => ({
		title: post.title,
		description: post.description,
		publishedAt: new Date(post.publishedAt),
		link: `${SITE_URL}/blog/${post.slug}`
	}));

	const releases = await getChangelogReleases();

	type FeedEntry = { publishedAt: Date; xml: string };

	const postEntries: FeedEntry[] = posts.map((post) => ({
		publishedAt: post.publishedAt,
		xml: `
<item>
	<title>${escapeXml(post.title)}</title>
	<link>${escapeXml(post.link)}</link>
	<guid>${escapeXml(post.link)}</guid>
	<pubDate>${post.publishedAt.toUTCString()}</pubDate>
	<category>Blog</category>
	<description>${escapeXml(post.description)}</description>
</item>`
	}));

	const releaseEntries: FeedEntry[] = releases.map((release) => {
		const publishedAt = new Date(release.publishedAt);
		const title = `Noctalia ${release.tagName}${release.prerelease ? ' (Pre-release)' : ''}`;
		const link = `${SITE_URL}/changelogs/${encodeURIComponent(release.tagName)}`;
		const guid = release.htmlUrl || link;
		const html = renderMarkdown(release.body);

		return {
			publishedAt,
			xml: `
<item>
	<title>${escapeXml(title)}</title>
	<link>${escapeXml(link)}</link>
	<guid>${escapeXml(guid)}</guid>
	<pubDate>${publishedAt.toUTCString()}</pubDate>
	<category>Release</category>
	<description><![CDATA[${html}]]></description>
</item>`
		};
	});

	const entries = [...postEntries, ...releaseEntries].sort(
		(a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
	);

	const items = entries.map((entry) => entry.xml).join('\n');

	const lastBuildDate =
		entries.length > 0 ? entries[0].publishedAt.toUTCString() : new Date().toUTCString();

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
	<title>Noctalia</title>
	<link>${SITE_URL}/blog</link>
	<description>Blog posts and release notes from the Noctalia team.</description>
	<language>en-us</language>
	<lastBuildDate>${lastBuildDate}</lastBuildDate>
	<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
	${items}
</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8'
		}
	});
};
