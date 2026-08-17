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

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 500; // multiplied by the attempt number, so 500ms / 1000ms
const REQUEST_TIMEOUT_MS = 10_000;

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Network errors and 5xx/429 responses are worth retrying; anything else (404, 401, ...) won't succeed on retry. */
function isRetryable(status: number): boolean {
	return status === 429 || status >= 500;
}

/**
 * Fetch from the GitHub API with auth headers, a request timeout, and a few
 * retries (with backoff) on transient failures. Build-time data fetches
 * (releases, contributors, plugin registry) all go through this so they get
 * the same resilience against a flaky or momentarily-down GitHub for free.
 */
export async function githubFetch(url: string, init?: RequestInit): Promise<Response> {
	let lastError: unknown;

	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

		try {
			const response = await fetch(url, {
				...init,
				headers: { ...githubHeaders(), ...init?.headers },
				signal: controller.signal
			});

			if (response.ok || !isRetryable(response.status)) {
				return response;
			}

			lastError = new Error(`GitHub API responded ${response.status} ${response.statusText} for ${url}`);
		} catch (err) {
			lastError = err;
		} finally {
			clearTimeout(timeout);
		}

		if (attempt < MAX_ATTEMPTS) {
			await sleep(RETRY_DELAY_MS * attempt);
		}
	}

	throw lastError instanceof Error ? lastError : new Error(`GitHub fetch failed for ${url}`);
}
