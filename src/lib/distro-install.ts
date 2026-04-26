export const distroSnippets: Record<string, string> = {
	fedora: `sudo dnf install meson gcc-c++ just \\
  wayland-devel wayland-protocols-devel \\
  libEGL-devel mesa-libGLES-devel \\
  freetype-devel harfbuzz-devel fontconfig-devel \\
  cairo-devel pango-devel \\
  libxkbcommon-devel \\
  sdbus-cpp-devel pipewire-devel \\
  pam-devel libcurl-devel libwebp-devel \\
  libasan libubsan`,
	arch: `sudo pacman -S meson gcc just \\
  wayland wayland-protocols \\
  libglvnd freetype2 harfbuzz fontconfig \\
  cairo pango \\
  libxkbcommon \\
  sdbus-cpp libpipewire \\
  pam curl libwebp \\
  gcc-libs`,
	debian: `sudo apt install meson g++ just \\
  libwayland-dev wayland-protocols \\
  libegl-dev libgles-dev \\
  libfreetype-dev libharfbuzz-dev libfontconfig-dev \\
  libcairo2-dev libpango1.0-dev \\
  libxkbcommon-dev \\
  libsdbus-c++-dev libpipewire-0.3-dev \\
  libpam0g-dev libcurl4-openssl-dev libwebp-dev \\
  libasan8 libubsan1`
};
