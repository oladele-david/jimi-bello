<script lang="ts">
	import { enhance } from '$app/forms';
	import { img } from '$lib/images';
	import type { Product } from '$lib/data/site';

	let { data, form } = $props();

	let searchQuery = $state('');
	let selectedCategory = $state('All');
	let deleteTarget = $state<Product | null>(null);
	let showResetModal = $state(false);
	let isDeleting = $state(false);
	let isResetting = $state(false);

	let categories = ['All', 'Living', 'Dining', 'Bedroom', 'Storage'];

	let filteredProducts = $derived.by(() => {
		let list = data.products || [];
		if (selectedCategory !== 'All') {
			list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
		}
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			list = list.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.slug.toLowerCase().includes(q) ||
					p.price.toLowerCase().includes(q) ||
					(p.material && p.material.toLowerCase().includes(q)) ||
					p.description.toLowerCase().includes(q)
			);
		}
		return list;
	});

	let stats = $derived.by(() => {
		const list = data.products || [];
		const total = list.length;
		const living = list.filter((p) => p.category.toLowerCase() === 'living').length;
		const dining = list.filter((p) => p.category.toLowerCase() === 'dining').length;
		const bedroom = list.filter((p) => p.category.toLowerCase() === 'bedroom').length;
		const storage = list.filter((p) => p.category.toLowerCase() === 'storage').length;
		return { total, living, dining, bedroom, storage };
	});
</script>

<svelte:head>
	<title>Products Catalogue | Studio Console</title>
</svelte:head>

