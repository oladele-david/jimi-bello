<script lang="ts">
	import ProjectForm from '$lib/components/console/ProjectForm.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Edit {data.project.title} | Studio Console</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page Header with Live Link -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
		<div>
			<div class="flex items-center gap-3">
				<h1 class="text-2xl font-bold tracking-tight text-white">{data.project.title}</h1>
				<span class="px-2.5 py-0.5 rounded-full bg-jbc-red/20 text-jbc-red text-xs font-semibold uppercase tracking-wider">
					{data.project.category}
				</span>
			</div>
			<p class="text-xs text-white/50 mt-1 font-mono">
				Slug: /{data.project.slug} &bull; Year: {data.project.year}
			</p>
		</div>

		<div class="flex items-center gap-3">
			<a
				href="/portfolio/{data.project.slug}"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-colors no-underline"
			>
				<span>View on Public Site</span>
				<svg class="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
				</svg>
			</a>
		</div>
	</div>

	{#if form?.message}
		<div class="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-sm text-emerald-300 text-xs flex items-center gap-2">
			<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<span>{form.message}</span>
		</div>
	{/if}

	<ProjectForm project={data.project} isNew={false} {form} />
</div>
