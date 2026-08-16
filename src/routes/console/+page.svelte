<script lang="ts">
	import { enhance } from '$app/forms';
	import { img } from '$lib/images';
	import type { Project } from '$lib/data/site';

	let { data, form } = $props();

	let searchQuery = $state('');
	let selectedCategory = $state('All');
	let deleteTarget = $state<Project | null>(null);
	let showResetModal = $state(false);
	let isDeleting = $state(false);
	let isResetting = $state(false);

	let categories = ['All', 'Residential', 'Commercial', 'Furniture'];

	let filteredProjects = $derived.by(() => {
		let list = data.projects || [];
		if (selectedCategory !== 'All') {
			list = list.filter((p) => p.category === selectedCategory);
		}
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			list = list.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.slug.toLowerCase().includes(q) ||
					p.location.toLowerCase().includes(q) ||
					p.scope.toLowerCase().includes(q)
			);
		}
		return list;
	});

	let stats = $derived.by(() => {
		const total = data.projects.length;
		const residential = data.projects.filter((p) => p.category === 'Residential').length;
		const commercial = data.projects.filter((p) => p.category === 'Commercial').length;
		const furniture = data.projects.filter((p) => p.category === 'Furniture').length;
		return { total, residential, commercial, furniture };
	});
</script>

<svelte:head>
	<title>Portfolio Manager | Jimi Bello &amp; Co. Admin</title>
</svelte:head>

