<script lang="ts">
	import type { Product } from '$lib/data/site';
	import { img } from '$lib/images';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();
</script>

<a
	href="/products/{product.slug}"
	class="group flex flex-col no-underline text-inherit"
>
	<!-- Clean image viewport with smooth hover zoom -->
	<div class="relative aspect-[4/5] w-full overflow-hidden bg-jbc-obsidian/5">
		<img
			src={img(product.image, { w: 900, q: 85 })}
			alt={product.title}
			class="h-full w-full object-cover transition-transform duration-700 ease-out-brand group-hover:scale-105"
			loading="lazy"
		/>
	</div>

	<!-- Product Name only -->
	<div class="mt-4 flex items-baseline justify-between gap-4">
		<h3 class="text-h2 font-display text-jbc-obsidian font-medium transition-colors duration-300 group-hover:text-jbc-ember">
			{product.title}
		</h3>
	</div>
</a>
