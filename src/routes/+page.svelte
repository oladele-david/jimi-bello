<script lang="ts">
	/**
	 * Home page for JimiBello & Co.
	 * Incorporates brand identity: Ivory grounds, Ember accents, Obsidian darks,
	 * JB Monogram watermark, and high image density.
	 */
	import { img, srcset } from '$lib/images';
	import { brandTagline, services, projects as defaultProjects } from '$lib/data/site';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import Preloader from '$lib/components/Preloader.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	let { data } = $props();

	const HERO = 'pages/home-hero';

	let allProjects = $derived(data?.projects && data.projects.length > 0 ? data.projects : defaultProjects);

	let pair = $derived.by(() => {
		const found = allProjects.filter((p) => ['ikoyi-residence', 'four-poster-series'].includes(p.slug));
		return found.length >= 2 ? found.slice(0, 2) : allProjects.slice(0, 2);
	});

	let breakout = $derived.by(() => {
		const found = allProjects.find((p) => p.slug === 'victoria-island-studio') || allProjects.find((p) => p.shape === 'wide');
		return found || allProjects[2] || allProjects[0];
	});

	const SECTION_TITLE = 'mt-4 text-h2 font-display font-semibold lg:text-h2-lg text-jbc-obsidian';
</script>

<svelte:head>
	<title>JimiBello &amp; Co. | Living Through Design — Interior Architecture &amp; Handcrafted Furniture</title>
	<meta
		name="description"
		content="{brandTagline} JimiBello & Co. designs interiors for homes and offices and builds bespoke furniture in our Lagos workshop."
	/>
</svelte:head>

<Preloader />

<!-- Hero Section -->
<section class="dark-bg relative flex min-h-svh flex-col justify-end overflow-hidden bg-jbc-obsidian pt-28 pb-16 lg:pt-36 lg:pb-24">
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
	<div class="scrim-hero" aria-hidden="true"></div>

	<div class="relative shell text-jbc-white">
		<p class="eyebrow text-jbc-white/80 font-semibold tracking-jbc-caps uppercase">{brandTagline}</p>
		<h1 class="mt-4 max-w-[18ch] text-hero font-display font-bold tracking-jbc-tight">
			Interiors We Design.<br />Furniture We Build.
		</h1>
		<p class="mt-5 max-w-[54ch] text-body lg:text-body-lg leading-[1.65] text-jbc-white/80">
			Our approach brings interior design and furniture making together from the start. We create spaces around how they need to function, then craft bespoke pieces that fit the vision, the proportions, and the people who will live with them.
		</p>
		<div class="mt-8">
			<CTAButton href="/portfolio" variant="primary" size="lg">Our Portfolio &rarr;</CTAButton>
		</div>
	</div>
</section>

<!-- Who We Are (Ivory Ground with Image Density + Watermark) -->
<section class="relative overflow-hidden bg-jbc-ivory py-[var(--spacing-section)] lg:py-[var(--spacing-section-lg)]">
	<!-- JB Monogram Watermark (Page 40 Brand Book style) -->
	<img
		src="/logos/monogram-ember.svg"
		aria-hidden="true"
		class="pointer-events-none absolute -right-[10%] top-1/2 -translate-y-1/2 w-[42vw] max-w-[550px] opacity-[0.06] select-none"
		alt=""
	/>

	<div class="relative shell">
		<div class="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
			<!-- Image Column: increases visual density -->
			<FadeUp class="lg:col-span-5">
				<div class="relative aspect-[4/5] overflow-hidden bg-jbc-obsidian/10 shadow-md">
					<img
						src={img('projects/ikoyi-residence/01', { w: 900, q: 85 })}
						alt="Curated interior living space by JimiBello & Co."
						class="h-full w-full object-cover"
						loading="lazy"
					/>
					<div class="absolute bottom-4 left-4 bg-jbc-obsidian/85 px-3 py-1 text-eyebrow text-jbc-white backdrop-blur-sm">
						Ikoyi Residence
					</div>
				</div>
			</FadeUp>

			<!-- Content Column -->
			<div class="lg:col-span-7">
				<FadeUp>
					<p class="eyebrow text-jbc-ember font-semibold">Who we are</p>
					<blockquote
						class="mt-4 max-w-[22ch] text-h1 font-display leading-[1.12] font-bold tracking-jbc-snug text-jbc-obsidian lg:text-[2.75rem]"
					>
						We don't design for the space alone. We design for the life within it.
					</blockquote>
				</FadeUp>

				<FadeUp index={1} class="mt-6">
					<p class="text-body-lg text-jbc-obsidian/80 leading-[1.7]">
						At Jimi Bello Co., we combine full-service interior design with our own custom furniture workshop. It’s a distinction that changes everything. Instead of searching for pre-made pieces that almost fit your space, we design and build furniture that fits it perfectly.
					</p>
					<p class="mt-4 text-body-lg text-jbc-obsidian/80 leading-[1.7]">
						From residential homes to sprawling corporate offices across Lagos, we manage projects of every scale. Whether revitalizing a stalled renovation or executing a full floor-plate design, our team handles the entire process from concept to completion.
					</p>
					<div class="mt-8">
						<CTAButton href="/about" variant="outline">More About JBC</CTAButton>
					</div>
				</FadeUp>
			</div>
		</div>
	</div>
