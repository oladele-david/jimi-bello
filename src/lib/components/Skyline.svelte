<script lang="ts">
	import skylineDark from '$lib/assets/skyline-dark.webp';
	import skylineLight from '$lib/assets/skyline-light.webp';

	type Theme = 'light' | 'dark';
	interface Props {
		/** Which skyline artwork to show. */
		theme?: Theme;
		/** Opacity of the skyline over the section background. */
		opacity?: number;
		class?: string;
	}
	let { theme = 'dark', opacity = 0.25, class: className = '' }: Props = $props();
	const src = $derived(theme === 'light' ? skylineLight : skylineDark);
</script>

<!--
	Decorative only: it is always aria-hidden, and callers are expected to
	position it absolutely behind content.
-->
<img
	src={src}
	alt=""
	class={['skyline', className]}
	aria-hidden="true"
	draggable="false"
	loading="lazy"
	decoding="async"
	style:--skyline-opacity={opacity}
/>

<style>
	.skyline {
		display: block;
		width: 100%;
		height: 100%;
		/* Matches the old SVG's preserveAspectRatio="xMidYMax slice". */
		object-fit: cover;
		object-position: center bottom;
		opacity: var(--skyline-opacity);
		pointer-events: none;
	}
</style>
