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

<section
	class="dark-bg relative flex min-h-[80svh] items-center overflow-hidden bg-jbc-black text-jbc-white"
>
	<div class="pointer-events-none absolute inset-x-0 bottom-0 h-[65%]" aria-hidden="true">
		<Skyline theme="dark" opacity={0.2} />
	</div>

	<div class="relative shell pt-32 pb-20">
		<p class="eyebrow text-jbc-red">Error {page.status}</p>
		<!-- Runs a shade smaller than the page-head token: this screen is a dead
		     end, not a section opener. -->
		<h1 class="mt-5 max-w-[16ch] text-h1 font-bold tracking-jbc-tight lg:text-[4rem]">
			{page.status === 404 ? 'That page is not here.' : 'Something went wrong.'}
		</h1>
		<p class="mt-6 max-w-[46ch] text-body-lg text-jbc-white-70">
			{page.status === 404
				? 'The link may be old, or the project may have moved. The work is all still in one place.'
				: (page.error?.message ??
					'Try again in a moment, or get in touch and we will sort it out.')}
		</p>
		<div class="mt-10 flex flex-wrap gap-4">
			<CTAButton href="/portfolio" size="lg">View the work</CTAButton>
			<CTAButton href="/contact" variant="outline" size="lg">Contact us</CTAButton>
		</div>
	</div>
</section>
