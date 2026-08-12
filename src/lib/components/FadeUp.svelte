<script lang="ts">
	/**
	 * Scroll-triggered reveal: translateY(20px) → 0, opacity 0 → 1.
	 *
	 * Wrap any block to have it fade up as it enters the viewport. Grouped items
	 * take an incrementing `index` to stagger; the delay is capped so long lists
	 * never leave the reader waiting on the last card.
	 *
	 * Reveals fire once and then stop observing — re-animating on every pass
	 * reads as fidgety on an editorial site.
	 */
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		children: Snippet;
		/** Position within a stagger group. Each step adds `stagger` ms of delay. */
		index?: number;
		stagger?: number;
		duration?: number;
		/** Distance travelled, in px. Larger values read as heavier. */
		distance?: number;
		/** Wrapper element — 'li' inside lists, 'div' otherwise. */
		as?: 'div' | 'li' | 'article' | 'section';
		/** Accepts the same shapes as a native `class` — string, array, object. */
		class?: ClassValue;
	}

	let {
		children,
		index = 0,
		stagger = 90,
		duration = 600,
		distance = 20,
		as = 'div',
		class: className = ''
	}: Props = $props();

	const MAX_DELAY = 450;
	let delay = $derived(Math.min(index * stagger, MAX_DELAY));

	let visible = $state(false);

	function reveal(node: HTMLElement) {
		// Honour the OS setting before any observer exists: the element is already
		// visible, so there is nothing to animate and nothing to watch.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			visible = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					visible = true;
					// One-shot: stop watching as soon as the reveal has run.
					observer.disconnect();
				}
			},
			// Fire slightly before the element is fully on screen, so the motion
			// resolves as the reader arrives rather than after.
			{ threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
		);

		observer.observe(node);
		return () => observer.disconnect();
	}
</script>

<svelte:element
	this={as}
	{@attach reveal}
	class={[
		'transition-[opacity,transform] ease-out-brand',
		'delay-[var(--fade-delay)] duration-[var(--fade-duration)]',
		visible
			? 'translate-y-0 opacity-100 will-change-auto'
			: // Hint the compositor only while the element is still animating in.
				'translate-y-[var(--fade-distance)] opacity-0 will-change-[opacity,transform]',
		/* Belt and braces: if JS is slow or unavailable, content must never be
		   stranded at opacity 0 for a reader who has asked for reduced motion. */
		'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
		className
	]}
	style:--fade-delay="{delay}ms"
	style:--fade-duration="{duration}ms"
	style:--fade-distance="{distance}px"
>
	{@render children()}
</svelte:element>
