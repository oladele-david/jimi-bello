<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { img } from '$lib/images';
	import type { Product } from '$lib/data/site';
	import ProductCard from '$lib/components/ProductCard.svelte';

	interface Props {
		product?: Partial<Product>;
		isNew?: boolean;
		form?: any;
	}

	let props: Props = $props();

	// Form fields reactive state initialized from props
	let title = $state(props.product?.title || '');
	let slug = $state(props.product?.slug || '');
	let category = $state(props.product?.category || 'Living');
	let price = $state(props.product?.price || '');
	let priceNote = $state(props.product?.priceNote || '');
	let leadTime = $state(props.product?.leadTime || '');
	let description = $state(props.product?.description || '');
	let image = $state(props.product?.image || '');
	let material = $state(props.product?.material || '');
	let dimensions = $state(props.product?.dimensions || '');
	let featured = $state<boolean>(props.product?.featured ?? false);

	let gallery = $state<string[]>(
		props.product?.gallery && props.product.gallery.length > 0
			? [...props.product.gallery]
			: []
	);

	let details = $state<{ label: string; value: string }[]>(
		props.product?.details && props.product.details.length > 0
			? props.product.details.map((d) => ({ ...d }))
			: [
					{ label: 'Origin', value: 'Handcrafted in JBC Workshop, Lagos' },
					{ label: 'Frame', value: 'Seasoned kiln-dried hardwood joinery' }
			  ]
	);

	let isSubmitting = $state(false);
	let isUploadingHero = $state(false);
	let isUploadingGallery = $state(false);
	let uploadError = $state<string | null>(null);
	let activeTab = $state<'edit' | 'preview'>('edit');
	let autoSlug = $state(props.isNew ?? false);

	const categories = ['Living', 'Dining', 'Bedroom', 'Storage', 'Architectural'];

	function generateSlug(text: string): string {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');
	}

	function handleTitleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		title = target.value;
		if (autoSlug) {
			slug = generateSlug(title);
		}
	}

	// Hero image upload handler to Cloudflare R2
	async function handleHeroUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		isUploadingHero = true;
		uploadError = null;

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('slug', slug || 'product');
			formData.append('type', 'product-hero');

			const res = await fetch('/api/console/upload', {
				method: 'POST',
				body: formData
			});

			const json = (await res.json()) as any;
			if (!res.ok || !json.success) {
				throw new Error(json.error || 'Failed to upload image');
			}

			image = json.url;
		} catch (err: any) {
			uploadError = err.message || 'Upload error';
		} finally {
			isUploadingHero = false;
			target.value = '';
		}
	}

	// Gallery images upload handler
	async function handleGalleryUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (!files || files.length === 0) return;

		isUploadingGallery = true;
		uploadError = null;

		try {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const formData = new FormData();
				formData.append('file', file);
				formData.append('slug', slug || 'product');
				formData.append('type', 'product-gallery');

				const res = await fetch('/api/console/upload', {
					method: 'POST',
					body: formData
				});

				const json = (await res.json()) as any;
				if (res.ok && json.success) {
					gallery = [...gallery, json.url];
				}
			}
		} catch (err: any) {
			uploadError = err.message || 'Gallery upload error';
		} finally {
			isUploadingGallery = false;
			target.value = '';
		}
	}

	function addGalleryKey(key: string) {
		const trimmed = key.trim();
		if (trimmed && !gallery.includes(trimmed)) {
			gallery = [...gallery, trimmed];
		}
	}

	function removeGalleryItem(index: number) {
		gallery = gallery.filter((_, i) => i !== index);
	}

	function moveGalleryItem(index: number, direction: 'up' | 'down') {
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= gallery.length) return;
		const next = [...gallery];
		const temp = next[index];
		next[index] = next[newIndex];
		next[newIndex] = temp;
		gallery = next;
	}

	function addDetailRow() {
		details = [...details, { label: '', value: '' }];
	}

	function removeDetailRow(index: number) {
		details = details.filter((_, i) => i !== index);
	}

	let newGalleryKeyInput = $state('');

	// Dynamic constructed product preview object
	let previewProduct = $derived<Product>({
		slug: slug || 'preview-product',
		title: title || 'Untitled Product',
		category: category,
		price: price || 'Price on request',
		priceNote: priceNote || undefined,
		description: description || 'A considered handcrafted piece by Jimi Bello & Co.',
		image: image || 'projects/ikoyi-residence/hero',
		material: material || undefined,
		dimensions: dimensions || undefined,
		leadTime: leadTime || undefined,
		gallery: gallery,
		featured: featured,
		details: details.filter((d) => d.label.trim() && d.value.trim())
	});
