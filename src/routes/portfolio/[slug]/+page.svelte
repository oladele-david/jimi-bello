<script lang="ts">
	/**
	 * Project detail: full-bleed hero, facts column beside narrative, then gallery.
	 * Updated with brand identity: Ivory grounds, Ember accents, Obsidian darks,
	 * JB Monogram watermark, and high image density.
	 */
	import { page } from '$app/state';
	import { img, srcset } from '$lib/images';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let project = $derived(data.project);
	let next = $derived(data.next);

	let ogImage = $derived(new URL(img(project.hero, 1200), page.url.origin).href);

	let facts = $derived([
		{ label: 'Category', value: project.category },
		{ label: 'Year', value: project.year },
		{ label: 'Location', value: project.location },
		{ label: 'Scope', value: project.scope }
	]);

	const PROSE = 'mt-6 max-w-[62ch] text-body-lg leading-[1.8] text-jbc-obsidian/80';
</script>

<svelte:head>
	<title>{project.title} — JimiBello &amp; Co. | Living Through Design</title>
	<meta name="description" content={project.excerpt} />
	<meta property="og:title" content="{project.title} — JimiBello & Co." />
	<meta property="og:description" content={project.excerpt} />
	<meta property="og:image" content={ogImage} />
</svelte:head>

<article class="bg-jbc-ivory">
	<!-- Project Hero -->
	<header class="dark-bg relative flex min-h-[78svh] flex-col justify-end overflow-hidden bg-jbc-obsidian pt-28 pb-16 lg:pt-36 lg:pb-24">
		<img
			class="absolute inset-0 h-full w-full object-cover"
			src={img(project.hero, 1920, { ratio: 16 / 9 })}
			srcset={srcset(project.hero, { ratio: 16 / 9 })}
			sizes="100vw"
			alt={project.title}
			width="1920"
			height="1080"
			fetchpriority="high"
			decoding="async"
		/>
		<div class="scrim-project" aria-hidden="true"></div>

		<div class="relative shell pb-16 text-jbc-white lg:pb-24">
			<p class="eyebrow text-jbc-ember font-semibold uppercase">{project.category} · {project.year}</p>
			<h1 class="mt-4 max-w-[16ch] text-h1 font-display font-bold tracking-jbc-tight lg:text-[4.25rem]">
				{project.title}
			</h1>
		</div>
	</header>

	<!-- Project Narrative & Facts (Ivory Ground + Watermark) -->
	<section class="relative overflow-hidden bg-jbc-ivory py-[var(--spacing-section)] lg:py-[var(--spacing-section-lg)]">
		<!-- Watermark on right edge -->
		<img
			src="/logos/monogram-ember.svg"
			aria-hidden="true"
			class="pointer-events-none absolute -right-[10%] top-1/2 -translate-y-1/2 w-[42vw] max-w-[550px] opacity-[0.05] select-none"
			alt=""
		/>

		<div class="relative shell lg:grid lg:grid-cols-[18rem_1fr] lg:items-start lg:gap-x-20">
			<FadeUp>
				<dl class="grid gap-6 border-l-2 border-jbc-ember pl-6">
					{#each facts as fact (fact.label)}
						<div>
							<dt class="eyebrow text-jbc-slate">{fact.label}</dt>
							<dd class="mt-1 text-body font-medium text-jbc-obsidian leading-[1.55]">{fact.value}</dd>
						</div>
					{/each}
				</dl>
			</FadeUp>

			<FadeUp index={1} class="mt-12 lg:mt-0">
				<p class="max-w-[34ch] text-h2 font-display leading-[1.3] font-semibold text-jbc-obsidian lg:text-[2rem]">
					{project.excerpt}
				</p>
				{#each project.body as paragraph, i (i)}
					<p class={PROSE}>{paragraph}</p>
				{/each}
			</FadeUp>
		</div>
	</section>

	<!-- Gallery (Ivory Ground + Left Watermark) -->
	{#if project.gallery.length > 0}
		<section class="relative overflow-hidden bg-jbc-ivory pb-[var(--spacing-section)] lg:pb-[var(--spacing-section-lg)]">
			<img
				src="/logos/monogram-ember.svg"
				aria-hidden="true"
				class="pointer-events-none absolute -left-[10%] top-1/3 -translate-y-1/2 w-[40vw] max-w-[500px] opacity-[0.04] select-none -scale-x-100"
				alt=""
			/>

			<div class="relative shell">
				<ul class="grid gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-20">
					{#each project.gallery as shot, i (shot.id)}
						{@const wide = i % 3 === 0}
						<FadeUp as="li" index={i} class={[wide && 'lg:col-span-2']}>
							<figure class="overflow-hidden bg-jbc-obsidian/10 shadow-sm">
								<img
									class="block h-auto w-full object-cover"
									src={img(shot.id, wide ? 1440 : 1024, { ratio: wide ? 16 / 9 : 4 / 3 })}
									srcset={srcset(shot.id, { ratio: wide ? 16 / 9 : 4 / 3 })}
									sizes={wide
										? '(min-width: 64rem) 84rem, 100vw'
										: '(min-width: 64rem) 42vw, 100vw'}
									alt={shot.caption}
									width={wide ? 1440 : 1024}
									height={wide ? 810 : 768}
									loading="lazy"
									decoding="async"
								/>
								<figcaption class="p-4 text-sm leading-[1.5] text-jbc-slate bg-jbc-ivory">
									{shot.caption}
								</figcaption>
							</figure>
						</FadeUp>
					{/each}
				</ul>
			</div>
		</section>
	{/if}

	<!-- Next Project Navigation (Obsidian Ground) -->
	<nav
		class="dark-bg relative overflow-hidden bg-jbc-obsidian text-jbc-white"
		aria-label="Next project"
	>
		<img
			class="absolute inset-0 h-full w-full object-cover opacity-60"
			src={img(next.hero, 1920, { ratio: 21 / 9 })}
			srcset={srcset(next.hero, { ratio: 21 / 9 })}
			sizes="100vw"
			alt=""
			width="1920"
			height="823"
			loading="lazy"
			decoding="async"
		/>
		<div class="scrim-next" aria-hidden="true"></div>

		<div class="relative shell py-[var(--spacing-section)] lg:py-[var(--spacing-section-lg)]">
			<p class="eyebrow text-jbc-ember font-semibold uppercase">Next Project</p>
			<a
				class="mt-4 inline-block max-w-[18ch] text-h1 font-display font-bold tracking-jbc-tight text-jbc-white
				       no-underline transition-colors duration-[350ms] ease-out-brand hover:text-jbc-ember
				       lg:text-[3.75rem]"
				href="/portfolio/{next.slug}">{next.title}</a
			>
			<div class="mt-8">
				<CTAButton href="/portfolio" variant="outline">Back to All Projects</CTAButton>
			</div>
		</div>
	</nav>
</article>
