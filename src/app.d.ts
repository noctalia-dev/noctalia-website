// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { PageSeo, PathSeoPreview } from '$lib/seo';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			seo?: PageSeo;
			/** Only on /embed-preview */
			preview?: PathSeoPreview;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
