<script lang="ts">
	/**
	 * About — JimiBello & Co.
	 * Updated with brand identity: Ivory grounds, Ember accents, Obsidian darks,
	 * JB Monogram watermark, and high image density.
	 */
	import { img, srcset } from '$lib/images';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import Skyline from '$lib/components/Skyline.svelte';

	const HERO = 'pages/about-hero';
	const WORKSHOP = 'pages/about-workshop';

	const numbers = [
		{ value: '12', label: 'Years designing and crafting' },
		{ value: '140+', label: 'Spaces completed across Lagos' },
		{ value: '10 yr', label: 'Structural warranty on bespoke furniture' }
	];

	const PROSE = 'max-w-[58ch] text-body-lg leading-[1.75] text-jbc-obsidian/80';
	const VM_TITLE = 'mt-5 max-w-[20ch] text-h2 font-display font-bold lg:text-[2.25rem]';
	const VM_TEXT = 'mt-6 max-w-[48ch] text-body-lg leading-[1.75] text-jbc-white/80';
</script>

<svelte:head>
	<title>About — JimiBello &amp; Co. | Living Through Design</title>
	<meta
		name="description"
		content="JimiBello & Co. is an interior design studio with a dedicated furniture workshop in Lagos. Our story, vision and craft."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="dark-bg relative flex min-h-[68svh] items-end overflow-hidden bg-jbc-obsidian">
	<img
		class="absolute inset-0 h-full w-full object-cover"
		src={img(HERO, 1920, { ratio: 16 / 9 })}
		srcset={srcset(HERO, { ratio: 16 / 9 })}
		sizes="100vw"
		alt="The JimiBello & Co. studio floor, with drawings pinned along a timber storage wall"
		width="1920"
		height="1080"
		fetchpriority="high"
		decoding="async"
	/>
	<div class="scrim-page" aria-hidden="true"></div>
	<div class="relative shell pb-16 text-jbc-white lg:pb-22">
		<p class="eyebrow text-jbc-ember font-semibold uppercase">About Our Studio</p>
		<h1 class="mt-4 max-w-[18ch] text-h1 font-display font-bold tracking-jbc-tight lg:text-[4.25rem]">
			A design studio with a workshop of its own.
		</h1>
	</div>
</section>

<!-- Story Section (Ivory Ground + JB Watermark + Image Density) -->
<section class="relative overflow-hidden bg-jbc-ivory py-[var(--spacing-section)] lg:py-[var(--spacing-section-lg)]">
	<!-- JB Watermark on Right Edge -->
	<img
		src="/logos/monogram-ember.svg"
		aria-hidden="true"
		class="pointer-events-none absolute -right-[10%] top-1/2 -translate-y-1/2 w-[42vw] max-w-[550px] opacity-[0.06] select-none"
		alt=""
	/>

	<div class="relative shell">
		<div class="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
			<!-- Quote Column -->
			<FadeUp class="lg:col-span-5">
				<p class="eyebrow text-jbc-ember font-semibold">Our Philosophy</p>
				<blockquote class="mt-4 text-h2-lg font-display leading-[1.15] font-bold tracking-jbc-snug text-jbc-obsidian">
					We believe good spaces are designed as a whole.
				</blockquote>
				<div class="mt-8 relative aspect-[4/3] overflow-hidden bg-jbc-obsidian/10 shadow-sm hidden lg:block">
					<img
						src={img('projects/four-poster-series/01', { w: 800, q: 85 })}
						alt="Workshop joinery detail"
						class="h-full w-full object-cover"
						loading="lazy"
					/>
				</div>
			</FadeUp>

			<!-- Prose Column -->
			<FadeUp index={1} class="lg:col-span-7">
				<p class="{PROSE}">
					JimiBello &amp; Co. began as a two-person interior practice in Lagos, born from a simple observation: too many exceptional rooms were being compromised by mass-produced furniture that never quite fit.
				</p>
				<p class="{PROSE} mt-6">
					So we established our own dedicated workshop. Today, every project we undertake benefits from seamless integration between architectural design and master craftsmanship. When a room requires a bookcase of exact proportions, a dining table sculpted from continuous grain, or a bespoke bed suited to ceiling height, we draw it, prototype it, and build it.
				</p>
				<p class="{PROSE} mt-6">
					We work across residential sanctuaries and commercial spaces throughout Lagos and beyond, upholding an uncompromising commitment to materials, integrity, and human comfort.
				</p>
				<div class="mt-8 flex flex-wrap gap-4">
					<CTAButton href="/services" variant="outline">Our Services</CTAButton>
					<CTAButton href="/products" variant="secondary">View Products</CTAButton>
				</div>
			</FadeUp>
		</div>
	</div>
