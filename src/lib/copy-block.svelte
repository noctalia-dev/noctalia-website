<script lang="ts">
	let { code, label = 'Copy' }: { code: string; label?: string } = $props();
	let status = $state<'idle' | 'copied'>('idle');

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			status = 'copied';
			setTimeout(() => (status = 'idle'), 2000);
		} catch {
			status = 'idle';
		}
	}
</script>

<div class="group relative rounded-md border border-border/60 bg-void-deep/90 shadow-card">
	<button
		type="button"
		class="absolute right-2.5 top-2.5 rounded-sm border border-border/50 bg-surface-2 px-2 py-1 font-mono text-[11px] text-fg-dim opacity-0 transition hover:border-accent-2/40 hover:text-accent-2 group-hover:opacity-100"
		onclick={copy}
	>
		{status === 'copied' ? 'Copied' : label}
	</button>
	<pre
		class="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-fg/90 [scrollbar-width:thin]"
	><code>{code}</code></pre>
</div>
