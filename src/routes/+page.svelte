<script lang="ts">
	/**
	 * Home. Five movements: full-bleed hero, intro with a Bold pull-quote,
	 * asymmetric featured grid, services teaser, dark CTA band.
	 *
	 * The hero photograph is the one place a busy image sits behind the lockup,
	 * so the header renders its solid white lockup there — never the full-colour
	 * one — per the brand manual.
	 */
	import { img, srcset } from '$lib/images';
	import { projects, services } from '$lib/data/site';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	const HERO = 'pages/home-hero';

	/**
	 * Curated rather than sliced, because the shapes carry the layout: a tall
	 * tile beside a square for the offset pair, then the one 'wide' project on
	 * its own so it can break out to the full viewport width.
	 */
	const pair = projects.filter((p) => ['ikoyi-residence', 'four-poster-series'].includes(p.slug));
	const [breakout] = projects.filter((p) => p.slug === 'victoria-island-studio');

	/** Section heading, used by both the work and services teasers. */
	const SECTION_TITLE = 'mt-4 text-h2 font-semibold lg:text-h2-lg';
</script>

<svelte:head>
	<title>JBC — Jimibello &amp; Co. | Interior design and handcrafted furniture, Lagos</title>
	<meta
		name="description"
		content="JBC designs interiors for homes and offices and builds the furniture that goes in them — from first sketch to the day you move back in. Lagos, Nigeria."
	/>
</svelte:head>

<!-- `dark-bg` earns the hero its white CTA outline via the on-dark: variant —
     the photograph reads as a dark ground even though no colour is set here. -->
<section class="dark-bg relative flex min-h-svh items-end overflow-hidden bg-jbc-black">
	<img
		class="absolute inset-0 h-full w-full object-cover"
		src={img(HERO, 1920, { ratio: 16 / 10 })}
		srcset={srcset(HERO, { ratio: 16 / 10 })}
		sizes="100vw"
		alt="A daylit living room with built-in timber storage and a low solid-wood table"
		width="1920"
		height="1200"
		fetchpriority="high"
		decoding="async"
	/>
	<!-- Scrim: the headline and the header lockup both need this to stay legible. -->
	<div class="scrim-hero" aria-hidden="true"></div>

	<div class="relative shell pb-20 text-jbc-white lg:pb-28">
		<p class="eyebrow text-jbc-white-70">Interior design &amp; furniture · Lagos</p>
		<h1 class="mt-6 max-w-[16ch] text-hero font-bold tracking-jbc-tight">
			Interiors we design.<br />Furniture we build.
		</h1>
		<p class="mt-7 max-w-[46ch] text-body-lg leading-[1.65] text-jbc-white-70">
			Most studios draw a room and then go shopping. We draw the room, then make the pieces that fit
			it — in our own workshop, to the millimetre.
		</p>
		<div class="mt-10">
			<CTAButton href="/portfolio" variant="outline" size="lg">See the work</CTAButton>
		</div>
	</div>
</section>

<section class="py-section lg:py-section-lg">
	<!-- Two columns from lg: the eyebrow and quote stack in column one, the body
	     fills column two — pulled level with the quote, not the eyebrow. Placed
	     by explicit row/column rather than named areas, which Tailwind cannot
	     express without dropping to arbitrary properties. -->
	<div class="shell lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-x-20">
		<FadeUp class="lg:col-start-1 lg:row-start-1">
			<p class="eyebrow text-jbc-black-50">Who we are</p>
		</FadeUp>
		<FadeUp index={1} class="lg:col-start-1 lg:row-start-2">
			<blockquote
				class="mt-7 max-w-[20ch] text-h1 leading-[1.08] font-bold tracking-jbc-snug
				       lg:mt-4 lg:text-[3.25rem]"
			>
				A room is finished when nothing in it is a compromise.
			</blockquote>
		</FadeUp>
		<FadeUp index={2} class="lg:col-start-2 lg:row-span-2 lg:row-start-1">
			<p class="mt-6 max-w-[52ch] text-body-lg text-jbc-black-70">
				JBC is an interior design studio with a furniture workshop attached. That second half is the
				part that changes things: when the alcove is an awkward width, we do not hunt for a bookcase
				that nearly fits — we build one that does.
			</p>
			<p class="mt-6 max-w-[52ch] text-body-lg text-jbc-black-70">
				We work on homes and offices across Lagos, on projects that run from a single stalled
				renovation to a full floor plate. One team carries it from the first sketch to the day you
				move back in.
			</p>
			<CTAButton href="/about" variant="outline" class="mt-9">More about JBC</CTAButton>
		</FadeUp>
	</div>
