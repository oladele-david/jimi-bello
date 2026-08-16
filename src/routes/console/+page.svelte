<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { img } from '$lib/images';
	import { brandTagline, contact as siteContact, services as siteServices } from '$lib/data/site';
	import type { Project } from '$lib/data/site';

	let { data, form } = $props();

	// Console Tab switcher (projects | content | contact | security)
	let activeTab = $state<'projects' | 'content' | 'contact' | 'security'>('projects');

	$effect(() => {
		const paramTab = page.url.searchParams.get('tab');
		if (paramTab && ['projects', 'content', 'contact', 'security'].includes(paramTab)) {
			activeTab = paramTab as any;
		}
	});

	// Projects management state
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
	<title>Studio Console | Jimi Bello &amp; Co.</title>
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

	<!-- Console Studio Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
		<div>
			<div class="flex items-center gap-3">
				<h1 class="text-2xl font-bold tracking-tight text-white">Studio Management Console</h1>
			</div>
			<p class="mt-1 text-xs text-white/50">
				Manage your portfolio showcase, studio details, and website settings.
			</p>
		</div>

		{#if activeTab === 'projects'}
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
		{/if}
	</div>

	<!-- Module Navigation Hub (Uncomment when ready to activate Site Content, Studio Details, and Security tabs)
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
		<button
			type="button"
			onclick={() => (activeTab = 'projects')}
			class="p-4 rounded-sm border text-left transition-all cursor-pointer {activeTab === 'projects'
				? 'bg-[#222] border-jbc-red shadow-md'
				: 'bg-[#181818] border-white/10 hover:border-white/20'}"
		>
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold uppercase tracking-wider {activeTab === 'projects' ? 'text-jbc-red' : 'text-white/80'}">
					Portfolio Works
				</span>
				<span class="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white/70">
					{stats.total} Projects
				</span>
			</div>
			<p class="text-[11px] text-white/40 mt-1 line-clamp-1">Case studies &amp; photography</p>
		</button>

		<button
			type="button"
			onclick={() => (activeTab = 'content')}
			class="p-4 rounded-sm border text-left transition-all cursor-pointer {activeTab === 'content'
				? 'bg-[#222] border-jbc-red shadow-md'
				: 'bg-[#181818] border-white/10 hover:border-white/20'}"
		>
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold uppercase tracking-wider {activeTab === 'content' ? 'text-jbc-red' : 'text-white/80'}">
					Site &amp; Brand
				</span>
				<span class="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-white/10 text-white/60">
					Overview
				</span>
			</div>
			<p class="text-[11px] text-white/40 mt-1 line-clamp-1">Taglines &amp; services</p>
		</button>

		<button
			type="button"
			onclick={() => (activeTab = 'contact')}
			class="p-4 rounded-sm border text-left transition-all cursor-pointer {activeTab === 'contact'
				? 'bg-[#222] border-jbc-red shadow-md'
				: 'bg-[#181818] border-white/10 hover:border-white/20'}"
		>
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold uppercase tracking-wider {activeTab === 'contact' ? 'text-jbc-red' : 'text-white/80'}">
					Studio Details
				</span>
				<span class="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-white/10 text-white/60">
					Overview
				</span>
			</div>
			<p class="text-[11px] text-white/40 mt-1 line-clamp-1">Address, email &amp; phone</p>
		</button>

		<button
			type="button"
			onclick={() => (activeTab = 'security')}
			class="p-4 rounded-sm border text-left transition-all cursor-pointer {activeTab === 'security'
				? 'bg-[#222] border-jbc-red shadow-md'
				: 'bg-[#181818] border-white/10 hover:border-white/20'}"
		>
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold uppercase tracking-wider {activeTab === 'security' ? 'text-jbc-red' : 'text-white/80'}">
					Security
				</span>
				<span class="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-emerald-500/10 text-emerald-400">
					Protected
				</span>
			</div>
			<p class="text-[11px] text-white/40 mt-1 line-clamp-1">Access &amp; defense policy</p>
		</button>
	</div>
	-->

	<!-- TAB 1: PORTFOLIO WORKS -->
	{#if activeTab === 'projects'}
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

							<!-- Category & Shape Badges -->
							<div class="absolute top-3 left-3 flex items-center gap-2">
								<span class="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold uppercase tracking-wider rounded-xs">
									{project.category}
								</span>
								<span class="px-2 py-0.5 bg-jbc-red/80 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider rounded-xs">
									{project.shape || 'square'}
								</span>
							</div>

							<!-- Year -->
							<div class="absolute top-3 right-3">
								<span class="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/20 text-white/80 font-mono text-[10px] rounded-xs">
									{project.year}
								</span>
							</div>

							<!-- Title & Location overlay -->
							<div class="absolute bottom-3 left-3 right-3">
								<h2 class="text-base font-bold text-white tracking-tight drop-shadow-md">
									{project.title}
								</h2>
								<p class="text-xs text-white/70 flex items-center gap-1.5 mt-0.5">
									<span>{project.location}</span>
									{#if project.gallery?.length}
										<span>&bull;</span>
										<span>{project.gallery.length} photos</span>
									{/if}
								</p>
							</div>
						</div>

						<!-- Scope & Excerpt Description -->
						<div class="p-4 flex-1 flex flex-col justify-between border-t border-white/5 space-y-3">
							<p class="text-xs text-white/60 line-clamp-2 leading-relaxed">
								{project.excerpt || 'No description available.'}
							</p>

							<!-- Action Buttons -->
							<div class="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
								<a
									href="/portfolio/{project.slug}"
									target="_blank"
									rel="noopener noreferrer"
									class="px-2.5 py-1 text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1 no-underline"
								>
									<span>View</span>
									<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
									</svg>
								</a>

								<div class="flex items-center gap-2">
									<a
										href="/console/projects/{project.slug}"
										class="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors no-underline"
									>
										Edit
									</a>

									<button
										type="button"
										onclick={() => (deleteTarget = project)}
										class="px-2.5 py-1 rounded text-xs text-jbc-red/70 hover:text-jbc-red hover:bg-jbc-red/10 transition-colors cursor-pointer"
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}

	<!-- Future Roadmap Modules (Uncomment when ready to activate Site Content, Studio Details, and Security tabs)
	{#if activeTab === 'content'}
		<div class="space-y-6">
			<div class="bg-[#1c1c1c] border border-white/10 p-6 rounded-sm space-y-6">
				<div class="border-b border-white/10 pb-4 flex items-center justify-between">
					<div>
						<h2 class="text-base font-bold text-white uppercase tracking-wider">Brand Statement &amp; Services</h2>
						<p class="text-xs text-white/50 mt-0.5">Core brand messaging and architectural disciplines featured on your public website.</p>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-4">
						<div>
							<span class="block text-xs font-semibold uppercase tracking-wider text-white/70">
								Brand Tagline
							</span>
							<div class="mt-1.5 px-4 py-3 bg-[#141414] border border-white/15 text-white text-sm rounded-sm font-medium">
								"{brandTagline}"
							</div>
							<p class="text-[11px] text-white/40 mt-1">Featured across page headers and web metadata.</p>
						</div>

						<div>
							<span class="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
								Architectural Disciplines &amp; Services
							</span>
							<div class="space-y-2">
								{#each siteServices as service}
									<div class="px-3.5 py-2.5 bg-[#141414] border border-white/10 rounded-sm flex items-center justify-between">
										<span class="text-xs font-semibold text-white">{service.title}</span>
										<span class="text-[11px] text-white/40">{service.points.length} focus points</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="bg-[#141414] border border-white/10 p-5 rounded-sm flex flex-col justify-between">
						<div>
							<span class="text-xs font-semibold uppercase tracking-wider text-white/70">Homepage Hero Showcase</span>
							<p class="text-xs text-white/40 mt-1">
								The homepage hero features full-bleed architectural photography and dynamically showcases your portfolio projects.
							</p>
							<div class="mt-4 p-4 border border-white/10 rounded bg-[#181818] space-y-2">
								<span class="text-xs font-bold text-white">Live Showcase Active</span>
								<p class="text-xs text-white/50 leading-relaxed">
									All published portfolio projects are automatically presented across the homepage showcase grid.
								</p>
							</div>
						</div>
						<a
							href="/"
							target="_blank"
							rel="noopener noreferrer"
							class="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors no-underline"
						>
							<span>View Live Homepage</span>
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if activeTab === 'contact'}
		<div class="space-y-6">
			<div class="bg-[#1c1c1c] border border-white/10 p-6 rounded-sm space-y-6">
				<div class="border-b border-white/10 pb-4 flex items-center justify-between">
					<div>
						<h2 class="text-base font-bold text-white uppercase tracking-wider">Studio Locations &amp; Inquiries</h2>
						<p class="text-xs text-white/50 mt-0.5">Public studio address, business hours, and consultation contact channels.</p>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="bg-[#141414] border border-white/10 p-5 rounded-sm space-y-3">
						<span class="text-xs font-semibold uppercase tracking-wider text-jbc-red">Main Studio</span>
						<p class="text-sm font-bold text-white">{siteContact.address.join(', ')}</p>
						<p class="text-xs text-white/50 leading-relaxed">
							Hours: {siteContact.hours}
						</p>
					</div>

					<div class="bg-[#141414] border border-white/10 p-5 rounded-sm space-y-3">
						<span class="text-xs font-semibold uppercase tracking-wider text-jbc-red">Direct Inquiries</span>
						<p class="text-sm font-bold text-white">{siteContact.email}</p>
						<p class="text-xs text-white/50 leading-relaxed">
							Phone: {siteContact.phone}
						</p>
					</div>

					<div class="bg-[#141414] border border-white/10 p-5 rounded-sm space-y-3">
						<span class="text-xs font-semibold uppercase tracking-wider text-jbc-red">Social Channels</span>
						<div class="space-y-2">
							{#each siteContact.social as social}
								<a
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-block px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-white/70 hover:text-white transition-colors mr-1.5 mb-1.5 no-underline"
								>
									{social.label} &rarr;
								</a>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if activeTab === 'security'}
		<div class="space-y-6">
			<div class="bg-[#1c1c1c] border border-white/10 p-6 rounded-sm space-y-6">
				<div class="border-b border-white/10 pb-4 flex items-center justify-between">
					<div>
						<h2 class="text-base font-bold text-white uppercase tracking-wider">Console Access &amp; Security Policy</h2>
						<p class="text-xs text-white/50 mt-0.5">Automated brute-force defense and session protection for your studio console.</p>
					</div>
					<span class="px-2.5 py-1 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
						Active &amp; Guarded
					</span>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="bg-[#141414] border border-white/10 p-5 rounded-sm space-y-4">
						<div class="flex items-center gap-2">
							<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
							<span class="text-sm font-bold text-white">Login Security Defense</span>
						</div>
						<ul class="text-xs text-white/70 space-y-2">
							<li class="flex items-center justify-between py-2 border-b border-white/5">
								<span>Maximum Password Trials:</span>
								<span class="text-white font-bold">5 Attempts</span>
							</li>
							<li class="flex items-center justify-between py-2 border-b border-white/5">
								<span>Lockout Cooldown:</span>
								<span class="text-amber-400 font-bold">5 Minutes</span>
							</li>
							<li class="flex items-center justify-between py-2">
								<span>Session Longevity:</span>
								<span class="text-white">7 Days (Secure Session)</span>
							</li>
						</ul>
					</div>

					<div class="bg-[#141414] border border-white/10 p-5 rounded-sm space-y-3 flex flex-col justify-between">
						<div>
							<span class="text-xs font-semibold uppercase tracking-wider text-white/70">Console Password Management</span>
							<p class="text-xs text-white/60 mt-2 leading-relaxed">
								Your studio console is protected with an encrypted administrative key. To update your password or invite additional studio team members, please contact your technical administrator.
							</p>
						</div>
						<div class="p-3 bg-white/5 border border-white/10 rounded text-xs text-white/50 flex items-center gap-2">
							<svg class="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>All administrative actions and sessions are protected.</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
	-->
</div>

<!-- Reset Confirmation Modal -->
{#if showResetModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
		<div class="bg-[#1c1c1c] border border-white/15 rounded-sm max-w-md w-full p-6 space-y-6 shadow-2xl">
			<div>
				<h3 class="text-lg font-bold text-white tracking-tight">Reset Portfolio to Defaults?</h3>
				<p class="mt-2 text-xs text-white/60 leading-relaxed">
					This will re-initialize the portfolio database with default seed projects. Any custom projects will be reset.
				</p>
			</div>

			<form
				method="POST"
				action="?/resetDefaults"
				use:enhance={() => {
					isResetting = true;
					return async ({ update }) => {
						isResetting = false;
						showResetModal = false;
						await update();
					};
				}}
				class="flex items-center justify-end gap-3"
			>
				<button
					type="button"
					onclick={() => (showResetModal = false)}
					disabled={isResetting}
					class="px-4 py-2 text-xs font-medium text-white/70 hover:text-white border border-white/15 rounded-sm transition-colors cursor-pointer"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isResetting}
					class="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-jbc-red hover:bg-jbc-red-deep text-white rounded-sm transition-colors disabled:opacity-50 cursor-pointer"
				>
					{isResetting ? 'Resetting...' : 'Confirm Reset'}
				</button>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if deleteTarget}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
		<div class="bg-[#1c1c1c] border border-white/15 rounded-sm max-w-md w-full p-6 space-y-6 shadow-2xl">
			<div>
				<h3 class="text-lg font-bold text-white tracking-tight">Delete Project?</h3>
				<p class="mt-2 text-xs text-white/60 leading-relaxed">
					Are you sure you want to delete <strong class="text-white font-semibold">{deleteTarget.title}</strong>? This action will remove the project from your live portfolio.
				</p>
			</div>

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
				class="flex items-center justify-end gap-3"
			>
				<input type="hidden" name="slug" value={deleteTarget.slug} />

				<button
					type="button"
					onclick={() => (deleteTarget = null)}
					disabled={isDeleting}
					class="px-4 py-2 text-xs font-medium text-white/70 hover:text-white border border-white/15 rounded-sm transition-colors cursor-pointer"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isDeleting}
					class="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-jbc-red hover:bg-jbc-red-deep text-white rounded-sm transition-colors disabled:opacity-50 cursor-pointer"
				>
					{isDeleting ? 'Deleting...' : 'Delete Project'}
				</button>
			</form>
		</div>
	</div>
{/if}
