<script lang="ts">
	/**
	 * About. The manual's own voice — direct, warm, no studio-speak. Vision and
	 * Mission sit in an offset two-column block rather than matched cards, so
	 * the page never reads as a corporate boilerplate section.
	 */
	import { img, srcset } from '$lib/images';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import Skyline from '$lib/components/Skyline.svelte';

	const HERO = 'pages/about-hero';
	const WORKSHOP = 'pages/about-workshop';

	const numbers = [
		{ value: '12', label: 'Years designing and building' },
		{ value: '140+', label: 'Rooms completed in Lagos' },
		{ value: '10 yr', label: 'Structural warranty on our furniture' }
	];
</script>

<svelte:head>
	<title>About — JBC | Jimibello &amp; Co.</title>
	<meta
		name="description"
		content="JBC is an interior design studio with a furniture workshop attached. Our story, vision and mission — and why building our own pieces changes what we can design."
	/>
</svelte:head>

<section class="hero">
	<img
		class="hero__image"
		src={img(HERO, 1920, { ratio: 16 / 9 })}
		srcset={srcset(HERO, { ratio: 16 / 9 })}
		sizes="100vw"
		alt="The JBC studio floor, with drawings pinned along a timber storage wall"
		width="1920"
		height="1080"
		fetchpriority="high"
		decoding="async"
	/>
	<div class="hero__scrim" aria-hidden="true"></div>
	<div class="hero__inner shell">
		<p class="hero__eyebrow eyebrow">About</p>
		<h1 class="hero__title">A design studio with a workshop attached.</h1>
	</div>
</section>

<section class="story">
	<div class="story__inner shell">
		<FadeUp class="story__lead">
			<p class="story__pull">
				We started because too many good rooms were being finished with whatever happened to fit.
			</p>
		</FadeUp>

		<FadeUp index={1} class="story__body">
			<p>
				JBC began as a two-person interior practice in Lagos, and for the first few years we did
				what every studio does: draw the space, then spend weeks hunting for pieces that were nearly
				the right size. Nearly is expensive. Nearly is what makes a finished room feel slightly off
				without anyone being able to say why.
			</p>
			<p>
				So we opened a workshop. Now when a wall is 2,340mm wide, the bookcase is 2,340mm wide. When
				a client wants a four-poster bed and has a normal ceiling, we redraw the bed rather than
				talk them out of it. The design and the making sit in the same building, which means the
				drawings are honest about what can actually be built — and the build never quietly departs
				from the drawing.
			</p>
			<p>
				We work on homes and offices, on budgets from modest to considerable. Need budget-friendly
				interiors done properly? That is a conversation we are happy to have, and one we have often.
			</p>
			<CTAButton href="/services" variant="outline" class="story__cta">What we do</CTAButton>
		</FadeUp>
	</div>
</section>

