# noctalia-website

The official website for [Noctalia](https://noctalia.dev), built with SvelteKit and deployed as a static site.

## Setup

```sh
npm install
```

## Developing

```sh
npm run dev
```

## Building

```sh
npm run build
```

Preview the production build with `npm run preview`.

`prebuild` also cuts the Tabler icon font down to the icons the site and the plugin manifests use
(`npm run icons`; full set in `scripts/tabler-icons/`). Use a new icon as a literal `ti-<name>` class
so the script finds it.

## Testing

```sh
npm test
```

## Dependency security

Use `npm ci` to install the audited lockfile and `npm audit` to check for new advisories.

The overrides in `package.json` require patched `postcss-selector-parser` (7.1.6+) for
Tailwind Typography, which pins a vulnerable 6.x version, and `source-map-js` (1.2.2+)
for the CSS build pipeline. Keep these security minimums when refreshing dependencies.
