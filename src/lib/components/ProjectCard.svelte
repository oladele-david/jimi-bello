<script lang="ts">
	/**
	 * Project tile for the portfolio and home grids.
	 *
	 * The card has no border, no shadow and no panel — separation comes from
	 * whitespace, per the brand's minimal treatment. On hover the image scales
	 * 1.04 behind a fixed frame and the category tag picks up Maximum Red.
	 *
	 * `shape` drives the asymmetric grid: 'tall' spans two rows, 'wide' spans two
	 * columns, 'square' occupies one cell. The aspect ratio follows the shape so
	 * the images themselves are the thing breaking the grid's rhythm.
	 */
	import { srcset, img } from '$lib/images';
	import type { Project } from '$lib/data/site';

	interface Props {
		project: Project;
		/** Sizes hint for the responsive image; depends on the grid it sits in. */
		sizes?: string;
		/** Above-the-fold cards load eagerly; the rest stay lazy. */
		priority?: boolean;
	}

	let { project, sizes = '(min-width: 1024px) 50vw, 100vw', priority = false }: Props = $props();

	/** Tall tiles are portrait, wide tiles are letterbox, squares sit between. */
	const RATIOS = { tall: 3 / 4, wide: 16 / 9, square: 4 / 3 } as const;
	let ratio = $derived(RATIOS[project.shape]);
</script>

<a class="card" href="/portfolio/{project.slug}">
	<div class="card__frame" style:aspect-ratio={ratio}>
		<img
			class="card__image"
			src={img(project.hero, 1024, { ratio })}
			srcset={srcset(project.hero, { ratio })}
			{sizes}
			alt={project.title}
			width="1024"
			height={Math.round(1024 / ratio)}
			loading={priority ? 'eager' : 'lazy'}
			fetchpriority={priority ? 'high' : 'auto'}
			decoding="async"
		/>
	</div>

	<div class="card__meta">
		<span class="card__category eyebrow">{project.category}</span>
		<h3 class="card__title">{project.title}</h3>
		<p class="card__excerpt">{project.excerpt}</p>
	</div>
</a>

<style>
	.card {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	.card__frame {
		/* Fixed frame: the image scales inside it, the layout never moves. */
		overflow: hidden;
		background-color: var(--color-jbc-black-15);
	}

	.card__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 500ms var(--ease-out-brand);
	}

	.card:hover .card__image,
	.card:focus-visible .card__image {
		transform: scale(1.04);
	}

	.card__meta {
		padding-top: 1.25rem;
	}

	.card__category {
		display: block;
		color: var(--color-jbc-black-50);
		transition: color 400ms var(--ease-out-brand);
	}

	/* The red arrives on hover — the tag is the only element that changes hue. */
	.card:hover .card__category,
	.card:focus-visible .card__category {
		color: var(--color-jbc-red);
	}

	.card__title {
		margin-top: 0.5rem;
		font-size: var(--text-h2);
		font-weight: 600;
		line-height: 1.2;
	}

	.card__excerpt {
		margin-top: 0.5rem;
		max-width: 46ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body);
		line-height: 1.65;
	}

	@media (prefers-reduced-motion: reduce) {
		.card__image {
			transition: none;
		}

		.card:hover .card__image,
		.card:focus-visible .card__image {
			transform: none;
		}
	}
</style>
