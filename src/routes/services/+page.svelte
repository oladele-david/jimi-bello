<script lang="ts">
	/**
	 * Services — JimiBello & Co.
	 * Updated with brand identity: Ivory grounds, Ember accents, Obsidian darks,
	 * JB Monogram watermark, and high image density.
	 */
	import { img, srcset } from '$lib/images';
	import { services } from '$lib/data/site';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';

	const standard = services.filter((s) => !s.feature);
	const feature = services.find((s) => s.feature);
	const HERO = 'pages/about-hero';

	const RULE_ITEM =
		'relative pl-6 text-body leading-[1.5] text-jbc-obsidian/80 ' +
		"before:absolute before:top-[0.7em] before:left-0 before:h-[1.5px] before:w-3 before:bg-jbc-ember before:content-['']";
</script>

<svelte:head>
	<title>Services — JimiBello &amp; Co. | Living Through Design</title>
	<meta
		name="description"
		content="Residential and commercial interiors, space planning, bespoke furniture design, and renovation consultation from JimiBello & Co. in Lagos."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="dark-bg relative flex min-h-[68svh] flex-col justify-end overflow-hidden bg-jbc-obsidian pt-28 pb-16 lg:pt-36 lg:pb-22">
	<img
		class="absolute inset-0 h-full w-full object-cover"
		src={img(HERO, 1920, { ratio: 16 / 9 })}
		srcset={srcset(HERO, { ratio: 16 / 9 })}
		sizes="100vw"
		alt="The JimiBello & Co. studio floor with architectural drawings"
		width="1920"
		height="1080"
		fetchpriority="high"
		decoding="async"
	/>
	<div class="scrim-page" aria-hidden="true"></div>
	<div class="relative shell pb-16 text-jbc-white lg:pb-22">
		<p class="eyebrow text-jbc-ember font-semibold uppercase">Our Expertise</p>
		<h1 class="mt-4 max-w-[18ch] text-h1 font-display font-bold tracking-jbc-tight text-jbc-white lg:text-[4.25rem]">
			Five ways in. A dedicated team throughout.
		</h1>
	</div>
</section>

