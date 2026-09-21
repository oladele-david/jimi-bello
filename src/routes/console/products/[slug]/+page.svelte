<script lang="ts">
	import ProductForm from '$lib/components/console/ProductForm.svelte';

	let { data, form } = $props();

	let product = $derived(data.product);
</script>

<svelte:head>
	<title>Edit {product.title} | Studio Console</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<div class="flex items-center gap-2 text-xs text-white/50 mb-2">
			<a href="/console/products" class="hover:text-white transition-colors">&larr; Products Catalogue</a>
			<span>/</span>
			<span class="text-white/80">{product.title}</span>
		</div>
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold tracking-tight text-white">{product.title}</h1>
				<p class="mt-1 text-xs text-white/50">
					Edit product specifications, pricing, imagery, and craft details.
				</p>
			</div>

			<form method="POST" action="?/deleteProduct" class="hidden sm:block">
				<button
					type="submit"
					onclick={(e) => {
						if (!confirm(`Are you sure you want to delete "${product.title}"?`)) {
							e.preventDefault();
						}
					}}
					class="px-3 py-1.5 border border-jbc-ember/40 hover:bg-jbc-ember/15 text-jbc-ember rounded-sm text-xs font-medium transition-colors cursor-pointer"
				>
					Delete Piece
				</button>
			</form>
		</div>
	</div>

	<ProductForm {product} isNew={false} {form} />
</div>
