export const TRANSLATE_URL = 'https://i18n.noctalia.dev';

export type Translator = {
	login: string;
	name: string | null;
	avatarUrl: string;
	profileUrl: string;
	/** Distinct non-English strings translated, across all projects. */
	strings: number;
	locales: string[];
};

type RawTranslator = {
	login?: unknown;
	name?: unknown;
	avatarUrl?: unknown;
	strings?: unknown;
	locales?: unknown;
};

/**
 * Translators from noctalia-translate's public credits endpoint. Never fails the
 * build: on any error the page renders its empty state instead. Plain `fetch`, not
 * `githubFetch`, so the GitHub token is never sent to this host.
 */
export async function getTranslators(): Promise<Translator[]> {
	try {
		const response = await fetch(`${TRANSLATE_URL}/api/translators`, {
			signal: AbortSignal.timeout(10_000)
		});
		if (!response.ok) {
			console.error('Failed to fetch translators, status:', response.status);
			return [];
		}
		const body = (await response.json()) as { translators?: unknown };
		if (!Array.isArray(body.translators)) {
			console.error('Failed to fetch translators: unexpected response shape');
			return [];
		}
		return (body.translators as RawTranslator[]).flatMap((raw) => {
			if (typeof raw.login !== 'string' || typeof raw.strings !== 'number') return [];
			return [
				{
					login: raw.login,
					name: typeof raw.name === 'string' ? raw.name : null,
					avatarUrl:
						typeof raw.avatarUrl === 'string' ? raw.avatarUrl : `https://github.com/${raw.login}.png`,
					profileUrl: `https://github.com/${raw.login}`,
					strings: raw.strings,
					locales: Array.isArray(raw.locales)
						? raw.locales.filter((l): l is string => typeof l === 'string')
						: []
				}
			];
		});
	} catch (err) {
		console.error('Failed to fetch translators:', err);
		return [];
	}
}
