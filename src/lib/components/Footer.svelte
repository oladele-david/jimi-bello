<script lang="ts">
	/**
	 * Site footer. Dark Liver ground with the white/red lockup and the skyline
	 * motif behind it — the brand manual's own cover treatment, and the reason
	 * every page ends on a full-dark surface.
	 *
	 * `.footer a` used to style every link in one selector. Tailwind has no
	 * descendant equivalent, so the shared run lives in `LINK` and each anchor
	 * spends it — one place to change, and the class list stays readable.
	 */
	import Logo from './Logo.svelte';
	import Skyline from './Skyline.svelte';
	import { nav, contact, brandTagline } from '$lib/data/site';

	const year = new Date().getFullYear();

	const LINK =
		'text-body text-jbc-white no-underline transition-colors duration-300 ' +
		'ease-out-brand hover:text-jbc-red';

	/** Column headings: caps eyebrow, dropped back to 50% white. */
	const HEADING = 'eyebrow text-jbc-white-50';

	/** Stacked link lists under a heading. */
	const LIST = 'mt-5 grid gap-3';
</script>

<!-- `dark-bg` is the marker the on-dark: variant keys off; it has no styles of
     its own, so the ground colour is set here explicitly. -->
<footer class="dark-bg relative overflow-hidden bg-jbc-black text-jbc-white">
	<!-- Decorative motif, anchored to the bottom edge behind the content. -->
	<div class="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]" aria-hidden="true">
		<Skyline theme="dark" opacity={0.16} />
	</div>

	<div class="relative shell pt-20 pb-8 lg:pt-28 lg:pb-10">
		<!-- Two columns from md, then four — the lockup column takes the extra
		     width at lg so the logo's clear space holds. -->
		<div class="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:gap-16">
			<div>
				<Logo variant="stacked" theme="dark" width={200} />
				<p class="mt-7 max-w-[34ch] text-body text-jbc-white-70">
					{brandTagline}
				</p>
			</div>

			<nav aria-label="Footer">
				<h2 class={HEADING}>Explore</h2>
				<ul class={LIST}>
					{#each nav as item (item.href)}
						<li><a class={LINK} href={item.href}>{item.label}</a></li>
					{/each}
				</ul>
			</nav>

			<div>
				<h2 class={HEADING}>Studio</h2>
				<address
					class="mt-5 grid gap-[0.35rem] text-body leading-[1.6] text-jbc-white-70 not-italic"
				>
					{#each contact.address as line (line)}
						<span>{line}</span>
					{/each}
				</address>
				<p class="mt-4 text-body text-jbc-white-50">{contact.hours}</p>
			</div>

			<div>
				<h2 class={HEADING}>Contact</h2>
				<ul class={LIST}>
					<li><a class={LINK} href="mailto:{contact.email}">{contact.email}</a></li>
					<li>
						<a class={LINK} href="tel:{contact.phone.replace(/\s/g, '')}">{contact.phone}</a>
					</li>
				</ul>
				<!-- Same list, wider gap above it — spelled out rather than layering a
				     second `mt-*` over LIST, which would depend on utility order. -->
				<ul class="mt-7 grid gap-3">
					{#each contact.social as link (link.href)}
						<li>
							<a class={LINK} href={link.href} target="_blank" rel="noreferrer noopener"
								>{link.label}</a
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div
			class="mt-16 flex flex-wrap justify-between gap-4 border-t border-jbc-white-15 pt-8
			       text-sm text-jbc-white-50"
		>
			<p>&copy; {year} Jimibello &amp; Co. All rights reserved.</p>
			<p>Lagos, Nigeria</p>
		</div>
	</div>
</footer>
