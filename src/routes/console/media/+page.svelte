<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { img } from '$lib/images';
	import type { MediaItem } from '$lib/server/db';

	let { data, form } = $props();

	let isUploading = $state(false);
	let uploadError = $state<string | null>(null);
	let copiedKey = $state<string | null>(null);
	let previewItem = $state<MediaItem | null>(null);
	let searchQuery = $state('');

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	async function handleUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (!files || files.length === 0) return;

		isUploading = true;
		uploadError = null;

		try {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const formData = new FormData();
				formData.append('file', file);
				formData.append('slug', 'media');

				const res = await fetch('/api/console/upload', {
					method: 'POST',
					body: formData
				});

				const json = await res.json();
				if (!res.ok || !json.success) {
					throw new Error(json.error || `Failed to upload ${file.name}`);
				}
			}
			await invalidateAll();
		} catch (err: any) {
			uploadError = err.message || 'Upload failed';
		} finally {
			isUploading = false;
			target.value = '';
		}
	}

	async function copyToClipboard(text: string, key: string) {
		try {
			await navigator.clipboard.writeText(text);
			copiedKey = key;
			setTimeout(() => {
				if (copiedKey === key) copiedKey = null;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy to clipboard', err);
		}
	}

	let filteredMedia = $derived.by(() => {
		let list = data.media || [];
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			list = list.filter((m) => m.filename.toLowerCase().includes(q) || m.key.toLowerCase().includes(q));
		}
		return list;
	});
</script>

<svelte:head>
	<title>Media Library | Studio Console</title>
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
		<div>
			<div class="flex items-center gap-3">
				<h1 class="text-2xl font-bold tracking-tight text-white">Media Library</h1>
				<span class="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-xs font-mono">
					{data.media?.length || 0} files
				</span>
			</div>
			<p class="text-xs text-white/50 mt-1">
				Upload and manage photography assets for your portfolio.
			</p>
		</div>

		<div>
			<label
				for="batch-upload-input"
				class="inline-flex items-center gap-2 px-4 py-2 bg-jbc-red hover:bg-jbc-red-deep text-white text-xs font-semibold uppercase tracking-jbc-caps rounded-sm shadow-md transition-colors cursor-pointer"
			>
				{#if isUploading}
					<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					<span>Uploading...</span>
				{:else}
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
					</svg>
					<span>Upload Images</span>
				{/if}
			</label>
			<input
				type="file"
				id="batch-upload-input"
				accept="image/*"
				multiple
				onchange={handleUpload}
				class="hidden"
			/>
		</div>
	</div>

	<!-- Feedback Alerts -->
	{#if uploadError || form?.error}
		<div class="p-4 bg-jbc-red/15 border border-jbc-red/40 rounded-sm text-jbc-red text-xs flex items-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{uploadError || form?.error}</span>
		</div>
	{/if}

	{#if form?.message}
		<div class="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-sm text-emerald-300 text-xs flex items-center gap-2">
			<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<span>{form.message}</span>
		</div>
	{/if}

	<!-- Search & Filter -->
	<div class="flex items-center justify-between gap-4 bg-[#1a1a1a] p-4 border border-white/10 rounded-sm">
		<div class="relative w-full sm:w-80">
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search media by name or key..."
				class="w-full pl-9 pr-4 py-2 bg-[#141414] border border-white/15 text-white placeholder-white/40 text-xs rounded-sm focus:outline-none focus:border-jbc-red"
			/>
		</div>
	</div>

	<!-- Media Grid -->
	{#if filteredMedia.length === 0}
		<div class="text-center py-16 px-4 bg-[#181818] border border-dashed border-white/15 rounded-sm">
			<svg class="mx-auto h-12 w-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
			<h3 class="mt-4 text-sm font-semibold text-white">No media files found</h3>
			<p class="mt-1 text-xs text-white/40">
				Upload photographs and render assets directly to Cloudflare R2 bucket.
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
			{#each filteredMedia as item (item.key)}
				<div class="group bg-[#1c1c1c] border border-white/10 hover:border-white/25 rounded-sm overflow-hidden flex flex-col justify-between transition-all">
					<!-- Thumbnail -->
					<button
						type="button"
						onclick={() => (previewItem = item)}
						class="relative aspect-square bg-black/40 overflow-hidden w-full text-left cursor-pointer"
					>
						<img
							src={img(item.url || item.key, 480)}
							alt={item.filename}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							loading="lazy"
						/>
						<div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<span class="px-2 py-1 bg-black/80 rounded text-[10px] text-white font-medium">Preview</span>
						</div>
					</button>

					<!-- Details & Actions -->
					<div class="p-3 space-y-2">
						<div class="truncate text-[11px] font-medium text-white" title={item.filename}>
							{item.filename}
						</div>
						<div class="flex items-center justify-between text-[10px] text-white/40">
							<span>{formatBytes(item.size)}</span>
							<span class="uppercase">{item.content_type?.split('/')[1] || 'img'}</span>
						</div>

						<div class="pt-2 border-t border-white/10 flex items-center justify-between gap-1">
							<button
								type="button"
								onclick={() => copyToClipboard(item.url || item.key, item.key)}
								class="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] rounded transition-colors cursor-pointer flex items-center gap-1"
							>
								{#if copiedKey === item.key}
									<span class="text-emerald-400 font-semibold">Copied!</span>
								{:else}
									<span>Copy URL</span>
								{/if}
							</button>

							<form method="POST" action="?/deleteMedia" use:enhance>
								<input type="hidden" name="key" value={item.key} />
								<button
									type="submit"
									class="p-1 text-white/40 hover:text-jbc-red transition-colors cursor-pointer"
									title="Delete file"
								>
									<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</form>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Preview Modal -->
{#if previewItem}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
		<div class="bg-[#1f1f1f] border border-white/20 rounded-sm max-w-2xl w-full p-6 space-y-4 shadow-2xl">
			<div class="flex items-center justify-between pb-3 border-b border-white/10">
				<div>
					<h3 class="text-sm font-bold text-white truncate max-w-md">{previewItem.filename}</h3>
					<p class="text-[11px] text-white/50 font-mono mt-0.5">{previewItem.key}</p>
				</div>
				<button
					type="button"
					onclick={() => (previewItem = null)}
					class="text-white/50 hover:text-white p-1 text-lg cursor-pointer"
				>
					&times;
				</button>
			</div>

			<div class="max-h-[60vh] flex items-center justify-center bg-black/50 rounded overflow-hidden p-2">
				<img
					src={img(previewItem.url || previewItem.key, 1440)}
					alt={previewItem.filename}
					class="max-h-[55vh] w-auto object-contain rounded"
				/>
			</div>

			<div class="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
				<div class="text-white/60">
					<span>Size: <strong>{formatBytes(previewItem.size)}</strong></span>
					<span class="mx-2">&bull;</span>
					<span>Type: <strong>{previewItem.content_type}</strong></span>
				</div>

				<button
					type="button"
					onclick={() => copyToClipboard(previewItem?.url || previewItem?.key || '', previewItem?.key || '')}
					class="px-3 py-1.5 bg-jbc-red text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
				>
					{copiedKey === previewItem.key ? 'Copied URL!' : 'Copy Direct URL'}
				</button>
			</div>
		</div>
	</div>
{/if}
