<script lang="ts">
	/**
	 * Contact. Two columns: the form on the left, the studio's details and a map
	 * on the right.
	 *
	 * Inputs are underline-only — no boxes, no fills — with the rule turning red
	 * on focus. That is the whole visual language of the form: one accent, used
	 * exactly where the reader's attention already is.
	 *
	 * The form posts to a server action and is enhanced progressively, so it
	 * still submits and still returns errors with JavaScript unavailable.
	 */
	import { enhance } from '$app/forms';
	import { contact } from '$lib/data/site';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import type { ActionData } from './$types';
	import Skyline from '$lib/components/Skyline.svelte';

	let { form }: { form: ActionData } = $props();

	let submitting = $state(false);

	let errors = $derived(form && 'errors' in form ? form.errors : undefined);
	let values = $derived(form && 'values' in form ? form.values : undefined);
	let sent = $derived(form?.success === true);

	const budgets = ['Under ₦5m', '₦5m – ₦15m', '₦15m – ₦40m', 'Over ₦40m', 'Not sure yet'];

	/** Encoded once for the map embed rather than inline in the markup. */
	const mapQuery = encodeURIComponent(contact.address.join(', '));

	/** Field wrapper. `first:mt-0` closes the gap above the opening field. */
	const FIELD = 'mt-10 first:mt-0';

	const LABEL = 'block text-eyebrow font-semibold tracking-jbc-caps uppercase text-jbc-black-50';

	/**
	 * The control itself: underline only, the rule *is* the input. Red arrives on
	 * focus and replaces the default outline, so a control that spent this much
	 * effort avoiding a box does not grow one back on focus — the red rule is the
	 * focus indicator, and it is a 1.5px colour change against 15% black, well
	 * clear of the 3:1 non-text contrast floor.
	 *
	 * One constant covers input, select and textarea because the old CSS grouped
	 * them in a single selector; keeping them identical is the design, not an
	 * accident of authoring.
	 */
	const CONTROL =
		'mt-3 w-full appearance-none rounded-none border-0 border-b-[1.5px] bg-transparent px-0 py-2 ' +
		'font-sans text-body-lg leading-[1.5] text-jbc-black placeholder:text-jbc-black-50 ' +
		'border-jbc-black-15 transition-colors duration-300 ease-out-brand ' +
		'hover:border-jbc-black-50 focus:border-jbc-red focus:outline-none ' +
		'aria-[invalid=true]:border-jbc-red';

	const ERROR = 'mt-2.5 text-sm leading-[1.4] text-jbc-red';

	/** Detail blocks in the aside, each opened by a hairline rule. */
	const DETAIL = 'border-t border-jbc-black-15 pt-7 [&+&]:mt-10';

	const DETAIL_LINK =
		'border-b border-jbc-black-15 text-body-lg text-jbc-black no-underline ' +
		'transition-[color,border-color] duration-300 ease-out-brand ' +
		'hover:border-jbc-red hover:text-jbc-red';
</script>

<svelte:head>
	<title>Contact — JBC | Jimibello &amp; Co.</title>
	<meta
		name="description"
		content="Talk to JBC about an interior or a piece of furniture. Studio in Ilupeju, Lagos — {contact.email}."
	/>
</svelte:head>

<!-- Top padding clears the fixed header, which is filled white on this route. -->
<section class="relative overflow-hidden">
	<div class="pointer-events-none absolute inset-x-0 bottom-0 h-[90%]" aria-hidden="true">
		<Skyline theme="light" opacity={0.22} />
	</div>
	<div class="relative shell pt-36 pb-20 lg:pt-48 lg:pb-28">
		<p class="eyebrow text-jbc-black-50">Contact</p>
		<h1 class="mt-5 max-w-[16ch] text-h1 font-bold tracking-jbc-tight lg:text-h1-lg">
			Tell us what the room is doing wrong.
		</h1>
		<p class="mt-6 max-w-[50ch] text-body-lg text-jbc-black-70">
			The more specific you are, the more useful our first reply will be. Photographs, rough
			dimensions, and the budget band you are working to all help.
		</p>
	</div>
