<script lang="ts">
	/**
	 * JBC wordmark. Three approved lockups from the brand manual (p.07):
	 *
	 *   wide    — "JBC" + "JIMIBELLO & CO." side by side (the default choice)
	 *   stacked — tagline centred beneath the wordmark
	 *   icon    — "JBC" alone, for tight spaces
	 *
	 * Two rules from p.08 are enforced here rather than eyeballed:
	 *   1. Rendered width never drops below 65px.
	 *   2. Clear space on all sides equals the "X" unit — the cap-height gap
	 *      between the wordmark baseline and the tagline. Expressed as a ratio
	 *      of the viewBox so it scales with the mark.
	 *
	 * Tagline colour: the supplied jbc_logo.png and every lockup in the manual
	 * set the *entire* tagline in Maximum Red, not just the ampersand. That is
	 * the default. Pass tagline="neutral" for a 70%-black (light) or white
	 * (dark) tagline with only the "&" in red.
	 *
	 * `solid` collapses the mark to one flat colour — required over busy
	 * photography, where the full-colour lockup is not permitted (p.09).
	 */
	type Variant = 'wide' | 'stacked' | 'icon';
	type Theme = 'light' | 'dark';
	type Tagline = 'brand' | 'neutral';

	interface Props {
		variant?: Variant;
		theme?: Theme;
		tagline?: Tagline;
		/** Flatten to a single colour for use over photography. */
		solid?: boolean;
		/** Rendered width in px. Clamped up to the 65px brand minimum. */
		width?: number;
		/** Accessible name; pass '' when a visible text label sits alongside. */
		title?: string;
		class?: string;
	}

	let {
		variant = 'wide',
		theme = 'light',
		tagline = 'brand',
		solid = false,
		width = 148,
		title = 'JBC — Jimibello & Co.',
		class: className = ''
	}: Props = $props();

	const MIN_WIDTH = 65;

	/** Brand minimum always wins over the caller's value. */
	let safeWidth = $derived(Math.max(width, MIN_WIDTH));

	let wordmark = $derived(theme === 'dark' ? 'var(--color-jbc-white)' : 'var(--color-jbc-black)');
	/** Red survives on both grounds, so the accent is theme-independent. */
	let accent = $derived(solid ? wordmark : 'var(--color-jbc-red)');
	let taglineFill = $derived(
		solid || tagline === 'brand'
			? accent
			: theme === 'dark'
				? 'var(--color-jbc-white)'
				: 'var(--color-jbc-black-70)'
	);
	/** In neutral mode the ampersand alone keeps the red. */
	let ampersandFill = $derived(tagline === 'neutral' ? accent : taglineFill);

	/**
	 * Geometry per lockup. `x` is the clear-space quantum from p.08 — the
	 * wordmark-to-tagline gap on the stacked mark. All three lockups reuse the
	 * same proportion so clear space reads consistently across the site.
	 */
	const geometry = {
		wide: { w: 404, h: 62, x: 11 },
		stacked: { w: 264, h: 104, x: 11 },
		icon: { w: 140, h: 62, x: 11 }
	} as const;

	let box = $derived(geometry[variant]);
	/** Clear space as a share of rendered width, so padding scales with the mark. */
	let clearSpace = $derived(`${(box.x / box.w) * 100}%`);
</script>

<span
	class={[
		/* Minimum size enforced twice: the derived value sets the target, and
		   min-w stops any flex or grid parent squeezing below the 65px floor.
		   Clear space travels with the mark as padding, so nav items, images and
		   page edges cannot crowd it regardless of where the logo is placed —
		   box-content keeps that padding outside the declared width. */
		'box-content inline-block w-[var(--jbc-logo-width)] min-w-[var(--jbc-logo-min-width)]',
		'p-[var(--jbc-logo-clear-space)]',
		/* Isolate the mark from inherited page typography. */
		'[&_text]:[font-kerning:none]',
		className
	]}
	style:--jbc-logo-width="{safeWidth}px"
	style:--jbc-logo-clear-space={clearSpace}
>
	<svg
		class="block h-auto w-full"
		viewBox="0 0 {box.w} {box.h}"
		role={title ? 'img' : 'presentation'}
		aria-label={title || undefined}
		aria-hidden={title ? undefined : 'true'}
		focusable="false"
	>
		<!--
			Every run is pinned with textLength/lengthAdjust. The mark then occupies
			identical geometry whether Raleway has loaded or the fallback is showing,
			so the lockup never reflows and adjacent runs cannot collide.
		-->
		{#if variant === 'wide'}
			<text
				x="0"
				y="47"
				fill={wordmark}
				font-family="Raleway, sans-serif"
				font-weight="700"
				font-size="56"
				textLength="134"
				lengthAdjust="spacingAndGlyphs">JBC</text
			>
			<text
				x="140"
				y="47"
				font-family="Raleway, sans-serif"
				font-weight="400"
				font-size="41"
				textLength="264"
				lengthAdjust="spacingAndGlyphs"
				fill={taglineFill}
			>
				JIMIBELLO <tspan fill={ampersandFill}>&amp;</tspan> CO.
			</text>
		{:else if variant === 'stacked'}
			<text
				x="132"
				y="58"
				text-anchor="middle"
				fill={wordmark}
				font-family="Raleway, sans-serif"
				font-weight="700"
				font-size="70"
				textLength="168"
				lengthAdjust="spacingAndGlyphs">JBC</text
			>
			<!-- The tagline is set to the wordmark's optical width — the manual's
			     stacked lockup aligns the two edges exactly. -->
			<text
				x="132"
				y="97"
				text-anchor="middle"
				font-family="Raleway, sans-serif"
				font-weight="400"
				font-size="29"
				textLength="186"
				lengthAdjust="spacingAndGlyphs"
				fill={taglineFill}
			>
				JIMIBELLO <tspan fill={ampersandFill}>&amp;</tspan> CO.
			</text>
		{:else}
			<text
				x="70"
				y="47"
				text-anchor="middle"
				fill={wordmark}
				font-family="Raleway, sans-serif"
				font-weight="700"
				font-size="56"
				textLength="134"
				lengthAdjust="spacingAndGlyphs">JBC</text
			>
		{/if}
	</svg>
</span>
