import { error } from '@sveltejs/kit';
import { getAllBlogPosts, getBlogPostBySlug } from '$lib/blog';
import { seoBlogPost } from '$lib/seo';

export async function entries() {
	const posts = await getAllBlogPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export async function load({ params }: { params: { slug: string } }) {
	const post = await getBlogPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return { post, seo: seoBlogPost(post) };
}
