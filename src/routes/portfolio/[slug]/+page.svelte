<script lang="ts">
	/**
	 * Project detail: full-bleed hero, a facts column beside the narrative, then
	 * the gallery. Gallery images alternate between full-width and paired so the
	 * page keeps the asymmetry of the index rather than settling into a strip.
	 */
	import { page } from '$app/state';
	import { img, srcset } from '$lib/images';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let project = $derived(data.project);
	let next = $derived(data.next);

	/** Crawlers reject relative og:image paths, so resolve against the request origin. */
	let ogImage = $derived(new URL(img(project.hero, 1200), page.url.origin).href);

	let facts = $derived([
		{ label: 'Category', value: project.category },
		{ label: 'Year', value: project.year },
		{ label: 'Location', value: project.location },
		{ label: 'Scope', value: project.scope }
	]);
</script>

<svelte:head>
	<title>{project.title} — JBC | Jimibello &amp; Co.</title>
	<meta name="description" content={project.excerpt} />
	<meta property="og:title" content="{project.title} — JBC" />
	<meta property="og:description" content={project.excerpt} />
	<meta property="og:image" content={ogImage} />
</svelte:head>

<article>
	<header class="hero">
		<img
			class="hero__image"
			src={img(project.hero, 1920, { ratio: 16 / 9 })}
			srcset={srcset(project.hero, { ratio: 16 / 9 })}
			sizes="100vw"
			alt={project.title}
			width="1920"
			height="1080"
			fetchpriority="high"
			decoding="async"
		/>
		<div class="hero__scrim" aria-hidden="true"></div>

		<div class="hero__inner shell">
			<p class="hero__eyebrow eyebrow">{project.category} · {project.year}</p>
			<h1 class="hero__title">{project.title}</h1>
		</div>
	</header>

	<section class="body">
		<div class="body__inner shell">
			<FadeUp class="body__facts">
				<dl>
					{#each facts as fact (fact.label)}
						<div class="fact">
							<dt class="eyebrow">{fact.label}</dt>
							<dd>{fact.value}</dd>
						</div>
					{/each}
				</dl>
			</FadeUp>

			<FadeUp index={1} class="body__prose">
				<p class="body__excerpt">{project.excerpt}</p>
				{#each project.body as paragraph (paragraph)}
					<p>{paragraph}</p>
				{/each}
			</FadeUp>
		</div>
	</section>

	{#if project.gallery.length > 0}
		<section class="gallery">
			<div class="shell">
				<ul class="gallery__list">
					{#each project.gallery as shot, i (shot.id)}
						{@const wide = i % 3 === 0}
						<FadeUp as="li" index={i} class={['gallery__item', wide && 'gallery__item--wide']}>
							<figure>
								<img
									src={img(shot.id, wide ? 1440 : 1024, { ratio: wide ? 16 / 9 : 4 / 3 })}
									srcset={srcset(shot.id, { ratio: wide ? 16 / 9 : 4 / 3 })}
									sizes={wide
										? '(min-width: 64rem) 84rem, 100vw'
										: '(min-width: 64rem) 42vw, 100vw'}
									alt={shot.caption}
									width={wide ? 1440 : 1024}
									height={wide ? 810 : 768}
									loading="lazy"
									decoding="async"
								/>
								<figcaption>{shot.caption}</figcaption>
							</figure>
						</FadeUp>
					{/each}
				</ul>
			</div>
		</section>
	{/if}

	<nav class="next dark-bg" aria-label="Next project">
		<img
			class="next__image"
			src={img(next.hero, 1920, { ratio: 21 / 9 })}
			srcset={srcset(next.hero, { ratio: 21 / 9 })}
			sizes="100vw"
			alt=""
			width="1920"
			height="823"
			loading="lazy"
			decoding="async"
		/>
		<div class="next__scrim" aria-hidden="true"></div>

		<div class="next__inner shell">
			<p class="next__eyebrow eyebrow">Next project</p>
			<a class="next__title" href="/portfolio/{next.slug}">{next.title}</a>
			<div class="next__actions">
				<CTAButton href="/portfolio" variant="outline" class="next__cta">Back to all work</CTAButton
				>
			</div>
		</div>
	</nav>
</article>

<style>
	/* ── Hero ─────────────────────────────────────────────────────────────── */

	.hero {
		position: relative;
		display: flex;
		align-items: flex-end;
		min-height: 78svh;
		min-height: 78vh;
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
			rgba(38, 38, 38, 0.45) 45%,
			rgba(38, 38, 38, 0.4) 100%
		);
	}

	.hero__inner {
		position: relative;
		padding-bottom: 4rem;
		color: var(--color-jbc-white);
	}

	@media (width >= 64rem) {
		.hero__inner {
			padding-bottom: 6rem;
		}
	}

	.hero__eyebrow {
		color: var(--color-jbc-white-70);
	}

	.hero__title {
		margin-top: 1.25rem;
		max-width: 16ch;
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

	/* ── Body ─────────────────────────────────────────────────────────────── */

	.body {
		padding-block: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.body {
			padding-block: var(--spacing-section-lg);
		}

		.body__inner {
			display: grid;
			grid-template-columns: 18rem 1fr;
			column-gap: 5rem;
			align-items: start;
		}
	}

	.body :global(.body__facts dl) {
		display: grid;
		gap: 1.5rem;
		margin: 0;
	}

	.fact dt {
		color: var(--color-jbc-black-50);
	}

	.fact dd {
		margin: 0.5rem 0 0;
		font-size: var(--text-body);
		line-height: 1.55;
	}

	.body :global(.body__prose) {
		margin-top: 3rem;
	}

	@media (width >= 64rem) {
		.body :global(.body__prose) {
			margin-top: 0;
		}
	}

	.body__excerpt {
		max-width: 34ch;
		font-size: var(--text-h2);
		font-weight: 600;
		line-height: 1.3;
	}

	@media (width >= 64rem) {
		.body__excerpt {
			font-size: 1.875rem;
		}
	}

	.body :global(.body__prose p + p) {
		margin-top: 1.5rem;
		max-width: 62ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body-lg);
		line-height: 1.8;
	}

	/* ── Gallery ──────────────────────────────────────────────────────────── */

	.gallery {
		padding-bottom: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.gallery {
			padding-bottom: var(--spacing-section-lg);
		}
	}

	.gallery__list {
		display: grid;
		gap: 3rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (width >= 64rem) {
		.gallery__list {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: 4rem;
			row-gap: 5rem;
		}

		/* Every third shot runs across both columns, breaking the pair rhythm. */
		.gallery :global(.gallery__item--wide) {
			grid-column: 1 / -1;
		}
	}

	.gallery figure {
		margin: 0;
	}

	.gallery img {
		display: block;
		width: 100%;
		height: auto;
		background-color: var(--color-jbc-black-15);
	}

	.gallery figcaption {
		margin-top: 1rem;
		color: var(--color-jbc-black-50);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	/* ── Next project ─────────────────────────────────────────────────────── */

	.next {
		position: relative;
		overflow: hidden;
		background-color: var(--color-jbc-black);
		color: var(--color-jbc-white);
	}

	.next__image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.next__scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(38, 38, 38, 0.9) 0%,
			rgba(38, 38, 38, 0.72) 60%,
			rgba(38, 38, 38, 0.66) 100%
		);
	}

	.next__inner {
		position: relative;
		padding-block: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.next__inner {
			padding-block: var(--spacing-section-lg);
		}
	}

	.next__eyebrow {
		color: var(--color-jbc-white-50);
	}

	.next__title {
		display: inline-block;
		margin-top: 1.25rem;
		max-width: 18ch;
		color: var(--color-jbc-white);
		font-size: var(--text-h1);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
		text-decoration: none;
		transition: color 350ms var(--ease-out-brand);
	}

	@media (width >= 64rem) {
		.next__title {
			font-size: 4rem;
		}
	}

	.next__title:hover {
		color: var(--color-jbc-red);
	}

	.next__actions {
		margin-top: 2.5rem;
	}

	.next :global(.next__cta) {
		padding: 1rem 2.25rem;
	}
</style>
