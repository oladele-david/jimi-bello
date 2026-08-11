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

	let { form }: { form: ActionData } = $props();

	let submitting = $state(false);

	let errors = $derived(form && 'errors' in form ? form.errors : undefined);
	let values = $derived(form && 'values' in form ? form.values : undefined);
	let sent = $derived(form?.success === true);

	const budgets = ['Under ₦5m', '₦5m – ₦15m', '₦15m – ₦40m', 'Over ₦40m', 'Not sure yet'];

	/** Encoded once for the map embed rather than inline in the markup. */
	const mapQuery = encodeURIComponent(contact.address.join(', '));
</script>

<svelte:head>
	<title>Contact — JBC | Jimibello &amp; Co.</title>
	<meta
		name="description"
		content="Talk to JBC about an interior or a piece of furniture. Studio in Victoria Island, Lagos — {contact.email}."
	/>
</svelte:head>

<section class="head">
	<div class="shell">
		<p class="head__eyebrow eyebrow">Contact</p>
		<h1 class="head__title">Tell us what the room is doing wrong.</h1>
		<p class="head__lede">
			The more specific you are, the more useful our first reply will be. Photographs, rough
			dimensions, and the budget band you are working to all help.
		</p>
	</div>
</section>

<section class="main">
	<div class="main__inner shell">
		<FadeUp class="main__form">
			{#if sent}
				<div class="sent" role="status">
					<p class="sent__eyebrow eyebrow">Received</p>
					<h2 class="sent__title">Thank you — we have it.</h2>
					<p class="sent__text">
						One of us will read this properly and reply within two working days. If it is urgent,
						call the studio on {contact.phone}.
					</p>
					<CTAButton href="/portfolio" variant="outline" class="sent__cta">
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
					<div class="field">
						<label for="name">Name</label>
						<input
							id="name"
							name="name"
							type="text"
							autocomplete="name"
							value={values?.name ?? ''}
							aria-invalid={errors?.name ? 'true' : undefined}
							aria-describedby={errors?.name ? 'name-error' : undefined}
						/>
						{#if errors?.name}
							<p class="field__error" id="name-error">{errors.name}</p>
						{/if}
					</div>

					<div class="field">
						<label for="email">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							value={values?.email ?? ''}
							aria-invalid={errors?.email ? 'true' : undefined}
							aria-describedby={errors?.email ? 'email-error' : undefined}
						/>
						{#if errors?.email}
							<p class="field__error" id="email-error">{errors.email}</p>
						{/if}
					</div>

					<div class="field">
						<label for="project">Project <span class="field__optional">Optional</span></label>
						<input
							id="project"
							name="project"
							type="text"
							placeholder="Three-bedroom flat, Ikoyi"
							value={values?.project ?? ''}
						/>
					</div>

					<div class="field">
						<label for="budget">Budget band <span class="field__optional">Optional</span></label>
						<select id="budget" name="budget">
							<option value="">Select a band</option>
							{#each budgets as band (band)}
								<option value={band} selected={values?.budget === band}>{band}</option>
							{/each}
						</select>
					</div>

					<div class="field">
						<label for="message">What is not working?</label>
						<textarea
							id="message"
							name="message"
							rows="5"
							aria-invalid={errors?.message ? 'true' : undefined}
							aria-describedby={errors?.message ? 'message-error' : undefined}
							>{values?.message ?? ''}</textarea
						>
						{#if errors?.message}
							<p class="field__error" id="message-error">{errors.message}</p>
						{/if}
					</div>

					<CTAButton type="submit" disabled={submitting} class="form__submit">
						{submitting ? 'Sending…' : 'Send enquiry'}
					</CTAButton>
				</form>
			{/if}
		</FadeUp>

		<FadeUp index={1} class="main__aside">
			<div class="detail">
				<h2 class="detail__heading eyebrow">Studio</h2>
				<address>
					{#each contact.address as line (line)}
						<span>{line}</span>
					{/each}
				</address>
				<p class="detail__hours">{contact.hours}</p>
			</div>

			<div class="detail">
				<h2 class="detail__heading eyebrow">Direct</h2>
				<ul>
					<li><a href="mailto:{contact.email}">{contact.email}</a></li>
					<li><a href="tel:{contact.phone.replace(/\s/g, '')}">{contact.phone}</a></li>
				</ul>
			</div>

			<div class="detail">
				<h2 class="detail__heading eyebrow">Elsewhere</h2>
				<ul>
					{#each contact.social as link (link.href)}
						<li>
							<a href={link.href} target="_blank" rel="noreferrer noopener">{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>

			<div class="map">
				<iframe
					title="Map showing the JBC studio in Victoria Island, Lagos"
					src="https://www.openstreetmap.org/export/embed.html?bbox=3.41%2C6.42%2C3.45%2C6.44&layer=mapnik&marker=6.43%2C3.43&query={mapQuery}"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</FadeUp>
	</div>
</section>

<style>
	.head {
		/* Clears the fixed header, which is filled white on this route. */
		padding-block: 8rem 3rem;
	}

	@media (width >= 64rem) {
		.head {
			padding-block: 11rem 4rem;
		}
	}

	.head__eyebrow {
		color: var(--color-jbc-black-50);
	}

	.head__title {
		margin-top: 1.25rem;
		max-width: 16ch;
		font-size: var(--text-h1);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	@media (width >= 64rem) {
		.head__title {
			font-size: 4.25rem;
		}
	}

	.head__lede {
		margin-top: 1.5rem;
		max-width: 50ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body-lg);
		line-height: 1.7;
	}

	/* ── Layout ───────────────────────────────────────────────────────────── */

	.main {
		padding-bottom: var(--spacing-section);
	}

	@media (width >= 64rem) {
		.main {
			padding-bottom: var(--spacing-section-lg);
		}

		.main__inner {
			display: grid;
			grid-template-columns: 1.25fr 1fr;
			column-gap: 5rem;
			align-items: start;
		}
	}

	/* ── Form ─────────────────────────────────────────────────────────────── */

	.field {
		margin-top: 2.5rem;
	}

	.field:first-child {
		margin-top: 0;
	}

	.field label {
		display: block;
		color: var(--color-jbc-black-50);
		font-size: var(--text-eyebrow);
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.field__optional {
		margin-left: 0.5rem;
		color: var(--color-jbc-black-50);
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: none;
	}

	/* Underline only: the rule is the whole control. */
	.field input,
	.field select,
	.field textarea {
		width: 100%;
		margin-top: 0.75rem;
		padding: 0.5rem 0;
		appearance: none;
		background: none;
		border: 0;
		border-bottom: 1.5px solid var(--color-jbc-black-15);
		border-radius: 0;
		color: var(--color-jbc-black);
		font-family: inherit;
		font-size: var(--text-body-lg);
		line-height: 1.5;
		transition: border-color 300ms var(--ease-out-brand);
	}

	.field textarea {
		resize: vertical;
	}

	.field input::placeholder,
	.field textarea::placeholder {
		color: var(--color-jbc-black-50);
	}

	.field input:hover,
	.field select:hover,
	.field textarea:hover {
		border-bottom-color: var(--color-jbc-black-50);
	}

	/* Red arrives on focus, and the rule replaces the default outline so the
	   control does not gain a box it spent all this effort avoiding. */
	.field input:focus,
	.field select:focus,
	.field textarea:focus {
		outline: none;
		border-bottom-color: var(--color-jbc-red);
	}

	.field input[aria-invalid='true'],
	.field textarea[aria-invalid='true'] {
		border-bottom-color: var(--color-jbc-red);
	}

	.field__error {
		margin-top: 0.625rem;
		color: var(--color-jbc-red);
		font-size: 0.875rem;
		line-height: 1.4;
	}

	form :global(.form__submit) {
		margin-top: 3rem;
		padding: 1.15rem 2.5rem;
	}

	form :global(.form__submit:disabled) {
		opacity: 0.6;
		cursor: progress;
	}

	/* ── Success ──────────────────────────────────────────────────────────── */

	.sent {
		padding: 2.5rem 0;
		border-top: 1.5px solid var(--color-jbc-red);
	}

	.sent__eyebrow {
		color: var(--color-jbc-red);
	}

	.sent__title {
		margin-top: 1rem;
		font-size: var(--text-h2);
		font-weight: 700;
		line-height: 1.15;
	}

	@media (width >= 64rem) {
		.sent__title {
			font-size: var(--text-h2-lg);
		}
	}

	.sent__text {
		margin-top: 1.25rem;
		max-width: 46ch;
		color: var(--color-jbc-black-70);
		font-size: var(--text-body-lg);
		line-height: 1.75;
	}

	.sent :global(.sent__cta) {
		margin-top: 2rem;
		padding: 1rem 2.25rem;
	}

	/* ── Details column ───────────────────────────────────────────────────── */

	.main :global(.main__aside) {
		margin-top: 4rem;
	}

	@media (width >= 64rem) {
		.main :global(.main__aside) {
			margin-top: 0;
		}
	}

	.detail {
		padding-top: 1.75rem;
		border-top: 1px solid var(--color-jbc-black-15);
	}

	.detail + .detail {
		margin-top: 2.5rem;
	}

	.detail__heading {
		color: var(--color-jbc-black-50);
	}

	.detail address {
		display: grid;
		gap: 0.35rem;
		margin-top: 1rem;
		font-size: var(--text-body-lg);
		font-style: normal;
		line-height: 1.55;
	}

	.detail__hours {
		margin-top: 1rem;
		color: var(--color-jbc-black-50);
		font-size: var(--text-body);
	}

	.detail ul {
		display: grid;
		gap: 0.625rem;
		margin: 1rem 0 0;
		padding: 0;
		list-style: none;
	}

	.detail a {
		color: var(--color-jbc-black);
		font-size: var(--text-body-lg);
		text-decoration: none;
		border-bottom: 1px solid var(--color-jbc-black-15);
		transition:
			color 300ms var(--ease-out-brand),
			border-color 300ms var(--ease-out-brand);
	}

	.detail a:hover {
		color: var(--color-jbc-red);
		border-bottom-color: var(--color-jbc-red);
	}

	/* ── Map ──────────────────────────────────────────────────────────────── */

	.map {
		margin-top: 2.5rem;
		aspect-ratio: 4 / 3;
		background-color: var(--color-jbc-black-15);
	}

	.map iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
		/* Desaturated so the map does not compete with the palette; it lifts on
		   hover for anyone actually reading it. */
		filter: grayscale(1) contrast(1.05);
		transition: filter 400ms var(--ease-out-brand);
	}

	.map:hover iframe {
		filter: grayscale(0.15) contrast(1);
	}
</style>
