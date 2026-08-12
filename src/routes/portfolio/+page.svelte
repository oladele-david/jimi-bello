<script lang="ts">
	/**
	 * Portfolio index.
	 *
	 * Filtering lives in the URL (`?category=Furniture`) rather than in local
	 * state: the tabs are plain links, so a filtered view is shareable, survives
	 * the back button, and works before hydration. `data-sveltekit-noscroll`
	 * keeps the page from jumping to the top on each tab.
	 *
	 * The grid places `wide` projects across both columns and offsets whichever
	 * tiles land in the right-hand column. That offset is computed from the
	 * filtered list rather than by :nth-child, because a wide tile resets the
	 * column cursor and CSS cannot see that.
	 */
	import { page } from '$app/state';
	import { projects, categories, type Category } from '$lib/data/site';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Skyline from '$lib/components/Skyline.svelte';

	function isCategory(value: string | null): value is Category {
		return value !== null && (categories as readonly string[]).includes(value);
	}

	let active = $derived.by(() => {
		const param = page.url.searchParams.get('category');
		return isCategory(param) ? param : 'All';
	});

	let filtered = $derived(
		active === 'All' ? projects : projects.filter((project) => project.category === active)
	);

	let tiles = $derived.by(() => {
		let column = 0;
		return filtered.map((project) => {
			if (project.shape === 'wide') {
				column = 0;
				return { project, span: true, offset: false };
			}
			const offset = column === 1;
			column = column === 0 ? 1 : 0;
			return { project, span: false, offset };
		});
	});

	/** 'All' is the bare path, so the canonical URL has no empty query string. */
	function hrefFor(category: Category) {
		return category === 'All' ? '/portfolio' : `/portfolio?category=${category}`;
	}

	/**
	 * Understated text tabs — no pills, no borders. The red rule under the active
	 * tab and the one drawn on hover are the same `after:` element in two states,
	 * so an active tab does not visibly change when the pointer crosses it.
	 */
	const TAB =
		'relative inline-block py-5 text-eyebrow font-semibold tracking-jbc-caps uppercase ' +
		'whitespace-nowrap no-underline text-jbc-black-50 transition-colors duration-[350ms] ' +
		'ease-out-brand hover:text-jbc-black ' +
		"after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:content-[''] " +
		'after:origin-left after:scale-x-0 after:bg-jbc-red after:transition-transform ' +
		'after:duration-[350ms] after:ease-out-brand hover:after:scale-x-100';

	/** Same caps treatment as a tab, but it is a count, not a control. */
	const COUNT = 'shrink-0 text-eyebrow font-semibold tracking-jbc-caps uppercase text-jbc-black-50';
</script>

<svelte:head>
	<title>Portfolio — JBC | Jimibello &amp; Co.</title>
	<meta
		name="description"
		content="Interiors and furniture by JBC — residential, commercial and workshop projects across Lagos."
	/>
</svelte:head>

<!-- Top padding clears the fixed header, which is already filled on this route. -->
<section class="relative overflow-hidden">
	<div class="pointer-events-none absolute inset-x-0 bottom-0 h-[90%]" aria-hidden="true">
		<Skyline theme="light" opacity={0.22} />
	</div>
	<div class="relative shell pt-28 pb-20 lg:pt-48 lg:pb-28">
		<p class="eyebrow text-jbc-black-50">Portfolio</p>
		<h1 class="mt-5 max-w-[16ch] text-h1 font-bold tracking-jbc-tight lg:text-h1-lg">
			The work, and what it had to solve.
		</h1>
		<p class="mt-6 max-w-[48ch] text-body-lg text-jbc-black-70">
			Every project here started with something that was not working — a dark room, a floor plate
			with no daylight, a renovation that had stopped twice.
		</p>
	</div>
</section>

<!-- Sticky: sits directly beneath the fixed header once that header fills. -->
<div class="sticky top-18 z-20 border-b border-jbc-black-15 bg-jbc-white lg:top-20">
	<div class="shell flex min-w-0 items-center justify-between gap-4 lg:gap-6">
		<nav class="min-w-0 flex-1" aria-label="Filter projects by category">
			<!-- On phones the labels wrap into a compact second row; wider screens keep one line. -->
			<ul
				class="flex max-w-full flex-wrap items-center gap-x-5 sm:flex-nowrap sm:gap-x-7
				       sm:overflow-x-auto sm:overscroll-x-contain sm:[scrollbar-width:none]
				       lg:gap-x-10 [&::-webkit-scrollbar]:hidden"
			>
				{#each categories as category (category)}
					<li class="shrink-0">
						<a
							href={hrefFor(category)}
							class={[TAB, category === active && 'text-jbc-black after:scale-x-100']}
							aria-current={category === active ? 'true' : undefined}
							data-sveltekit-noscroll
						>
							{category}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<p class={COUNT} aria-live="polite">
			{filtered.length}
			{filtered.length === 1 ? 'project' : 'projects'}
		</p>
	</div>
</div>

<section class="py-section lg:py-section-lg">
	<div class="shell">
		{#if tiles.length === 0}
			<p class="text-body-lg text-jbc-black-70">No projects in this category yet.</p>
		{:else}
			<!-- Keyed on category too, so switching filters replays the reveal
			     instead of leaving newly-inserted tiles at opacity 0. -->
			{#key active}
				<div class="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-x-16 lg:gap-y-24">
					{#each tiles as tile, i (tile.project.slug)}
						<FadeUp
							index={i}
							class={[
								tile.span && 'lg:col-span-2',
								/* Right-hand tiles drop, so no row lines up flush across. */
								tile.offset && 'lg:mt-20'
							]}
						>
							<ProjectCard
								project={tile.project}
								sizes={tile.span
									? '(min-width: 64rem) 84rem, 100vw'
									: '(min-width: 64rem) 42vw, 100vw'}
								priority={i < 2}
							/>
						</FadeUp>
					{/each}
				</div>
			{/key}
		{/if}
	</div>
</section>
