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
</script>

<svelte:head>
	<title>Portfolio — JBC | Jimibello &amp; Co.</title>
	<meta
		name="description"
		content="Interiors and furniture by JBC — residential, commercial and workshop projects across Lagos."
	/>
</svelte:head>

<section class="head">
	<div class="shell">
		<p class="head__eyebrow eyebrow">Portfolio</p>
		<h1 class="head__title">The work, and what it had to solve.</h1>
		<p class="head__lede">
			Every project here started with something that was not working — a dark room, a floor plate
			with no daylight, a renovation that had stopped twice.
		</p>
	</div>
</section>

<div class="filters">
	<div class="shell">
		<nav class="filters__nav" aria-label="Filter projects by category">
			<ul>
				{#each categories as category (category)}
					<li>
						<a
							href={hrefFor(category)}
							class={['filters__tab', category === active && 'is-active']}
							aria-current={category === active ? 'true' : undefined}
							data-sveltekit-noscroll
						>
							{category}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<p class="filters__count" aria-live="polite">
			{filtered.length}
			{filtered.length === 1 ? 'project' : 'projects'}
		</p>
	</div>
</div>

<section class="work">
	<div class="shell">
		{#if tiles.length === 0}
			<p class="work__empty">No projects in this category yet.</p>
		{:else}
			<!-- Keyed on category too, so switching filters replays the reveal
			     instead of leaving newly-inserted tiles at opacity 0. -->
			{#key active}
				<div class="work__grid">
					{#each tiles as tile, i (tile.project.slug)}
						<FadeUp
							index={i}
							class={[
								'work__tile',
								tile.span && 'work__tile--span',
								tile.offset && 'work__tile--offset'
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

<style>
	.head {
		/* Clears the fixed header, which is already filled white on this route. */
		padding-block: 8rem 3rem;
	}

	@media (width >= 64rem) {
		.head {
			padding-block: 11rem 4rem;
		}
	}

	.head__eyebrow {
		color: var(--color-jbc-black-50);
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
		margin-top: 1.5rem;
		max-width: 48ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body-lg);
		line-height: 1.7;
	}

	/* ── Filters ──────────────────────────────────────────────────────────── */

	.filters {
		position: sticky;
		/* Sits directly beneath the fixed header once it fills. */
		top: 4.5rem;
		z-index: 20;
		background-color: var(--color-jbc-white);
		border-bottom: 1px solid var(--color-jbc-black-15);
	}

	@media (width >= 64rem) {
		.filters {
			top: 5rem;
		}
	}

	.filters .shell {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
	}

	.filters__nav ul {
		display: flex;
		align-items: center;
		gap: 1.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
		/* Four tabs fit most phones; anything narrower scrolls rather than wraps. */
		overflow-x: auto;
		scrollbar-width: none;
	}

	@media (width >= 64rem) {
		.filters__nav ul {
			gap: 2.5rem;
		}
	}

	/* Understated text tabs — no pills, no borders. */
	.filters__tab {
		position: relative;
		display: inline-block;
		padding-block: 1.25rem;
		color: var(--color-jbc-black-50);
		font-size: var(--text-eyebrow);
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-decoration: none;
		white-space: nowrap;
		transition: color 350ms var(--ease-out-brand);
	}

	.filters__tab::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2px;
		background-color: var(--color-jbc-red);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 350ms var(--ease-out-brand);
	}

	.filters__tab:hover {
		color: var(--color-jbc-black);
	}

	.filters__tab.is-active {
		color: var(--color-jbc-black);
	}

	.filters__tab.is-active::after,
	.filters__tab:hover::after {
		transform: scaleX(1);
	}

	.filters__count {
		flex-shrink: 0;
		color: var(--color-jbc-black-50);
		font-size: var(--text-eyebrow);
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	/* ── Grid ─────────────────────────────────────────────────────────────── */

	.work {
		padding-block: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.work {
			padding-block: var(--spacing-section-lg);
		}
	}

	.work__grid {
		display: grid;
		gap: 3.5rem;
	}

	@media (width >= 64rem) {
		.work__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: 4rem;
			row-gap: 6rem;
			align-items: start;
		}

		.work__grid :global(.work__tile--span) {
			grid-column: 1 / -1;
		}

		/* Right-hand tiles drop, so no row ever lines up flush across. */
		.work__grid :global(.work__tile--offset) {
			margin-top: 5rem;
		}
	}

	.work__empty {
		color: var(--color-jbc-black-70);
		font-size: var(--text-body-lg);
	}
</style>