</section>

<section class="pb-section lg:pb-section-lg">
	<div class="shell lg:grid lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-x-20">
		<FadeUp>
			{#if sent}
				<div class="border-t-[1.5px] border-jbc-red py-10" role="status">
					<p class="eyebrow text-jbc-red">Received</p>
					<h2 class="mt-4 text-h2 font-bold lg:text-h2-lg">Thank you — we have it.</h2>
					<p class="mt-5 max-w-[46ch] text-body-lg leading-[1.75] text-jbc-black-70">
						One of us will read this properly and reply within two working days. If it is urgent,
						call the studio on {contact.phone}.
					</p>
					<CTAButton href="/portfolio" variant="outline" class="mt-8">
						Look at the work meanwhile
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
							<!-- Lower-case and looser than the label it sits in: this is an aside,
							     not a second heading. -->
							<span class="ml-2 font-normal tracking-[0.12em] text-jbc-black-50 normal-case"
								>Optional</span
							>
						</label>
						<input
							class={CONTROL}
							id="project"
							name="project"
							type="text"
							placeholder="Three-bedroom flat, Ikoyi"
							value={values?.project ?? ''}
						/>
					</div>

					<div class={FIELD}>
						<label class={LABEL} for="budget">
							Budget band
							<span class="ml-2 font-normal tracking-[0.12em] text-jbc-black-50 normal-case"
								>Optional</span
							>
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
							aria-invalid={errors?.message ? 'true' : undefined}
							aria-describedby={errors?.message ? 'message-error' : undefined}
							>{values?.message ?? ''}</textarea
						>
						{#if errors?.message}
							<p class={ERROR} id="message-error">{errors.message}</p>
						{/if}
					</div>

					<!-- The disabled treatment lives in CTAButton, so a submit button that
					     is mid-flight looks the same wherever it appears. -->
					<CTAButton type="submit" size="lg" disabled={submitting} class="mt-12">
						{submitting ? 'Sending…' : 'Send enquiry'}
					</CTAButton>
				</form>
			{/if}
		</FadeUp>

		<FadeUp index={1} class="mt-16 lg:mt-0">
			<div class={DETAIL}>
				<h2 class="eyebrow text-jbc-black-50">Studio</h2>
				<address class="mt-4 grid gap-[0.35rem] text-body-lg leading-[1.55] not-italic">
					{#each contact.address as line (line)}
						<span>{line}</span>
					{/each}
				</address>
				<p class="mt-4 text-body text-jbc-black-50">{contact.hours}</p>
			</div>

			<div class={DETAIL}>
				<h2 class="eyebrow text-jbc-black-50">Direct</h2>
				<ul class="mt-4 grid gap-2.5">
					<li><a class={DETAIL_LINK} href="mailto:{contact.email}">{contact.email}</a></li>
					<li>
						<a class={DETAIL_LINK} href="tel:{contact.phone.replace(/\s/g, '')}">{contact.phone}</a>
					</li>
				</ul>
			</div>

			<div class={DETAIL}>
				<h2 class="eyebrow text-jbc-black-50">Elsewhere</h2>
				<ul class="mt-4 grid gap-2.5">
					{#each contact.social as link (link.href)}
						<li>
							<a class={DETAIL_LINK} href={link.href} target="_blank" rel="noreferrer noopener"
								>{link.label}</a
							>
						</li>
					{/each}
				</ul>
			</div>

			<div class="group mt-10 aspect-[4/3] bg-jbc-black-15">
				<iframe
					class="block h-full w-full border-0 contrast-[1.05] grayscale transition-[filter]
					       duration-400 ease-out-brand group-hover:contrast-100 group-hover:grayscale-[0.15]"
					title="Map showing the JBC studio in Ilupeju, Lagos"
					src="https://www.openstreetmap.org/export/embed.html?bbox=3.348%2C6.536%2C3.376%2C6.566&layer=mapnik&marker=6.551%2C3.362&query={mapQuery}"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</FadeUp>
	</div>
</section>
