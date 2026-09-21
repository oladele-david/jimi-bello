<script lang="ts">
	import ProductForm from '$lib/components/console/ProductForm.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>New Product | Studio Console</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<div class="flex items-center gap-2 text-xs text-white/50 mb-2">
			<a href="/console/products" class="hover:text-white transition-colors">&larr; Products Catalogue</a>
			<span>/</span>
			<span class="text-white/80">Add New Piece</span>
		</div>
		<h1 class="text-2xl font-bold tracking-tight text-white">Add New Product</h1>
		<p class="mt-1 text-xs text-white/50">
			Create and publish a new handcrafted piece to the studio catalogue.
		</p>
	</div>

	<ProductForm isNew={true} {form} />
</div>
