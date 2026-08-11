<script lang="ts">
	/**
	 * Call-to-action, rendered as <a> when `href` is passed and <button> otherwise.
	 * Most CTAs on this site navigate, so the link form is the common case; the
	 * button form exists for the contact form's submit.
	 *
	 * Two appearances:
	 *   primary — solid Maximum Red fill, white label. Used once per section at most.
	 *   outline — 1.5px border on transparent ground. Inside a `.dark-bg` section
	 *             the border and label flip to white so the control stays legible;
	 *             hovering fills it red either way.
	 *
	 * Hover shades are mixed from the brand colours rather than picked by eye —
	 * no fourth hex enters the system.
	 *
	 * Size comes from the caller (`px-9 py-4 text-xs`) so hero and inline CTAs
	 * can share one component without a size prop.
	 */
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'outline';

	type Props = {
		variant?: Variant;
		children: Snippet;
		class?: string;
	} & (
		| ({ href: string } & Omit<HTMLAnchorAttributes, 'class'>)
		| ({ href?: undefined } & Omit<HTMLButtonAttributes, 'class'>)
	);

	let { variant = 'primary', href, class: className = '', children, ...rest }: Props = $props();

	let classes = $derived(['cta', `cta--${variant}`, className]);
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

<style>
	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.75em;
		/* Reset the native button so both elements start from the same place. */
		appearance: none;
		border: 1.5px solid transparent;
		border-radius: 0;
		cursor: pointer;
		font-family: inherit;
		font-size: var(--text-eyebrow);
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-decoration: none;
		white-space: nowrap;
		transition:
			background-color 400ms var(--ease-out-brand),
			border-color 400ms var(--ease-out-brand),
			color 400ms var(--ease-out-brand);
	}

	.cta--primary {
		background-color: var(--color-jbc-red);
		border-color: var(--color-jbc-red);
		color: var(--color-jbc-white);
	}

	.cta--primary:hover {
		/* Shade derived from the two brand colours, not a new swatch. */
		background-color: color-mix(in srgb, var(--color-jbc-red) 86%, var(--color-jbc-black));
		border-color: color-mix(in srgb, var(--color-jbc-red) 86%, var(--color-jbc-black));
	}

	.cta--outline {
		background-color: transparent;
		border-color: var(--color-jbc-red);
		color: var(--color-jbc-red);
	}

	.cta--outline:hover {
		background-color: var(--color-jbc-red);
		color: var(--color-jbc-white);
	}

	/* On Dark Liver grounds a red outline all but disappears, so the resting
	   state goes white and the red arrives on hover instead. */
	:global(.dark-bg) .cta--outline {
		border-color: var(--color-jbc-white);
		color: var(--color-jbc-white);
	}

	:global(.dark-bg) .cta--outline:hover {
		background-color: var(--color-jbc-red);
		border-color: var(--color-jbc-red);
	}
</style>
