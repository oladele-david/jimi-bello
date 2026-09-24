<script lang="ts">
	import { img, srcset } from '$lib/images';
	import { products as fallbackProducts } from '$lib/data/site';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';

	let { data } = $props();

	const HERO = 'services/furniture-design';

	let allProducts = $derived(data?.products && data.products.length > 0 ? data.products : fallbackProducts);

	let activeCategory = $state('All');
	const categories = ['All', 'Living', 'Dining', 'Bedroom', 'Storage'];

	let filteredProducts = $derived(
		activeCategory === 'All'
			? allProducts
			: allProducts.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase())
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
	<!-- Hero Section with Background Photography -->
	<section class="dark-bg relative flex min-h-[68svh] flex-col justify-end overflow-hidden bg-jbc-obsidian pt-28 pb-16 lg:pt-36 lg:pb-22">
		<img
			class="absolute inset-0 h-full w-full object-cover"
			src={img(HERO, 1920, { ratio: 16 / 9 })}
			srcset={srcset(HERO, { ratio: 16 / 9 })}
			sizes="100vw"
			alt="Handcrafted furniture and bespoke architectural objects from the JimiBello &amp; Co. workshop"
			width="1920"
			height="1080"
			fetchpriority="high"
			decoding="async"
		/>
		<div class="scrim-page" aria-hidden="true"></div>
		<div class="relative shell pb-16 text-jbc-white lg:pb-22">
			<FadeUp>
				<p class="eyebrow text-jbc-ember font-semibold uppercase">Furniture &amp; Objects</p>
				<h1 class="mt-4 max-w-[18ch] text-h1 font-display font-bold tracking-jbc-tight lg:text-[4.25rem]">
					Pieces built for the life within.
				</h1>
				<p class="mt-4 max-w-[48ch] text-body-lg text-jbc-white/80">
					Handcrafted in solid timber in our Lagos workshop. Made to order and sized to your space.
				</p>
			</FadeUp>
		</div>
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

		<div class="relative shell pt-12">
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
