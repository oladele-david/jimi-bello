<script lang="ts">
	import ProjectForm from '$lib/components/console/ProjectForm.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>New Project | Studio Console</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<span class="text-eyebrow font-semibold uppercase tracking-jbc-caps text-jbc-red">Portfolio Studio</span>
		<h1 class="text-2xl font-bold tracking-tight text-white mt-1">Create New Project</h1>
		<p class="text-xs text-white/50 mt-1">
			Add a new interior architecture or furniture project to your portfolio.
		</p>
	</div>

	<ProjectForm isNew={true} {form} />
</div>
