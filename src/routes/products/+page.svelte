<script lang="ts">
	import { products } from '$lib/data/site';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import { img } from '$lib/images';

	let activeCategory = $state('All');
	const categories = ['All', 'Living', 'Dining', 'Bedroom', 'Storage'];

	let filteredProducts = $derived(
		activeCategory === 'All'
			? products
			: products.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase())
	);
</script>

<svelte:head>
	<title>Products | JimiBello & Co.</title>
	<meta
		name="description"
		content="Handcrafted furniture and architectural pieces from our Lagos workshop. Built to order in solid timber."
	/>
</svelte:head>

<main id="main">
	<!-- Hero -->
	<section class="dark-bg relative flex min-h-[50vh] items-end overflow-hidden bg-jbc-obsidian pb-16 pt-36 lg:pb-24 lg:pt-48">
		<div class="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
			<img
				src={img('services/furniture-design', { w: 1800, q: 80 })}
				alt=""
				class="h-full w-full object-cover"
			/>
		</div>
		<div class="scrim-hero" aria-hidden="true"></div>

		<div class="relative shell">
			<span class="eyebrow text-jbc-ember block">Bespoke Workshop</span>
			<h1 class="mt-3 text-h1 text-jbc-white max-w-[18ch] lg:text-h1-lg">
				Pieces built for the life within.
			</h1>
			<p class="mt-5 max-w-[50ch] text-body-lg text-jbc-white/80">
				From our Woodwolves collection to made-to-measure editions. Every piece is drafted, prototyped, and built in solid timber in our Lagos workshop.
			</p>
		</div>
	</section>

	<!-- Catalogue Section with JB Monogram Watermark -->
	<section class="relative overflow-hidden bg-jbc-ivory py-[var(--spacing-section)] lg:py-[var(--spacing-section-lg)]">
		<!-- JB Watermark from page 40 brand book style -->
		<img
			src="/logos/monogram-ember.svg"
			aria-hidden="true"
			class="pointer-events-none absolute -right-[12%] top-1/3 -translate-y-1/2 w-[45vw] max-w-[580px] opacity-[0.06] select-none"
			alt=""
		/>

		<div class="relative shell">
			<!-- Category filter bar -->
			<div class="flex flex-wrap items-center justify-between gap-6 border-b border-jbc-obsidian/10 pb-6">
				<div class="flex flex-wrap gap-2 sm:gap-3">
					{#each categories as category}
						<button
							type="button"
							class={[
								'px-4 py-2 text-eyebrow font-semibold tracking-jbc-caps uppercase transition-all duration-300',
								activeCategory === category
									? 'bg-jbc-obsidian text-jbc-white'
									: 'bg-jbc-obsidian/5 text-jbc-obsidian/70 hover:bg-jbc-obsidian/10 hover:text-jbc-obsidian'
							]}
							onclick={() => (activeCategory = category)}
						>
							{category}
						</button>
					{/each}
				</div>

				<p class="text-sm font-semibold tracking-jbc-caps text-jbc-slate uppercase">
					Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Design' : 'Designs'}
				</p>
			</div>

			<!-- Product Grid -->
			<div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
				{#each filteredProducts as product (product.slug)}
					<ProductCard {product} />
				{/each}
			</div>
		</div>
	</section>

	<!-- Bespoke Workshop Commission Notice (Ivory with Left Watermark) -->
	<section class="relative overflow-hidden bg-jbc-ivory border-t border-jbc-obsidian/10 py-[var(--spacing-section)]">
		<!-- Left Mirrored Watermark -->
		<img
			src="/logos/monogram-ember.svg"
			aria-hidden="true"
			class="pointer-events-none absolute -left-[12%] top-1/2 -translate-y-1/2 w-[40vw] max-w-[520px] opacity-[0.05] select-none -scale-x-100"
			alt=""
		/>

		<div class="relative shell">
			<div class="grid gap-10 lg:grid-cols-2 items-center">
				<div class="relative aspect-[16/10] overflow-hidden bg-jbc-obsidian/10">
					<img
						src={img('projects/four-poster-series/03', { w: 1000, q: 85 })}
						alt="Craftsman at work in workshop"
						class="h-full w-full object-cover"
						loading="lazy"
					/>
				</div>
				<div class="max-w-[48ch]">
					<span class="eyebrow text-jbc-ember block">Bespoke Commissions</span>
					<h2 class="mt-3 text-h2 font-display text-jbc-obsidian lg:text-h2-lg">
						Need a piece tailored to your space?
					</h2>
					<p class="mt-4 text-body text-jbc-obsidian/80">
						If an awkward alcove, specific room dimension, or custom wood choice requires something unique, our workshop builds one-off custom furniture tailored to the millimeter.
					</p>
					<div class="mt-6">
						<CTAButton href="/contact?subject=Custom%20Furniture%20Commission" variant="secondary">
							Enquire About Custom Builds
						</CTAButton>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Call to Action Band -->
	<section class="dark-bg relative overflow-hidden bg-jbc-ember py-16 text-jbc-white lg:py-20">
		<div class="relative shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
			<div>
				<span class="eyebrow text-jbc-white-70">Catalogue & Specifications</span>
				<h2 class="mt-2 text-h2 font-display font-medium text-jbc-white">
					Request the full Woodwolves catalogue.
				</h2>
			</div>
			<div class="flex flex-wrap gap-4">
				<CTAButton href="/contact" variant="primary" class="bg-jbc-obsidian text-jbc-white hover:bg-jbc-obsidian/90">
					Book a Consultation &rarr;
				</CTAButton>
			</div>
		</div>
	</section>
</main>
