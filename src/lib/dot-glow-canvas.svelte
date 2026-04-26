<script lang="ts">
	import { onMount } from 'svelte';

	/** Matches `layout.css` `.page-canvas` dot grid */
	const GRID = 24;
	const LAYER1 = { ox: 1, oy: 1 };
	const LAYER2 = { ox: 13, oy: 13 };
	const NEIGHBOR = 7;
	const MAX_DIST = 92;
	const FULL_BRIGHT = 11;
	const POINTER_SMOOTH = 0.42;
	const POINTER_SNAP_SQ = 0.45;
	/** Nodes  -  softer than filaments */
	const DOT_INTENSITY = 0.32;
	/** Diagonal segments  -  balanced, not “neon” */
	const LINE_INTENSITY = 1.06;
	/** Fewer segments = less visual pile-up near the cursor */
	const DIAG_EDGE_KEEP = 0.52;

	type GlowCell = { dcx: number; dcy: number; a: number };

	type FancyFrame = {
		t: number;
		breath: number;
		aurora: number;
		speedBoost: number;
	};

	type RGB = { r: number; g: number; b: number };

	function parseCssColor(value: string): RGB {
		const s = value.trim();
		const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
		if (hex) {
			let h = hex[1]!;
			if (h.length === 3) h = [...h].map((c) => c + c).join('');
			const n = parseInt(h, 16);
			return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
		}
		const rgb = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
		if (rgb) return { r: +rgb[1]!, g: +rgb[2]!, b: +rgb[3]! };
		return { r: 255, g: 245, b: 155 };
	}

	function rgba(c: RGB, a: number): string {
		return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
	}

	/** Multiply toward black for readable strokes on light backgrounds */
	function shade(c: RGB, factor: number): RGB {
		return {
			r: Math.round(Math.min(255, c.r * factor)),
			g: Math.round(Math.min(255, c.g * factor)),
			b: Math.round(Math.min(255, c.b * factor))
		};
	}

	function readAccentPalette(): { primary: RGB; secondary: RGB; tertiary: RGB } {
		const cs = getComputedStyle(document.documentElement);
		return {
			primary: parseCssColor(cs.getPropertyValue('--color-accent')),
			secondary: parseCssColor(cs.getPropertyValue('--color-accent-2')),
			tertiary: parseCssColor(cs.getPropertyValue('--color-accent-3'))
		};
	}

	let canvasEl = $state<HTMLCanvasElement | null>(null);

	function setupDotGlow(canvas: HTMLCanvasElement, pageCanvas: HTMLElement): () => void {
		const maybeCtx = canvas.getContext('2d');
		if (!maybeCtx) return () => {};
		const ctx: CanvasRenderingContext2D = maybeCtx;

		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let rafId = 0;
		let cx = window.innerWidth * 0.5;
		let cy = window.innerHeight * 0.4;
		let targetX = cx;
		let targetY = cy;
		let lastCx = cx;
		let lastCy = cy;
		let smoothSpeed = 0;

		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			const w = window.innerWidth;
			const h = window.innerHeight;
			canvas.width = Math.floor(w * dpr);
			canvas.height = Math.floor(h * dpr);
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};

		const falloff = (dist: number): number => {
			if (dist >= MAX_DIST) return 0;
			if (dist <= FULL_BRIGHT) return 1;
			const u = (MAX_DIST - dist) / (MAX_DIST - FULL_BRIGHT);
			return u * u * (3 - 2 * u);
		};

		const collectLayer = (
			ox: number,
			oy: number,
			rect: DOMRect,
			map: Map<string, GlowCell>
		) => {
			const lx = cx - rect.left;
			const ly = cy - rect.top;
			const n0 = Math.round((lx - ox) / GRID);
			const m0 = Math.round((ly - oy) / GRID);

			for (let dn = -NEIGHBOR; dn <= NEIGHBOR; dn++) {
				for (let dm = -NEIGHBOR; dm <= NEIGHBOR; dm++) {
					const n = n0 + dn;
					const m = m0 + dm;
					const dcx = rect.left + ox + n * GRID;
					const dcy = rect.top + oy + m * GRID;
					const dist = Math.hypot(dcx - cx, dcy - cy);
					const a = falloff(dist);
					if (a < 0.006) continue;
					map.set(`${n},${m}`, { dcx, dcy, a });
				}
			}
		};

		/**
		 * High-entropy 0..1, stable for the same inputs (no flicker). Several mixing rounds so
		 * local grid patches don’t form regular angular motifs.
		 */
		const stableRoll = (n: number, m: number, t: number, u: number, layerSalt: number): number => {
			let x =
				Math.imul(n | 0, 0x9e3779b1) ^
				Math.imul(m | 0, 0x85ebca6b) ^
				Math.imul(t | 0, 0xc2b2ae35) ^
				Math.imul(u | 0, 0x27d4eb2d) ^
				Math.imul(layerSalt | 0, 0x165667b1);
			x = (x ^ (x >>> 16)) >>> 0;
			x = Math.imul(x, 0x7feb352d);
			x = (x ^ (x >>> 15)) >>> 0;
			x = Math.imul(x, 0x83d385e7);
			x = (x ^ (x >>> 13)) >>> 0;
			x = Math.imul(x, 0xd6e8feb7);
			x = (x ^ (x >>> 17)) >>> 0;
			return x / 4294967296;
		};

		const drawFilaments = (
			map: Map<string, GlowCell>,
			f: FancyFrame,
			layerIdx: number,
			light: boolean,
			pal: { primary: RGB; secondary: RGB; tertiary: RGB }
		) => {
			const layerSalt = layerIdx * 0x51edc003 + 0x31415926;

			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			const a0 = 0.55 + 0.45 * f.aurora;

			for (const [key, cell] of map) {
				const comma = key.indexOf(',');
				const n = Number(key.slice(0, comma));
				const m = Number(key.slice(comma + 1));

				/* At most one diagonal per cell → no small closed diamonds / cross hubs */
				const useDownRight = stableRoll(n, m, 0xa11, 0x5ee, layerSalt) < 0.5;
				const dn = 1;
				const dm = useDownRight ? 1 : -1;

				const other = map.get(`${n + dn},${m + dm}`);
				if (!other) continue;
				if (stableRoll(n, m, dn + 0x700, dm + 0x700, layerSalt) > DIAG_EDGE_KEEP) continue;

				let lineA = Math.min(cell.a, other.a) * LINE_INTENSITY * f.breath;
				lineA *= 1 + 0.11 * f.speedBoost;
				if (lineA < 0.028) continue;

				/* Slight endpoint jitter  -  breaks perfect 45° symmetry */
				const j1 = stableRoll(n, m, dn + 0xd00, dm + 0xd00, layerSalt);
				const j2 = stableRoll(n, m, dn + 0xe00, dm + 0xe00, layerSalt);
				const ox = (j1 - 0.5) * 3.8;
				const oy = (j2 - 0.5) * 3.8;
				const x0 = cell.dcx + ox * 0.35;
				const y0 = cell.dcy + oy * 0.35;
				const x1 = other.dcx - ox * 0.22;
				const y1 = other.dcy - oy * 0.22;

				const { primary: p, secondary: s, tertiary: t } = pal;

				if (light) {
					/* Primary-tinted ink on pale ground  -  `lighter` blend would wash out */
					const deep = shade(p, 0.38);
					const mid = shade(p, 0.58);
					ctx.strokeStyle = rgba(deep, 0.36 * lineA);
					ctx.lineWidth = 1.2 + 1.35 * lineA;
					ctx.shadowColor = rgba(shade(p, 0.32), 0.4 * lineA);
					ctx.shadowBlur = 8 + 15 * lineA;
					ctx.beginPath();
					ctx.moveTo(x0, y0);
					ctx.lineTo(x1, y1);
					ctx.stroke();
					ctx.shadowBlur = 0;

					const grad = ctx.createLinearGradient(x0, y0, x1, y1);
					const w0 = 0.32 * lineA;
					const w1 = 0.28 * lineA;
					grad.addColorStop(0, rgba(p, w0 * a0 * 0.52));
					grad.addColorStop(0.45, rgba(mid, w1 * 0.95));
					grad.addColorStop(1, rgba(shade(p, 0.48), w1 * (1.05 - 0.25 * f.aurora)));

					ctx.strokeStyle = grad;
					ctx.lineWidth = 0.72 + 0.82 * lineA;
					ctx.shadowColor = rgba(deep, 0.34 * lineA);
					ctx.shadowBlur = 4.5 + 11 * lineA;
					ctx.beginPath();
					ctx.moveTo(x0, y0);
					ctx.lineTo(x1, y1);
					ctx.stroke();
					ctx.shadowBlur = 0;
					continue;
				}

				/* Wide soft underglow  -  theme secondary */
				ctx.strokeStyle = rgba(s, 0.17 * lineA);
				ctx.lineWidth = 1.35 + 1.45 * lineA;
				ctx.shadowColor = rgba(s, 0.44 * lineA);
				ctx.shadowBlur = 9 + 18 * lineA;
				ctx.beginPath();
				ctx.moveTo(x0, y0);
				ctx.lineTo(x1, y1);
				ctx.stroke();
				ctx.shadowBlur = 0;

				const g = ctx.createLinearGradient(x0, y0, x1, y1);
				const w0 = 0.27 * lineA;
				const w1 = 0.23 * lineA;
				g.addColorStop(0, rgba(p, w0 * a0));
				g.addColorStop(0.45, rgba(s, w1));
				g.addColorStop(1, rgba(t, w1 * (1.08 - 0.28 * f.aurora)));

				ctx.strokeStyle = g;
				ctx.lineWidth = 0.76 + 0.86 * lineA;
				ctx.shadowColor = rgba(p, 0.4 * lineA);
				ctx.shadowBlur = 5.5 + 12.5 * lineA;
				ctx.beginPath();
				ctx.moveTo(x0, y0);
				ctx.lineTo(x1, y1);
				ctx.stroke();
				ctx.shadowBlur = 0;
			}
		};

		const drawDots = (
			map: Map<string, GlowCell>,
			f: FancyFrame,
			light: boolean,
			pal: { primary: RGB; secondary: RGB }
		) => {
			const { primary: p, secondary: s } = pal;

			for (const { dcx, dcy, a } of map.values()) {
				let g = a * DOT_INTENSITY * f.breath;
				g *= 1 + 0.06 * f.speedBoost;

				const rCore = 1.06 + 1.15 * g;
				const blur = 4.5 + 7 * g;

				if (light) {
					const core = shade(p, 0.52);
					ctx.shadowColor = rgba(shade(p, 0.4), 0.48 * g);
					ctx.shadowBlur = blur;
					ctx.fillStyle = rgba(core, 0.44 * g);
					ctx.beginPath();
					ctx.arc(dcx, dcy, rCore, 0, Math.PI * 2);
					ctx.fill();

					ctx.shadowBlur = 0;
					ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * g})`;
					ctx.beginPath();
					ctx.arc(dcx, dcy, 0.96 + 0.14 * g, 0, Math.PI * 2);
					ctx.fill();
					continue;
				}

				ctx.shadowColor = rgba(s, 0.28 * g);
				ctx.shadowBlur = blur;
				ctx.fillStyle = rgba(p, 0.24 * g);
				ctx.beginPath();
				ctx.arc(dcx, dcy, rCore, 0, Math.PI * 2);
				ctx.fill();

				ctx.shadowBlur = 0;
				ctx.fillStyle = `rgba(255, 255, 255, ${0.13 * g})`;
				ctx.beginPath();
				ctx.arc(dcx, dcy, 0.96 + 0.14 * g, 0, Math.PI * 2);
				ctx.fill();
			}
		};

		const draw = () => {
			const rect = pageCanvas.getBoundingClientRect();
			const w = window.innerWidth;
			const h = window.innerHeight;
			ctx.clearRect(0, 0, w, h);

			const vx = cx - lastCx;
			const vy = cy - lastCy;
			lastCx = cx;
			lastCy = cy;
			const instant = Math.hypot(vx, vy);
			smoothSpeed += (Math.min(95, instant) - smoothSpeed) * 0.14;
			const speedBoost = Math.min(1, smoothSpeed / 52);

			const now = performance.now();
			const t = now * 0.001;
			const breath = 0.9 + 0.1 * Math.sin(t * 2.35);
			const aurora = 0.5 + 0.5 * Math.sin(t * 0.72 + 1.1);

			const fancy: FancyFrame = { t, breath, aurora, speedBoost };

			const layers = [LAYER1, LAYER2] as const;
			const maps = [new Map<string, GlowCell>(), new Map<string, GlowCell>()];

			for (let i = 0; i < layers.length; i++) {
				const { ox, oy } = layers[i];
				collectLayer(ox, oy, rect, maps[i]!);
			}

			const light = document.documentElement.getAttribute('data-theme') === 'light';
			const pal = readAccentPalette();

			ctx.save();
			ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';

			for (let i = 0; i < maps.length; i++) {
				drawFilaments(maps[i]!, fancy, i, light, pal);
			}
			for (const map of maps) {
				drawDots(map, fancy, light, pal);
			}

			ctx.restore();
		};

		const tick = () => {
			rafId = requestAnimationFrame(tick);
			if (document.hidden) return;

			const dx = targetX - cx;
			const dy = targetY - cy;
			const distSq = dx * dx + dy * dy;

			if (distSq > POINTER_SNAP_SQ) {
				cx += dx * POINTER_SMOOTH;
				cy += dy * POINTER_SMOOTH;
			} else {
				cx = targetX;
				cy = targetY;
			}

			draw();
		};

		const onPointerMove = (e: PointerEvent) => {
			targetX = e.clientX;
			targetY = e.clientY;
		};

		const onResize = () => {
			resize();
		};

		resize();
		rafId = requestAnimationFrame(tick);

		window.addEventListener('pointermove', onPointerMove, { passive: true });
		window.addEventListener('resize', onResize);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('resize', onResize);
		};
	}

	onMount(() => {
		const canvas = canvasEl;
		if (!canvas || typeof window === 'undefined') return;

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const coarse = window.matchMedia('(pointer: coarse)').matches;
		if (reduceMotion || coarse) return;

		const pageCanvas = canvas.closest('.page-canvas');
		if (!(pageCanvas instanceof HTMLElement)) return;

		return setupDotGlow(canvas, pageCanvas);
	});
</script>

<canvas
	class="dot-glow-canvas"
	bind:this={canvasEl}
	aria-hidden="true"
></canvas>
