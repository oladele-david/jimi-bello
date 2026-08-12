<script lang="ts">
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';

	type Props = {
		title?: string;
		durationMs?: number;
		variant?: 'stacked' | 'wide' | 'icon';
		width?: number;
	};

	let {
		title = 'JBC — Jimibello & Co.',
		durationMs = 1200,
		variant = 'stacked',
		width = 280
	}: Props = $props();

	let visible = $state(true);
	let closing = $state(false);

	onMount(() => {
		// Begin smooth exit curtain fade after duration
		const startFade = window.setTimeout(() => {
			closing = true;
		}, durationMs);

		// Remove from DOM after exit fade animation completes
		const endHide = window.setTimeout(() => {
			visible = false;
		}, durationMs + 600);

		return () => {
			window.clearTimeout(startFade);
			window.clearTimeout(endHide);
		};
	});
</script>

{#if visible}
	<div
		class={[
			'fixed inset-0 z-[100] flex items-center justify-center bg-[#2d0907] px-8 transition-opacity duration-600 ease-out-brand select-none',
			closing ? 'pointer-events-none opacity-0' : 'opacity-100'
		]}
		role="status"
		aria-label={title}
		aria-live="polite"
	>
		<div class="flex flex-col items-center">
			<Logo {variant} theme="dark" tagline="brand" {width} />
		</div>
	</div>
{/if}