<div class="space-y-8">
	<!-- Feedback Alerts -->
	{#if form?.message}
		<div class="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-sm text-emerald-300 text-xs flex items-center justify-between">
			<div class="flex items-center gap-2">
				<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				<span>{form.message}</span>
			</div>
		</div>
	{/if}

	{#if form?.error}
		<div class="p-4 bg-jbc-red/15 border border-jbc-red/40 rounded-sm text-jbc-red text-xs flex items-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{form.error}</span>
		</div>
	{/if}

	<!-- Header with Action Strip -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
		<div>
			<div class="flex items-center gap-3">
				<h1 class="text-2xl font-bold tracking-tight text-white">Portfolio Projects</h1>
				<span class="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-xs font-mono">
					{stats.total} total
				</span>
			</div>
			<p class="mt-1 text-xs text-white/50">
				Manage portfolio projects and showcase works.
			</p>
		</div>

		<div class="flex items-center gap-3 flex-wrap">
			<button
				type="button"
				onclick={() => (showResetModal = true)}
				class="px-3.5 py-2 rounded-sm text-xs font-medium text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-colors cursor-pointer"
			>
				Reset Defaults
			</button>

			<a
				href="/console/projects/new"
				class="inline-flex items-center gap-2 px-4 py-2 bg-jbc-red hover:bg-jbc-red-deep text-white text-xs font-semibold uppercase tracking-jbc-caps rounded-sm shadow-md transition-colors cursor-pointer no-underline"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span>New Project</span>
			</a>
		</div>
	</div>

	<!-- Metric Quick Strip -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
		<div class="bg-[#1c1c1c] border border-white/10 p-4 rounded-sm">
			<span class="text-[11px] font-semibold uppercase tracking-wider text-white/50">Total Projects</span>
			<div class="mt-1 text-xl font-bold text-white">{stats.total}</div>
		</div>
		<div class="bg-[#1c1c1c] border border-white/10 p-4 rounded-sm">
			<span class="text-[11px] font-semibold uppercase tracking-wider text-white/50">Residential</span>
			<div class="mt-1 text-xl font-bold text-white">{stats.residential}</div>
		</div>
		<div class="bg-[#1c1c1c] border border-white/10 p-4 rounded-sm">
			<span class="text-[11px] font-semibold uppercase tracking-wider text-white/50">Commercial</span>
			<div class="mt-1 text-xl font-bold text-white">{stats.commercial}</div>
		</div>
		<div class="bg-[#1c1c1c] border border-white/10 p-4 rounded-sm">
			<span class="text-[11px] font-semibold uppercase tracking-wider text-white/50">Furniture</span>
			<div class="mt-1 text-xl font-bold text-white">{stats.furniture}</div>
		</div>
	</div>

	<!-- Filter & Search Bar -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1a1a1a] p-4 border border-white/10 rounded-sm">
		<!-- Category Tabs -->
		<div class="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
			{#each categories as cat}
				<button
					type="button"
					onclick={() => (selectedCategory = cat)}
					class="px-3 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer {selectedCategory === cat
						? 'bg-jbc-red text-white'
						: 'text-white/60 hover:text-white hover:bg-white/5'}"
				>
					{cat}
				</button>
			{/each}
		</div>

		<!-- Search Input -->
		<div class="relative w-full md:w-72">
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search projects..."
				class="w-full pl-9 pr-4 py-2 bg-[#141414] border border-white/15 text-white placeholder-white/40 text-xs rounded-sm focus:outline-none focus:border-jbc-red focus:ring-1 focus:ring-jbc-red"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => (searchQuery = '')}
					class="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white text-xs"
				>
					Clear
				</button>
			{/if}
		</div>
	</div>

	<!-- Projects Grid -->
	{#if filteredProjects.length === 0}
		<div class="text-center py-16 px-4 bg-[#181818] border border-dashed border-white/15 rounded-sm">
			<svg class="mx-auto h-12 w-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
			</svg>
			<h3 class="mt-4 text-sm font-semibold text-white">No projects found</h3>
			<p class="mt-1 text-xs text-white/40">
				{searchQuery || selectedCategory !== 'All'
					? 'Try changing your search or filter terms.'
					: 'Get started by creating your first portfolio project.'}
			</p>
			<div class="mt-6">
				<a
					href="/console/projects/new"
					class="inline-flex items-center gap-1.5 px-4 py-2 bg-jbc-red hover:bg-jbc-red-deep text-white text-xs font-semibold uppercase tracking-jbc-caps rounded-sm no-underline"
				>
					+ Create Project
				</a>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredProjects as project (project.slug)}
				<div class="group bg-[#1c1c1c] border border-white/10 hover:border-white/25 rounded-sm overflow-hidden flex flex-col transition-all duration-300">
					<!-- Thumbnail & Badges -->
					<div class="relative aspect-16/10 bg-[#121212] overflow-hidden">
						<img
							src={img(project.hero, 768, { ratio: 16 / 10 })}
							alt={project.title}
							class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							loading="lazy"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

						<!-- Shape Badge -->
						<div class="absolute top-3 left-3">
							<span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white/80 border border-white/15">
								Shape: {project.shape}
							</span>
						</div>

						<!-- Category & Year -->
						<div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
							<span class="font-semibold text-jbc-red uppercase tracking-wider text-[11px]">
								{project.category}
							</span>
							<span class="text-white/70 font-mono text-[11px]">{project.year}</span>
						</div>
					</div>

					<!-- Details Block -->
					<div class="p-5 flex-1 flex flex-col justify-between">
						<div>
							<div class="flex items-baseline justify-between gap-2">
								<h2 class="text-base font-bold text-white group-hover:text-jbc-red transition-colors">
									{project.title}
								</h2>
							</div>

							<p class="mt-1 text-[11px] text-white/50 font-mono">
								/{project.slug} &bull; {project.location}
							</p>

							<p class="mt-2.5 text-xs text-white/70 line-clamp-2 leading-relaxed">
								{project.excerpt}
							</p>
						</div>

						<!-- Gallery count and Actions -->
						<div class="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
							<span class="text-[11px] text-white/40 flex items-center gap-1">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								{project.gallery?.length || 0} gallery photos
							</span>

							<div class="flex items-center gap-2">
								<a
									href="/portfolio/{project.slug}"
									target="_blank"
									rel="noopener noreferrer"
									class="p-1.5 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
									title="View live page"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
									</svg>
								</a>

								<a
									href="/console/projects/{project.slug}"
									class="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors no-underline"
								>
									Edit
								</a>

								<button
									type="button"
									onclick={() => (deleteTarget = project)}
									class="p-1.5 rounded text-white/40 hover:text-jbc-red hover:bg-jbc-red/10 transition-colors cursor-pointer"
									title="Delete project"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Delete Confirmation Modal -->
{#if deleteTarget}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
		<div class="bg-[#1f1f1f] border border-white/20 rounded-sm max-w-md w-full p-6 space-y-4 shadow-2xl">
			<div class="flex items-center gap-3 text-jbc-red">
				<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
				<h3 class="text-lg font-bold text-white">Delete Project</h3>
			</div>

			<p class="text-xs text-white/70 leading-relaxed">
				Are you sure you want to permanently delete <strong class="text-white">"{deleteTarget.title}"</strong> ({deleteTarget.slug})? This action cannot be undone.
			</p>

			<div class="pt-4 border-t border-white/10 flex justify-end gap-3">
				<button
					type="button"
					onclick={() => (deleteTarget = null)}
					class="px-4 py-2 text-xs font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 rounded-sm transition-colors cursor-pointer"
				>
					Cancel
				</button>

				<form
					method="POST"
					action="?/deleteProject"
					use:enhance={() => {
						isDeleting = true;
						return async ({ update }) => {
							isDeleting = false;
							deleteTarget = null;
							await update();
						};
					}}
				>
					<input type="hidden" name="slug" value={deleteTarget.slug} />
					<button
						type="submit"
						disabled={isDeleting}
						class="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-jbc-red hover:bg-jbc-red-deep text-white rounded-sm transition-colors disabled:opacity-50 cursor-pointer"
					>
						{isDeleting ? 'Deleting...' : 'Confirm Delete'}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Re-seed Defaults Modal -->
{#if showResetModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
		<div class="bg-[#1f1f1f] border border-white/20 rounded-sm max-w-md w-full p-6 space-y-4 shadow-2xl">
			<div class="flex items-center gap-3 text-amber-400">
				<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
				</svg>
				<h3 class="text-lg font-bold text-white">Reset Default Projects</h3>
			</div>

			<p class="text-xs text-white/70 leading-relaxed">
				This will restore the 6 original Jimi Bello &amp; Co. projects (Ikoyi Residence, Victoria Island Studio, Four-Poster Series, Lekki Duplex, Ikeja Showroom, Iroko Dining Collection).
			</p>

			<div class="pt-4 border-t border-white/10 flex justify-end gap-3">
				<button
					type="button"
					onclick={() => (showResetModal = false)}
					class="px-4 py-2 text-xs font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 rounded-sm transition-colors cursor-pointer"
				>
					Cancel
				</button>

				<form
					method="POST"
					action="?/seedDefaults"
					use:enhance={() => {
						isResetting = true;
						return async ({ update }) => {
							isResetting = false;
							showResetModal = false;
							await update();
						};
					}}
				>
					<button
						type="submit"
						disabled={isResetting}
						class="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white/20 hover:bg-white/30 text-white rounded-sm transition-colors disabled:opacity-50 cursor-pointer"
					>
						{isResetting ? 'Resetting...' : 'Confirm Reset'}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
