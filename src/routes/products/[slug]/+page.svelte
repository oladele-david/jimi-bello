<script lang="ts">
	import { enhance } from '$app/forms';
	import { img } from '$lib/images';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import CTAButton from '$lib/components/CTAButton.svelte';

	let { data, form } = $props();

	let product = $derived(data.product);
	let related = $derived(data.related);

	let submitting = $state(false);
</script>

<svelte:head>
	<title>{product.title} | Furniture &amp; Pieces — JimiBello &amp; Co.</title>
	<meta name="description" content="{product.title} — {product.description}" />
</svelte:head>

<main id="main" class="bg-jbc-ivory text-jbc-obsidian min-h-screen">
	<!-- Top Navigation Breadcrumb -->
	<section class="shell pt-32 lg:pt-40 pb-6">
		<a
			href="/products"
			class="inline-flex items-center gap-2 text-eyebrow font-semibold tracking-jbc-caps uppercase text-jbc-slate hover:text-jbc-ember transition-colors duration-300 no-underline"
		>
			<span aria-hidden="true">&larr;</span>
			<span>All Products</span>
		</a>
	</section>

	<!-- Product Header: Title & Pricing -->
	<section class="shell pb-10 lg:pb-14">
		<FadeUp>
			<h1 class="text-h1 lg:text-[3.25rem] font-display font-medium text-jbc-obsidian tracking-jbc-tight leading-[1.1]">
				{product.title}
			</h1>

			<!-- Price & Enquiry Note -->
			<div class="mt-4 flex flex-wrap items-baseline gap-3">
				<span class="text-2xl lg:text-3xl font-display font-semibold text-jbc-obsidian">
					{product.price}
				</span>
				{#if product.priceNote}
					<span class="text-sm font-sans text-jbc-slate">
						({product.priceNote})
					</span>
				{/if}
			</div>

			<p class="mt-2 text-body text-jbc-slate">
				To enquire please use the contact form below
			</p>
		</FadeUp>
	</section>

	<!-- Main Image Showcase -->
	<section class="shell pb-16 lg:pb-24">
		<FadeUp>
			<div class="relative aspect-[16/10] w-full overflow-hidden bg-jbc-obsidian/5 border border-jbc-obsidian/10">
				<img
					src={img(product.image, { w: 1800, q: 88 })}
					alt={product.title}
					class="h-full w-full object-cover"
					loading="eager"
					fetchpriority="high"
				/>
			</div>
		</FadeUp>

		<!-- Secondary Gallery Images (if available) -->
		{#if product.gallery && product.gallery.length > 0}
			<div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				{#each product.gallery as item, i}
					<FadeUp index={i + 1}>
						<div class="relative aspect-[4/3] w-full overflow-hidden bg-jbc-obsidian/5 border border-jbc-obsidian/10">
							<img
								src={img(item, { w: 900, q: 85 })}
								alt="{product.title} detail angle"
								class="h-full w-full object-cover"
								loading="lazy"
							/>
						</div>
					</FadeUp>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Product Specifications & Narrative -->
	<section class="shell pb-20 lg:pb-28">
		<div class="border-t border-jbc-obsidian/15 pt-12 lg:pt-16 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
			<!-- Narrative Description -->
			<FadeUp>
				<h2 class="text-eyebrow font-semibold tracking-jbc-caps uppercase text-jbc-ember">
					Design &amp; Craft
				</h2>
				<p class="mt-4 text-body-lg text-jbc-obsidian/90 leading-relaxed max-w-[48ch]">
					{product.description}
				</p>
				<p class="mt-4 text-body text-jbc-slate leading-relaxed max-w-[48ch]">
					Every piece from our workshop is built to order. If your room calls for customized proportions, timber species, or tailored finishes, we adjust the drawings to match the architecture of your space.
				</p>

				<div class="mt-8">
					<a
						href="#enquire"
						class="inline-flex items-center gap-2 text-eyebrow font-semibold tracking-jbc-caps uppercase text-jbc-ember hover:text-jbc-obsidian transition-colors no-underline"
					>
						<span>Jump to Enquiry Form</span>
						<span aria-hidden="true">&darr;</span>
					</a>
				</div>
			</FadeUp>

			<!-- Specifications Table -->
			<FadeUp index={1}>
				<h2 class="text-eyebrow font-semibold tracking-jbc-caps uppercase text-jbc-ember">
					Specifications
				</h2>

				<dl class="mt-4 divide-y divide-jbc-obsidian/10 border-y border-jbc-obsidian/10">
					{#if product.category}
						<div class="py-3.5 grid grid-cols-[130px_1fr] gap-4">
							<dt class="text-xs font-semibold uppercase tracking-jbc-caps text-jbc-slate">Category</dt>
							<dd class="text-body font-medium text-jbc-obsidian">{product.category}</dd>
						</div>
					{/if}

					{#if product.material}
						<div class="py-3.5 grid grid-cols-[130px_1fr] gap-4">
							<dt class="text-xs font-semibold uppercase tracking-jbc-caps text-jbc-slate">Materials</dt>
							<dd class="text-body font-medium text-jbc-obsidian">{product.material}</dd>
						</div>
					{/if}

					{#if product.dimensions}
						<div class="py-3.5 grid grid-cols-[130px_1fr] gap-4">
							<dt class="text-xs font-semibold uppercase tracking-jbc-caps text-jbc-slate">Dimensions</dt>
							<dd class="text-body font-medium text-jbc-obsidian">{product.dimensions}</dd>
						</div>
					{/if}

					{#if product.leadTime}
						<div class="py-3.5 grid grid-cols-[130px_1fr] gap-4">
							<dt class="text-xs font-semibold uppercase tracking-jbc-caps text-jbc-slate">Lead Time</dt>
							<dd class="text-body font-medium text-jbc-obsidian">{product.leadTime}</dd>
						</div>
					{/if}

					{#if product.details}
						{#each product.details as detail}
							<div class="py-3.5 grid grid-cols-[130px_1fr] gap-4">
								<dt class="text-xs font-semibold uppercase tracking-jbc-caps text-jbc-slate">{detail.label}</dt>
								<dd class="text-body font-medium text-jbc-obsidian">{detail.value}</dd>
							</div>
						{/each}
					{/if}
				</dl>
			</FadeUp>
		</div>
	</section>

	<!-- Product Enquiry Form Section (Dark Obsidian Ground) -->
	<section id="enquire" class="dark-bg relative overflow-hidden bg-jbc-obsidian text-jbc-white py-20 lg:py-28">
		<!-- Subtle Background Motif -->
		<img
			src="/logos/monogram-white.svg"
			aria-hidden="true"
			class="pointer-events-none absolute -right-[10%] top-1/2 -translate-y-1/2 w-[35vw] max-w-[450px] opacity-[0.03] select-none"
			alt=""
		/>

		<div class="relative shell max-w-4xl">
			<FadeUp>
				<span class="eyebrow text-jbc-ember block">Purchase &amp; Custom Orders</span>
				<h2 class="mt-3 text-h2 lg:text-h2-lg font-display font-medium text-jbc-white">
					Enquire about this piece
				</h2>
				<p class="mt-3 text-body-lg text-jbc-white/80 max-w-[50ch]">
					Interested in purchasing the {product.title} or requesting customized dimensions? Fill out the form below and our studio team will get back to you with timelines and availability.
				</p>
			</FadeUp>

			{#if form?.success}
				<div class="mt-10 p-8 border border-jbc-ember/50 bg-jbc-ember/10">
					<p class="text-h2 font-display text-jbc-white font-medium">Thank you for your enquiry.</p>
					<p class="mt-2 text-body text-jbc-white/80">
						{form.message || 'Our team will review your specifications and be in touch shortly.'}
					</p>
				</div>
			{:else}
				<form
					method="POST"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							submitting = false;
							await update();
						};
					}}
					class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
				>
					<!-- Pre-filled Product Subject -->
					<input type="hidden" name="subject" value="Enquiry: {product.title}" />

					<!-- Name -->
					<div>
						<label for="name" class="block text-xs font-semibold tracking-jbc-caps uppercase text-jbc-white/70">
							Your Name <span class="text-jbc-ember">*</span>
						</label>
						<input
							type="text"
							id="name"
							name="name"
							required
							placeholder="e.g. Adewale Bakare"
							value={form?.values?.name ?? ''}
							class="mt-2 w-full bg-white/5 border border-white/15 px-4 py-3 text-body text-jbc-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
						/>
						{#if form?.errors?.name}
							<p class="mt-1 text-xs text-jbc-ember">{form.errors.name}</p>
						{/if}
					</div>

					<!-- Email -->
					<div>
						<label for="email" class="block text-xs font-semibold tracking-jbc-caps uppercase text-jbc-white/70">
							Email Address <span class="text-jbc-ember">*</span>
						</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							placeholder="e.g. adewale@example.com"
							value={form?.values?.email ?? ''}
							class="mt-2 w-full bg-white/5 border border-white/15 px-4 py-3 text-body text-jbc-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
						/>
						{#if form?.errors?.email}
							<p class="mt-1 text-xs text-jbc-ember">{form.errors.email}</p>
						{/if}
					</div>

					<!-- Telephone -->
					<div>
						<label for="phone" class="block text-xs font-semibold tracking-jbc-caps uppercase text-jbc-white/70">
							Telephone Number
						</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							placeholder="+234 ..."
							value={form?.values?.phone ?? ''}
							class="mt-2 w-full bg-white/5 border border-white/15 px-4 py-3 text-body text-jbc-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
						/>
					</div>

					<!-- Target Delivery Location -->
					<div>
						<label for="location" class="block text-xs font-semibold tracking-jbc-caps uppercase text-jbc-white/70">
							Delivery Location
						</label>
						<input
							type="text"
							id="location"
							name="location"
							placeholder="e.g. Ikoyi, Lagos or Abuja"
							class="mt-2 w-full bg-white/5 border border-white/15 px-4 py-3 text-body text-jbc-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
						/>
					</div>

					<!-- Message / Specifications -->
					<div class="md:col-span-2">
						<label for="message" class="block text-xs font-semibold tracking-jbc-caps uppercase text-jbc-white/70">
							Your Message / Custom Sizing Requirements <span class="text-jbc-ember">*</span>
						</label>
						<textarea
							id="message"
							name="message"
							rows="4"
							required
							placeholder="Please share any requirements, desired timber finish, or sizing questions for the {product.title}..."
							class="mt-2 w-full bg-white/5 border border-white/15 px-4 py-3 text-body text-jbc-white placeholder-white/30 focus:border-jbc-ember focus:outline-none transition-colors"
						>{form?.values?.message ?? ''}</textarea>
						{#if form?.errors?.message}
							<p class="mt-1 text-xs text-jbc-ember">{form.errors.message}</p>
						{/if}
					</div>

					<!-- Submit -->
					<div class="md:col-span-2 pt-2">
						<button
							type="submit"
							disabled={submitting}
							class="inline-flex items-center justify-center px-8 py-4 bg-jbc-ember text-jbc-white font-sans text-eyebrow font-semibold tracking-jbc-caps uppercase hover:bg-jbc-ember/90 transition-colors duration-300 disabled:opacity-50 cursor-pointer"
						>
							{submitting ? 'Sending Enquiry...' : 'Send Enquiry'}
						</button>
					</div>
				</form>
			{/if}
		</div>
	</section>

	<!-- You May Also Like Section (Matching Henri Fitzwilliam-Lay reference) -->
	{#if related && related.length > 0}
		<section class="shell py-20 lg:py-28 border-t border-jbc-obsidian/10">
			<div class="flex items-baseline justify-between gap-6 border-b border-jbc-obsidian/10 pb-6">
				<FadeUp>
					<h3 class="text-h2 font-display font-medium text-jbc-obsidian">
						You may like
					</h3>
				</FadeUp>
				<FadeUp>
					<a
						href="/products"
						class="text-eyebrow font-semibold tracking-jbc-caps uppercase text-jbc-slate hover:text-jbc-ember transition-colors no-underline"
					>
						<span>View All Products</span>
						<span aria-hidden="true">&rarr;</span>
					</a>
				</FadeUp>
			</div>

			<!-- Streamlined product cards: image and title only -->
			<div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
				{#each related as item (item.slug)}
					<FadeUp>
						<ProductCard product={item} />
					</FadeUp>
				{/each}
			</div>
		</section>
	{/if}
</main>
