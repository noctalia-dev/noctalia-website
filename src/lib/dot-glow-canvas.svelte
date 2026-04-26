<script lang="ts">
	import { onMount } from 'svelte';

	type Particle = {
		x: number;
		y: number;
		homeX: number;
		homeY: number;
		vx: number;
		vy: number;
		r: number;
		weight: number;
	};

	type Cluster = {
		x: number;
		y: number;
		rx: number;
		ry: number;
		weight: number;
	};

	type RGB = { r: number; g: number; b: number };

	const PARTICLE_COUNT = 100;
	const LINK_DISTANCE = 205;
	const MOUSE_RADIUS = 165;
	const MOUSE_FORCE = 0.024;
	const MAX_SPEED = 0.2;
	const HOME_PULL = 0.0012;

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
		return { r: 169, g: 174, b: 254 };
	}

	function rgba(c: RGB, alpha: number): string {
		return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
	}

	function mix(a: RGB, b: RGB, amount: number): RGB {
		const t = Math.max(0, Math.min(1, amount));
		return {
			r: Math.round(a.r + (b.r - a.r) * t),
			g: Math.round(a.g + (b.g - a.g) * t),
			b: Math.round(a.b + (b.b - a.b) * t)
		};
	}

	function readPalette(): { line: RGB; node: RGB; highlight: RGB; lightLine: RGB } {
		const cs = getComputedStyle(document.documentElement);
		const accent = parseCssColor(cs.getPropertyValue('--color-accent'));
		const secondary = parseCssColor(cs.getPropertyValue('--color-accent-2'));
		const tertiary = parseCssColor(cs.getPropertyValue('--color-accent-3'));
		return {
			line: mix(tertiary, { r: 210, g: 218, b: 255 }, 0.28),
			node: tertiary,
			highlight: accent,
			lightLine: mix(tertiary, { r: 14, g: 14, b: 67 }, 0.24)
		};
	}

	let canvasEl = $state<HTMLCanvasElement | null>(null);

	function setupPlexus(canvas: HTMLCanvasElement): () => void {
		const maybeCtx = canvas.getContext('2d');
		if (!maybeCtx) return () => {};
		const ctx = maybeCtx;

		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let width = window.innerWidth;
		let height = window.innerHeight;
		let rafId = 0;
		let particles: Particle[] = [];
		let clusters: Cluster[] = [];
		let mouseX = 0;
		let mouseY = 0;
		let mouseActive = false;
		let palette = readPalette();

		const rand = (seed: number) => {
			const x = Math.sin(seed * 127.1) * 43758.5453123;
			return x - Math.floor(x);
		};

		const createClusters = (): Cluster[] => [
			{ x: width * 0.02, y: height * 0.2, rx: width * 0.24, ry: height * 0.42, weight: 1.15 },
			{ x: width * 0.25, y: height * 0.02, rx: width * 0.3, ry: height * 0.26, weight: 1 },
			{ x: width * 0.98, y: height * 0.2, rx: width * 0.26, ry: height * 0.43, weight: 1.15 },
			{ x: width * 0.93, y: height * 0.74, rx: width * 0.3, ry: height * 0.42, weight: 1.05 },
			{ x: width * 0.09, y: height * 0.82, rx: width * 0.31, ry: height * 0.34, weight: 1 },
			{ x: width * 0.54, y: height * 0.1, rx: width * 0.3, ry: height * 0.24, weight: 0.88 },
			{ x: width * 0.56, y: height * 0.92, rx: width * 0.31, ry: height * 0.24, weight: 0.82 },
			{ x: width * 0.54, y: height * 0.46, rx: width * 0.32, ry: height * 0.26, weight: 0.7 }
		];

		const pickCluster = (seed: number): Cluster => {
			const total = clusters.reduce((sum, cluster) => sum + cluster.weight, 0);
			let target = rand(seed) * total;
			for (const cluster of clusters) {
				target -= cluster.weight;
				if (target <= 0) return cluster;
			}
			return clusters[clusters.length - 1]!;
		};

		const createParticle = (_: unknown, i: number): Particle => {
			const cluster = pickCluster(i + 80);
			const angle = rand(i + 1) * Math.PI * 2;
			const radius = Math.sqrt(rand(i + 2));
			const x = cluster.x + Math.cos(angle) * cluster.rx * radius + (rand(i + 3) - 0.5) * 30;
			const y = cluster.y + Math.sin(angle) * cluster.ry * radius + (rand(i + 4) - 0.5) * 30;
			const speedAngle = rand(i + 5) * Math.PI * 2;
			const speed = 0.022 + rand(i + 6) * 0.055;
			const centerDistance = Math.hypot(x - width * 0.5, y - height * 0.5);
			const edgeWeight = 0.66 + Math.min(1, centerDistance / (Math.min(width, height) * 0.45)) * 0.34;
			return {
				x,
				y,
				homeX: x,
				homeY: y,
				vx: Math.cos(speedAngle) * speed,
				vy: Math.sin(speedAngle) * speed,
				r: 1 + rand(i + 7) * 1.4,
				weight: edgeWeight
			};
		};

		const rebuild = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			clusters = createClusters();
			particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
			palette = readPalette();
		};

		const repelFromMouse = (p: Particle) => {
			if (!mouseActive) return 0;

			const dx = p.x - mouseX;
			const dy = p.y - mouseY;
			const dist = Math.hypot(dx, dy);
			if (dist <= 0 || dist >= MOUSE_RADIUS) return 0;

			const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
			p.vx += (dx / dist) * force;
			p.vy += (dy / dist) * force;
			return 1 - dist / MOUSE_RADIUS;
		};

		const update = () => {
			for (const p of particles) {
				repelFromMouse(p);

				p.vx += (p.homeX - p.x) * HOME_PULL;
				p.vy += (p.homeY - p.y) * HOME_PULL;
				p.vx *= 0.992;
				p.vy *= 0.992;

				const speed = Math.hypot(p.vx, p.vy);
				if (speed > MAX_SPEED) {
					p.vx = (p.vx / speed) * MAX_SPEED;
					p.vy = (p.vy / speed) * MAX_SPEED;
				}

				p.x += p.vx;
				p.y += p.vy;

				if (p.x <= 0 || p.x >= width) {
					p.vx *= -1;
					p.x = Math.max(0, Math.min(width, p.x));
				}
				if (p.y <= 0 || p.y >= height) {
					p.vy *= -1;
					p.y = Math.max(0, Math.min(height, p.y));
				}
			}
		};

		const draw = () => {
			const light = document.documentElement.getAttribute('data-theme') === 'light';
			const lineColor = light ? palette.lightLine : palette.line;

			ctx.clearRect(0, 0, width, height);
			ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
			ctx.lineCap = 'round';

			for (let i = 0; i < particles.length; i++) {
				const a = particles[i]!;
				for (let j = i + 1; j < particles.length; j++) {
					const b = particles[j]!;
					const dx = b.x - a.x;
					const dy = b.y - a.y;
					const dist = Math.hypot(dx, dy);
					if (dist >= LINK_DISTANCE) continue;

					const proximity = 1 - dist / LINK_DISTANCE;
					const mouseGlow =
						mouseActive
							? Math.max(
									0,
									1 -
										Math.min(
											Math.hypot(a.x - mouseX, a.y - mouseY),
											Math.hypot(b.x - mouseX, b.y - mouseY)
										) /
											MOUSE_RADIUS
								)
							: 0;
					const alpha =
						(light ? 0.24 : 0.42) * proximity * Math.min(a.weight, b.weight) + mouseGlow * 0.28;

					ctx.strokeStyle = rgba(lineColor, alpha * 0.36);
					ctx.lineWidth = 2.4 + proximity * 1.8;
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.stroke();

					ctx.strokeStyle = rgba(lineColor, alpha);
					ctx.lineWidth = 0.9 + proximity * 1.25 + mouseGlow * 0.45;
					ctx.shadowColor = rgba(lineColor, 0.08 + mouseGlow * 0.34);
					ctx.shadowBlur = 3 + mouseGlow * 12;
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.stroke();
					ctx.shadowBlur = 0;
				}
			}

			for (const p of particles) {
				const mouseGlow = mouseActive
					? Math.max(0, 1 - Math.hypot(p.x - mouseX, p.y - mouseY) / MOUSE_RADIUS)
					: 0;
				const color = mouseGlow > 0.05 ? palette.highlight : palette.node;
				const alpha = ((light ? 0.34 : 0.52) + mouseGlow * 0.42) * p.weight;

				ctx.shadowColor = rgba(color, 0.18 + mouseGlow * 0.48);
				ctx.shadowBlur = 4 + mouseGlow * 18;
				ctx.fillStyle = rgba(color, alpha);
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r + 0.3 + mouseGlow * 1.25, 0, Math.PI * 2);
				ctx.fill();
				ctx.shadowBlur = 0;
			}
		};

		const tick = () => {
			rafId = requestAnimationFrame(tick);
			if (document.hidden) return;
			update();
			draw();
		};

		const onPointerMove = (e: PointerEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
			mouseActive = true;
		};

		const onPointerLeave = () => {
			mouseActive = false;
		};

		const onResize = () => {
			rebuild();
		};

		rebuild();
		rafId = requestAnimationFrame(tick);

		window.addEventListener('pointermove', onPointerMove, { passive: true });
		window.addEventListener('pointerleave', onPointerLeave);
		window.addEventListener('resize', onResize);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerleave', onPointerLeave);
			window.removeEventListener('resize', onResize);
		};
	}

	onMount(() => {
		const canvas = canvasEl;
		if (!canvas || typeof window === 'undefined') return;

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduceMotion) return;

		return setupPlexus(canvas);
	});
</script>

<canvas
	class="plexus-canvas"
	bind:this={canvasEl}
	aria-hidden="true"
></canvas>