<section class="numbers">
	<div class="shell">
		<ul class="numbers__list">
			{#each numbers as item, i (item.label)}
				<FadeUp as="li" index={i} class="numbers__item">
					<span class="numbers__value">{item.value}</span>
					<span class="numbers__label">{item.label}</span>
				</FadeUp>
			{/each}
		</ul>
	</div>
</section>

<section class="vm dark-bg">
	<div class="vm__motif" aria-hidden="true">
		<Skyline theme="dark" opacity={0.18} />
	</div>

	<div class="vm__inner shell">
		<FadeUp class="vm__block vm__block--vision">
			<p class="vm__eyebrow eyebrow">Vision</p>
			<h2 class="vm__title">Rooms in Lagos that were made for the people in them.</h2>
			<p class="vm__text">
				We want made-to-measure to stop being a luxury word. A house full of pieces built for its
				own walls should be an ordinary way to live, not a rare one — and the way there is to keep
				the design and the making under one roof, where the cost of custom stops multiplying.
			</p>
		</FadeUp>

		<FadeUp index={1} class="vm__block vm__block--mission">
			<p class="vm__eyebrow eyebrow">Mission</p>
			<h2 class="vm__title">Design it, build it, stand behind it.</h2>
			<p class="vm__text">
				Every project runs with one team from first sketch to handover: no design that cannot be
				built, no builder inheriting someone else's drawing. Every piece that leaves our workshop is
				signed, numbered and warranted for ten years — because a chair you can hand down is worth
				more than a chair you replace.
			</p>
		</FadeUp>
	</div>
</section>

<section class="workshop">
	<div class="workshop__inner shell">
		<FadeUp class="workshop__media">
			<img
				src={img(WORKSHOP, 1024, { ratio: 4 / 5 })}
				srcset={srcset(WORKSHOP, { ratio: 4 / 5 })}
				sizes="(min-width: 64rem) 45vw, 100vw"
				alt="A JBC maker checking a joint on a partly assembled timber frame"
				width="1024"
				height="1280"
				loading="lazy"
				decoding="async"
			/>
		</FadeUp>

		<FadeUp index={1} class="workshop__copy">
			<p class="workshop__eyebrow eyebrow">The workshop</p>
			<h2 class="workshop__title">The part most studios have to outsource.</h2>
			<p class="workshop__text">
				Beds, four-poster beds, chests of drawers, dining tables and chairs, bookcases, coffee
				tables — drawn here, prototyped here, built here in solid timber. Prototypes are reviewed
				with you before the full run, and nothing ships until the joinery is right.
			</p>
			<CTAButton href="/services#furniture-design" variant="outline" class="workshop__cta">
				Furniture design
			</CTAButton>
		</FadeUp>
	</div>
</section>

<style>
	/* ── Hero ─────────────────────────────────────────────────────────────── */

	.hero {
		position: relative;
		display: flex;
		align-items: flex-end;
		min-height: 68svh;
		min-height: 68vh;
		overflow: hidden;
		background-color: var(--color-jbc-black);
	}

	.hero__image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero__scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(38, 38, 38, 0.85) 0%,
			rgba(38, 38, 38, 0.5) 45%,
			rgba(38, 38, 38, 0.42) 100%
		);
	}

	.hero__inner {
		position: relative;
		padding-bottom: 4rem;
		color: var(--color-jbc-white);
	}

	@media (width >= 64rem) {
		.hero__inner {
			padding-bottom: 5.5rem;
		}
	}

	.hero__eyebrow {
		color: var(--color-jbc-white-70);
	}

	.hero__title {
		margin-top: 1.25rem;
		max-width: 18ch;
		font-size: var(--text-h1);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	@media (width >= 64rem) {
		.hero__title {
			font-size: 4.5rem;
		}
	}

	/* ── Story ────────────────────────────────────────────────────────────── */

	.story {
		padding-block: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.story {
			padding-block: var(--spacing-section-lg);
		}

		.story__inner {
			display: grid;
			grid-template-columns: 1fr 1.15fr;
			column-gap: 5rem;
			align-items: start;
		}
	}

	.story__pull {
		max-width: 22ch;
		font-size: var(--text-h2-lg);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.015em;
	}

	.story :global(.story__body p) {
		margin-top: 1.5rem;
		max-width: 58ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body-lg);
		line-height: 1.75;
	}

	.story :global(.story__body p:first-child) {
		margin-top: 2rem;
	}

	@media (width >= 64rem) {
		.story :global(.story__body p:first-child) {
			margin-top: 0;
		}
	}

	.story :global(.story__cta) {
		margin-top: 2.25rem;
		padding: 1rem 2.25rem;
	}

	/* ── Numbers ──────────────────────────────────────────────────────────── */

	.numbers {
		padding-bottom: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.numbers {
			padding-bottom: var(--spacing-section-lg);
		}
	}

	.numbers__list {
		display: grid;
		gap: 2.5rem;
		margin: 0;
		padding: 2.5rem 0 0;
		list-style: none;
		border-top: 1px solid var(--color-jbc-black-15);
	}

	@media (width >= 48rem) {
		.numbers__list {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 3rem;
		}
	}

	.numbers :global(.numbers__item) {
		display: grid;
		gap: 0.75rem;
	}

	.numbers__value {
		font-size: 3rem;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.numbers__label {
		max-width: 24ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body);
		line-height: 1.6;
	}

	/* ── Vision & Mission ─────────────────────────────────────────────────── */

	.vm {
		position: relative;
		overflow: hidden;
		background-color: var(--color-jbc-black);
		color: var(--color-jbc-white);
	}

	.vm__motif {
		position: absolute;
		inset: auto 0 0;
		height: 65%;
		pointer-events: none;
	}

	.vm__inner {
		position: relative;
		display: grid;
		gap: 3.5rem;
		padding-block: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.vm__inner {
			/* Offset, not matched: the two blocks are different widths and the
			   second sits lower, so they read as a conversation, not a table. */
			grid-template-columns: 1fr 1fr;
			column-gap: 5rem;
			padding-block: var(--spacing-section-lg);
		}

		.vm :global(.vm__block--mission) {
			margin-top: 6rem;
		}
	}

	.vm__eyebrow {
		color: var(--color-jbc-red);
	}

	.vm__title {
		margin-top: 1.25rem;
		max-width: 20ch;
		font-size: var(--text-h2);
		font-weight: 700;
		line-height: 1.15;
	}

	@media (width >= 64rem) {
		.vm__title {
			font-size: 2.25rem;
		}
	}

	.vm__text {
		margin-top: 1.5rem;
		max-width: 48ch;
		color: var(--color-jbc-white-70);
		font-size: var(--text-body-lg);
		line-height: 1.75;
	}

	/* ── Workshop ─────────────────────────────────────────────────────────── */

	.workshop {
		padding-block: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.workshop {
			padding-block: var(--spacing-section-lg);
		}

		.workshop__inner {
			display: grid;
			grid-template-columns: 0.95fr 1fr;
			column-gap: 5rem;
			align-items: center;
		}
	}

	.workshop :global(.workshop__media img) {
		display: block;
		width: 100%;
		height: auto;
		background-color: var(--color-jbc-black-15);
	}

	.workshop :global(.workshop__copy) {
		margin-top: 2.5rem;
	}

	@media (width >= 64rem) {
		.workshop :global(.workshop__copy) {
			margin-top: 0;
		}
	}

	.workshop__eyebrow {
		color: var(--color-jbc-black-50);
	}

	.workshop__title {
		margin-top: 1.25rem;
		max-width: 18ch;
		font-size: var(--text-h2);
		font-weight: 600;
		line-height: 1.15;
	}

	@media (width >= 64rem) {
		.workshop__title {
			font-size: var(--text-h2-lg);
		}
	}

	.workshop__text {
		margin-top: 1.5rem;
		max-width: 52ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body-lg);
		line-height: 1.75;
	}

	.workshop :global(.workshop__cta) {
		margin-top: 2.25rem;
		padding: 1rem 2.25rem;
	}
</style>
