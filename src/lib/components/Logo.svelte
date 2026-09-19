<script lang="ts">
	/**
	 * JimiBello Co. Logo System.
	 * Supports:
	 *   - primary: Stacked mark (JB monogram + JIMIBELLOCO wordmark)
	 *   - monogram: JB monogram mark only (compact/mobile)
	 *   - wordmark: JIMIBELLOCO wordmark only (horizontal)
	 *
	 * Backward compatibility:
	 *   - 'wide' maps to 'wordmark'
	 *   - 'stacked' maps to 'primary'
	 *   - 'icon' maps to 'monogram'
	 */
	type Variant = 'primary' | 'monogram' | 'wordmark' | 'wide' | 'stacked' | 'icon';
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
		theme = 'light',
		color,
		width,
		height,
		title = 'JimiBello Co.',
		alt,
		class: className = ''
	}: Props = $props();

	let resolvedColor = $derived<Color>(
		color ?? (theme === 'dark' ? 'white' : 'black')
	);

	let baseName = $derived<string>(() => {
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

	let src = $derived(`/logos/${baseName()}-${resolvedColor}.svg`);
	let accessibleTitle = $derived(alt ?? title);
</script>

<img
	{src}
	alt={accessibleTitle}
	class={['inline-block object-contain', className]}
	style:width={width ? `${width}px` : undefined}
	style:height={height ? `${height}px` : undefined}
	loading="eager"
	decoding="async"
/>
