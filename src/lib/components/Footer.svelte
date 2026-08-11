<script lang="ts">
	/**
	 * Site footer. Dark Liver ground with the white/red lockup and the skyline
	 * motif behind it — the brand manual's own cover treatment, and the reason
	 * every page ends on a full-dark surface.
	 */
	import Logo from './Logo.svelte';
	import Skyline from './Skyline.svelte';
	import { nav, contact } from '$lib/data/site';

	const year = new Date().getFullYear();
</script>

<footer class="footer dark-bg">
	<!-- Decorative motif, anchored to the bottom edge behind the content. -->
	<div class="footer__motif" aria-hidden="true">
		<Skyline theme="dark" opacity={0.16} />
	</div>

	<div class="footer__inner">
		<div class="footer__top">
			<div class="footer__brand">
				<Logo variant="stacked" theme="dark" width={200} />
				<p class="footer__blurb">
					Handcrafted furniture and interior design for homes and offices — from first sketch to the
					day you move back in.
				</p>
			</div>

			<nav class="footer__nav" aria-label="Footer">
				<h2 class="footer__heading eyebrow">Explore</h2>
				<ul>
					{#each nav as item (item.href)}
						<li><a href={item.href}>{item.label}</a></li>
					{/each}
				</ul>
			</nav>

			<div class="footer__block">
				<h2 class="footer__heading eyebrow">Studio</h2>
				<address>
					{#each contact.address as line (line)}
						<span>{line}</span>
					{/each}
				</address>
				<p class="footer__hours">{contact.hours}</p>
			</div>

			<div class="footer__block">
				<h2 class="footer__heading eyebrow">Contact</h2>
				<ul>
					<li><a href="mailto:{contact.email}">{contact.email}</a></li>
					<li><a href="tel:{contact.phone.replace(/\s/g, '')}">{contact.phone}</a></li>
				</ul>
				<ul class="footer__social">
					{#each contact.social as link (link.href)}
						<li>
							<a href={link.href} target="_blank" rel="noreferrer noopener">{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="footer__bottom">
			<p>&copy; {year} Jimibello &amp; Co. All rights reserved.</p>
			<p>Lagos, Nigeria</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		position: relative;
		overflow: hidden;
		background-color: var(--color-jbc-black);
		color: var(--color-jbc-white);
	}

	.footer__motif {
		position: absolute;
		inset: auto 0 0;
		height: 60%;
		pointer-events: none;
	}

	.footer__inner {
		position: relative;
		width: 100%;
		max-width: 84rem;
		margin-inline: auto;
		padding: 5rem 1.5rem 2rem;
	}

	@media (width >= 64rem) {
		.footer__inner {
			padding: 7rem 3rem 2.5rem;
		}
	}

	.footer__top {
		display: grid;
		gap: 3rem;
	}

	@media (width >= 48rem) {
		.footer__top {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (width >= 64rem) {
		.footer__top {
			/* The lockup column takes the extra width so its clear space holds. */
			grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
			gap: 4rem;
		}
	}

	.footer__blurb {
		margin-top: 1.75rem;
		max-width: 34ch;
		color: var(--color-jbc-white-70);
		font-size: var(--text-body);
		line-height: 1.7;
	}

	.footer__heading {
		color: var(--color-jbc-white-50);
	}

	.footer__nav ul,
	.footer__block ul {
		margin: 1.25rem 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.75rem;
	}

	.footer__social {
		margin-top: 1.75rem;
	}

	.footer a {
		color: var(--color-jbc-white);
		font-size: var(--text-body);
		text-decoration: none;
		transition: color 300ms var(--ease-out-brand);
	}

	.footer a:hover {
		color: var(--color-jbc-red);
	}

	.footer address {
		margin-top: 1.25rem;
		display: grid;
		gap: 0.35rem;
		color: var(--color-jbc-white-70);
		font-size: var(--text-body);
		font-style: normal;
		line-height: 1.6;
	}

	.footer__hours {
		margin-top: 1rem;
		color: var(--color-jbc-white-50);
		font-size: var(--text-body);
	}

	.footer__bottom {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 1px solid var(--color-jbc-white-15);
		color: var(--color-jbc-white-50);
		font-size: 0.875rem;
	}
</style>
