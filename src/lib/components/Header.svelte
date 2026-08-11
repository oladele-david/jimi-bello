<script lang="ts">
	/**
	 * Fixed site header.
	 *
	 * Over a hero the bar is transparent and carries the white lockup; once the
	 * reader passes the fold it fills white and swaps to the black lockup. Pages
	 * without a hero (`solid`) start in the filled state so the mark is never
	 * white-on-white.
	 *
	 * The mobile menu is a full-screen Dark Liver panel — the same treatment as
	 * the footer, which keeps the white/red lockup in its intended context.
	 */
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import Logo from './Logo.svelte';
	import { nav } from '$lib/data/site';

	interface Props {
		/** Set on pages with no full-bleed hero behind the header. */
		solid?: boolean;
	}

	let { solid = false }: Props = $props();

	let scrollY = $state(0);
	let menuOpen = $state(false);

	/** Roughly one header height of travel before the bar fills. */
	let scrolled = $derived(scrollY > 40);
	let filled = $derived(solid || scrolled);
	/** The lockup follows the bar, except while the dark menu panel is open. */
	let logoTheme: 'light' | 'dark' = $derived(filled && !menuOpen ? 'light' : 'dark');

	function isCurrent(href: string) {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}

	// Tapping a menu item navigates; the panel has to come down with it.
	afterNavigate(() => {
		menuOpen = false;
	});

	// Lock the page behind the open menu panel. This syncs to document.body,
	// which is outside Svelte's control, so an effect is the right tool.
	$effect(() => {
		if (!menuOpen) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	});
</script>

<svelte:window
	bind:scrollY
	onkeydown={(event) => {
		if (event.key === 'Escape') menuOpen = false;
	}}
/>

<a class="skip" href="#main">Skip to content</a>

