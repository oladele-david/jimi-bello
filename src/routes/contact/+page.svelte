<script lang="ts">
	/**
	 * Contact — JimiBello & Co.
	 * Updated with brand identity: Ivory grounds, Ember accents, Obsidian darks,
	 * JB Monogram watermark, and both phone numbers.
	 */
	import { enhance } from '$app/forms';
	import { img, srcset } from '$lib/images';
	import { contact } from '$lib/data/site';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import type { ActionData } from './$types';

	const HERO = 'pages/contact-hero';

	let { form }: { form: ActionData } = $props();

	let submitting = $state(false);

	let errors = $derived(form && 'errors' in form ? form.errors : undefined);
	let values = $derived(form && 'values' in form ? form.values : undefined);
	let sent = $derived(form?.success === true);

	const budgets = ['Under ₦5m', '₦5m – ₦15m', '₦15m – ₦40m', 'Over ₦40m', 'Not sure yet'];

	const mapQuery = encodeURIComponent(contact.address.join(', '));

	const FIELD = 'mt-8 first:mt-0';
	const LABEL = 'block text-eyebrow font-semibold tracking-jbc-caps uppercase text-jbc-obsidian/60';

	const CONTROL =
		'mt-3 w-full appearance-none rounded-none border-0 border-b-[1.5px] bg-transparent px-0 py-2 ' +
		'font-sans text-body-lg leading-[1.5] text-jbc-obsidian placeholder:text-jbc-obsidian/40 ' +
		'border-jbc-obsidian/20 transition-colors duration-300 ease-out-brand ' +
		'hover:border-jbc-obsidian/60 focus:border-jbc-ember focus:outline-none ' +
		'aria-[invalid=true]:border-jbc-ember';

	const ERROR = 'mt-2 text-sm leading-[1.4] text-jbc-ember font-medium';
	const DETAIL = 'border-t border-jbc-obsidian/15 pt-7 [&+&]:mt-10';

	const DETAIL_LINK =
		'border-b border-jbc-obsidian/20 text-body-lg text-jbc-obsidian no-underline ' +
		'transition-[color,border-color] duration-300 ease-out-brand ' +
		'hover:border-jbc-ember hover:text-jbc-ember';
</script>

<svelte:head>
	<title>Contact — JimiBello &amp; Co. | Living Through Design</title>
	<meta
		name="description"
		content="Talk to JimiBello & Co. about an interior project or handcrafted furniture. Studio in Ilupeju, Lagos — {contact.email}."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="dark-bg relative flex min-h-[68svh] flex-col justify-end overflow-hidden bg-jbc-obsidian pt-28 pb-16 lg:pt-36 lg:pb-22">
	<img
		class="absolute inset-0 h-full w-full object-cover"
		src={img(HERO, 1920, { ratio: 16 / 9 })}
		srcset={srcset(HERO, { ratio: 16 / 9 })}
		sizes="100vw"
		alt="An architectural interior space with warm lighting and bespoke timber details"
		width="1920"
		height="1080"
		fetchpriority="high"
		decoding="async"
	/>
	<div class="scrim-page" aria-hidden="true"></div>
	<div class="relative shell pb-16 text-jbc-white lg:pb-22">
		<p class="eyebrow text-jbc-ember font-semibold uppercase">Contact Our Studio</p>
		<h1 class="mt-4 max-w-[18ch] text-h1 font-display font-bold tracking-jbc-tight lg:text-h1-lg">
			Tell us what the room is doing wrong.
		</h1>
		<p class="mt-4 max-w-[50ch] text-body-lg text-jbc-white/80">
			We'll show you what it could be.
		</p>
	</div>
</section>

