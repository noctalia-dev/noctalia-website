import tablerCss from '../routes/tabler-icons.css?raw';

/** Icon names shipped in the site's Tabler stylesheet (`.ti-<name>:before`). */
const TABLER_ICONS = new Set(
	Array.from(tablerCss.matchAll(/\.ti-([a-z0-9-]+):before/g), (match) => match[1])
);

/** Returns the icon name if this Tabler build has it, otherwise `undefined`. */
export function knownTablerIcon(name: string | undefined): string | undefined {
	const icon = name?.trim();
	return icon && TABLER_ICONS.has(icon) ? icon : undefined;
}
