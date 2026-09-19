<script lang="ts">
	import type { Product } from '$lib/data/site';
	import { img } from '$lib/images';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();
</script>

<article
	class="group relative flex flex-col overflow-hidden bg-jbc-ivory border border-jbc-obsidian/10 transition-all duration-400 ease-out-brand hover:border-jbc-ember/40 hover:shadow-lg"
>
	<!-- Image viewport with smooth hover zoom -->
	<div class="relative aspect-[4/3] w-full overflow-hidden bg-jbc-obsidian/5">
		<img
			src={img(product.image, { w: 900, q: 85 })}
			alt={product.title}
			class="h-full w-full object-cover transition-transform duration-700 ease-out-brand group-hover:scale-105"
			loading="lazy"
		/>
		<div
			class="pointer-events-none absolute inset-0 bg-gradient-to-t from-jbc-obsidian/40 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100"
			aria-hidden="true"
		></div>

		<span
			class="absolute top-4 left-4 inline-block bg-jbc-obsidian/80 px-2.5 py-1 text-eyebrow font-semibold tracking-jbc-caps text-jbc-white uppercase backdrop-blur-sm"
		>
			{product.category}
		</span>
	</div>

	<!-- Content -->
	<div class="flex flex-1 flex-col p-6 sm:p-7">
		<h3 class="text-h2 font-display font-medium text-jbc-obsidian group-hover:text-jbc-ember transition-colors duration-300">
			{product.title}
		</h3>

		{#if product.material}
			<p class="mt-1 text-xs font-semibold tracking-jbc-caps text-jbc-slate uppercase">
				{product.material}
			</p>
		{/if}

		<p class="mt-3 text-body text-jbc-obsidian/80 line-clamp-3">
			{product.description}
		</p>

		<div class="mt-auto pt-5">
			<a
				href="/contact?subject={encodeURIComponent(`Enquiry: ${product.title}`)}"
				class="inline-flex items-center gap-2 text-eyebrow font-semibold tracking-jbc-caps text-jbc-ember uppercase no-underline transition-all duration-300 group-hover:translate-x-1"
			>
				<span>Request Specifications</span>
				<span aria-hidden="true">&rarr;</span>
			</a>
		</div>
	</div>
</article>
