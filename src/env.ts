import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	GITHUB_TOKEN: {
		static: true,
		description: 'Optional GitHub API token for build-time fetches (raises rate limits).',
		schema: (value) => value || undefined
	}
});