<!-- Standard Services Rows (Ivory Ground + Watermarks) -->
{#each standard as service, i (service.slug)}
	<section
		class="relative overflow-hidden scroll-mt-20 border-b border-jbc-obsidian/10 bg-jbc-ivory py-[var(--spacing-section)] lg:py-[var(--spacing-section-lg)]"
		id={service.slug}
	>
		<!-- Watermark on alternating sides -->
		{#if i % 2 === 0}
			<img
				src="/logos/monogram-ember.svg"
				aria-hidden="true"
				class="pointer-events-none absolute -right-[8%] top-1/2 -translate-y-1/2 w-[36vw] max-w-[480px] opacity-[0.05] select-none"
				alt=""
			/>
		{:else}
			<img
				src="/logos/monogram-ember.svg"
				aria-hidden="true"
				class="pointer-events-none absolute -left-[8%] top-1/2 -translate-y-1/2 w-[36vw] max-w-[480px] opacity-[0.05] select-none -scale-x-100"
				alt=""
			/>
		{/if}

		<div class="relative shell lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-20">
			<!-- Image Column -->
			<FadeUp class={[i % 2 === 1 && 'lg:order-2']}>
				<div class="relative aspect-[4/3] overflow-hidden bg-jbc-obsidian/10 shadow-sm">
					<img
						class="h-full w-full object-cover"
						src={img(service.image, 1024, { ratio: 4 / 3 })}
						srcset={srcset(service.image, { ratio: 4 / 3 })}
						sizes="(min-width: 64rem) 50vw, 100vw"
						alt={service.title}
						width="1024"
						height="768"
						loading={i === 0 ? 'eager' : 'lazy'}
						decoding="async"
					/>
				</div>
			</FadeUp>

			<!-- Content Column -->
			<FadeUp index={1} class="mt-8 lg:mt-0">
				<p class="eyebrow text-jbc-ember font-mono font-semibold">{String(i + 1).padStart(2, '0')}</p>
				<h2 class="mt-3 text-h2 font-display font-semibold lg:text-h2-lg text-jbc-obsidian">{service.title}</h2>
				<p class="mt-4 max-w-[44ch] text-body-lg leading-[1.55] font-semibold text-jbc-obsidian">{service.summary}</p>
				<p class="mt-4 max-w-[54ch] text-body leading-[1.75] text-jbc-obsidian/80">{service.detail}</p>
				<ul class="mt-7 grid gap-3">
					{#each service.points as point (point)}
						<li class={RULE_ITEM}>{point}</li>
					{/each}
				</ul>
				<div class="mt-8">
					<CTAButton href="/contact?subject={encodeURIComponent(`Enquiry: ${service.title}`)}" variant="outline">
						Consult on {service.title}
					</CTAButton>
				</div>
			</FadeUp>
		</div>
	</section>
{/each}

<!-- Feature Service (Obsidian Dark Ground — Furniture Design Workshop) -->
{#if feature}
	<section
		class="dark-bg relative scroll-mt-20 overflow-hidden bg-jbc-obsidian text-jbc-white"
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
			class="relative shell grid gap-12 py-[var(--spacing-section)] lg:grid-cols-[1.25fr_1fr] lg:items-start
			       lg:gap-x-20 lg:py-[var(--spacing-section-lg)]"
		>
			<FadeUp>
				<p class="eyebrow text-jbc-ember font-semibold uppercase">Our Dedicated Workshop</p>
				<h2 class="mt-4 text-h1 font-display font-bold tracking-jbc-tight text-jbc-white lg:text-[3.25rem]">{feature.title}</h2>
				<p class="mt-5 max-w-[46ch] text-body-lg leading-[1.55] font-semibold text-jbc-white">{feature.summary}</p>
				<p class="mt-4 max-w-[56ch] text-body leading-[1.8] text-jbc-white/80">{feature.detail}</p>
			</FadeUp>

			<FadeUp index={1}>
				<ul class="grid gap-5">
					{#each feature.points as point, p (point)}
						<li
							class="grid grid-cols-[auto_1fr] gap-4 border-t border-jbc-white-15 pt-5 text-body
							       leading-[1.5] text-jbc-white/90"
						>
							<span
								class="text-eyebrow font-semibold font-mono tracking-jbc-caps text-jbc-ember"
								aria-hidden="true">{String(p + 1).padStart(2, '0')}</span
							>
							<span>{point}</span>
						</li>
					{/each}
				</ul>
				<div class="mt-9 flex flex-wrap gap-4">
					<CTAButton href="/products" variant="primary">
						View Workshop Products
					</CTAButton>
					<CTAButton href="/contact?subject=Custom%20Furniture%20Design" variant="outline">
						Commission a Custom Piece
					</CTAButton>
				</div>
			</FadeUp>
		</div>
	</section>
{/if}

<!-- Bottom Consultation Section (Ivory Ground) -->
<section class="relative overflow-hidden bg-jbc-ivory py-[var(--spacing-section)] lg:py-[var(--spacing-section-lg)]">
	<img
		src="/logos/monogram-ember.svg"
		aria-hidden="true"
		class="pointer-events-none absolute -right-[8%] top-1/2 -translate-y-1/2 w-[38vw] max-w-[500px] opacity-[0.05] select-none"
		alt=""
	/>

	<div class="relative shell">
		<FadeUp>
			<span class="eyebrow text-jbc-ember font-semibold">Ready to Begin?</span>
			<h2 class="mt-3 max-w-[20ch] text-h2 font-display leading-[1.15] font-bold text-jbc-obsidian lg:text-h2-lg">
				Not sure which of these you need?
			</h2>
			<p class="mt-5 max-w-[52ch] text-body-lg leading-[1.75] text-jbc-obsidian/80">
				Most projects start as one thing and turn out to be another. Describe your space and we will tell you honestly which service or approach fits your goals best.
			</p>
			<div class="mt-8">
				<CTAButton href="/contact" size="lg">
					Book a Consultation &rarr;
				</CTAButton>
			</div>
		</FadeUp>
	</div>
</section>
