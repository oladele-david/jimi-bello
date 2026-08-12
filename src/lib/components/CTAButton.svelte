<script lang="ts">
	/**
	 * Call-to-action, rendered as <a> when `href` is passed and <button> otherwise.
	 * Most CTAs on this site navigate, so the link form is the common case; the
	 * button form exists for the contact form's submit.
	 *
	 * Three appearances:
	 *   primary — solid Maximum Red fill, white label. Used once per section at most.
	 *   outline — 1.5px border on transparent ground. Inside a `.dark-bg` section
	 *             the border and label flip to white so the control stays legible;
	 *             hovering fills it red either way. That flip is the `on-dark:`
	 *             variant from layout.css, so no parent has to reach in for it.
	 *   invert  — for the three Maximum Red bands, where a red hover fill would be
	 *             invisible. White at rest, solid white with red type on hover.
	 *
	 * Hover shades are mixed from the brand colours rather than picked by eye —
	 * no fourth hex enters the system.
	 *
	 * Size comes from the caller (`px-10 py-[1.15rem]`) so hero and inline CTAs
	 * can share one component without a size prop. `size` covers the two padding
	 * pairs that actually recur; anything else is passed through `class`.
	 */
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes, ClassValue } from 'svelte/elements';

	type Variant = 'primary' | 'outline' | 'invert';
	/** The two padding pairs used across the site. `md` is the inline default. */
	type Size = 'md' | 'lg';

	type Props = {
		variant?: Variant;
		size?: Size;
		children: Snippet;
		class?: ClassValue;
	} & (
		| ({ href: string } & Omit<HTMLAnchorAttributes, 'class'>)
		| ({ href?: undefined } & Omit<HTMLButtonAttributes, 'class'>)
	);

	let {
		variant = 'primary',
		size = 'md',
		href,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const BASE =
		'inline-flex items-center justify-center gap-[0.75em] appearance-none rounded-none ' +
		'border-[1.5px] border-transparent cursor-pointer font-sans text-eyebrow font-semibold ' +
		'tracking-jbc-caps uppercase whitespace-nowrap no-underline ' +
		'transition-[background-color,border-color,color] duration-400 ease-out-brand ' +
		'disabled:opacity-60 disabled:cursor-progress';

	const SIZES = {
		md: 'px-9 py-4',
		lg: 'px-10 py-[1.15rem]'
	} as const;

	const VARIANTS = {
		primary:
			'bg-jbc-red border-jbc-red text-jbc-white hover:bg-jbc-red-deep hover:border-jbc-red-deep',
		/* On Dark Liver grounds a red outline all but disappears, so the resting
		   state goes white and the red arrives on hover instead. */
		outline:
			'bg-transparent border-jbc-red text-jbc-red hover:bg-jbc-red hover:text-jbc-white ' +
			'on-dark:border-jbc-white on-dark:text-jbc-white ' +
			'on-dark:hover:bg-jbc-red on-dark:hover:border-jbc-red on-dark:hover:text-jbc-white',
		/* Maximum Red grounds. `outline` would resolve correctly at rest — red is a
		   dark ground, so on-dark: turns it white — but its hover fills red, which
		   is the ground itself. This inverts to a solid white chip instead. Stated
		   unconditionally rather than as an on-dark: override, so no specificity
		   contest decides which hover wins. */
		invert:
			'bg-transparent border-jbc-white text-jbc-white ' +
			'hover:bg-jbc-white hover:border-jbc-white hover:text-jbc-red'
	} as const;

	let classes = $derived([BASE, SIZES[size], VARIANTS[variant], className]);
</script>

{#if href}
	<a {href} {...rest as HTMLAnchorAttributes} class={classes}>
		{@render children()}
	</a>
{:else}
	<button {...rest as HTMLButtonAttributes} class={classes}>
		{@render children()}
	</button>
{/if}
