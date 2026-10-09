import { writable } from 'svelte/store';
import { pluginMetricKey } from './plugin-identity';

const METRICS_URL = 'https://api.noctalia.dev/v1/plugin-metrics';
const MAX_CACHE_MS = 60_000;

type Metrics = ReadonlyMap<string, number>;
const metricsStore = writable<Metrics | null>(null);
export const pluginMetrics = { subscribe: metricsStore.subscribe };

let cachedMetrics: Metrics | null = null;
let etag: string | null = null;
let freshUntil = 0;
let retryAt = 0;
let inFlight: Promise<void> | null = null;

export function parsePluginMetrics(value: unknown): Metrics {
	if (!value || typeof value !== 'object') throw new Error('Invalid plugin metrics document');
	const document = value as Record<string, unknown>;
	if (
		document.schema !== 1 ||
		typeof document.generated_at !== 'string' ||
		!Array.isArray(document.plugins)
	) {
		throw new Error('Unsupported or invalid plugin metrics schema');
	}

	const metrics = new Map<string, number>();
	for (const value of document.plugins) {
		if (!value || typeof value !== 'object') throw new Error('Invalid plugin metric');
		const row = value as Record<string, unknown>;
		if (
			typeof row.key !== 'string' ||
			metrics.has(row.key) ||
			typeof row.recommendations !== 'number' ||
			!Number.isSafeInteger(row.recommendations) ||
			row.recommendations < 0 ||
			typeof row.trending_score !== 'number' ||
			!Number.isFinite(row.trending_score) ||
			row.trending_score < 0
		) {
			throw new Error('Invalid plugin metric');
		}
		const colon = row.key.indexOf(':');
		if (pluginMetricKey(row.key.slice(0, colon), row.key.slice(colon + 1)) !== row.key) {
			throw new Error('Invalid plugin metric key');
		}
		metrics.set(row.key, row.recommendations);
	}
	return metrics;
}

async function fetchMetrics(): Promise<void> {
	try {
		const response = await fetch(METRICS_URL, {
			headers: etag ? { 'If-None-Match': etag } : {},
			cache: 'no-cache',
			signal: AbortSignal.timeout(10_000)
		});
		if (response.status === 304) {
			if (!cachedMetrics) throw new Error('Plugin metrics cache is missing');
		} else if (response.ok) {
			cachedMetrics = parsePluginMetrics(await response.json());
		} else {
			throw new Error(`Plugin metrics returned HTTP ${response.status}`);
		}

		etag = response.headers.get('ETag');
		const maxAge = response.headers
			.get('Cache-Control')
			?.match(/(?:^|,)\s*max-age=(\d+)\s*(?=,|$)/);
		freshUntil = Date.now() + (maxAge ? Math.min(Number(maxAge[1]) * 1000, MAX_CACHE_MS) : 0);
		retryAt = 0;
		metricsStore.set(cachedMetrics);
	} catch (error) {
		freshUntil = 0;
		retryAt = Date.now() + MAX_CACHE_MS;
		metricsStore.set(null);
		console.warn('Plugin recommendation counts are unavailable:', error);
	}
}

// Called once by each plugin page; concurrent page requests share the aggregate fetch.
export function refreshPluginMetrics(): Promise<void> {
	if (inFlight) return inFlight;
	if (cachedMetrics && Date.now() < freshUntil) {
		metricsStore.set(cachedMetrics);
		return Promise.resolve();
	}
	if (Date.now() < retryAt) return Promise.resolve();
	inFlight = fetchMetrics().finally(() => {
		inFlight = null;
	});
	return inFlight;
}
