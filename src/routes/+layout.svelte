<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/logo-white.png';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	/**
	 * Routes whose first screen is a white surface. The header has to start
	 * filled there — the white lockup would otherwise sit invisibly on white.
	 * Everything else opens on a photograph or a Dark Liver band, so the bar
	 * stays transparent until the reader scrolls past the fold.
	 */
	const LIGHT_AT_TOP: string[] = [];
	let solidHeader = $derived(LIGHT_AT_TOP.includes(page.url.pathname));
	let isConsoleRoute = $derived(page.url.pathname.startsWith('/console'));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#262626" />
	<meta property="og:site_name" content="JBC — Jimibello &amp; Co." />
	<meta property="og:type" content="website" />
</svelte:head>

{#if !isConsoleRoute}
	<Header solid={solidHeader} />

	<!-- Target of the skip link in Header. Focus lands here from that link and
	     the focus ring is enough, so the default outline is dropped. -->
	<main id="main" class="outline-none" tabindex="-1">
		{@render children()}
	</main>

	<Footer />
{:else}
	<main id="main" class="min-h-screen bg-[#191919] text-jbc-white antialiased">
		{@render children()}
	</main>
{/if}
