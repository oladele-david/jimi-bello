<script lang="ts">
	/**
	 * JimiBello Co. Logo System.
	 * Supports:
	 *   - responsive: Automatically swaps between primary logo on desktop (≥1024px)
	 *                 and monogram mark on mobile (<1024px) via <picture>
	 *   - primary: Stacked mark (JB monogram + JIMIBELLOCO wordmark)
	 *   - monogram: JB monogram mark only (compact)
	 *   - wordmark: JIMIBELLOCO wordmark only (horizontal)
	 *
	 * Backward compatibility:
	 *   - 'wide' maps to 'wordmark'
	 *   - 'stacked' maps to 'primary'
	 *   - 'icon' maps to 'monogram'
	 */
	type Variant = 'responsive' | 'primary' | 'monogram' | 'wordmark' | 'wide' | 'stacked' | 'icon';
	type Theme = 'light' | 'dark';
	type Color = 'white' | 'black' | 'ember';

	interface Props {
		variant?: Variant;
		theme?: Theme;
		color?: Color;
		width?: number;
		height?: number;
		title?: string;
		alt?: string;
		class?: string;
	}

	let {
		variant = 'primary',
		theme,
		color,
		width,
		height,
		title = 'JimiBello Co.',
		alt,
		class: className = ''
	}: Props = $props();

	let resolvedColor = $derived.by<Color>(() => {
		if (color) return color;
		if (theme === 'dark') return 'white';
		if (theme === 'light') return 'black';
		return 'ember';
	});

	let baseName = $derived.by<string>(() => {
		switch (variant) {
			case 'monogram':
			case 'icon':
				return 'monogram';
			case 'wordmark':
			case 'wide':
				return 'wordmark';
			case 'primary':
			case 'stacked':
			default:
				return 'primary-logo';
		}
	});

	let src = $derived(`/logos/${baseName}-${resolvedColor}.svg`);
	let accessibleTitle = $derived(alt ?? title);
</script>

{#if variant === 'responsive'}
	<picture class="inline-flex items-center">
		<source media="(min-width: 1024px)" srcset="/logos/primary-logo-{resolvedColor}.svg" />
		<img
			src="/logos/primary-logo-{resolvedColor}.svg"
			alt={accessibleTitle}
			class={['block object-contain', className]}
			style:width={width ? `${width}px` : undefined}
			style:height={height ? `${height}px` : undefined}
			loading="eager"
			decoding="async"
		/>
	</picture>
{:else}
	<img
		{src}
		alt={accessibleTitle}
		class={['object-contain', className || 'inline-block']}
		style:width={width ? `${width}px` : undefined}
		style:height={height ? `${height}px` : undefined}
		loading="eager"
		decoding="async"
	/>
{/if}
