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
	{src}
	alt=""
	class={[
		/* object-cover + bottom origin matches the old SVG's
		   preserveAspectRatio="xMidYMax slice". */
		'pointer-events-none block h-full w-full object-cover object-bottom',
		'opacity-[var(--skyline-opacity)]',
		className
	]}
	aria-hidden="true"
	draggable="false"
	loading="lazy"
	decoding="async"
	style:--skyline-opacity={opacity}
/>
