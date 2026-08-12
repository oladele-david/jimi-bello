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
	 *
	 * `metaClass` exists for the one caller that needs it: the home page runs a
	 * card's image to the full viewport width but returns its caption to the
	 * content column. That used to be a `:global(.card__meta)` selector reaching
	 * in from the outside, which broke silently if this file renamed the class.
	 */
	import { srcset, img } from '$lib/images';
	import type { Project } from '$lib/data/site';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		project: Project;
		/** Sizes hint for the responsive image; depends on the grid it sits in. */
		sizes?: string;
		/** Above-the-fold cards load eagerly; the rest stay lazy. */
		priority?: boolean;
		class?: ClassValue;
		/** Applied to the caption block, for callers that re-inset it. */
		metaClass?: ClassValue;
	}

	let {
		project,
		sizes = '(min-width: 1024px) 50vw, 100vw',
		priority = false,
		class: className = '',
		metaClass = ''
	}: Props = $props();

	/** Tall tiles are portrait, wide tiles are letterbox, squares sit between. */
	const RATIOS = { tall: 3 / 4, wide: 16 / 9, square: 4 / 3 } as const;
	let ratio = $derived(RATIOS[project.shape]);
</script>

<a class={['group block text-inherit no-underline', className]} href="/portfolio/{project.slug}">
	<!-- Fixed frame: the image scales inside it, the layout never moves. -->
	<div class="overflow-hidden bg-jbc-black-15" style:aspect-ratio={ratio}>
		<img
			class="h-full w-full object-cover transition-transform duration-500 ease-out-brand
			       group-hover:scale-[1.04] group-focus-visible:scale-[1.04]
			       motion-reduce:transition-none motion-reduce:group-hover:scale-100
			       motion-reduce:group-focus-visible:scale-100"
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

	<div class={['pt-5', metaClass]}>
		<!-- The red arrives on hover — the tag is the only element that changes hue. -->
		<span
			class="block eyebrow text-jbc-black-50 transition-colors duration-400 ease-out-brand
			       group-hover:text-jbc-red group-focus-visible:text-jbc-red"
		>
			{project.category}
		</span>
		<h3 class="mt-2 text-h2 leading-[1.2] font-semibold">{project.title}</h3>
		<p class="mt-2 max-w-[46ch] text-body leading-[1.65] text-jbc-black-70">{project.excerpt}</p>
	</div>
</a>
