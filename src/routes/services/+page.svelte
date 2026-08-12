<script lang="ts">
	/**
	 * Services. Alternating full-width image/text rows, one per service.
	 *
	 * Furniture Design carries `feature: true` and gets a different treatment
	 * entirely — full-bleed, on Dark Liver, with its points listed out. It is
	 * the capability that separates JBC from a studio that specifies and buys,
	 * so it is not allowed to sit as row four of five.
	 */
	import { img, srcset } from '$lib/images';
	import { services } from '$lib/data/site';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import Skyline from '$lib/components/Skyline.svelte';

	const standard = services.filter((s) => !s.feature);
	const feature = services.find((s) => s.feature);

	/**
	 * Red rule as the list marker — the accent at its smallest useful size.
	 * A `before:` pseudo-element rather than a ::marker, which cannot be given
	 * a width, and rather than an inline <span>, which a screen reader would
	 * have to skip past on every bullet.
	 */
	const RULE_ITEM =
		'relative pl-6 text-body leading-[1.5] text-jbc-black-70 ' +
		"before:absolute before:top-[0.7em] before:left-0 before:h-[1.5px] before:w-3 before:bg-jbc-red before:content-['']";
</script>

<svelte:head>
	<title>Services — JBC | Jimibello &amp; Co.</title>
	<meta
		name="description"
		content="Residential and commercial interiors, space planning, made-to-measure furniture design, and renovation consultation — from JBC in Lagos."
	/>
</svelte:head>

<section class="dark-bg relative overflow-hidden bg-jbc-black text-jbc-white">
	<div class="pointer-events-none absolute inset-x-0 bottom-0 h-[90%]" aria-hidden="true">
		<Skyline theme="dark" opacity={0.22} />
	</div>
	<!-- Top padding clears the fixed header. -->
	<div class="relative shell pt-36 pb-20 lg:pt-48 lg:pb-28">
		<p class="eyebrow text-jbc-red">Services</p>
		<h1 class="mt-5 max-w-[16ch] text-h1 font-bold tracking-jbc-tight lg:text-h1-lg">
			Five ways in. One team throughout.
		</h1>
		<p class="mt-7 max-w-[52ch] text-body-lg text-jbc-white-70">
			Take the whole project or take one piece of it. The consultation stands on its own, the space
			planning stands on its own, and the workshop will build for a room we did not design.
		</p>
	</div>
</section>

{#each standard as service, i (service.slug)}
	<!-- Anchored from the home services teaser; scroll-mt clears the fixed header. -->
	<section
		class="scroll-mt-20 border-b border-jbc-black-15 py-section lg:py-section-lg"
		id={service.slug}
	>
		<div class="shell lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-20">
			<!-- Odd rows put the photograph on the right. Order, not direction, so the
			     DOM sequence still reads image-then-text for a screen reader. -->
			<FadeUp class={[i % 2 === 1 && 'lg:order-2']}>
				<img
					class="block h-auto w-full bg-jbc-black-15"
					src={img(service.image, 1024, { ratio: 4 / 3 })}
					srcset={srcset(service.image, { ratio: 4 / 3 })}
					sizes="(min-width: 64rem) 50vw, 100vw"
					alt={service.title}
					width="1024"
					height="768"
					loading={i === 0 ? 'eager' : 'lazy'}
					decoding="async"
				/>
			</FadeUp>

			<FadeUp index={1} class="mt-8 lg:mt-0">
				<p class="eyebrow text-jbc-red">{String(i + 1).padStart(2, '0')}</p>
				<h2 class="mt-4 text-h2 font-semibold lg:text-h2-lg">{service.title}</h2>
				<p class="mt-5 max-w-[42ch] text-body-lg leading-[1.5] font-semibold">{service.summary}</p>
				<p class="mt-5 max-w-[54ch] text-body leading-[1.75] text-jbc-black-70">{service.detail}</p>
				<ul class="mt-8 grid gap-3">
					{#each service.points as point (point)}
						<li class={RULE_ITEM}>{point}</li>
					{/each}
				</ul>
			</FadeUp>
		</div>
	</section>
{/each}

{#if feature}
	<section
		class="dark-bg relative scroll-mt-20 overflow-hidden bg-jbc-black text-jbc-white"
		id={feature.slug}
	>
		<div class="absolute inset-0">
			<img
				class="h-full w-full object-cover"
				src={img(feature.image, 1920, { ratio: 21 / 9 })}
				srcset={srcset(feature.image, { ratio: 21 / 9 })}
				sizes="100vw"
				alt={feature.title}
				width="1920"
				height="823"
				loading="lazy"
				decoding="async"
			/>
			<div class="scrim-feature" aria-hidden="true"></div>
		</div>

		<div
			class="relative shell grid gap-12 py-section lg:grid-cols-[1.25fr_1fr] lg:items-start
			       lg:gap-x-20 lg:py-section-lg"
		>
			<FadeUp>
				<p class="eyebrow text-jbc-red">Our workshop</p>
				<h2 class="mt-5 text-h1 font-bold tracking-jbc-tight lg:text-[3.5rem]">{feature.title}</h2>
				<p class="mt-6 max-w-[46ch] text-body-lg leading-[1.55] font-semibold">{feature.summary}</p>
				<p class="mt-5 max-w-[56ch] text-body leading-[1.8] text-jbc-white-70">{feature.detail}</p>
			</FadeUp>

			<FadeUp index={1}>
				<ul class="grid gap-5">
					{#each feature.points as point, p (point)}
						<li
							class="grid grid-cols-[auto_1fr] gap-4 border-t border-jbc-white-15 pt-5 text-body
							       leading-[1.5]"
						>
							<span
								class="text-eyebrow font-semibold tracking-jbc-caps text-jbc-red"
								aria-hidden="true">{String(p + 1).padStart(2, '0')}</span
							>
							<span>{point}</span>
						</li>
					{/each}
				</ul>
				<CTAButton href="/portfolio" variant="outline" class="mt-10">
					See pieces we have built
				</CTAButton>
			</FadeUp>
		</div>
	</section>
{/if}

<section class="py-section lg:py-section-lg">
	<div class="shell">
		<FadeUp>
			<h2 class="max-w-[18ch] text-h2 leading-[1.12] font-bold lg:text-h2-lg">
				Not sure which of these you need?
			</h2>
			<p class="mt-6 max-w-[52ch] text-body-lg leading-[1.75] text-jbc-black-70">
				Most projects start as one thing and turn out to be another. Describe the space and we will
				tell you which service actually fits — including when the answer is none of them.
			</p>
			<CTAButton href="/contact" size="lg" class="mt-9">Talk to JBC</CTAButton>
		</FadeUp>
	</div>
</section>