<header class={['header', filled && 'header--filled', menuOpen && 'header--menu-open']}>
	<div class="header__inner">
		<a class="header__brand" href="/" aria-label="JBC — Jimibello & Co., home">
			<!-- Clear space is baked into Logo; nothing here may crowd it. -->
			<Logo variant="wide" theme={logoTheme} width={150} title="" class="header__logo-wide" />
			<Logo variant="icon" theme={logoTheme} width={72} title="" class="header__logo-icon" />
		</a>

		<nav class="header__nav" aria-label="Primary">
			<ul>
				{#each nav as item (item.href)}
					<li>
						<a
							href={item.href}
							class={['header__link', isCurrent(item.href) && 'is-current']}
							aria-current={isCurrent(item.href) ? 'page' : undefined}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<button
			class="header__toggle"
			type="button"
			aria-expanded={menuOpen}
			aria-controls="mobile-menu"
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span class="header__toggle-label">{menuOpen ? 'Close' : 'Menu'}</span>
			<span class="header__toggle-bars" aria-hidden="true">
				<span></span>
				<span></span>
			</span>
		</button>
	</div>
</header>

<!-- Rendered always, hidden when closed, so the open/close transition can run. -->
<div id="mobile-menu" class={['menu', 'dark-bg', menuOpen && 'menu--open']} inert={!menuOpen}>
	<nav aria-label="Mobile">
		<ul>
			{#each nav as item, i (item.href)}
				<li style:--menu-delay="{i * 45}ms">
					<a
						href={item.href}
						class={['menu__link', isCurrent(item.href) && 'is-current']}
						aria-current={isCurrent(item.href) ? 'page' : undefined}
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>

<style>
	.skip {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		padding: 0.75rem 1.25rem;
		background-color: var(--color-jbc-red);
		color: var(--color-jbc-white);
		font-size: var(--text-eyebrow);
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-decoration: none;
		/* Off-screen until focused, rather than display:none, so it stays reachable. */
		transform: translateY(-110%);
		transition: transform 200ms var(--ease-out-brand);
	}

	.skip:focus-visible {
		transform: translateY(0);
	}

	.header {
		position: fixed;
		inset: 0 0 auto;
		z-index: 60;
		transition:
			background-color 400ms var(--ease-out-brand),
			box-shadow 400ms var(--ease-out-brand);
	}

	.header--filled {
		background-color: var(--color-jbc-white);
		box-shadow: 0 1px 0 var(--color-jbc-black-15);
	}

	/* While the dark panel is open the bar must not paint white behind it. */
	.header--menu-open,
	.header--menu-open.header--filled {
		background-color: transparent;
		box-shadow: none;
	}

	.header__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		width: 100%;
		max-width: 84rem;
		margin-inline: auto;
		padding: 1rem 1.5rem;
	}

	@media (width >= 64rem) {
		.header__inner {
			padding: 1.25rem 3rem;
		}
	}

	.header__brand {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
	}

	/* One lockup at a time: wide on desktop, icon-only where space is tight. */
	.header__brand :global(.header__logo-wide) {
		display: none;
	}

	@media (width >= 48rem) {
		.header__brand :global(.header__logo-wide) {
			display: inline-block;
		}

		.header__brand :global(.header__logo-icon) {
			display: none;
		}
	}

	.header__nav {
		display: none;
	}

	@media (width >= 64rem) {
		.header__nav {
			display: block;
		}
	}

	.header__nav ul {
		display: flex;
		align-items: center;
		gap: 2.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.header__link {
		position: relative;
		display: inline-block;
		padding-block: 0.25rem;
		color: var(--color-jbc-white);
		font-size: var(--text-eyebrow);
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-decoration: none;
		transition: color 400ms var(--ease-out-brand);
	}

	.header--filled .header__link {
		color: var(--color-jbc-black);
	}

	/* Red underline, drawn from the left on hover and pinned open when current. */
	.header__link::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1.5px;
		background-color: var(--color-jbc-red);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 350ms var(--ease-out-brand);
	}

	.header__link:hover::after,
	.header__link.is-current::after {
		transform: scaleX(1);
	}

	.header__link:hover {
		color: var(--color-jbc-red);
	}

	.header__toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
		background: none;
		border: 0;
		cursor: pointer;
		color: var(--color-jbc-white);
		font-family: inherit;
		font-size: var(--text-eyebrow);
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		transition: color 400ms var(--ease-out-brand);
	}

	.header--filled .header__toggle {
		color: var(--color-jbc-black);
	}

	.header--menu-open .header__toggle,
	.header--menu-open.header--filled .header__toggle {
		color: var(--color-jbc-white);
	}

	@media (width >= 64rem) {
		.header__toggle {
			display: none;
		}
	}

	.header__toggle-bars {
		display: grid;
		gap: 5px;
		width: 22px;
	}

	.header__toggle-bars span {
		height: 1.5px;
		background-color: currentColor;
		transition: transform 300ms var(--ease-out-brand);
	}

	/* Two bars cross into an X — no third bar to fade out. */
	.header--menu-open .header__toggle-bars span:first-child {
		transform: translateY(3.25px) rotate(45deg);
	}

	.header--menu-open .header__toggle-bars span:last-child {
		transform: translateY(-3.25px) rotate(-45deg);
	}

	.menu {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		padding: 6rem 1.5rem 3rem;
		background-color: var(--color-jbc-black);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 400ms var(--ease-out-brand),
			visibility 400ms;
	}

	.menu--open {
		opacity: 1;
		visibility: visible;
	}

	@media (width >= 64rem) {
		.menu {
			display: none;
		}
	}

	.menu ul {
		margin: 0;
		padding: 0;
		list-style: none;
		width: 100%;
	}

	.menu li {
		border-bottom: 1px solid var(--color-jbc-white-15);
	}

	.menu__link {
		display: block;
		padding: 1.25rem 0;
		color: var(--color-jbc-white);
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.15;
		text-decoration: none;
		/* Items settle in sequence once the panel itself has appeared. */
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 400ms var(--ease-out-brand) var(--menu-delay),
			transform 400ms var(--ease-out-brand) var(--menu-delay),
			color 300ms var(--ease-out-brand);
	}

	.menu--open .menu__link {
		opacity: 1;
		transform: none;
	}

	.menu__link.is-current,
	.menu__link:hover {
		color: var(--color-jbc-red);
	}

	@media (prefers-reduced-motion: reduce) {
		.menu__link {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
