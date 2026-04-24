import { getAllBlogPosts } from '$lib/blog';

export async function load() {
	const posts = await getAllBlogPosts();
	return { posts };
}
