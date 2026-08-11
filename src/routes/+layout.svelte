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
	 *
	 * Matched exactly: /portfolio/[slug] opens on a full-bleed hero and is
	 * deliberately not in this list.
	 */
	const LIGHT_AT_TOP = ['/portfolio', '/contact'];
	let solidHeader = $derived(LIGHT_AT_TOP.includes(page.url.pathname));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#262626" />
	<meta property="og:site_name" content="JBC — Jimibello &amp; Co." />
	<meta property="og:type" content="website" />
</svelte:head>

<Header solid={solidHeader} />

<!-- Target of the skip link in Header. -->
<main id="main" tabindex="-1">
	{@render children()}
</main>

<Footer />

<style>
	main {
		/* Focus lands here from the skip link; the focus ring is enough. */
		outline: none;
	}
</style>
