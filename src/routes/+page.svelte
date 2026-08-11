<script lang="ts">
	/**
	 * Home. Five movements: full-bleed hero, intro with a Bold pull-quote,
	 * asymmetric featured grid, services teaser, dark CTA band.
	 *
	 * The hero photograph is the one place a busy image sits behind the lockup,
	 * so the header renders its solid white lockup there — never the full-colour
	 * one — per the brand manual.
	 */
	import { img, srcset } from '$lib/images';
	import { projects, services } from '$lib/data/site';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	const HERO = 'pages/home-hero';

	/**
	 * Curated rather than sliced, because the shapes carry the layout: a tall
	 * tile beside a square for the offset pair, then the one 'wide' project on
	 * its own so it can break out to the full viewport width.
	 */
	const pair = projects.filter((p) => ['ikoyi-residence', 'four-poster-series'].includes(p.slug));
	const [breakout] = projects.filter((p) => p.slug === 'victoria-island-studio');
</script>

<svelte:head>
	<title>JBC — Jimibello &amp; Co. | Interior design and handcrafted furniture, Lagos</title>
	<meta
		name="description"
		content="JBC designs interiors for homes and offices and builds the furniture that goes in them — from first sketch to the day you move back in. Lagos, Nigeria."
	/>
</svelte:head>

<section class="hero">
	<img
		class="hero__image"
		src={img(HERO, 1920, { ratio: 16 / 10 })}
		srcset={srcset(HERO, { ratio: 16 / 10 })}
		sizes="100vw"
		alt="A daylit living room with built-in timber storage and a low solid-wood table"
		width="1920"
		height="1200"
		fetchpriority="high"
		decoding="async"
	/>
	<!-- Scrim: the headline and the header lockup both need this to stay legible. -->
	<div class="hero__scrim" aria-hidden="true"></div>

	<div class="hero__inner shell">
		<p class="hero__eyebrow eyebrow">Interior design &amp; furniture · Lagos</p>
		<h1 class="hero__title">Interiors we design.<br />Furniture we build.</h1>
		<p class="hero__lede">
			Most studios draw a room and then go shopping. We draw the room, then make the pieces that fit
			it — in our own workshop, to the millimetre.
		</p>
		<div class="hero__actions">
			<CTAButton href="/portfolio" variant="outline" class="hero__cta">See the work</CTAButton>
		</div>
	</div>
</section>

<section class="intro">
	<div class="intro__inner shell">
		<FadeUp>
			<p class="intro__eyebrow eyebrow">Who we are</p>
		</FadeUp>
		<FadeUp index={1}>
			<blockquote class="intro__quote">
				A room is finished when nothing in it is a compromise.
			</blockquote>
		</FadeUp>
		<FadeUp index={2} class="intro__body">
			<p>
				JBC is an interior design studio with a furniture workshop attached. That second half is the
				part that changes things: when the alcove is an awkward width, we do not hunt for a bookcase
				that nearly fits — we build one that does.
			</p>
			<p>
				We work on homes and offices across Lagos, on projects that run from a single stalled
				renovation to a full floor plate. One team carries it from the first sketch to the day you
				move back in.
			</p>
			<CTAButton href="/about" variant="outline" class="intro__cta">More about JBC</CTAButton>
		</FadeUp>
	</div>
