import { getAllBlogPosts } from '#lib/blog.js';
import { SEO_BLOG_INDEX } from '#lib/seo.js';

export async function load() {
	const posts = await getAllBlogPosts();
	return { posts, seo: SEO_BLOG_INDEX };
}
