<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';

	let { form } = $props();

	let showPassword = $state(false);
	let isSubmitting = $state(false);
	let returnUrl = $derived(page.url.searchParams.get('returnUrl') || '/console');
</script>

<svelte:head>
	<title>Sign In | Studio Console</title>
</svelte:head>

<div class="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-[#141414] text-white">
	<div class="w-full max-w-md space-y-8 bg-[#1a1a1a] border border-white/10 p-8 sm:p-10 shadow-2xl rounded-sm">
		<!-- Brand Lockup -->
		<div class="text-center">
			<div class="flex justify-center mb-6">
				<Logo class="w-24 h-auto" />
			</div>
			<p class="text-eyebrow font-semibold uppercase tracking-jbc-caps text-jbc-red">
				Studio Console
			</p>
			<h1 class="mt-2 text-2xl font-bold tracking-tight text-white">
				Sign In
			</h1>
		</div>

		<!-- Form -->
		<form
			method="POST"
			action="?/login"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="mt-8 space-y-6"
		>
			<input type="hidden" name="returnUrl" value={returnUrl} />

			{#if form?.error}
				<div class="p-3.5 bg-jbc-red/10 border border-jbc-red/40 rounded text-xs text-jbc-red flex items-center gap-2">
					<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span>{form.error}</span>
				</div>
			{/if}

			<div>
				<label for="password" class="block text-xs font-semibold uppercase tracking-wider text-white/70">
					Password
				</label>
				<div class="mt-2 relative">
					<input
						id="password"
						name="password"
						type={showPassword ? 'text' : 'password'}
						required
						autocomplete="current-password"
						placeholder="Enter password..."
						class="w-full px-4 py-3 bg-[#141414] border border-white/20 text-white placeholder-white/30 text-sm rounded-sm focus:outline-none focus:border-jbc-red focus:ring-1 focus:ring-jbc-red transition-all"
					/>
					<button
						type="button"
						onclick={() => (showPassword = !showPassword)}
						class="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
					>
						{showPassword ? 'Hide' : 'Show'}
					</button>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={isSubmitting}
					class="w-full flex justify-center items-center py-3 px-4 bg-jbc-red hover:bg-jbc-red-deep text-white text-xs font-semibold uppercase tracking-jbc-caps rounded-sm shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
				>
					{#if isSubmitting}
						<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span>Signing In...</span>
					{:else}
						<span>Sign In</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
