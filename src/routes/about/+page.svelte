<script lang="ts">
	/**
	 * About. The manual's own voice — direct, warm, no studio-speak. Vision and
	 * Mission sit in an offset two-column block rather than matched cards, so
	 * the page never reads as a corporate boilerplate section.
	 */
	import { img, srcset } from '$lib/images';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import Skyline from '$lib/components/Skyline.svelte';

	const HERO = 'pages/about-hero';
	const WORKSHOP = 'pages/about-workshop';

	const numbers = [
		{ value: '12', label: 'Years designing and building' },
		{ value: '140+', label: 'Rooms completed in Lagos' },
		{ value: '10 yr', label: 'Structural warranty on our furniture' }
	];

	/**
	 * The story's three paragraphs share one measure and colour. Spacing is left
	 * to each `<p>`: the first one's top margin is responsive and a `mt-*` here
	 * would need overriding, which puts two competing utilities in one class
	 * list and leaves the outcome to Tailwind's sort order rather than to intent.
	 */
	const PROSE = 'max-w-[58ch] text-body-lg leading-[1.75] text-jbc-black-70';

	/** Vision and Mission are typographically identical; only the copy differs. */
	const VM_TITLE = 'mt-5 max-w-[20ch] text-h2 font-bold lg:text-[2.25rem]';
	const VM_TEXT = 'mt-6 max-w-[48ch] text-body-lg leading-[1.75] text-jbc-white-70';
</script>

<svelte:head>
	<title>About — JBC | Jimibello &amp; Co.</title>
	<meta
		name="description"
		content="JBC is an interior design studio with a furniture workshop attached. Our story, vision and mission — and why building our own pieces changes what we can design."
	/>
</svelte:head>

<section class="relative flex min-h-[68svh] items-end overflow-hidden bg-jbc-black">
	<img
		class="absolute inset-0 h-full w-full object-cover"
		src={img(HERO, 1920, { ratio: 16 / 9 })}
		srcset={srcset(HERO, { ratio: 16 / 9 })}
		sizes="100vw"
		alt="The JBC studio floor, with drawings pinned along a timber storage wall"
		width="1920"
		height="1080"
		fetchpriority="high"
		decoding="async"
	/>
	<div class="scrim-page" aria-hidden="true"></div>
	<div class="relative shell pb-16 text-jbc-white lg:pb-22">
		<p class="eyebrow text-jbc-white-70">About</p>
		<!-- Over photography the title runs past the shared page-head token. -->
		<h1 class="mt-5 max-w-[18ch] text-h1 font-bold tracking-jbc-tight lg:text-[4.5rem]">
			A design studio with a workshop attached.
		</h1>
	</div>
</section>

<section class="py-section lg:py-section-lg">
	<div class="shell lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-x-20">
		<FadeUp>
			<p class="max-w-[22ch] text-h2-lg leading-[1.1] font-bold tracking-jbc-snug">
				We started because too many good rooms were being finished with whatever happened to fit.
			</p>
		</FadeUp>

		<FadeUp index={1}>
			<!-- Below lg the body follows the pull-quote and needs the gap; level
			     with it in two columns, it must not. -->
			<p class="{PROSE} mt-8 lg:mt-0">
				JBC began as a two-person interior practice in Lagos, and for the first few years we did
				what every studio does: draw the space, then spend weeks hunting for pieces that were nearly
				the right size. Nearly is expensive. Nearly is what makes a finished room feel slightly off
				without anyone being able to say why.
			</p>
			<p class="{PROSE} mt-6">
				So we opened a workshop. Now when a wall is 2,340mm wide, the bookcase is 2,340mm wide. When
				a client wants a four-poster bed and has a normal ceiling, we redraw the bed rather than
				talk them out of it. The design and the making sit in the same building, which means the
				drawings are honest about what can actually be built — and the build never quietly departs
				from the drawing.
			</p>
			<p class="{PROSE} mt-6">
				We work on homes and offices, on budgets from modest to considerable. Need budget-friendly
				interiors done properly? That is a conversation we are happy to have, and one we have often.
			</p>
			<CTAButton href="/services" variant="outline" class="mt-9">What we do</CTAButton>
		</FadeUp>
	</div>
</section>

<section class="pb-section lg:pb-section-lg">
	<div class="shell">
		<ul class="grid gap-10 border-t border-jbc-black-15 pt-10 md:grid-cols-3 md:gap-12">
			{#each numbers as item, i (item.label)}
				<FadeUp as="li" index={i} class="grid gap-3">
					<span class="text-[3rem] leading-none font-bold tracking-jbc-tight">{item.value}</span>
					<span class="max-w-[24ch] text-body leading-[1.6] text-jbc-black-70">{item.label}</span>
				</FadeUp>
			{/each}
		</ul>
	</div>
</section>

<section class="dark-bg relative overflow-hidden bg-jbc-black text-jbc-white">
	<div class="pointer-events-none absolute inset-x-0 bottom-0 h-[65%]" aria-hidden="true">
		<Skyline theme="dark" opacity={0.18} />
	</div>

	<!-- Offset, not matched: the two blocks are the same width but the second
	     sits lower, so they read as a conversation, not a table. -->
	<div class="relative shell grid gap-14 py-section lg:grid-cols-2 lg:gap-x-20 lg:py-section-lg">
		<FadeUp>
			<p class="eyebrow text-jbc-red">Vision</p>
			<h2 class={VM_TITLE}>Rooms in Lagos that were made for the people in them.</h2>
			<p class={VM_TEXT}>
				We want made-to-measure to stop being a luxury word. A house full of pieces built for its
				own walls should be an ordinary way to live, not a rare one — and the way there is to keep
				the design and the making under one roof, where the cost of custom stops multiplying.
			</p>
		</FadeUp>

		<FadeUp index={1} class="lg:mt-24">
			<p class="eyebrow text-jbc-red">Mission</p>
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

<section class="py-section lg:py-section-lg">
	<div class="shell lg:grid lg:grid-cols-[0.95fr_1fr] lg:items-center lg:gap-x-20">
		<FadeUp>
			<img
				class="block h-auto w-full bg-jbc-black-15"
				src={img(WORKSHOP, 1024, { ratio: 4 / 5 })}
				srcset={srcset(WORKSHOP, { ratio: 4 / 5 })}
				sizes="(min-width: 64rem) 45vw, 100vw"
				alt="A JBC maker checking a joint on a partly assembled timber frame"
				width="1024"
				height="1280"
				loading="lazy"
				decoding="async"
			/>
		</FadeUp>

		<FadeUp index={1} class="mt-10 lg:mt-0">
			<p class="eyebrow text-jbc-black-50">The workshop</p>
			<h2 class="mt-5 max-w-[18ch] text-h2 font-semibold lg:text-h2-lg">
				The part most studios have to outsource.
			</h2>
			<p class="mt-6 max-w-[52ch] text-body-lg leading-[1.75] text-jbc-black-70">
				Beds, four-poster beds, chests of drawers, dining tables and chairs, bookcases, coffee
				tables — drawn here, prototyped here, built here in solid timber. Prototypes are reviewed
				with you before the full run, and nothing ships until the joinery is right.
			</p>
			<CTAButton href="/services#furniture-design" variant="outline" class="mt-9">
				Furniture design
			</CTAButton>
		</FadeUp>
	</div>
</section>