</section>

<!-- Selected Work (Ivory Ground with Left Mirrored Watermark) -->
<section class="relative overflow-hidden bg-jbc-ivory border-t border-jbc-obsidian/10 pb-[var(--spacing-section)] lg:pb-[var(--spacing-section-lg)] pt-12 lg:pt-16">
	<!-- Left Watermark -->
	<img
		src="/logos/monogram-ember.svg"
		aria-hidden="true"
		class="pointer-events-none absolute -left-[10%] top-1/3 -translate-y-1/2 w-[40vw] max-w-[500px] opacity-[0.05] select-none -scale-x-100"
		alt=""
	/>

	<div class="relative shell">
		<FadeUp class="max-w-[34ch]">
			<p class="eyebrow text-jbc-ember font-semibold">Selected work</p>
			<h2 class={SECTION_TITLE}>Three spaces, brought to life through design.</h2>
			<p class="mt-3 text-body text-jbc-slate">
				A curated selection of residential spaces, commercial environments, and bespoke workshop pieces.
			</p>
		</FadeUp>
	</div>

	<!-- Pair: one tall, one square, offset -->
	<div class="relative shell mt-12 grid gap-14 lg:mt-16 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-16">
		{#each pair as project, i (project.slug)}
			<FadeUp index={i} class={[i === 1 && 'lg:mt-24']}>
				<ProjectCard {project} sizes="(min-width: 64rem) 42vw, 100vw" />
			</FadeUp>
		{/each}
	</div>

	<!-- Breakout -->
	<FadeUp class="relative mt-16 lg:mt-24">
		<ProjectCard project={breakout} sizes="100vw" metaClass="shell" />
	</FadeUp>

	<div class="relative shell mt-12 text-center lg:text-left">
		<FadeUp>
			<CTAButton href="/portfolio" variant="outline">View All Projects &rarr;</CTAButton>
		</FadeUp>
	</div>
</section>

<!-- What We Do / Services Teaser (Ivory Ground) -->
<section class="relative overflow-hidden bg-jbc-ivory border-t border-jbc-obsidian/10 py-[var(--spacing-section)] lg:py-[var(--spacing-section-lg)]">
	<div class="relative shell">
		<FadeUp class="max-w-[32ch]">
			<p class="eyebrow text-jbc-ember font-semibold">What we do</p>
			<h2 class={SECTION_TITLE}>Five services, one team throughout.</h2>
		</FadeUp>

		<ul class="mt-12">
			{#each services as service, i (service.slug)}
				<FadeUp as="li" index={i} class="border-t border-jbc-obsidian/15 last:border-b">
					<a
						class="group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 py-7 text-inherit
						       no-underline lg:gap-12 lg:py-8 transition-colors duration-300 hover:bg-jbc-obsidian/[0.02]"
						href="/services#{service.slug}"
					>
						<span
							class="eyebrow text-jbc-obsidian/50 transition-colors duration-400 ease-out-brand
							       group-hover:text-jbc-ember font-mono"
						>
							{String(i + 1).padStart(2, '0')}
						</span>
						<span class="grid gap-2 lg:grid-cols-[18rem_1fr] lg:items-baseline lg:gap-8">
							<span class="text-[1.375rem] font-display leading-[1.2] font-semibold text-jbc-obsidian group-hover:text-jbc-ember transition-colors duration-300">
								{service.title}
							</span>
							<span class="max-w-[54ch] text-body leading-[1.6] text-jbc-obsidian/75"
								>{service.summary}</span
							>
						</span>
						<span
							class="self-center text-jbc-obsidian/40 transition-[color,transform] duration-400
							       ease-out-brand group-hover:translate-x-1.5 group-hover:text-jbc-ember
							       motion-reduce:group-hover:translate-x-0"
							aria-hidden="true">→</span
						>
					</a>
				</FadeUp>
			{/each}
		</ul>
	</div>
</section>

<!-- Call to Action Band (Ember Ground) -->
<section class="relative overflow-hidden bg-jbc-ember text-jbc-white">
	<div class="relative shell py-[var(--spacing-section)] lg:py-[var(--spacing-section-lg)]">
		<FadeUp>
			<p class="eyebrow text-jbc-white font-semibold uppercase tracking-jbc-caps">Begin Your Project</p>
			<h2
				class="mt-4 max-w-[20ch] text-h1 font-display leading-[1.08] font-bold tracking-jbc-snug lg:text-[3.25rem]"
			>
				Every exceptional space begins with a considered idea.
			</h2>
			<p class="mt-6 max-w-[56ch] text-body-lg text-jbc-white/90 leading-[1.7]">
				Tell us about your space, your vision, and your investment range. We’ll take the time to understand your needs, assess your project and transform your ideas into a thoughtfully designed space, shaped around how you live, work, and experience it.
			</p>
			<div class="mt-9">
				<CTAButton href="/contact" variant="primary" size="lg" class="bg-jbc-obsidian text-jbc-white hover:bg-jbc-obsidian/90">
					Book a Consultation.
				</CTAButton>
			</div>
		</FadeUp>
	</div>
</section>
