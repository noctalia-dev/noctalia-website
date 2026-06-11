// src/routes/rss.xml/+server.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';

export const prerender = true;

const SITE_URL = 'https://noctalia.dev';
const BLOG_DIR = path.resolve('src/content/blog');

function escapeXml(str: string) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function parseFrontmatter(source: string) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return null;

	const raw = match[1];
	const lines = raw.split(/\r?\n/);
	const data: Record<string, string | string[]> = {};

	for (const line of lines) {
		const idx = line.indexOf(':');
		if (idx === -1) continue;

		const key = line.slice(0, idx).trim();
		const value = line.slice(idx + 1).trim();

		if (key === 'tags') {
			data[key] = value
				.split(',')
				.map((tag) => tag.trim())
				.filter(Boolean);
		} else {
			data[key] = value;
		}
	}

	return data;
}

export const GET: RequestHandler = async () => {
	const files = await fs.readdir(BLOG_DIR);

	const posts = (
		await Promise.all(
			files
				.filter((file) => file.endsWith('.md'))
				.map(async (file) => {
					const fullPath = path.join(BLOG_DIR, file);
					const source = await fs.readFile(fullPath, 'utf8');
					const data = parseFrontmatter(source);

					if (!data?.title || !data?.publishedAt) {
						return null;
					}

					const slug = file.replace(/\.md$/, '');

					return {
						title: String(data.title),
						description: String(data.description ?? ''),
						author: String(data.author ?? 'Noctalia Team'),
						tags: Array.isArray(data.tags) ? data.tags : [],
						publishedAt: new Date(String(data.publishedAt)),
						link: `${SITE_URL}/blog/${slug}`
					};
				})
		)
	)
		.filter((post): post is NonNullable<typeof post> => post !== null)
		.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

	const items = posts
		.map(
			(post) => `
<item>
	<title>${escapeXml(post.title)}</title>
	<link>${escapeXml(post.link)}</link>
	<guid>${escapeXml(post.link)}</guid>
	<pubDate>${post.publishedAt.toUTCString()}</pubDate>
	<description>${escapeXml(post.description)}</description>
</item>`
		)
		.join('\n');

	const lastBuildDate =
		posts.length > 0
			? posts[0].publishedAt.toUTCString()
			: new Date().toUTCString();

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
	<title>Noctalia Blog</title>
	<link>${SITE_URL}/blog</link>
	<description>Noctalia blog updates</description>
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