<script lang="ts">
	import { products } from '$lib/data/site';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';

	let activeCategory = $state('All');
	const categories = ['All', 'Living', 'Dining', 'Bedroom', 'Storage'];

	let filteredProducts = $derived(
		activeCategory === 'All'
			? products
			: products.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase())
	);
</script>

<svelte:head>
	<title>Products | Furniture &amp; Objects — JimiBello &amp; Co.</title>
	<meta
		name="description"
		content="Handcrafted furniture and architectural pieces from our Lagos workshop. Built to order in solid timber."
	/>
</svelte:head>

<main id="main" class="bg-jbc-ivory text-jbc-obsidian min-h-screen">
	<!-- Editorial Intro -->
	<section class="shell pt-36 lg:pt-44 pb-10">
		<FadeUp>
			<span class="eyebrow text-jbc-ember block font-semibold">Furniture &amp; Objects</span>
			<h1 class="mt-3 text-h1 lg:text-[3.5rem] font-display font-medium text-jbc-obsidian tracking-jbc-tight max-w-[20ch]">
				Pieces built for the life within.
			</h1>
			<p class="mt-4 max-w-[48ch] text-body-lg text-jbc-slate">
				Handcrafted in solid timber in our Lagos workshop. Made to order and sized to your space.
			</p>
		</FadeUp>
	</section>

	<!-- Catalogue Section -->
	<section class="relative overflow-hidden bg-jbc-ivory pb-[var(--spacing-section)] lg:pb-[var(--spacing-section-lg)]">
		<!-- Subtle Monogram Watermark -->
		<img
			src="/logos/monogram-ember.svg"
			aria-hidden="true"
			class="pointer-events-none absolute -right-[10%] top-1/4 -translate-y-1/2 w-[40vw] max-w-[500px] opacity-[0.04] select-none"
			alt=""
		/>

		<div class="relative shell">
			<!-- Category filter bar -->
			<div class="flex flex-wrap items-center justify-between gap-6 border-b border-jbc-obsidian/10 pb-6">
				<div class="flex flex-wrap gap-2 sm:gap-4">
					{#each categories as category}
						<button
							type="button"
							class={[
								'py-2 text-eyebrow font-semibold tracking-jbc-caps uppercase transition-all duration-300 relative',
								activeCategory === category
									? 'text-jbc-obsidian after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-jbc-ember'
									: 'text-jbc-obsidian/50 hover:text-jbc-obsidian'
							]}
							onclick={() => (activeCategory = category)}
						>
							{category}
						</button>
					{/each}
				</div>

				<p class="text-xs font-semibold tracking-jbc-caps text-jbc-slate uppercase">
					{filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'}
				</p>
			</div>

			<!-- Product Grid: Just Image & Product Name -->
			<div class="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
				{#each filteredProducts as product (product.slug)}
					<FadeUp>
						<ProductCard {product} />
					</FadeUp>
				{/each}
			</div>
		</div>
	</section>
</main>
