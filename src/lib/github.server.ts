import { GITHUB_TOKEN } from '$env/static/private';

function githubHeaders(): HeadersInit {
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github.v3+json'
	};
	if (GITHUB_TOKEN) {
		headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
	}
	return headers;
}

export function githubFetch(url: string, init?: RequestInit): Promise<Response> {
	return fetch(url, { ...init, headers: { ...githubHeaders(), ...init?.headers } });
}
