<script lang="ts">
	/**
	 * Services. Alternating full-width image/text rows, one per service.
	 *
	 * Furniture Design carries `feature: true` and gets a different treatment
	 * entirely — full-bleed, on Dark Liver, with its points listed out. It is
	 * the capability that separates JBC from a studio that specifies and buys,
	 * so it is not allowed to sit as row four of five.
	 */
	import { img, srcset } from '$lib/images';
	import { services } from '$lib/data/site';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import Skyline from '$lib/components/Skyline.svelte';

	const standard = services.filter((s) => !s.feature);
	const feature = services.find((s) => s.feature);
</script>

<svelte:head>
	<title>Services — JBC | Jimibello &amp; Co.</title>
	<meta
		name="description"
		content="Residential and commercial interiors, space planning, made-to-measure furniture design, and renovation consultation — from JBC in Lagos."
	/>
</svelte:head>

<section class="head dark-bg">
	<div class="head__motif" aria-hidden="true">
		<Skyline theme="dark" opacity={0.22} />
	</div>
	<div class="head__inner shell">
		<p class="head__eyebrow eyebrow">Services</p>
		<h1 class="head__title">Five ways in. One team throughout.</h1>
		<p class="head__lede">
			Take the whole project or take one piece of it. The consultation stands on its own, the space
			planning stands on its own, and the workshop will build for a room we did not design.
		</p>
	</div>
</section>

