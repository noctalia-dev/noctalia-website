import { redirect } from '@sveltejs/kit';

// The palettes page lives at /palettes now. Keep /themes working for old links.
export function load() {
	redirect(308, '/palettes');
}