</section>

<!-- Stats Section (Ivory Ground) -->
<section class="relative overflow-hidden bg-jbc-ivory border-t border-jbc-obsidian/10 py-12 lg:py-16">
	<div class="relative shell">
		<ul class="grid gap-10 md:grid-cols-3 md:gap-12">
			{#each numbers as item, i (item.label)}
				<FadeUp as="li" index={i} class="grid gap-2 border-l-2 border-jbc-ember pl-6">
					<span class="text-[3rem] font-display leading-none font-bold tracking-jbc-tight text-jbc-obsidian">
						{item.value}
					</span>
					<span class="max-w-[24ch] text-body leading-[1.5] text-jbc-slate">{item.label}</span>
				</FadeUp>
			{/each}
		</ul>
	</div>
</section>

<!-- Vision & Mission (Obsidian Dark Ground) -->
<section class="dark-bg relative overflow-hidden bg-jbc-obsidian text-jbc-white">
	<div class="pointer-events-none absolute inset-x-0 bottom-0 h-[65%]" aria-hidden="true">
		<Skyline theme="dark" opacity={0.16} />
	</div>

	<div class="relative shell grid gap-14 py-[var(--spacing-section)] lg:grid-cols-2 lg:gap-x-20 lg:py-[var(--spacing-section-lg)]">
		<FadeUp>
			<p class="eyebrow text-jbc-ember font-semibold">Vision</p>
			<h2 class={VM_TITLE}>Rooms in Lagos that were made for the people in them.</h2>
			<p class={VM_TEXT}>
				We want made-to-measure to stop being a luxury word. A house full of pieces built for its
				own walls should be an ordinary way to live, not a rare one — and the way there is to keep
				the design and the making under one roof, where the cost of custom stops multiplying.
			</p>
		</FadeUp>

		<FadeUp index={1} class="lg:mt-24">
			<p class="eyebrow text-jbc-ember font-semibold">Mission</p>
			<h2 class={VM_TITLE}>Design it, build it, stand behind it.</h2>
			<p class={VM_TEXT}>
				Every project runs with one team from first sketch to handover: no design that cannot be
				built, no builder inheriting someone else's drawing. Every piece that leaves our workshop is
				signed, numbered and warranted for ten years — because a chair you can hand down is worth
				more than a chair you replace.
			</p>
		</FadeUp>
	</div>
</section>

<!-- Workshop Section (Ivory Ground + Left Mirrored Watermark + Photography) -->
<section class="relative overflow-hidden bg-jbc-ivory py-[var(--spacing-section)] lg:py-[var(--spacing-section-lg)]">
	<img
		src="/logos/monogram-ember.svg"
		aria-hidden="true"
		class="pointer-events-none absolute -left-[10%] top-1/2 -translate-y-1/2 w-[40vw] max-w-[500px] opacity-[0.05] select-none -scale-x-100"
		alt=""
	/>

	<div class="relative shell lg:grid lg:grid-cols-[0.95fr_1fr] lg:items-center lg:gap-x-20">
		<FadeUp>
			<div class="relative aspect-[4/5] overflow-hidden bg-jbc-obsidian/10 shadow-md">
				<img
					class="h-full w-full object-cover"
					src={img(WORKSHOP, 1024, { ratio: 4 / 5 })}
					srcset={srcset(WORKSHOP, { ratio: 4 / 5 })}
					sizes="(min-width: 64rem) 45vw, 100vw"
					alt="A master maker refining joinery on a solid timber frame in our workshop"
					width="1024"
					height="1280"
					loading="lazy"
					decoding="async"
				/>
			</div>
		</FadeUp>

		<FadeUp index={1} class="mt-10 lg:mt-0">
			<p class="eyebrow text-jbc-ember font-semibold">The Workshop</p>
			<h2 class="mt-4 max-w-[18ch] text-h2 font-display font-semibold lg:text-h2-lg text-jbc-obsidian">
				The part most studios have to outsource.
			</h2>
			<p class="mt-5 max-w-[52ch] text-body-lg leading-[1.75] text-jbc-obsidian/80">
				Our dedicated workshop is the heartbeat of JimiBello &amp; Co. Here, master craftsmen transform solid iroko, walnut, and oak into heirloom-grade furniture pieces. Every joint is finessed by hand, and every piece is built to endure.
			</p>
			<div class="mt-8 flex flex-wrap gap-4">
				<CTAButton href="/services#furniture-design" variant="outline">
					Furniture Design Services
				</CTAButton>
				<CTAButton href="/products" variant="secondary">
					View Workshop Pieces
				</CTAButton>
			</div>
		</FadeUp>
	</div>
</section>
