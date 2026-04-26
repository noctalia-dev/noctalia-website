export type StackRow = { layer: string; library: string };

export const stackRows: StackRow[] = [
	{ layer: 'Wayland core', library: '`libwayland-client`, `wayland-scanner`, `wayland-protocols`' },
	{ layer: 'Surfaces', library: '`xdg-shell`, `zwlr-layer-shell-v1`' },
	{ layer: 'Multi-monitor', library: '`zxdg-output-unstable-v1`' },
	{
		layer: 'Active window metadata',
		library: '`zwlr-foreign-toplevel-management-unstable-v1`'
	},
	{ layer: 'Workspaces', library: '`ext-workspace-v1`, `dwl-ipc-unstable-v2`' },
	{ layer: 'Clipboard', library: '`ext-data-control-v1`, `wlr-data-control-unstable-v1`' },
	{ layer: 'Activation', library: '`xdg-activation-v1`' },
	{ layer: 'Lockscreen', library: '`ext-session-lock-v1`' },
	{ layer: 'Idle', library: '`ext-idle-notify-v1`, `idle-inhibit-unstable-v1`' },
	{ layer: 'Cursor', library: '`wp-cursor-shape-v1`' },
	{ layer: 'Keyboard', library: '`xkbcommon`' },
	{ layer: 'Rendering', library: '`EGL`, `OpenGL ES 3`, `wayland-egl`' },
	{
		layer: 'Text',
		library: '`cairo`, `pango`, `pangocairo`, `freetype`, `harfbuzz`, `fontconfig`'
	},
	{ layer: 'Images', library: '`Wuffs` (vendored), `nanosvg` (vendored), `libwebp`' },
	{ layer: 'IPC', library: '`sdbus-c++`' },
	{ layer: 'Audio', library: '`libpipewire`' },
	{ layer: 'Authentication', library: '`PAM`' },
	{ layer: 'HTTP', library: '`libcurl`' },
	{ layer: 'Config', library: '`tomlplusplus` (vendored)' },
	{ layer: 'JSON', library: '`nlohmann/json` (vendored)' },
	{ layer: 'Math expressions', library: '`tinyexpr` (vendored)' }
];
