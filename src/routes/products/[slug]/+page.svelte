<script lang="ts">
	import { enhance } from '$app/forms';
	import { img } from '$lib/images';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let { data, form } = $props();

	let product = $derived(data.product);
	let related = $derived(data.related);

	let submitting = $state(false);
</script>

<svelte:head>
	<title>{product.title} | JimiBello &amp; Co.</title>
	<meta name="description" content="{product.title} — {product.description}" />
</svelte:head>

<main id="main" class="bg-jbc-ivory text-jbc-obsidian min-h-screen">
	<!-- Split Hero: Centered Text on Left, Portrait Image on Right (matching reference) -->
	<section class="shell pt-28 lg:pt-36 pb-16 lg:pb-24">
		<div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16 min-h-[70vh]">
			<!-- Left Column: Centered Minimal Product Details -->
			<div class="flex flex-col items-center justify-center text-center px-4 py-8 lg:py-16">
				<FadeUp class="max-w-sm">
					<!-- Title in uppercase with wide tracking -->
					<h1 class="text-xs sm:text-sm lg:text-base font-sans font-semibold tracking-[0.2em] uppercase text-jbc-obsidian">
						{product.title}
					</h1>

					<!-- Price -->
					<p class="mt-4 text-xs sm:text-sm font-sans text-jbc-obsidian/85">
						{#if product.priceNote}
							{product.priceNote} &ndash; {product.price}
						{:else}
							{product.price}
						{/if}
					</p>

					<!-- Action note linking to form below -->
					<p class="mt-4 text-xs sm:text-sm font-sans text-jbc-slate">
						<a
							href="#enquire"
							class="text-inherit hover:text-jbc-ember transition-colors duration-300 no-underline"
						>
							to enquire please use contact form below
						</a>
					</p>
				</FadeUp>
			</div>

			<!-- Right Column: Portrait Product Image -->
			<div class="w-full flex justify-center lg:justify-end">
				<FadeUp class="w-full max-w-xl">
					<div class="relative aspect-[3/4] w-full overflow-hidden bg-jbc-obsidian/5">
						<img
							src={img(product.image, { w: 1400, q: 90 })}
							alt={product.title}
							class="h-full w-full object-cover"
							loading="eager"
							fetchpriority="high"
						/>
					</div>
				</FadeUp>
			</div>
		</div>

		<!-- Secondary Gallery Images (if available) -->
		{#if product.gallery && product.gallery.length > 0}
			<div class="mt-12 pt-12 border-t border-jbc-obsidian/10">
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{#each product.gallery as item, i}
						<FadeUp index={i}>
							<div class="relative aspect-[4/5] w-full overflow-hidden bg-jbc-obsidian/5">
								<img
									src={img(item, { w: 900, q: 85 })}
									alt="{product.title} view"
									class="h-full w-full object-cover"
									loading="lazy"
								/>
							</div>
						</FadeUp>
					{/each}
				</div>
			</div>
		{/if}
	</section>

	<!-- Product Enquiry Form Section -->
	<section id="enquire" class="border-t border-jbc-obsidian/10 bg-jbc-ivory py-20 lg:py-28">
		<div class="shell max-w-2xl">
			<FadeUp class="text-center">
				<h2 class="text-h2 font-display font-medium text-jbc-obsidian">
					Enquire about our products
				</h2>
				<p class="mt-3 text-sm font-sans text-jbc-slate">
					Please complete the form below regarding <span class="font-semibold text-jbc-obsidian">{product.title}</span> and our studio will be in touch.
				</p>
			</FadeUp>

			{#if form?.success}
				<div class="mt-10 p-8 border border-jbc-ember/40 bg-jbc-ember/5 text-center">
					<p class="text-h2 font-display text-jbc-obsidian font-medium">Thank you for your enquiry.</p>
					<p class="mt-2 text-sm text-jbc-slate">
						{form.message || 'Our studio will review your request and get back to you shortly.'}
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
					class="mt-10 space-y-6"
				>
					<!-- Pre-filled Product Subject -->
					<input type="hidden" name="subject" value="Product Enquiry: {product.title}" />

					<!-- Name (First & Last name) -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label for="firstName" class="sr-only">First Name</label>
							<input
								type="text"
								id="firstName"
								name="name"
								required
								placeholder="First name *"
								value={form?.values?.name ?? ''}
								class="w-full bg-white border border-jbc-obsidian/15 px-4 py-3 text-sm text-jbc-obsidian placeholder-jbc-obsidian/40 focus:border-jbc-ember focus:outline-none transition-colors"
							/>
						</div>
						<div>
							<label for="lastName" class="sr-only">Last Name</label>
							<input
								type="text"
								id="lastName"
								name="lastName"
								placeholder="Last name"
								class="w-full bg-white border border-jbc-obsidian/15 px-4 py-3 text-sm text-jbc-obsidian placeholder-jbc-obsidian/40 focus:border-jbc-ember focus:outline-none transition-colors"
							/>
						</div>
					</div>
					{#if form?.errors?.name}
						<p class="text-xs text-jbc-ember">{form.errors.name}</p>
					{/if}

					<!-- Email & Phone -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label for="email" class="sr-only">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								required
								placeholder="Your email address *"
								value={form?.values?.email ?? ''}
								class="w-full bg-white border border-jbc-obsidian/15 px-4 py-3 text-sm text-jbc-obsidian placeholder-jbc-obsidian/40 focus:border-jbc-ember focus:outline-none transition-colors"
							/>
							{#if form?.errors?.email}
								<p class="mt-1 text-xs text-jbc-ember">{form.errors.email}</p>
							{/if}
						</div>
						<div>
							<label for="phone" class="sr-only">Telephone</label>
							<input
								type="tel"
								id="phone"
								name="phone"
								placeholder="Telephone"
								value={form?.values?.phone ?? ''}
								class="w-full bg-white border border-jbc-obsidian/15 px-4 py-3 text-sm text-jbc-obsidian placeholder-jbc-obsidian/40 focus:border-jbc-ember focus:outline-none transition-colors"
							/>
						</div>
					</div>

					<!-- Subject display -->
					<div>
						<label for="subjectDisplay" class="sr-only">Subject</label>
						<input
							type="text"
							id="subjectDisplay"
							readonly
							value="Product enquiry: {product.title}"
							class="w-full bg-jbc-obsidian/5 border border-jbc-obsidian/15 px-4 py-3 text-sm text-jbc-obsidian/80 cursor-not-allowed"
						/>
					</div>

					<!-- Message -->
					<div>
						<label for="message" class="sr-only">Your message</label>
						<textarea
							id="message"
							name="message"
							rows="5"
							required
							placeholder="Your message *"
							class="w-full bg-white border border-jbc-obsidian/15 px-4 py-3 text-sm text-jbc-obsidian placeholder-jbc-obsidian/40 focus:border-jbc-ember focus:outline-none transition-colors"
						>{form?.values?.message ?? ''}</textarea>
						{#if form?.errors?.message}
							<p class="mt-1 text-xs text-jbc-ember">{form.errors.message}</p>
						{/if}
					</div>

					<!-- Submit button -->
					<div class="pt-2">
						<button
							type="submit"
							disabled={submitting}
							class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-jbc-obsidian text-jbc-white font-sans text-xs font-semibold tracking-[0.15em] uppercase hover:bg-jbc-ember transition-colors duration-300 disabled:opacity-50 cursor-pointer"
						>
							{submitting ? 'Sending Enquiry...' : 'Send Enquiry'}
						</button>
					</div>
				</form>
			{/if}
		</div>
	</section>

	<!-- You May Like Section (matching reference) -->
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
