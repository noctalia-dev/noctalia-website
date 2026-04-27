import { getAllBlogPosts } from '$lib/blog';
import { SEO_BLOG_INDEX } from '$lib/seo';

export async function load() {
	const posts = await getAllBlogPosts();
	return { posts, seo: SEO_BLOG_INDEX };
}
