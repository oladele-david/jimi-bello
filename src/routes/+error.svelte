<script lang="ts">
	/** Shared error page — reached by /portfolio/[slug] on an unknown slug. */
	import { page } from '$app/state';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import Skyline from '$lib/components/Skyline.svelte';
</script>

<svelte:head>
	<title>{page.status} — JBC | Jimibello &amp; Co.</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="error dark-bg">
	<div class="error__motif" aria-hidden="true">
		<Skyline theme="dark" opacity={0.2} />
	</div>

	<div class="error__inner shell">
		<p class="error__code eyebrow">Error {page.status}</p>
		<h1 class="error__title">
			{page.status === 404 ? 'That page is not here.' : 'Something went wrong.'}
		</h1>
		<p class="error__text">
			{page.status === 404
				? 'The link may be old, or the project may have moved. The work is all still in one place.'
				: (page.error?.message ??
					'Try again in a moment, or get in touch and we will sort it out.')}
		</p>
		<div class="error__actions">
			<CTAButton href="/portfolio">View the work</CTAButton>
			<CTAButton href="/contact" variant="outline">Contact us</CTAButton>
		</div>
	</div>
</section>

<style>
	.error {
		position: relative;
		display: flex;
		align-items: center;
		min-height: 80svh;
		min-height: 80vh;
		overflow: hidden;
		background-color: var(--color-jbc-black);
		color: var(--color-jbc-white);
	}

	.error__motif {
		position: absolute;
		inset: auto 0 0;
		height: 65%;
		pointer-events: none;
	}

	.error__inner {
		position: relative;
		padding-block: 8rem 5rem;
	}

	.error__code {
		color: var(--color-jbc-red);
	}

	.error__title {
		margin-top: 1.25rem;
		max-width: 16ch;
		font-size: var(--text-h1);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	@media (width >= 64rem) {
		.error__title {
			font-size: 4rem;
		}
	}

	.error__text {
		margin-top: 1.5rem;
		max-width: 46ch;
		color: var(--color-jbc-white-70);
		font-size: var(--text-body-lg);
		line-height: 1.7;
	}

	.error__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 2.5rem;
	}

	.error__actions :global(.cta) {
		padding: 1.15rem 2.5rem;
	}
</style>
