<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { img } from '$lib/images';
	import type { Project } from '$lib/data/site';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	interface Props {
		project?: Partial<Project>;
		isNew?: boolean;
		form?: any;
	}

	let props: Props = $props();

	// Form fields reactive state initialized from props
	let title = $state(props.project?.title || '');
	let slug = $state(props.project?.slug || '');
	let category = $state(props.project?.category || 'Residential');
	let year = $state(props.project?.year || new Date().getFullYear().toString());
	let location = $state(props.project?.location || 'Lagos, Nigeria');
	let scope = $state(props.project?.scope || '');
	let excerpt = $state(props.project?.excerpt || '');
	let body = $state<string[]>(
		props.project?.body && props.project.body.length > 0 ? [...props.project.body] : ['']
	);
	let hero = $state(props.project?.hero || '');
	let gallery = $state<{ id: string; caption: string }[]>(
		props.project?.gallery && props.project.gallery.length > 0
			? props.project.gallery.map((g) => ({ ...g }))
			: []
	);
	let shape = $state<'tall' | 'wide' | 'square'>(props.project?.shape || 'square');

	let isSubmitting = $state(false);
	let isUploadingHero = $state(false);
	let isUploadingGallery = $state(false);
	let uploadError = $state<string | null>(null);
	let activeTab = $state<'edit' | 'preview'>('edit');
	let autoSlug = $state(props.isNew ?? false);

	const categories = ['Residential', 'Commercial', 'Furniture'];

	function generateSlug(text: string): string {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');
	}

	function handleTitleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		title = target.value;
		if (autoSlug) {
			slug = generateSlug(title);
		}
	}

	function addParagraph() {
		body = [...body, ''];
	}

	function removeParagraph(index: number) {
		if (body.length > 1) {
			body = body.filter((_, i) => i !== index);
		} else {
			body = [''];
		}
	}

	function moveParagraph(index: number, direction: 'up' | 'down') {
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= body.length) return;
		const next = [...body];
		const temp = next[index];
		next[index] = next[newIndex];
		next[newIndex] = temp;
		body = next;
	}

	// Hero image upload handler to Cloudflare R2
	async function handleHeroUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		isUploadingHero = true;
		uploadError = null;

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('slug', slug || 'general');
			formData.append('type', 'hero');

			const res = await fetch('/api/console/upload', {
				method: 'POST',
				body: formData
			});

			const json = await res.json();
			if (!res.ok || !json.success) {
				throw new Error(json.error || 'Failed to upload hero image');
			}

			hero = json.url;
		} catch (err: any) {
			uploadError = err.message || 'Upload error';
		} finally {
			isUploadingHero = false;
			target.value = '';
		}
	}

	// Gallery images upload handler to Cloudflare R2
	async function handleGalleryUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (!files || files.length === 0) return;

		isUploadingGallery = true;
		uploadError = null;

		try {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const formData = new FormData();
				formData.append('file', file);
				formData.append('slug', slug || 'general');
				formData.append('type', 'gallery');

				const res = await fetch('/api/console/upload', {
					method: 'POST',
					body: formData
				});

				const json = await res.json();
				if (res.ok && json.success) {
					gallery = [
						...gallery,
						{
							id: json.url,
							caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
						}
					];
				}
			}
		} catch (err: any) {
			uploadError = err.message || 'Gallery upload error';
		} finally {
			isUploadingGallery = false;
			target.value = '';
		}
	}

	function removeGalleryItem(index: number) {
		gallery = gallery.filter((_, i) => i !== index);
	}

	function moveGalleryItem(index: number, direction: 'up' | 'down') {
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= gallery.length) return;
		const next = [...gallery];
		const temp = next[index];
		next[index] = next[newIndex];
		next[newIndex] = temp;
		gallery = next;
	}

	// Dynamic constructed project preview object
	let previewProject = $derived<Project>({
		slug: slug || 'preview-project',
		title: title || 'Untitled Project',
		category: category as any,
		year: year || '2026',
		location: location || 'Lagos, Nigeria',
		scope: scope || 'Interior Design',
		excerpt: excerpt || 'A showcase of bespoke architectural interior design by Jimi Bello & Co.',
		body: body.filter((p) => p.trim().length > 0),
		hero: hero || 'projects/ikoyi-residence/hero',
		gallery: gallery,
		shape: shape
	});