{#each standard as service, i (service.slug)}
	<section class={['row', i % 2 === 1 && 'row--flip']} id={service.slug}>
		<div class="row__inner shell">
			<FadeUp class="row__media">
				<img
					src={img(service.image, 1024, { ratio: 4 / 3 })}
					srcset={srcset(service.image, { ratio: 4 / 3 })}
					sizes="(min-width: 64rem) 50vw, 100vw"
					alt={service.title}
					width="1024"
					height="768"
					loading={i === 0 ? 'eager' : 'lazy'}
					decoding="async"
				/>
			</FadeUp>

			<FadeUp index={1} class="row__copy">
				<p class="row__index eyebrow">{String(i + 1).padStart(2, '0')}</p>
				<h2 class="row__title">{service.title}</h2>
				<p class="row__summary">{service.summary}</p>
				<p class="row__detail">{service.detail}</p>
				<ul class="row__points">
					{#each service.points as point (point)}
						<li>{point}</li>
					{/each}
				</ul>
			</FadeUp>
		</div>
	</section>
{/each}

{#if feature}
	<section class="feature dark-bg" id={feature.slug}>
		<div class="feature__media">
			<img
				src={img(feature.image, 1920, { ratio: 21 / 9 })}
				srcset={srcset(feature.image, { ratio: 21 / 9 })}
				sizes="100vw"
				alt={feature.title}
				width="1920"
				height="823"
				loading="lazy"
				decoding="async"
			/>
			<div class="feature__scrim" aria-hidden="true"></div>
		</div>

		<div class="feature__inner shell">
			<FadeUp class="feature__copy">
				<p class="feature__eyebrow eyebrow">Our workshop</p>
				<h2 class="feature__title">{feature.title}</h2>
				<p class="feature__summary">{feature.summary}</p>
				<p class="feature__detail">{feature.detail}</p>
			</FadeUp>

			<FadeUp index={1} class="feature__aside">
				<ul class="feature__points">
					{#each feature.points as point, p (point)}
						<li>
							<span class="feature__point-index" aria-hidden="true"
								>{String(p + 1).padStart(2, '0')}</span
							>
							<span>{point}</span>
						</li>
					{/each}
				</ul>
				<CTAButton href="/portfolio" variant="outline" class="feature__cta">
					See pieces we have built
				</CTAButton>
			</FadeUp>
		</div>
	</section>
{/if}

<section class="close">
	<div class="close__inner shell">
		<FadeUp>
			<h2 class="close__title">Not sure which of these you need?</h2>
			<p class="close__text">
				Most projects start as one thing and turn out to be another. Describe the space and we will
				tell you which service actually fits — including when the answer is none of them.
			</p>
			<CTAButton href="/contact" class="close__cta">Talk to JBC</CTAButton>
		</FadeUp>
	</div>
</section>

<style>
	/* ── Page head ────────────────────────────────────────────────────────── */

	.head {
		position: relative;
		overflow: hidden;
		background-color: var(--color-jbc-black);
		color: var(--color-jbc-white);
	}

	.head__motif {
		position: absolute;
		inset: auto 0 0;
		height: 70%;
		pointer-events: none;
	}

	.head__inner {
		position: relative;
		/* Top padding clears the fixed header. */
		padding-block: 9rem 5rem;
	}

	@media (width >= 64rem) {
		.head__inner {
			padding-block: 12rem 7rem;
		}
	}

	.head__eyebrow {
		color: var(--color-jbc-red);
	}

	.head__title {
		margin-top: 1.25rem;
		max-width: 16ch;
		font-size: var(--text-h1);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	@media (width >= 64rem) {
		.head__title {
			font-size: 4.25rem;
		}
	}

	.head__lede {
		margin-top: 1.75rem;
		max-width: 52ch;
		color: var(--color-jbc-white-70);
		font-size: var(--text-body-lg);
		line-height: 1.7;
	}

	/* ── Alternating rows ─────────────────────────────────────────────────── */

	.row {
		padding-block: var(--spacing-section);
		border-bottom: 1px solid var(--color-jbc-black-15);
		/* Anchored from the services teaser; clear the fixed header on landing. */
		scroll-margin-top: 5rem;
	}

	@media (width >= 64rem) {
		.row {
			padding-block: var(--spacing-section-lg);
		}

		.row__inner {
			display: grid;
			grid-template-columns: 1fr 1fr;
			column-gap: 5rem;
			align-items: center;
		}

		/* Odd rows put the photograph on the right. Order, not direction, so the
		   DOM sequence still reads image-then-text for a screen reader. */
		.row--flip :global(.row__media) {
			order: 2;
		}
	}

	.row :global(.row__media img) {
		display: block;
		width: 100%;
		height: auto;
		background-color: var(--color-jbc-black-15);
	}

	.row :global(.row__copy) {
		margin-top: 2rem;
	}

	@media (width >= 64rem) {
		.row :global(.row__copy) {
			margin-top: 0;
		}
	}

	.row__index {
		color: var(--color-jbc-red);
	}

	.row__title {
		margin-top: 1rem;
		font-size: var(--text-h2);
		font-weight: 600;
		line-height: 1.15;
	}

	@media (width >= 64rem) {
		.row__title {
			font-size: var(--text-h2-lg);
		}
	}

	.row__summary {
		margin-top: 1.25rem;
		max-width: 42ch;
		font-size: var(--text-body-lg);
		font-weight: 600;
		line-height: 1.5;
	}

	.row__detail {
		margin-top: 1.25rem;
		max-width: 54ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body);
		line-height: 1.75;
	}

	.row__points {
		display: grid;
		gap: 0.75rem;
		margin: 2rem 0 0;
		padding: 0;
		list-style: none;
	}

	.row__points li {
		position: relative;
		padding-left: 1.5rem;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body);
		line-height: 1.5;
	}

	/* Red rule as the marker — the accent at its smallest useful size. */
	.row__points li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.7em;
		width: 0.75rem;
		height: 1.5px;
		background-color: var(--color-jbc-red);
	}

	/* ── Feature: Furniture Design ────────────────────────────────────────── */

	.feature {
		position: relative;
		overflow: hidden;
		background-color: var(--color-jbc-black);
		color: var(--color-jbc-white);
		scroll-margin-top: 5rem;
	}

	.feature__media {
		position: absolute;
		inset: 0;
	}

	.feature__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Heavy enough that body copy holds its contrast over the photograph. */
	.feature__scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to right,
			rgba(38, 38, 38, 0.94) 0%,
			rgba(38, 38, 38, 0.86) 45%,
			rgba(38, 38, 38, 0.68) 100%
		);
	}

	.feature__inner {
		position: relative;
		display: grid;
		gap: 3rem;
		padding-block: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.feature__inner {
			grid-template-columns: 1.25fr 1fr;
			column-gap: 5rem;
			padding-block: var(--spacing-section-lg);
			align-items: start;
		}
	}

	.feature__eyebrow {
		color: var(--color-jbc-red);
	}

	.feature__title {
		margin-top: 1.25rem;
		font-size: var(--text-h1);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	@media (width >= 64rem) {
		.feature__title {
			font-size: 3.5rem;
		}
	}

	.feature__summary {
		margin-top: 1.5rem;
		max-width: 46ch;
		font-size: var(--text-body-lg);
		font-weight: 600;
		line-height: 1.55;
	}

	.feature__detail {
		margin-top: 1.25rem;
		max-width: 56ch;
		color: var(--color-jbc-white-70);
		font-size: var(--text-body);
		line-height: 1.8;
	}

	.feature__points {
		display: grid;
		gap: 1.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.feature__points li {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--color-jbc-white-15);
		font-size: var(--text-body);
		line-height: 1.5;
	}

	.feature__point-index {
		color: var(--color-jbc-red);
		font-size: var(--text-eyebrow);
		font-weight: 600;
		letter-spacing: 0.18em;
	}

	.feature :global(.feature__cta) {
		margin-top: 2.5rem;
		padding: 1rem 2.25rem;
	}

	/* ── Closing ──────────────────────────────────────────────────────────── */

	.close {
		padding-block: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.close {
			padding-block: var(--spacing-section-lg);
		}
	}

	.close__title {
		max-width: 18ch;
		font-size: var(--text-h2);
		font-weight: 700;
		line-height: 1.12;
	}

	@media (width >= 64rem) {
		.close__title {
			font-size: var(--text-h2-lg);
		}
	}

	.close__text {
		margin-top: 1.5rem;
		max-width: 52ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body-lg);
		line-height: 1.75;
	}

	.close :global(.close__cta) {
		margin-top: 2.25rem;
		padding: 1.15rem 2.5rem;
	}
</style>
