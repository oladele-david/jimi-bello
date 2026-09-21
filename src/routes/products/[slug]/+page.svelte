<script lang="ts">
	import { enhance } from '$app/forms';
	import { img } from '$lib/images';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let { data, form } = $props();

	let product = $derived(data.product);
	let related = $derived(data.related);

	let submitting = $state(false);

	let otherImages = $derived.by(() => {
		const imgs: string[] = [];
		if (product.gallery) {
			for (const g of product.gallery) {
				if (g && !imgs.includes(g) && g !== product.image) {
					imgs.push(g);
				}
			}
		}
		const fallbacks = [
			'projects/four-poster-series/02',
			'projects/iroko-dining-collection/01',
			'projects/ikoyi-residence/01'
		];
		for (const fb of fallbacks) {
			if (imgs.length >= 2) break;
			if (!imgs.includes(fb) && fb !== product.image) {
				imgs.push(fb);
			}
		}
		return imgs.slice(0, 2);
	});
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
	</section>

	<!-- Product Enquiry Section: Form on Left + 2 Images on Right + JB Offcut Watermark (matching Pasted image (2).png) -->
	<section id="enquire" class="relative overflow-hidden border-t border-jbc-obsidian/10 bg-jbc-ivory py-20 lg:py-28">
		<!-- Signature JB Monogram Offcut Watermark at the edge -->
		<img
			src="/logos/monogram-ember.svg"
			aria-hidden="true"
			class="pointer-events-none absolute -right-[12%] top-1/2 -translate-y-1/2 w-[42vw] max-w-[520px] opacity-[0.05] select-none"
			alt=""
		/>

		<div class="relative shell">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				<!-- Left Column: Minimal Form with Line-Inputs (approx 5.5 cols) -->
				<div class="lg:col-span-6 max-w-xl">
					<FadeUp>
						<h2 class="text-xs sm:text-sm font-sans font-semibold tracking-[0.2em] uppercase text-jbc-obsidian">
							Enquire About Our Products
						</h2>
					</FadeUp>

					{#if form?.success}
						<div class="mt-8 p-6 border border-jbc-ember/40 bg-jbc-ember/5">
							<p class="text-base font-display text-jbc-obsidian font-medium">Thank you for your enquiry.</p>
							<p class="mt-1 text-xs text-jbc-slate">
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
							class="mt-8 space-y-6"
						>
							<input type="hidden" name="subject" value="Product Enquiry: {product.title}" />

							<!-- Row 1: First name & Last name -->
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
								<div>
									<label for="firstName" class="sr-only">First name</label>
									<input
										type="text"
										id="firstName"
										name="name"
										required
										placeholder="First name"
										value={form?.values?.name ?? ''}
										class="w-full bg-transparent border-0 border-b border-jbc-obsidian/30 pb-2 text-sm text-jbc-obsidian placeholder-jbc-obsidian/50 focus:border-jbc-obsidian focus:outline-none transition-colors"
									/>
									{#if form?.errors?.name}
										<p class="mt-1 text-xs text-jbc-ember">{form.errors.name}</p>
									{/if}
								</div>
								<div>
									<label for="lastName" class="sr-only">Last name</label>
									<input
										type="text"
										id="lastName"
										name="lastName"
										placeholder="Last name"
										class="w-full bg-transparent border-0 border-b border-jbc-obsidian/30 pb-2 text-sm text-jbc-obsidian placeholder-jbc-obsidian/50 focus:border-jbc-obsidian focus:outline-none transition-colors"
									/>
								</div>
							</div>

							<!-- Row 2: Email & Telephone -->
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
								<div>
									<label for="email" class="sr-only">Your email address</label>
									<input
										type="email"
										id="email"
										name="email"
										required
										placeholder="Your email address"
										value={form?.values?.email ?? ''}
										class="w-full bg-transparent border-0 border-b border-jbc-obsidian/30 pb-2 text-sm text-jbc-obsidian placeholder-jbc-obsidian/50 focus:border-jbc-obsidian focus:outline-none transition-colors"
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
										class="w-full bg-transparent border-0 border-b border-jbc-obsidian/30 pb-2 text-sm text-jbc-obsidian placeholder-jbc-obsidian/50 focus:border-jbc-obsidian focus:outline-none transition-colors"
									/>
								</div>
							</div>

							<!-- Row 3: Subject line -->
							<div>
								<label for="subjectSelect" class="sr-only">Subject</label>
								<div class="relative">
									<select
										id="subjectSelect"
										name="subjectDisplay"
										class="w-full bg-transparent border-0 border-b border-jbc-obsidian/30 pb-2 text-sm text-jbc-obsidian focus:border-jbc-obsidian focus:outline-none transition-colors appearance-none pr-8 cursor-pointer"
									>
										<option value="Product enquiry: {product.title}" selected>Product enquiry: {product.title}</option>
										<option value="Custom sizing: {product.title}">Custom sizing: {product.title}</option>
										<option value="Press &amp; Catalogue">Press &amp; Catalogue</option>
									</select>
									<span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-jbc-obsidian/60" aria-hidden="true">
										&#9662;
									</span>
								</div>
							</div>

							<!-- Row 4: Your message -->
							<div>
								<label for="message" class="sr-only">Your message</label>
								<textarea
									id="message"
									name="message"
									rows="3"
									required
									placeholder="Your message"
									class="w-full bg-transparent border-0 border-b border-jbc-obsidian/30 pb-2 text-sm text-jbc-obsidian placeholder-jbc-obsidian/50 focus:border-jbc-obsidian focus:outline-none transition-colors resize-y"
								>{form?.values?.message ?? ''}</textarea>
								{#if form?.errors?.message}
									<p class="mt-1 text-xs text-jbc-ember">{form.errors.message}</p>
								{/if}
							</div>

							<!-- Row 5: Consent Checkbox -->
							<div class="flex items-start gap-3 pt-1">
								<input
									type="checkbox"
									id="consent"
									name="consent"
									class="mt-1 h-4 w-4 rounded-none border-jbc-obsidian/30 text-jbc-obsidian accent-jbc-obsidian focus:ring-0"
								/>
								<label for="consent" class="text-xs font-sans text-jbc-obsidian/75 leading-relaxed">
									By joining the mailing list, I agree to the Privacy Policy
								</label>
							</div>

							<!-- Submit Button -->
							<div class="pt-3">
								<button
									type="submit"
									disabled={submitting}
									class="inline-flex items-center justify-center px-8 py-3.5 bg-jbc-obsidian text-jbc-white font-sans text-xs font-semibold tracking-[0.18em] uppercase hover:bg-jbc-ember transition-colors duration-300 disabled:opacity-50 cursor-pointer"
								>
									{submitting ? 'Sending Enquiry...' : 'Send Enquiry'}
								</button>
							</div>
						</form>
					{/if}
				</div>

				<!-- Right Column: The 2 Other Images (matching Pasted image (2).png) -->
				<div class="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6 items-start">
					{#each otherImages as imgPath, idx}
						<FadeUp index={idx}>
							<div class="relative aspect-[3/4] w-full overflow-hidden bg-jbc-obsidian/5 shadow-sm">
								<img
									src={img(imgPath, { w: 900, q: 88 })}
									alt="{product.title} craft and interior view {idx + 1}"
									class="h-full w-full object-cover"
									loading="lazy"
								/>
							</div>
						</FadeUp>
					{/each}
				</div>
			</div>
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