</section>
<section class="work">
	<div class="shell">
		<FadeUp class="work__head">
			<p class="work__eyebrow eyebrow">Selected work</p>
			<h2 class="work__title">Three rooms that had a problem first.</h2>
		</FadeUp>
	</div>

	<!-- Pair: one tall, one square, offset. The offset is the whole point —
	     a uniform 3-up would read as a template. -->
	<div class="work__pair shell">
		{#each pair as project, i (project.slug)}
			<FadeUp index={i} class={['work__cell', i === 1 && 'work__cell--offset']}>
				<ProjectCard {project} sizes="(min-width: 64rem) 42vw, 100vw" />
			</FadeUp>
		{/each}
	</div>

	<!-- Breakout: full viewport width, out of the content column entirely. -->
	<FadeUp class="work__breakout">
		<ProjectCard project={breakout} sizes="100vw" />
	</FadeUp>

	<div class="work__foot shell">
		<FadeUp>
			<CTAButton href="/portfolio" variant="outline">View all work</CTAButton>
		</FadeUp>
	</div>
</section>

<section class="services">
	<div class="shell">
		<FadeUp class="services__head">
			<p class="eyebrow">What we do</p>
			<h2 class="services__title">Five services, one team.</h2>
		</FadeUp>

		<ul class="services__list">
			{#each services as service, i (service.slug)}
				<FadeUp as="li" index={i} class="services__item">
					<a class="services__link" href="/services#{service.slug}">
						<span class="services__index eyebrow">{String(i + 1).padStart(2, '0')}</span>
						<span class="services__text">
							<span class="services__name">{service.title}</span>
							<span class="services__summary">{service.summary}</span>
						</span>
						<span class="services__arrow" aria-hidden="true">→</span>
					</a>
				</FadeUp>
			{/each}
		</ul>
	</div>
</section>

<!-- Solid Maximum Red: the footer already owns the dark ground + skyline
     treatment, so the CTA takes the one saturated surface on the site. -->
<section class="band dark-bg">
	<div class="band__inner shell">
		<FadeUp>
			<p class="band__eyebrow eyebrow">Start a project</p>
			<h2 class="band__title">Tell us what the room is doing wrong.</h2>
			<p class="band__lede">
				Send us the space, the budget band you are working to, and what is not working. We will tell
				you honestly whether we are the right studio for it.
			</p>
			<CTAButton href="/contact" variant="outline" class="band__cta">Talk to JBC</CTAButton>
		</FadeUp>
	</div>
</section>

<style>
	/* ── Hero ─────────────────────────────────────────────────────────────── */

	.hero {
		position: relative;
		display: flex;
		align-items: flex-end;
		min-height: 100svh;
		/* Falls back for browsers without svh; the header sits over this. */
		min-height: 100vh;
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

	/* Weighted to the bottom, where the type sits, so the image stays open above. */
	.hero__scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(38, 38, 38, 0.82) 0%,
			rgba(38, 38, 38, 0.55) 38%,
			rgba(38, 38, 38, 0.28) 70%,
			rgba(38, 38, 38, 0.45) 100%
		);
	}

	.hero__inner {
		position: relative;
		padding-bottom: 5rem;
		color: var(--color-jbc-white);
	}

	@media (width >= 64rem) {
		.hero__inner {
			padding-bottom: 7rem;
		}
	}

	.hero__eyebrow {
		color: var(--color-jbc-white-70);
	}

	.hero__title {
		margin-top: 1.5rem;
		max-width: 16ch;
		font-size: var(--text-hero);
		font-weight: 700;
		line-height: 0.98;
		letter-spacing: -0.02em;
	}

	.hero__lede {
		margin-top: 1.75rem;
		max-width: 46ch;
		color: var(--color-jbc-white-70);
		font-size: var(--text-body-lg);
		line-height: 1.65;
	}

	.hero__actions {
		margin-top: 2.5rem;
	}

	.hero :global(.hero__cta) {
		padding: 1.15rem 2.5rem;
		/* On the photograph the outline must read white, not red. */
		border-color: var(--color-jbc-white);
		color: var(--color-jbc-white);
	}

	.hero :global(.hero__cta:hover) {
		background-color: var(--color-jbc-red);
		border-color: var(--color-jbc-red);
	}

	/* ── Intro ────────────────────────────────────────────────────────────── */

	.intro {
		padding-block: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.intro {
			padding-block: var(--spacing-section-lg);
		}
	}

	.intro__eyebrow {
		color: var(--color-jbc-black-50);
	}

	.intro__quote {
		margin: 1.75rem 0 0;
		max-width: 20ch;
		font-size: var(--text-h1);
		font-weight: 700;
		line-height: 1.08;
		letter-spacing: -0.015em;
	}

	@media (width >= 64rem) {
		.intro__inner {
			display: grid;
			grid-template-columns: 1.1fr 1fr;
			column-gap: 5rem;
			/* Eyebrow above the quote in column one; body sits in column two,
			   pulled level with the quote rather than the eyebrow. */
			grid-template-areas:
				'eyebrow body'
				'quote body';
			align-items: start;
		}

		.intro__eyebrow {
			grid-area: eyebrow;
		}

		.intro__quote {
			grid-area: quote;
			margin-top: 1rem;
			font-size: 3.25rem;
		}

		.intro :global(.intro__body) {
			grid-area: body;
		}
	}

	.intro :global(.intro__body p) {
		margin-top: 1.5rem;
		max-width: 52ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body-lg);
		line-height: 1.7;
	}

	.intro :global(.intro__cta) {
		margin-top: 2.25rem;
		padding: 1rem 2.25rem;
	}

	/* ── Selected work ────────────────────────────────────────────────────── */

	.work {
		padding-bottom: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.work {
			padding-bottom: var(--spacing-section-lg);
		}
	}

	.work :global(.work__head) {
		max-width: 30ch;
	}

	.work__eyebrow {
		color: var(--color-jbc-black-50);
	}

	.work__title {
		margin-top: 1rem;
		font-size: var(--text-h2);
		font-weight: 600;
		line-height: 1.15;
	}

	@media (width >= 64rem) {
		.work__title {
			font-size: var(--text-h2-lg);
		}
	}

	.work__pair {
		display: grid;
		gap: 3.5rem;
		margin-top: 3rem;
	}

	@media (width >= 64rem) {
		.work__pair {
			grid-template-columns: 1.15fr 1fr;
			gap: 4rem;
			margin-top: 4.5rem;
			align-items: start;
		}

		/* The offset that keeps the pair from reading as a two-up card row. */
		.work__pair :global(.work__cell--offset) {
			margin-top: 7rem;
		}
	}

	.work :global(.work__breakout) {
		margin-top: 4rem;
	}

	@media (width >= 64rem) {
		.work :global(.work__breakout) {
			margin-top: 7rem;
		}
	}

	/* The breakout image runs full-viewport, but its caption block returns to
	   the content column so the text still lines up with everything above it. */
	.work :global(.work__breakout) :global(.card__meta) {
		width: 100%;
		max-width: 84rem;
		margin-inline: auto;
		padding-inline: 1.5rem;
	}

	@media (width >= 64rem) {
		.work :global(.work__breakout) :global(.card__meta) {
			padding-inline: 3rem;
		}
	}

	.work__foot {
		margin-top: 3.5rem;
	}

	.work__foot :global(.cta) {
		padding: 1rem 2.25rem;
	}

	/* ── Services teaser ──────────────────────────────────────────────────── */

	.services {
		padding-block: var(--spacing-section);
		border-top: 1px solid var(--color-jbc-black-15);
	}

	@media (width >= 64rem) {
		.services {
			padding-block: var(--spacing-section-lg);
		}
	}

	.services :global(.services__head) {
		max-width: 32ch;
	}

	.services :global(.services__head .eyebrow) {
		color: var(--color-jbc-black-50);
	}

	.services__title {
		margin-top: 1rem;
		font-size: var(--text-h2);
		font-weight: 600;
		line-height: 1.15;
	}

	@media (width >= 64rem) {
		.services__title {
			font-size: var(--text-h2-lg);
		}
	}

	.services__list {
		margin: 3rem 0 0;
		padding: 0;
		list-style: none;
	}

	.services :global(.services__item) {
		border-top: 1px solid var(--color-jbc-black-15);
	}

	.services :global(.services__item:last-child) {
		border-bottom: 1px solid var(--color-jbc-black-15);
	}

	.services__link {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: baseline;
		gap: 1.25rem;
		padding: 1.75rem 0;
		color: inherit;
		text-decoration: none;
	}

	@media (width >= 64rem) {
		.services__link {
			gap: 3rem;
			padding: 2.25rem 0;
		}
	}

	.services__index {
		color: var(--color-jbc-black-50);
		transition: color 400ms var(--ease-out-brand);
	}

	.services__link:hover .services__index {
		color: var(--color-jbc-red);
	}

	.services__text {
		display: grid;
		gap: 0.5rem;
	}

	@media (width >= 64rem) {
		.services__text {
			grid-template-columns: 18rem 1fr;
			align-items: baseline;
			gap: 2rem;
		}
	}

	.services__name {
		font-size: 1.375rem;
		font-weight: 600;
		line-height: 1.2;
	}

	.services__summary {
		max-width: 54ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body);
		line-height: 1.6;
	}

	.services__arrow {
		align-self: center;
		color: var(--color-jbc-black-50);
		transition:
			color 400ms var(--ease-out-brand),
			transform 400ms var(--ease-out-brand);
	}

	.services__link:hover .services__arrow {
		color: var(--color-jbc-red);
		transform: translateX(6px);
	}

	/* ── Dark CTA band ────────────────────────────────────────────────────── */

	.band {
		position: relative;
		overflow: hidden;
		background-color: var(--color-jbc-red);
		color: var(--color-jbc-white);
	}

	.band__inner {
		position: relative;
		padding-block: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.band__inner {
			padding-block: var(--spacing-section-lg);
		}
	}

	/* On red, the white opacity tints go muddy rather than quiet, so the
	   secondary type holds full white and steps down in weight instead. */
	.band__eyebrow {
		color: var(--color-jbc-white);
	}

	.band__title {
		margin-top: 1.25rem;
		max-width: 18ch;
		font-size: var(--text-h1);
		font-weight: 700;
		line-height: 1.08;
		letter-spacing: -0.015em;
	}

	@media (width >= 64rem) {
		.band__title {
			font-size: 3.5rem;
		}
	}

	.band__lede {
		margin-top: 1.5rem;
		max-width: 50ch;
		color: var(--color-jbc-white);
		font-size: var(--text-body-lg);
		line-height: 1.7;
	}

	.band :global(.band__cta) {
		margin-top: 2.5rem;
		padding: 1.15rem 2.5rem;
	}

	/* The shared .dark-bg outline hover fills Maximum Red — invisible here.
	   On the red ground it inverts to a solid white chip instead. */
	.band :global(.band__cta:hover) {
		background-color: var(--color-jbc-white);
		border-color: var(--color-jbc-white);
		color: var(--color-jbc-red);
	}

	@media (prefers-reduced-motion: reduce) {
		.services__link:hover .services__arrow {
			transform: none;
		}
	}
</style>
