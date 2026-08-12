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

<!-- Off-screen until focused, rather than hidden, so it stays reachable. -->
<a
	class="skip fixed top-0 left-0 z-100 -translate-y-[110%] bg-jbc-red px-5 py-3 text-eyebrow
	       font-semibold tracking-jbc-caps text-jbc-white uppercase no-underline
	       transition-transform duration-200 ease-out-brand focus-visible:translate-y-0"
	href="#main">Skip to content</a
>

<header
	class={[
		'fixed inset-x-0 top-0 z-60 transition-[background-color,box-shadow] duration-400 ease-out-brand',
		/* While the dark panel is open the bar must not paint white behind it. */
		filled && !menuOpen && 'bg-jbc-white shadow-[0_1px_0_var(--color-jbc-black-15)]'
	]}
>
	<div
		class="mx-auto flex w-full max-w-[84rem] items-center justify-between gap-8 px-6 py-4 lg:px-12 lg:py-5"
	>
		<a
			class="inline-flex items-center no-underline"
			href="/"
			aria-label="JBC — Jimibello & Co., home"
		>
			<!-- One lockup at a time: wide on desktop, icon-only where space is tight.
			     Clear space is baked into Logo; nothing here may crowd it. -->
			<Logo variant="wide" theme={logoTheme} width={150} title="" class="hidden md:inline-block" />
			<Logo variant="icon" theme={logoTheme} width={72} title="" class="md:hidden" />
		</a>

		<nav class="hidden lg:block" aria-label="Primary">
			<ul class="flex items-center gap-10">
				{#each nav as item (item.href)}
					<li>
						<a
							href={item.href}
							class={[
								'relative inline-block py-1 text-eyebrow font-semibold tracking-jbc-caps uppercase',
								'no-underline transition-colors duration-400 ease-out-brand hover:text-jbc-red',
								/* Red underline, drawn from the left on hover, pinned open when current. */
								'after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-left',
								'after:scale-x-0 after:bg-jbc-red after:transition-transform after:duration-[350ms]',
								'after:ease-out-brand hover:after:scale-x-100',
								filled && !menuOpen ? 'text-jbc-black' : 'text-jbc-white',
								isCurrent(item.href) && 'after:scale-x-100'
							]}
							aria-current={isCurrent(item.href) ? 'page' : undefined}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<button
			class={[
				'group inline-flex items-center gap-3 border-0 bg-none py-2 [font-family:inherit]',
				'cursor-pointer text-eyebrow font-semibold tracking-jbc-caps uppercase',
				'transition-colors duration-400 ease-out-brand lg:hidden',
				filled && !menuOpen ? 'text-jbc-black' : 'text-jbc-white'
			]}
			type="button"
			aria-expanded={menuOpen}
			aria-controls="mobile-menu"
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span>{menuOpen ? 'Close' : 'Menu'}</span>
			<!-- Two bars cross into an X — no third bar to fade out. -->
			<span class="grid w-[22px] gap-[5px]" aria-hidden="true">
				<span
					class={[
						'h-[1.5px] bg-current transition-transform duration-300 ease-out-brand',
						menuOpen && 'translate-y-[3.25px] rotate-45'
					]}
				></span>
				<span
					class={[
						'h-[1.5px] bg-current transition-transform duration-300 ease-out-brand',
						menuOpen && '-translate-y-[3.25px] -rotate-45'
					]}
				></span>
			</span>
		</button>
	</div>
</header>

<!-- Rendered always, hidden when closed, so the open/close transition can run.
     `dark-bg` is the marker the on-dark: variant keys off; nothing styles it. -->
<div
	id="mobile-menu"
	class={[
		'dark-bg fixed inset-0 z-50 flex items-center bg-jbc-black px-6 pt-24 pb-12 lg:hidden',
		'transition-[opacity,visibility] duration-400 ease-out-brand',
		menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
	]}
	inert={!menuOpen}
>
	<nav class="w-full" aria-label="Mobile">
		<ul class="w-full">
			{#each nav as item, i (item.href)}
				<li class="border-b border-jbc-white-15" style:--menu-delay="{i * 45}ms">
					<a
						href={item.href}
						class={[
							'block py-5 text-[2rem] leading-[1.15] font-bold no-underline',
							/* Items settle in sequence once the panel itself has appeared. */
							'transition-[opacity,transform,color] duration-400 ease-out-brand',
							'delay-[var(--menu-delay)] motion-reduce:transition-none',
							menuOpen
								? 'translate-y-0 opacity-100'
								: 'translate-y-3 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
							isCurrent(item.href) ? 'text-jbc-red' : 'text-jbc-white hover:text-jbc-red'
						]}
						aria-current={isCurrent(item.href) ? 'page' : undefined}
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>