<!-- Form & Details Section (Ivory Ground + JB Watermark) -->
<section class="relative overflow-hidden bg-jbc-ivory py-[var(--spacing-section)] lg:py-[var(--spacing-section-lg)]">
	<!-- Watermark on right edge -->
	<img
		src="/logos/monogram-ember.svg"
		aria-hidden="true"
		class="pointer-events-none absolute -right-[10%] top-1/2 -translate-y-1/2 w-[42vw] max-w-[560px] opacity-[0.06] select-none"
		alt=""
	/>

	<div class="relative shell lg:grid lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-x-20">
		<FadeUp>
			{#if sent}
				<div class="border-t-[2px] border-jbc-ember py-10" role="status">
					<p class="eyebrow text-jbc-ember font-semibold uppercase">Enquiry Received</p>
					<h2 class="mt-3 text-h2 font-display font-bold text-jbc-obsidian lg:text-h2-lg">Thank you — we have it.</h2>
					<p class="mt-4 max-w-[46ch] text-body-lg leading-[1.75] text-jbc-obsidian/80">
						One of us will read this carefully and reply within two working days. If it is urgent,
						call our studio on {contact.phone} or {contact.phone2}.
					</p>
					<CTAButton href="/portfolio" variant="outline" class="mt-8">
						Look at our work meanwhile
					</CTAButton>
				</div>
			{:else}
				<form
					method="POST"
					novalidate
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update();
							submitting = false;
						};
					}}
				>
					<div class={FIELD}>
						<label class={LABEL} for="name">Name</label>
						<input
							class={CONTROL}
							id="name"
							name="name"
							type="text"
							autocomplete="name"
							placeholder="Your full name"
							value={values?.name ?? ''}
							aria-invalid={errors?.name ? 'true' : undefined}
							aria-describedby={errors?.name ? 'name-error' : undefined}
						/>
						{#if errors?.name}
							<p class={ERROR} id="name-error">{errors.name}</p>
						{/if}
					</div>

					<div class={FIELD}>
						<label class={LABEL} for="email">Email</label>
						<input
							class={CONTROL}
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							placeholder="yourname@domain.com"
							value={values?.email ?? ''}
							aria-invalid={errors?.email ? 'true' : undefined}
							aria-describedby={errors?.email ? 'email-error' : undefined}
						/>
						{#if errors?.email}
							<p class={ERROR} id="email-error">{errors.email}</p>
						{/if}
					</div>

					<div class={FIELD}>
						<label class={LABEL} for="project">
							Project
							<span class="ml-2 font-normal tracking-[0.12em] text-jbc-slate normal-case">Optional</span>
						</label>
						<input
							class={CONTROL}
							id="project"
							name="project"
							type="text"
							placeholder="Three-bedroom residence, Ikoyi / Bespoke dining collection"
							value={values?.project ?? ''}
						/>
					</div>

					<div class={FIELD}>
						<label class={LABEL} for="budget">
							Budget band
							<span class="ml-2 font-normal tracking-[0.12em] text-jbc-slate normal-case">Optional</span>
						</label>
						<select class={CONTROL} id="budget" name="budget">
							<option value="">Select a band</option>
							{#each budgets as band (band)}
								<option value={band} selected={values?.budget === band}>{band}</option>
							{/each}
						</select>
					</div>

					<div class={FIELD}>
						<label class={LABEL} for="message">What is not working?</label>
						<textarea
							class="{CONTROL} resize-y"
							id="message"
							name="message"
							rows="5"
							placeholder="Tell us about the space, your timeline, or the piece you want built..."
							aria-invalid={errors?.message ? 'true' : undefined}
							aria-describedby={errors?.message ? 'message-error' : undefined}
							>{values?.message ?? ''}</textarea
						>
						{#if errors?.message}
							<p class={ERROR} id="message-error">{errors.message}</p>
						{/if}
					</div>

					<CTAButton type="submit" size="lg" disabled={submitting} class="mt-10">
						{submitting ? 'Sending…' : 'Send enquiry'}
					</CTAButton>
				</form>
			{/if}
		</FadeUp>

		<FadeUp index={1} class="mt-16 lg:mt-0">
			<div class={DETAIL}>
				<h2 class="eyebrow text-jbc-ember font-semibold uppercase">Studio Address</h2>
				<address class="mt-3 grid gap-[0.35rem] text-body-lg leading-[1.55] not-italic text-jbc-obsidian/85">
					{#each contact.address as line (line)}
						<span>{line}</span>
					{/each}
				</address>
				<p class="mt-3 text-body text-jbc-slate">{contact.hours}</p>
			</div>

			<div class={DETAIL}>
				<h2 class="eyebrow text-jbc-ember font-semibold uppercase">Direct Lines</h2>
				<ul class="mt-3 grid gap-2.5">
					<li><a class={DETAIL_LINK} href="mailto:{contact.email}">{contact.email}</a></li>
					<li>
						<a class={DETAIL_LINK} href="tel:{contact.phone.replace(/\s/g, '')}">{contact.phone}</a>
					</li>
					{#if contact.phone2}
						<li>
							<a class={DETAIL_LINK} href="tel:{contact.phone2.replace(/\s/g, '')}">{contact.phone2}</a>
						</li>
					{/if}
				</ul>
			</div>

			<div class={DETAIL}>
				<h2 class="eyebrow text-jbc-ember font-semibold uppercase">Social</h2>
				<ul class="mt-3 grid gap-2.5">
					{#each contact.social as link (link.href)}
						<li>
							<a class={DETAIL_LINK} href={link.href} target="_blank" rel="noreferrer noopener"
								>{link.label}</a
							>
						</li>
					{/each}
				</ul>
			</div>

			<div class="group mt-10 aspect-[4/3] bg-jbc-obsidian/10 overflow-hidden shadow-sm">
				<iframe
					class="block h-full w-full border-0 contrast-[1.05] grayscale transition-[filter]
					       duration-400 ease-out-brand group-hover:contrast-100 group-hover:grayscale-[0.15]"
					title="Map showing the JimiBello & Co. studio in Ilupeju, Lagos"
					src="https://www.openstreetmap.org/export/embed.html?bbox=3.348%2C6.536%2C3.376%2C6.566&layer=mapnik&marker=6.551%2C3.362&query={mapQuery}"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</FadeUp>
	</div>
</section>