</section>

<section class="pb-section lg:pb-section-lg">
	<div class="shell">
		<FadeUp class="max-w-[30ch]">
			<p class="eyebrow text-jbc-black-50">Selected work</p>
			<h2 class={SECTION_TITLE}>Three rooms that had a problem first.</h2>
		</FadeUp>
	</div>

	<!-- Pair: one tall, one square, offset. The offset is the whole point —
	     a uniform 3-up would read as a template. -->
	<div class="shell mt-12 grid gap-14 lg:mt-18 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-16">
		{#each pair as project, i (project.slug)}
			<FadeUp index={i} class={[i === 1 && 'lg:mt-28']}>
				<ProjectCard {project} sizes="(min-width: 64rem) 42vw, 100vw" />
			</FadeUp>
		{/each}
	</div>

	<!-- Breakout: the image runs full-viewport, out of the content column
	     entirely, but its caption returns to the column via `metaClass` so the
	     text still lines up with everything above it. -->
	<FadeUp class="mt-16 lg:mt-28">
		<ProjectCard project={breakout} sizes="100vw" metaClass="shell" />
	</FadeUp>

	<div class="shell mt-14">
		<FadeUp>
			<CTAButton href="/portfolio" variant="outline">View all work</CTAButton>
		</FadeUp>
	</div>
</section>

<section class="border-t border-jbc-black-15 py-section lg:py-section-lg">
	<div class="shell">
		<FadeUp class="max-w-[32ch]">
			<p class="eyebrow text-jbc-black-50">What we do</p>
			<h2 class={SECTION_TITLE}>Five services, one team.</h2>
		</FadeUp>

		<ul class="mt-12">
			{#each services as service, i (service.slug)}
				<FadeUp as="li" index={i} class="border-t border-jbc-black-15 last:border-b">
					<a
						class="group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 py-7 text-inherit
						       no-underline lg:gap-12 lg:py-9"
						href="/services#{service.slug}"
					>
						<span
							class="eyebrow text-jbc-black-50 transition-colors duration-400 ease-out-brand
							       group-hover:text-jbc-red"
						>
							{String(i + 1).padStart(2, '0')}
						</span>
						<span class="grid gap-2 lg:grid-cols-[18rem_1fr] lg:items-baseline lg:gap-8">
							<span class="text-[1.375rem] leading-[1.2] font-semibold">{service.title}</span>
							<span class="max-w-[54ch] text-body leading-[1.6] text-jbc-black-70"
								>{service.summary}</span
							>
						</span>
						<span
							class="self-center text-jbc-black-50 transition-[color,transform] duration-400
							       ease-out-brand group-hover:translate-x-1.5 group-hover:text-jbc-red
							       motion-reduce:group-hover:translate-x-0"
							aria-hidden="true">→</span
						>
					</a>
				</FadeUp>
			{/each}
		</ul>
	</div>
</section>

<!-- Solid Maximum Red: the footer already owns the dark ground + skyline
     treatment, so the CTA takes the one saturated surface on the site. -->
<section class="relative overflow-hidden bg-jbc-red text-jbc-white">
	<div class="relative shell py-section lg:py-section-lg">
		<FadeUp>
			<!-- On red, the white opacity tints go muddy rather than quiet, so the
			     secondary type holds full white and steps down in weight instead. -->
			<p class="eyebrow text-jbc-white">Start a project</p>
			<h2
				class="mt-5 max-w-[18ch] text-h1 leading-[1.08] font-bold tracking-jbc-snug lg:text-[3.5rem]"
			>
				Tell us what the room is doing wrong.
			</h2>
			<p class="mt-6 max-w-[50ch] text-body-lg text-jbc-white">
				Send us the space, the budget band you are working to, and what is not working. We will tell
				you honestly whether we are the right studio for it.
			</p>
			<CTAButton href="/contact" variant="invert" size="lg" class="mt-10">Talk to JBC</CTAButton>
		</FadeUp>
	</div>
</section>