</script>

<div class="space-y-6">
	<!-- Tab Bar for Edit / Live Preview -->
	<div class="flex items-center justify-between border-b border-white/10 pb-4">
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => (activeTab = 'edit')}
				class="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer {activeTab === 'edit'
					? 'bg-jbc-red text-white'
					: 'text-white/60 hover:text-white hover:bg-white/5'}"
			>
				Project Editor
			</button>
			<button
				type="button"
				onclick={() => (activeTab = 'preview')}
				class="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer {activeTab === 'preview'
					? 'bg-jbc-red text-white'
					: 'text-white/60 hover:text-white hover:bg-white/5'}"
			>
				Live Visual Preview
			</button>
		</div>

		<a
			href="/console"
			class="text-xs text-white/50 hover:text-white transition-colors no-underline flex items-center gap-1"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			<span>Back to Projects</span>
		</a>
	</div>

	{#if props.form?.error || uploadError}
		<div class="p-4 bg-jbc-red/15 border border-jbc-red/40 rounded-sm text-jbc-red text-xs flex items-center gap-2">
			<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{props.form?.error || uploadError}</span>
		</div>
	{/if}

	{#if activeTab === 'preview'}
		<!-- Live Preview Surface -->
		<div class="bg-[#1c1c1c] border border-white/10 p-6 sm:p-10 rounded-sm space-y-10">
			<div>
				<span class="text-eyebrow font-semibold uppercase tracking-jbc-caps text-jbc-red">Portfolio Grid Preview</span>
				<p class="text-xs text-white/50 mt-1">This is how the card appears on the public portfolio and home grids.</p>
				<div class="mt-6 max-w-xl bg-[#262626] p-6 rounded-sm text-white">
					<ProjectCard project={previewProject} />
				</div>
			</div>

			<div class="pt-8 border-t border-white/10">
				<span class="text-eyebrow font-semibold uppercase tracking-jbc-caps text-jbc-red">Gallery Photography ({gallery.length} photos)</span>
				<div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{#each gallery as item}
						<div class="bg-[#141414] border border-white/10 rounded overflow-hidden">
							<div class="aspect-4/3 bg-black/40">
								<img src={img(item.id, 768)} alt={item.caption} class="w-full h-full object-cover" />
							</div>
							<div class="p-3 text-[11px] text-white/70">
								{item.caption || 'No caption set'}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<!-- Main Form -->
		<form
			method="POST"
			action="?/saveProject"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-8"
		>
			<input type="hidden" name="isNew" value={props.isNew ? 'true' : 'false'} />
			<input type="hidden" name="bodyJson" value={JSON.stringify(body.filter((p) => p.trim().length > 0))} />
			<input type="hidden" name="galleryJson" value={JSON.stringify(gallery)} />

			<!-- Section 1: General Details -->
			<div class="bg-[#1c1c1c] border border-white/10 p-6 rounded-sm space-y-6">
				<div class="border-b border-white/10 pb-3">
					<h3 class="text-sm font-bold uppercase tracking-wider text-white">1. Project Overview &amp; Identification</h3>
					<p class="text-xs text-white/40 mt-0.5">Basic metadata for portfolio routing and search.</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Title -->
					<div>
						<label for="title" class="block text-xs font-semibold uppercase tracking-wider text-white/70">
							Project Title *
						</label>
						<input
							id="title"
							name="title"
							type="text"
							required
							bind:value={title}
							oninput={handleTitleChange}
							placeholder="e.g. Ikoyi Residence"
							class="mt-2 w-full px-4 py-2.5 bg-[#141414] border border-white/15 text-white text-xs rounded-sm focus:outline-none focus:border-jbc-red focus:ring-1 focus:ring-jbc-red"
						/>
					</div>

					<!-- Slug -->
					<div>
						<div class="flex items-center justify-between">
							<label for="slug" class="block text-xs font-semibold uppercase tracking-wider text-white/70">
								URL Slug * (Unique)
							</label>
							<button
								type="button"
								onclick={() => (autoSlug = !autoSlug)}
								class="text-[10px] text-white/40 hover:text-white transition-colors"
							>
								{autoSlug ? 'Auto (syncing with title)' : 'Manual override'}
							</button>
						</div>
						<div class="mt-2 flex items-center">
							<span class="px-3 py-2.5 bg-white/5 border border-r-0 border-white/15 text-white/40 text-xs font-mono rounded-l-sm">
								/portfolio/
							</span>
							<input
								id="slug"
								name="slug"
								type="text"
								required
								bind:value={slug}
								placeholder="ikoyi-residence"
								class="w-full px-4 py-2.5 bg-[#141414] border border-white/15 text-white font-mono text-xs rounded-r-sm focus:outline-none focus:border-jbc-red focus:ring-1 focus:ring-jbc-red"
							/>
						</div>
					</div>

					<!-- Category -->
					<div>
						<label for="category" class="block text-xs font-semibold uppercase tracking-wider text-white/70">
							Category *
						</label>
						<select
							id="category"
							name="category"
							bind:value={category}
							class="mt-2 w-full px-4 py-2.5 bg-[#141414] border border-white/15 text-white text-xs rounded-sm focus:outline-none focus:border-jbc-red focus:ring-1 focus:ring-jbc-red"
						>
							{#each categories as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>

					<!-- Year -->
					<div>
						<label for="year" class="block text-xs font-semibold uppercase tracking-wider text-white/70">
							Year *
						</label>
						<input
							id="year"
							name="year"
							type="text"
							required
							bind:value={year}
							placeholder="2025"
							class="mt-2 w-full px-4 py-2.5 bg-[#141414] border border-white/15 text-white text-xs rounded-sm focus:outline-none focus:border-jbc-red focus:ring-1 focus:ring-jbc-red"
						/>
					</div>

					<!-- Location -->
					<div>
						<label for="location" class="block text-xs font-semibold uppercase tracking-wider text-white/70">
							Location *
						</label>
						<input
							id="location"
							name="location"
							type="text"
							required
							bind:value={location}
							placeholder="e.g. Ikoyi, Lagos"
							class="mt-2 w-full px-4 py-2.5 bg-[#141414] border border-white/15 text-white text-xs rounded-sm focus:outline-none focus:border-jbc-red focus:ring-1 focus:ring-jbc-red"
						/>
					</div>

					<!-- Scope -->
					<div>
						<label for="scope" class="block text-xs font-semibold uppercase tracking-wider text-white/70">
							Scope of Work *
						</label>
						<input
							id="scope"
							name="scope"
							type="text"
							required
							bind:value={scope}
							placeholder="e.g. Full interior design · Bespoke furniture · Lighting"
							class="mt-2 w-full px-4 py-2.5 bg-[#141414] border border-white/15 text-white text-xs rounded-sm focus:outline-none focus:border-jbc-red focus:ring-1 focus:ring-jbc-red"
						/>
					</div>
				</div>
			</div>

			<!-- Section 2: Layout Shape -->
			<div class="bg-[#1c1c1c] border border-white/10 p-6 rounded-sm space-y-6">
				<div class="border-b border-white/10 pb-3">
					<h3 class="text-sm font-bold uppercase tracking-wider text-white">2. Asymmetric Grid Layout Shape</h3>
					<p class="text-xs text-white/40 mt-0.5">Controls how this card spans in the portfolio layout.</p>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<!-- Square Shape -->
					<label
						class="relative flex flex-col p-4 rounded-sm border cursor-pointer transition-all {shape === 'square'
							? 'bg-jbc-red/10 border-jbc-red text-white'
							: 'bg-[#141414] border-white/10 text-white/70 hover:border-white/25'}"
					>
						<input type="radio" name="shape" value="square" bind:group={shape} class="sr-only" />
						<div class="flex items-center justify-between">
							<span class="text-xs font-bold uppercase tracking-wider">Square (4:3)</span>
							{#if shape === 'square'}
								<span class="w-2 h-2 rounded-full bg-jbc-red"></span>
							{/if}
						</div>
						<div class="mt-3 aspect-4/3 bg-white/10 rounded flex items-center justify-center text-[10px] text-white/50">
							Standard 1x1 Cell
						</div>
						<p class="mt-2 text-[11px] text-white/40">Standard single column and row tile.</p>
					</label>

					<!-- Tall Shape -->
					<label
						class="relative flex flex-col p-4 rounded-sm border cursor-pointer transition-all {shape === 'tall'
							? 'bg-jbc-red/10 border-jbc-red text-white'
							: 'bg-[#141414] border-white/10 text-white/70 hover:border-white/25'}"
					>
						<input type="radio" name="shape" value="tall" bind:group={shape} class="sr-only" />
						<div class="flex items-center justify-between">
							<span class="text-xs font-bold uppercase tracking-wider">Tall (3:4)</span>
							{#if shape === 'tall'}
								<span class="w-2 h-2 rounded-full bg-jbc-red"></span>
							{/if}
						</div>
						<div class="mt-3 aspect-3/4 bg-white/10 rounded flex items-center justify-center text-[10px] text-white/50">
							Portrait (Spans 2 Rows)
						</div>
						<p class="mt-2 text-[11px] text-white/40">Spans two vertical rows in the asymmetric grid.</p>
					</label>

					<!-- Wide Shape -->
					<label
						class="relative flex flex-col p-4 rounded-sm border cursor-pointer transition-all {shape === 'wide'
							? 'bg-jbc-red/10 border-jbc-red text-white'
							: 'bg-[#141414] border-white/10 text-white/70 hover:border-white/25'}"
					>
						<input type="radio" name="shape" value="wide" bind:group={shape} class="sr-only" />
						<div class="flex items-center justify-between">
							<span class="text-xs font-bold uppercase tracking-wider">Wide (16:9)</span>
							{#if shape === 'wide'}
								<span class="w-2 h-2 rounded-full bg-jbc-red"></span>
							{/if}
						</div>
						<div class="mt-3 aspect-16/9 bg-white/10 rounded flex items-center justify-center text-[10px] text-white/50">
							Landscape (Spans 2 Cols)
						</div>
						<p class="mt-2 text-[11px] text-white/40">Spans both columns across the full viewport width.</p>
					</label>
				</div>
			</div>

			<!-- Section 3: Summary Excerpt & Story Narrative -->
			<div class="bg-[#1c1c1c] border border-white/10 p-6 rounded-sm space-y-6">
				<div class="border-b border-white/10 pb-3">
					<h3 class="text-sm font-bold uppercase tracking-wider text-white">3. Excerpt &amp; Story Narrative</h3>
					<p class="text-xs text-white/40 mt-0.5">Written story describing the client brief, design constraints and outcome.</p>
				</div>

				<!-- Excerpt -->
				<div>
					<label for="excerpt" class="block text-xs font-semibold uppercase tracking-wider text-white/70">
						Card Excerpt * (1–2 sentences)
					</label>
					<textarea
						id="excerpt"
						name="excerpt"
						rows="2"
						required
						bind:value={excerpt}
						placeholder="A concise summary of the architectural brief..."
						class="mt-2 w-full px-4 py-2.5 bg-[#141414] border border-white/15 text-white text-xs rounded-sm focus:outline-none focus:border-jbc-red focus:ring-1 focus:ring-jbc-red"
					></textarea>
				</div>

				<!-- Body Paragraphs -->
				<div class="space-y-4 pt-4 border-t border-white/10">
					<div class="flex items-center justify-between">
						<span class="block text-xs font-semibold uppercase tracking-wider text-white/70">
							Detail Story Paragraphs ({body.length})
						</span>
						<button
							type="button"
							onclick={addParagraph}
							class="text-xs text-jbc-red hover:underline font-semibold flex items-center gap-1 cursor-pointer"
						>
							+ Add Paragraph
						</button>
					</div>

					{#each body as paragraph, index}
						<div class="bg-[#141414] border border-white/10 p-4 rounded-sm space-y-2">
							<div class="flex items-center justify-between text-[11px] text-white/50">
								<span>Paragraph #{index + 1}</span>
								<div class="flex items-center gap-2">
									{#if index > 0}
										<button
											type="button"
											onclick={() => moveParagraph(index, 'up')}
											class="hover:text-white"
											title="Move up"
										>
											&uarr; Up
										</button>
									{/if}
									{#if index < body.length - 1}
										<button
											type="button"
											onclick={() => moveParagraph(index, 'down')}
											class="hover:text-white"
											title="Move down"
										>
											&darr; Down
										</button>
									{/if}
									<button
										type="button"
										onclick={() => removeParagraph(index)}
										class="text-jbc-red hover:text-jbc-red-deep ml-2"
									>
										Delete
									</button>
								</div>
							</div>
							<textarea
								rows="3"
								bind:value={body[index]}
								placeholder="Write story paragraph..."
								class="w-full px-3 py-2 bg-[#191919] border border-white/10 text-white text-xs rounded-sm focus:outline-none focus:border-jbc-red"
							></textarea>
						</div>
					{/each}
				</div>
			</div>

			<!-- Section 4: Hero Photograph -->
			<div class="bg-[#1c1c1c] border border-white/10 p-6 rounded-sm space-y-6">
				<div class="border-b border-white/10 pb-3 flex items-center justify-between">
					<div>
						<h3 class="text-sm font-bold uppercase tracking-wider text-white">4. Hero Photograph</h3>
						<p class="text-xs text-white/40 mt-0.5">Primary project image featured on headers and card covers.</p>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
					<!-- Upload Box -->
					<div>
						<span class="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
							Upload Hero Photo
						</span>
						<div class="border-2 border-dashed border-white/20 hover:border-jbc-red rounded-sm p-6 text-center transition-colors bg-[#141414]">
							<input
								type="file"
								id="hero-file-input"
								accept="image/*"
								onchange={handleHeroUpload}
								class="hidden"
							/>
							<label for="hero-file-input" class="cursor-pointer block">
								<svg class="mx-auto h-8 w-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<span class="mt-2 block text-xs font-medium text-white">
									{isUploadingHero ? 'Uploading image...' : 'Click to select or drag photo here'}
								</span>
								<span class="mt-1 block text-[10px] text-white/40">
									JPG, PNG, WebP, AVIF up to 25MB
								</span>
							</label>
						</div>

						<!-- Direct Key / URL fallback -->
						<div class="mt-4">
							<label for="hero" class="block text-[11px] font-medium text-white/60">
								Hero Image Key or URL *
							</label>
							<input
								id="hero"
								name="hero"
								type="text"
								required
								bind:value={hero}
								placeholder="projects/ikoyi-residence/hero or /api/images/..."
								class="mt-1 w-full px-3 py-2 bg-[#141414] border border-white/15 text-white text-xs font-mono rounded-sm focus:outline-none focus:border-jbc-red"
							/>
						</div>
					</div>

					<!-- Hero Preview Thumbnail -->
					<div>
						<span class="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
							Current Hero Preview
						</span>
						<div class="relative aspect-16/10 bg-[#121212] border border-white/10 rounded overflow-hidden">
							{#if hero}
								<img
									src={img(hero, 1024)}
									alt="Hero preview"
									class="w-full h-full object-cover"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center text-xs text-white/30">
									No hero image selected
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Section 5: Gallery Photography -->
			<div class="bg-[#1c1c1c] border border-white/10 p-6 rounded-sm space-y-6">
				<div class="border-b border-white/10 pb-3 flex items-center justify-between">
					<div>
						<h3 class="text-sm font-bold uppercase tracking-wider text-white">5. Gallery Photography ({gallery.length} photos)</h3>
						<p class="text-xs text-white/40 mt-0.5">Supplementary photos and captions for the project case study.</p>
					</div>

					<label
						for="gallery-file-input"
						class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
						<span>{isUploadingGallery ? 'Uploading...' : 'Upload Photos'}</span>
					</label>
					<input
						type="file"
						id="gallery-file-input"
						accept="image/*"
						multiple
						onchange={handleGalleryUpload}
						class="hidden"
					/>
				</div>

				{#if gallery.length === 0}
					<div class="py-8 text-center border border-dashed border-white/15 rounded bg-[#141414]">
						<p class="text-xs text-white/40">No gallery photos added yet. Click "Upload Photos" above to add images.</p>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each gallery as item, index}
							<div class="bg-[#141414] border border-white/10 p-3 rounded-sm flex gap-4 items-start">
								<div class="w-24 h-20 bg-black/40 rounded overflow-hidden shrink-0">
									<img src={img(item.id, 480)} alt={item.caption} class="w-full h-full object-cover" />
								</div>
								<div class="flex-1 space-y-2">
									<div class="flex items-center justify-between text-[11px] text-white/50">
										<span>Photo #{index + 1}</span>
										<div class="flex items-center gap-2">
											{#if index > 0}
												<button
													type="button"
													onclick={() => moveGalleryItem(index, 'up')}
													class="hover:text-white"
												>
													&larr;
												</button>
											{/if}
											{#if index < gallery.length - 1}
												<button
													type="button"
													onclick={() => moveGalleryItem(index, 'down')}
													class="hover:text-white"
												>
													&rarr;
												</button>
											{/if}
											<button
												type="button"
												onclick={() => removeGalleryItem(index)}
												class="text-jbc-red hover:text-jbc-red-deep ml-2"
											>
												Remove
											</button>
										</div>
									</div>
									<input
										type="text"
										bind:value={gallery[index].caption}
										placeholder="Photo caption..."
										class="w-full px-2.5 py-1.5 bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-sm focus:outline-none focus:border-jbc-red"
									/>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Bottom Save Bar -->
			<div class="sticky bottom-4 z-30 bg-[#1c1c1c]/95 backdrop-blur-md border border-white/20 p-4 rounded-sm flex items-center justify-between shadow-2xl">
				<div class="flex items-center gap-2 text-xs text-white/60">
					<span class="w-2 h-2 rounded-full {title && slug ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
					<span>{title && slug ? 'Ready to save' : 'Title and Slug required'}</span>
				</div>

				<div class="flex items-center gap-3">
					<a
						href="/console"
						class="px-4 py-2 text-xs font-medium text-white/70 hover:text-white border border-white/15 rounded-sm transition-colors no-underline"
					>
						Cancel
					</a>

					<button
						type="submit"
						disabled={isSubmitting || !title || !slug}
						class="px-6 py-2.5 bg-jbc-red hover:bg-jbc-red-deep text-white text-xs font-semibold uppercase tracking-jbc-caps rounded-sm shadow-md transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
					>
						{#if isSubmitting}
							<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span>Saving Project...</span>
						{:else}
							<span>{props.isNew ? 'Create Project' : 'Save Changes'}</span>
						{/if}
					</button>
				</div>
			</div>
		</form>
	{/if}
</div>
