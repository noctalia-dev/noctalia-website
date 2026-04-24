export interface BlogPostMeta {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	author: string;
	tags: string[];
}

export interface BlogPost extends BlogPostMeta {
	content: string;
}

function parseFrontmatter(raw: string): { meta: Omit<BlogPostMeta, 'slug'>; content: string } {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!match) {
		throw new Error('Invalid markdown frontmatter');
	}

	const [, frontmatter, body] = match;
	const fields: Record<string, string> = {};

	for (const line of frontmatter.split('\n')) {
		const separatorIndex = line.indexOf(':');
		if (separatorIndex === -1) continue;
		const key = line.slice(0, separatorIndex).trim();
		const value = line.slice(separatorIndex + 1).trim();
		fields[key] = value;
	}

	const tags =
		fields.tags
			?.split(',')
			.map((tag) => tag.trim())
			.filter(Boolean) ?? [];

	return {
		meta: {
			title: fields.title ?? 'Untitled post',
			description: fields.description ?? '',
			publishedAt: fields.publishedAt ?? new Date().toISOString().slice(0, 10),
			author: fields.author ?? 'Noctalia Team',
			tags
		},
		content: body.trim()
	};
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
	const modules = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default' });
	const posts: BlogPost[] = [];

	for (const [path, resolver] of Object.entries(modules)) {
		const raw = (await resolver()) as string;
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';
		const { meta, content } = parseFrontmatter(raw);
		posts.push({ slug, ...meta, content });
	}

	return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
	const posts = await getAllBlogPosts();
	return posts.find((post) => post.slug === slug);
}