</script>

<div class="space-y-6">
	<!-- Tab Bar for Edit / Live Preview -->
	<div class="flex items-center justify-between border-b border-white/10 pb-4">
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => (activeTab = 'edit')}
				class="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer {activeTab === 'edit'
					? 'bg-jbc-ember text-white'
					: 'text-white/60 hover:text-white hover:bg-white/5'}"
			>
				Product Editor
			</button>
			<button
				type="button"
				onclick={() => (activeTab = 'preview')}
				class="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer {activeTab === 'preview'
					? 'bg-jbc-ember text-white'
					: 'text-white/60 hover:text-white hover:bg-white/5'}"
			>
				Live Preview
			</button>
		</div>

		<div class="flex items-center gap-3">
			<a
				href="/console/products"
				class="px-3.5 py-1.5 rounded-sm text-xs font-medium text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-colors"
			>
				Cancel
			</a>
			{#if !props.isNew && slug}
				<a
					href="/products/{slug}"
					target="_blank"
					rel="noopener noreferrer"
					class="px-3.5 py-1.5 rounded-sm text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/15 transition-colors flex items-center gap-1.5"
				>
					<span>View Live</span>
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
					</svg>
				</a>
			{/if}
		</div>
	</div>

	<!-- Global Error / Notifications -->
	{#if uploadError}
		<div class="p-4 bg-jbc-ember/15 border border-jbc-ember/40 rounded-sm text-jbc-ember text-xs flex items-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{uploadError}</span>
		</div>
	{/if}

	{#if props.form?.error}
		<div class="p-4 bg-jbc-ember/15 border border-jbc-ember/40 rounded-sm text-jbc-ember text-xs flex items-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{props.form.error}</span>
		</div>
	{/if}

	{#if activeTab === 'edit'}
		<form
			method="POST"
			action="?/saveProduct"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-8"
		>
			<!-- Hidden JSON fields for array data -->
			<input type="hidden" name="galleryJson" value={JSON.stringify(gallery)} />
			<input type="hidden" name="detailsJson" value={JSON.stringify(details.filter(d => d.label.trim() && d.value.trim()))} />
			<input type="hidden" name="featured" value={featured ? 'true' : 'false'} />

			<!-- Section 1: Basic Information -->
			<div class="bg-[#1a1a1a] border border-white/10 rounded-sm p-6 space-y-6">
				<h3 class="text-sm font-semibold uppercase tracking-wider text-white/90 border-b border-white/10 pb-3">
					1. General Information
				</h3>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Title -->
					<div class="space-y-2">
						<label for="title" class="block text-xs font-medium uppercase tracking-wider text-white/70">
							Product Title <span class="text-jbc-ember">*</span>
						</label>
						<input
							type="text"
							id="title"
							name="title"
							required
							placeholder="e.g. Bello Sofa Series"
							value={title}
							oninput={handleTitleChange}
							class="w-full px-3.5 py-2.5 bg-[#141414] border border-white/15 rounded-sm text-sm text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
						/>
					</div>

					<!-- Slug -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<label for="slug" class="block text-xs font-medium uppercase tracking-wider text-white/70">
								URL Slug <span class="text-jbc-ember">*</span>
							</label>
							<label class="flex items-center gap-1.5 text-xs text-white/50 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={autoSlug}
									class="rounded-none border-white/20 text-jbc-ember focus:ring-0"
								/>
								<span>Auto-generate</span>
							</label>
						</div>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-white/40 font-mono">
								/products/
							</span>
							<input
								type="text"
								id="slug"
								name="slug"
								required
								placeholder="bello-sofa-series"
								bind:value={slug}
								class="w-full pl-24 pr-3.5 py-2.5 bg-[#141414] border border-white/15 rounded-sm text-sm font-mono text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
							/>
						</div>
					</div>

					<!-- Category -->
					<div class="space-y-2">
						<label for="category" class="block text-xs font-medium uppercase tracking-wider text-white/70">
							Category <span class="text-jbc-ember">*</span>
						</label>
						<select
							id="category"
							name="category"
							bind:value={category}
							class="w-full px-3.5 py-2.5 bg-[#141414] border border-white/15 rounded-sm text-sm text-white focus:border-jbc-ember focus:outline-none transition-colors cursor-pointer"
						>
							{#each categories as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>

					<!-- Featured Toggle -->
					<div class="space-y-2 flex flex-col justify-end">
						<div class="flex items-center gap-3 p-3 bg-[#141414] border border-white/10 rounded-sm">
							<input
								type="checkbox"
								id="featuredCheck"
								bind:checked={featured}
								class="h-4 w-4 rounded-none border-white/20 text-jbc-ember accent-jbc-ember focus:ring-0 cursor-pointer"
							/>
							<label for="featuredCheck" class="text-xs font-medium text-white/90 cursor-pointer">
								Featured Product (highlighted in showcase)
							</label>
						</div>
					</div>
				</div>

				<!-- Description -->
				<div class="space-y-2">
					<label for="description" class="block text-xs font-medium uppercase tracking-wider text-white/70">
						Product Description <span class="text-jbc-ember">*</span>
					</label>
					<textarea
						id="description"
						name="description"
						required
						rows="3"
						placeholder="Describe the piece, its craft proportions, materials, and presence..."
						bind:value={description}
						class="w-full px-3.5 py-2.5 bg-[#141414] border border-white/15 rounded-sm text-sm text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors resize-y"
					></textarea>
				</div>
			</div>

			<!-- Section 2: Pricing & Specifications -->
			<div class="bg-[#1a1a1a] border border-white/10 rounded-sm p-6 space-y-6">
				<h3 class="text-sm font-semibold uppercase tracking-wider text-white/90 border-b border-white/10 pb-3">
					2. Pricing, Dimensions &amp; Lead Time
				</h3>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<!-- Price -->
					<div class="space-y-2">
						<label for="price" class="block text-xs font-medium uppercase tracking-wider text-white/70">
							Price <span class="text-jbc-ember">*</span>
						</label>
						<input
							type="text"
							id="price"
							name="price"
							required
							placeholder="e.g. ₦2,400,000"
							bind:value={price}
							class="w-full px-3.5 py-2.5 bg-[#141414] border border-white/15 rounded-sm text-sm text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
						/>
					</div>

					<!-- Price Note -->
					<div class="space-y-2">
						<label for="priceNote" class="block text-xs font-medium uppercase tracking-wider text-white/70">
							Price Note (Optional)
						</label>
						<input
							type="text"
							id="priceNote"
							name="priceNote"
							placeholder="e.g. Made to order · Custom sizing available"
							bind:value={priceNote}
							class="w-full px-3.5 py-2.5 bg-[#141414] border border-white/15 rounded-sm text-sm text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
						/>
					</div>

					<!-- Lead Time -->
					<div class="space-y-2">
						<label for="leadTime" class="block text-xs font-medium uppercase tracking-wider text-white/70">
							Production Lead Time
						</label>
						<input
							type="text"
							id="leadTime"
							name="leadTime"
							placeholder="e.g. 4–6 weeks"
							bind:value={leadTime}
							class="w-full px-3.5 py-2.5 bg-[#141414] border border-white/15 rounded-sm text-sm text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
						/>
					</div>

					<!-- Dimensions -->
					<div class="space-y-2">
						<label for="dimensions" class="block text-xs font-medium uppercase tracking-wider text-white/70">
							Dimensions
						</label>
						<input
							type="text"
							id="dimensions"
							name="dimensions"
							placeholder="e.g. W: 2400mm · D: 980mm · H: 780mm"
							bind:value={dimensions}
							class="w-full px-3.5 py-2.5 bg-[#141414] border border-white/15 rounded-sm text-sm text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
						/>
					</div>

					<!-- Material -->
					<div class="space-y-2 md:col-span-2">
						<label for="material" class="block text-xs font-medium uppercase tracking-wider text-white/70">
							Timber &amp; Materials
						</label>
						<input
							type="text"
							id="material"
							name="material"
							placeholder="e.g. Solid hardwood frame, bespoke linen-blend upholstery"
							bind:value={material}
							class="w-full px-3.5 py-2.5 bg-[#141414] border border-white/15 rounded-sm text-sm text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
						/>
					</div>
				</div>

				<!-- Detailed Specifications (Key/Value pairs) -->
				<div class="space-y-3 pt-4 border-t border-white/10">
					<div class="flex items-center justify-between">
						<span class="block text-xs font-medium uppercase tracking-wider text-white/70">
							Specification Details (Origin, Joinery, Hardware, Maintenance)
						</span>
						<button
							type="button"
							onclick={addDetailRow}
							class="text-xs font-semibold text-jbc-ember hover:text-white transition-colors cursor-pointer flex items-center gap-1"
						>
							<span>+ Add Spec Row</span>
						</button>
					</div>

					{#if details.length === 0}
						<p class="text-xs text-white/40 italic">No custom specification rows added.</p>
					{:else}
						<div class="space-y-2">
							{#each details as row, idx}
								<div class="flex items-center gap-3">
									<input
										type="text"
										placeholder="Specification (e.g. Frame)"
										bind:value={row.label}
										class="w-1/3 px-3 py-2 bg-[#141414] border border-white/15 rounded-sm text-xs text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none"
									/>
									<input
										type="text"
										placeholder="Value (e.g. Seasoned hardwood joinery)"
										bind:value={row.value}
										class="flex-1 px-3 py-2 bg-[#141414] border border-white/15 rounded-sm text-xs text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none"
									/>
									<button
										type="button"
										onclick={() => removeDetailRow(idx)}
										class="p-2 text-white/40 hover:text-jbc-ember transition-colors cursor-pointer"
										title="Remove row"
									>
										&times;
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Section 3: Imagery & Media -->
			<div class="bg-[#1a1a1a] border border-white/10 rounded-sm p-6 space-y-6">
				<h3 class="text-sm font-semibold uppercase tracking-wider text-white/90 border-b border-white/10 pb-3">
					3. Imagery &amp; Product Gallery
				</h3>

				<!-- Primary Portrait Hero Image -->
				<div class="space-y-3">
					<label for="heroImage" class="block text-xs font-medium uppercase tracking-wider text-white/70">
						Primary Portrait Image <span class="text-jbc-ember">*</span>
					</label>

					<div class="flex flex-col sm:flex-row items-start gap-6">
						<!-- Preview Thumbnail -->
						<div class="w-32 h-44 bg-[#141414] border border-white/15 rounded-sm overflow-hidden flex items-center justify-center shrink-0">
							{#if image}
								<img
									src={img(image, { w: 300, q: 80 })}
									alt="Primary Product View"
									class="w-full h-full object-cover"
								/>
							{:else}
								<span class="text-[10px] text-white/30 uppercase tracking-wider text-center px-2">No image selected</span>
							{/if}
						</div>

						<div class="flex-1 space-y-3 w-full">
							<input
								type="text"
								id="heroImage"
								name="image"
								required
								placeholder="Image reference or path (e.g. projects/ikoyi-residence/hero)"
								bind:value={image}
								class="w-full px-3.5 py-2.5 bg-[#141414] border border-white/15 rounded-sm text-sm font-mono text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
							/>

							<div class="flex items-center gap-3">
								<label class="px-3.5 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-sm text-xs font-medium text-white cursor-pointer transition-colors inline-flex items-center gap-2">
									<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
									</svg>
									<span>{isUploadingHero ? 'Uploading...' : 'Upload Photograph'}</span>
									<input
										type="file"
										accept="image/*"
										class="hidden"
										onchange={handleHeroUpload}
										disabled={isUploadingHero}
									/>
								</label>
								<span class="text-xs text-white/40">Portrait 3:4 or 4:5 aspect ratio recommended.</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Gallery Images -->
				<div class="space-y-4 pt-6 border-t border-white/10">
					<div class="flex items-center justify-between">
						<div>
							<span class="block text-xs font-medium uppercase tracking-wider text-white/70">
								Gallery &amp; Craft Photography
							</span>
							<p class="text-[11px] text-white/40 mt-0.5">
								Additional angles, joinery details, and context photographs shown with the enquiry form.
							</p>
						</div>

						<label class="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-sm text-xs font-medium text-white cursor-pointer transition-colors inline-flex items-center gap-1.5">
							<span>+ {isUploadingGallery ? 'Uploading...' : 'Upload Photos'}</span>
							<input
								type="file"
								accept="image/*"
								multiple
								class="hidden"
								onchange={handleGalleryUpload}
								disabled={isUploadingGallery}
							/>
						</label>
					</div>

					<!-- Manual Key Input -->
					<div class="flex items-center gap-2">
						<input
							type="text"
							placeholder="Or enter existing image path (e.g. projects/four-poster-series/01)"
							bind:value={newGalleryKeyInput}
							class="flex-1 px-3 py-2 bg-[#141414] border border-white/15 rounded-sm text-xs font-mono text-white placeholder-white/30 focus:border-jbc-ember focus:outline-none"
						/>
						<button
							type="button"
							onclick={() => {
								addGalleryKey(newGalleryKeyInput);
								newGalleryKeyInput = '';
							}}
							class="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-sm text-xs font-medium text-white cursor-pointer transition-colors"
						>
							Add Image
						</button>
					</div>

					<!-- Gallery Thumbnails List -->
					{#if gallery.length === 0}
						<div class="p-6 border border-dashed border-white/15 rounded-sm text-center text-xs text-white/40">
							No gallery images added yet. Upload photographs or enter existing paths above.
						</div>
					{:else}
						<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{#each gallery as gKey, idx}
								<div class="relative bg-[#141414] border border-white/15 rounded-sm p-2 flex flex-col gap-2 group">
									<div class="aspect-[3/4] w-full overflow-hidden bg-black/40 rounded-xs">
										<img
											src={img(gKey, { w: 300, q: 80 })}
											alt="Gallery image {idx + 1}"
											class="w-full h-full object-cover"
										/>
									</div>
									<p class="text-[10px] font-mono text-white/60 truncate" title={gKey}>{gKey}</p>
									<div class="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
										<div class="flex items-center gap-1">
											<button
												type="button"
												onclick={() => moveGalleryItem(idx, 'up')}
												disabled={idx === 0}
												class="px-1 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
												title="Move left"
											>
												&larr;
											</button>
											<button
												type="button"
												onclick={() => moveGalleryItem(idx, 'down')}
												disabled={idx === gallery.length - 1}
												class="px-1 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
												title="Move right"
											>
												&rarr;
											</button>
										</div>
										<button
											type="button"
											onclick={() => removeGalleryItem(idx)}
											class="text-jbc-ember hover:text-white transition-colors cursor-pointer text-[11px]"
											title="Remove"
										>
											Remove
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Form Actions Bottom Bar -->
			<div class="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
				<a
					href="/console/products"
					class="px-5 py-2.5 rounded-sm text-xs font-medium text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-colors"
				>
					Cancel
				</a>
				<button
					type="submit"
					disabled={isSubmitting}
					class="px-6 py-2.5 bg-jbc-ember hover:bg-jbc-ember/85 text-white font-sans text-xs font-semibold tracking-wider uppercase rounded-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2"
				>
					{#if isSubmitting}
						<svg class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
						</svg>
						<span>Saving Product...</span>
					{:else}
						<span>{props.isNew ? 'Create Product' : 'Save Changes'}</span>
					{/if}
				</button>
			</div>
		</form>
	{:else}
		<!-- Live Preview Mode -->
		<div class="space-y-12 bg-jbc-ivory text-jbc-obsidian p-8 sm:p-12 border border-white/20 rounded-sm">
			<div class="border-b border-jbc-obsidian/10 pb-4 flex items-center justify-between">
				<div>
					<span class="text-xs uppercase tracking-widest text-jbc-ember font-semibold font-sans">Live Preview</span>
					<h2 class="text-lg font-display text-jbc-obsidian">Customer Page Simulation</h2>
				</div>
				<button
					type="button"
					onclick={() => (activeTab = 'edit')}
					class="px-3.5 py-1.5 bg-jbc-obsidian text-white text-xs font-sans uppercase tracking-wider rounded-sm cursor-pointer"
				>
					&larr; Back to Editor
				</button>
			</div>

			<!-- Single Product View Split-Screen Simulation (matching Pasted image.png) -->
			<div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16 py-8">
				<div class="flex flex-col items-center justify-center text-center px-4">
					<h1 class="text-xs sm:text-sm lg:text-base font-sans font-semibold tracking-[0.2em] uppercase text-jbc-obsidian">
						{previewProduct.title}
					</h1>
					<p class="mt-4 text-xs sm:text-sm font-sans text-jbc-obsidian/85">
						{#if previewProduct.priceNote}
							{previewProduct.priceNote} &ndash; {previewProduct.price}
						{:else}
							{previewProduct.price}
						{/if}
					</p>
					<p class="mt-4 text-xs sm:text-sm font-sans text-jbc-slate">
						to enquire please use contact form below
					</p>
				</div>
				<div class="flex justify-center">
					<div class="relative aspect-[3/4] w-full max-w-md overflow-hidden bg-jbc-obsidian/5 shadow-md">
						<img
							src={img(previewProduct.image, { w: 900, q: 85 })}
							alt={previewProduct.title}
							class="h-full w-full object-cover"
						/>
					</div>
				</div>
			</div>

			<!-- Catalogue Card Preview -->
			<div class="pt-8 border-t border-jbc-obsidian/10">
				<span class="text-xs uppercase tracking-wider text-jbc-slate font-sans block mb-4">Catalogue Card Preview:</span>
				<div class="max-w-xs">
					<ProductCard product={previewProduct} />
				</div>
			</div>
		</div>
	{/if}
</div>
