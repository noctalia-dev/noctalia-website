/** Canonical site origin for meta tags, Open Graph, and canonical URLs */
export const SITE_ORIGIN = 'https://noctalia.dev';

export const SITE_NAME = 'Noctalia';

export const DEFAULT_DESCRIPTION = 'Noctalia - a lightweight Wayland shell.';

/** Open Graph / Twitter `og:title` (same as the document title) */
export const DEFAULT_OG_TITLE = `${SITE_NAME}  -  Wayland Shell`;

/** Open Graph artboard (static/og.webp, from `node scripts/build-og.mjs`) */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Default card when a route has no `seo.ogImagePath` (e.g. error pages). Filled by `prebuild` → `node scripts/build-og.mjs`. */
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og.webp`;

/** Published documentation (v5) */
export const DOCS_BASE_URL = 'https://docs.noctalia.dev';
export const DOCS_INSTALLATION_URL = 'https://docs.noctalia.dev/noctalia/getting-started/installation/';
