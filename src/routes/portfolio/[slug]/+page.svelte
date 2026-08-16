<script lang="ts">
	/**
	 * Project detail: full-bleed hero, a facts column beside the narrative, then
	 * the gallery. Gallery images alternate between full-width and paired so the
	 * page keeps the asymmetry of the index rather than settling into a strip.
	 */
	import { page } from '$app/state';
	import { img, srcset } from '$lib/images';
	import CTAButton from '$lib/components/CTAButton.svelte';
	import FadeUp from '$lib/components/FadeUp.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let project = $derived(data.project);
	let next = $derived(data.next);

	/** Crawlers reject relative og:image paths, so resolve against the request origin. */
	let ogImage = $derived(new URL(img(project.hero, 1200), page.url.origin).href);

	let facts = $derived([
		{ label: 'Category', value: project.category },
		{ label: 'Year', value: project.year },
		{ label: 'Location', value: project.location },
		{ label: 'Scope', value: project.scope }
	]);

	/** Narrative paragraphs. The excerpt above them is set larger and separately. */
	const PROSE = 'mt-6 max-w-[62ch] text-body-lg leading-[1.8] text-jbc-black-70';
</script>

<svelte:head>
	<title>{project.title} — JBC | Jimibello &amp; Co.</title>
	<meta name="description" content={project.excerpt} />
	<meta property="og:title" content="{project.title} — JBC" />
	<meta property="og:description" content={project.excerpt} />
	<meta property="og:image" content={ogImage} />
</svelte:head>

<article>
	<header class="relative flex min-h-[78svh] items-end overflow-hidden bg-jbc-black">
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
			<p class="eyebrow text-jbc-white-70">{project.category} · {project.year}</p>
			<h1 class="mt-5 max-w-[16ch] text-h1 font-bold tracking-jbc-tight lg:text-[4.5rem]">
				{project.title}
			</h1>
		</div>
	</header>

	<section class="py-section lg:py-section-lg">
		<div class="shell lg:grid lg:grid-cols-[18rem_1fr] lg:items-start lg:gap-x-20">
			<FadeUp>
				<dl class="grid gap-6">
					{#each facts as fact (fact.label)}
						<div>
							<dt class="eyebrow text-jbc-black-50">{fact.label}</dt>
							<dd class="mt-2 text-body leading-[1.55]">{fact.value}</dd>
						</div>
					{/each}
				</dl>
			</FadeUp>

			<FadeUp index={1} class="mt-12 lg:mt-0">
				<p class="max-w-[34ch] text-h2 leading-[1.3] font-semibold lg:text-[1.875rem]">
					{project.excerpt}
				</p>
				{#each project.body as paragraph, i (i)}
					<p class={PROSE}>{paragraph}</p>
				{/each}
			</FadeUp>
		</div>
	</section>

	{#if project.gallery.length > 0}
		<section class="pb-section lg:pb-section-lg">
			<div class="shell">
				<ul class="grid gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-20">
					{#each project.gallery as shot, i (shot.id)}
						{@const wide = i % 3 === 0}
						<!-- Every third shot runs across both columns, breaking the pair rhythm. -->
						<FadeUp as="li" index={i} class={[wide && 'lg:col-span-2']}>
							<figure>
								<img
									class="block h-auto w-full bg-jbc-black-15"
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
								<figcaption class="mt-4 text-sm leading-[1.5] text-jbc-black-50">
									{shot.caption}
								</figcaption>
							</figure>
						</FadeUp>
					{/each}
				</ul>
			</div>
		</section>
	{/if}

	<nav
		class="dark-bg relative overflow-hidden bg-jbc-black text-jbc-white"
		aria-label="Next project"
	>
		<img
			class="absolute inset-0 h-full w-full object-cover"
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

		<div class="relative shell py-section lg:py-section-lg">
			<p class="eyebrow text-jbc-white-50">Next project</p>
			<a
				class="mt-5 inline-block max-w-[18ch] text-h1 font-bold tracking-jbc-tight text-jbc-white
				       no-underline transition-colors duration-[350ms] ease-out-brand hover:text-jbc-red
				       lg:text-[4rem]"
				href="/portfolio/{next.slug}">{next.title}</a
			>
			<div class="mt-10">
				<CTAButton href="/portfolio" variant="outline">Back to all work</CTAButton>
			</div>
		</div>
	</nav>
</article>