<div class="space-y-8">
	<!-- Alerts / Notifications -->
	{#if form?.message}
		<div class="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-sm text-emerald-300 text-xs flex items-center justify-between">
			<div class="flex items-center gap-2">
				<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				<span>{form.message}</span>
			</div>
		</div>
	{/if}

	{#if form?.error}
		<div class="p-4 bg-jbc-ember/15 border border-jbc-ember/40 rounded-sm text-jbc-ember text-xs flex items-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{form.error}</span>
		</div>
	{/if}

	<!-- Header with Actions -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-white">Furniture &amp; Objects Catalogue</h1>
			<p class="mt-1 text-xs text-white/50">
				Manage your handcrafted furniture collection, pricing, dimensions, specifications, and photography.
			</p>
		</div>

		<div class="flex items-center gap-3 flex-wrap">
			<button
				type="button"
				onclick={() => (showResetModal = true)}
				class="px-3.5 py-2 rounded-sm text-xs font-medium text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-colors cursor-pointer"
			>
				Reset Catalogue
			</button>
			<a
				href="/console/products/new"
				class="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-jbc-ember text-white text-xs font-semibold uppercase tracking-wider hover:bg-jbc-ember/85 transition-colors shadow-sm"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span>New Product</span>
			</a>
		</div>
	</div>

	<!-- Stats Summary Grid -->
	<div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
		<div class="p-4 bg-[#1a1a1a] border border-white/10 rounded-sm">
			<span class="text-[10px] uppercase tracking-wider text-white/50 font-medium">Total Products</span>
			<p class="text-xl font-bold text-white mt-1">{stats.total}</p>
		</div>
		<div class="p-4 bg-[#1a1a1a] border border-white/10 rounded-sm">
			<span class="text-[10px] uppercase tracking-wider text-white/50 font-medium">Living</span>
			<p class="text-xl font-bold text-white mt-1">{stats.living}</p>
		</div>
		<div class="p-4 bg-[#1a1a1a] border border-white/10 rounded-sm">
			<span class="text-[10px] uppercase tracking-wider text-white/50 font-medium">Dining</span>
			<p class="text-xl font-bold text-white mt-1">{stats.dining}</p>
		</div>
		<div class="p-4 bg-[#1a1a1a] border border-white/10 rounded-sm">
			<span class="text-[10px] uppercase tracking-wider text-white/50 font-medium">Bedroom</span>
			<p class="text-xl font-bold text-white mt-1">{stats.bedroom}</p>
		</div>
		<div class="p-4 bg-[#1a1a1a] border border-white/10 rounded-sm col-span-2 sm:col-span-1">
			<span class="text-[10px] uppercase tracking-wider text-white/50 font-medium">Storage</span>
			<p class="text-xl font-bold text-white mt-1">{stats.storage}</p>
		</div>
	</div>

	<!-- Search & Filter Controls -->
	<div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
		<!-- Category Filter Pills -->
		<div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
			{#each categories as category}
				<button
					type="button"
					onclick={() => (selectedCategory = category)}
					class="px-3 py-1.5 rounded-sm text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer shrink-0 {selectedCategory === category
						? 'bg-white/15 text-white font-semibold'
						: 'text-white/50 hover:text-white hover:bg-white/5'}"
				>
					{category}
				</button>
			{/each}
		</div>

		<!-- Search Input -->
		<div class="relative w-full sm:w-72">
			<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			<input
				type="text"
				placeholder="Search products..."
				bind:value={searchQuery}
				class="w-full pl-9 pr-4 py-2 bg-[#1a1a1a] border border-white/15 rounded-sm text-xs text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
			/>
		</div>
	</div>

	<!-- Products List / Grid -->
	{#if filteredProducts.length === 0}
		<div class="p-12 text-center border border-dashed border-white/15 rounded-sm bg-[#181818]">
			<p class="text-sm text-white/60">No products found matching your search.</p>
			{#if searchQuery || selectedCategory !== 'All'}
				<button
					type="button"
					onclick={() => {
						searchQuery = '';
						selectedCategory = 'All';
					}}
					class="mt-3 text-xs text-jbc-ember hover:underline cursor-pointer"
				>
					Clear filters
				</button>
			{/if}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredProducts as product (product.slug)}
				<div class="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-hidden flex flex-col hover:border-white/20 transition-all duration-200 group">
					<!-- Thumbnail Container -->
					<div class="relative aspect-[4/3] w-full overflow-hidden bg-[#141414]">
						<img
							src={img(product.image, { w: 600, q: 80 })}
							alt={product.title}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							loading="lazy"
						/>
						<!-- Badges -->
						<div class="absolute top-3 left-3 flex items-center gap-1.5">
							<span class="px-2 py-0.5 bg-black/75 backdrop-blur-sm rounded-xs text-[10px] font-semibold uppercase tracking-wider text-white">
								{product.category}
							</span>
							{#if product.featured}
								<span class="px-2 py-0.5 bg-jbc-ember/90 backdrop-blur-sm rounded-xs text-[10px] font-semibold uppercase tracking-wider text-white">
									Featured
								</span>
							{/if}
						</div>
					</div>

					<!-- Body Details -->
					<div class="p-5 flex-1 flex flex-col justify-between space-y-4">
						<div class="space-y-2">
							<div class="flex items-baseline justify-between gap-2">
								<h3 class="text-base font-bold text-white group-hover:text-jbc-ember transition-colors">
									{product.title}
								</h3>
								<span class="text-sm font-semibold font-mono text-emerald-400 shrink-0">
									{product.price}
								</span>
							</div>

							{#if product.priceNote}
								<p class="text-[11px] text-white/50 italic">
									{product.priceNote}
								</p>
							{/if}

							<p class="text-xs text-white/60 line-clamp-2 leading-relaxed">
								{product.description}
							</p>

							{#if product.dimensions || product.leadTime}
								<div class="pt-2 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/40">
									{#if product.dimensions}
										<span>{product.dimensions}</span>
									{/if}
									{#if product.leadTime}
										<span>Lead: {product.leadTime}</span>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Card Actions -->
						<div class="pt-3 border-t border-white/10 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<a
									href="/console/products/{product.slug}"
									class="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-sm text-xs font-medium text-white transition-colors"
								>
									Edit
								</a>
								<a
									href="/products/{product.slug}"
									target="_blank"
									rel="noopener noreferrer"
									class="px-2.5 py-1.5 text-white/50 hover:text-white rounded-sm text-xs transition-colors"
									title="View on live site"
								>
									<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
									</svg>
								</a>
							</div>

							<button
								type="button"
								onclick={() => (deleteTarget = product)}
								class="px-2.5 py-1.5 text-white/40 hover:text-jbc-ember transition-colors text-xs cursor-pointer"
								title="Delete product"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Delete Confirmation Modal -->
{#if deleteTarget}
	<div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="bg-[#1c1c1c] border border-white/15 rounded-sm max-w-md w-full p-6 space-y-6 shadow-2xl">
			<div class="space-y-2">
				<h3 class="text-lg font-bold text-white">Delete Product</h3>
				<p class="text-xs text-white/60 leading-relaxed">
					Are you sure you want to delete <span class="text-white font-semibold">"{deleteTarget.title}"</span>? This will permanently remove the piece from your studio catalogue.
				</p>
			</div>

			<div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
				<button
					type="button"
					onclick={() => (deleteTarget = null)}
					class="px-4 py-2 rounded-sm text-xs font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-colors cursor-pointer"
				>
					Cancel
				</button>
				<form
					method="POST"
					action="?/deleteProduct"
					use:enhance={() => {
						isDeleting = true;
						return async ({ update }) => {
							isDeleting = false;
							deleteTarget = null;
							await update();
						};
					}}
				>
					<input type="hidden" name="slug" value={deleteTarget.slug} />
					<button
						type="submit"
						disabled={isDeleting}
						class="px-4 py-2 rounded-sm bg-jbc-ember hover:bg-jbc-ember/85 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
					>
						{isDeleting ? 'Deleting...' : 'Confirm Delete'}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Reset Catalogue Modal -->
{#if showResetModal}
	<div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="bg-[#1c1c1c] border border-white/15 rounded-sm max-w-md w-full p-6 space-y-6 shadow-2xl">
			<div class="space-y-2">
				<h3 class="text-lg font-bold text-white">Reset Catalogue to Defaults</h3>
				<p class="text-xs text-white/60 leading-relaxed">
					This will reset the entire products catalogue in your database back to the studio's curated pieces (Bello Sofa Series, Four-Poster Bed, Iroko Dining Table, Woodwolves Credenza, Steam-Bent Chair, and Loft Coffee Table).
				</p>
			</div>

			<div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
				<button
					type="button"
					onclick={() => (showResetModal = false)}
					class="px-4 py-2 rounded-sm text-xs font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-colors cursor-pointer"
				>
					Cancel
				</button>
				<form
					method="POST"
					action="?/seedDefaults"
					use:enhance={() => {
						isResetting = true;
						return async ({ update }) => {
							isResetting = false;
							showResetModal = false;
							await update();
						};
					}}
				>
					<button
						type="submit"
						disabled={isResetting}
						class="px-4 py-2 rounded-sm bg-white/15 hover:bg-white/25 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
					>
						{isResetting ? 'Resetting...' : 'Yes, Reset Defaults'}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
