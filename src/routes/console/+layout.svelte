<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';

	let { children } = $props();

	let isLoginPage = $derived(page.url.pathname === '/console/login');

	const NAV = [
		{ label: 'Portfolio', href: '/console' },
		{ label: 'Media Library', href: '/console/media' }
		/* Future Roadmap Modules:
		{ label: 'Site Content', href: '/console?tab=content' },
		{ label: 'Contact Info', href: '/console?tab=contact' },
		{ label: 'Security', href: '/console?tab=security' }
		*/
	];
</script>

{#if isLoginPage}
	<div class="min-h-screen bg-[#141414] text-jbc-white">
		{@render children()}
	</div>
{:else}
	<div class="min-h-screen bg-[#141414] text-[#ececec] flex flex-col font-sans">
		<!-- Console Header -->
		<header class="sticky top-0 z-40 border-b border-white/10 bg-[#1c1c1c]/90 backdrop-blur-md">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
				<!-- Brand & Logo -->
				<div class="flex items-center gap-6">
					<a href="/console" class="flex items-center gap-3 text-inherit no-underline group">
						<Logo class="w-16 h-auto" />
						<div class="border-l border-white/15 pl-3">
							<span class="block text-xs font-semibold uppercase tracking-jbc-caps text-jbc-red">Studio Console</span>
						</div>
					</a>

					<!-- Navigation Links -->
					<nav class="hidden lg:flex items-center gap-1 ml-4" aria-label="Console Navigation">
						{#each NAV as item}
							{@const isExact = item.href === '/console' && (page.url.pathname === '/console' && !page.url.searchParams.get('tab'))}
							{@const isMedia = item.href === '/console/media' && page.url.pathname.startsWith('/console/media')}
							{@const isTab = item.href.includes('tab=') && page.url.search.includes(item.href.split('?')[1])}
							{@const isProjectSubpage = item.href === '/console' && page.url.pathname.startsWith('/console/projects')}
							{@const active = isExact || isMedia || isTab || isProjectSubpage}
							<a
								href={item.href}
								class="px-3 py-1.5 rounded-sm text-xs font-medium uppercase tracking-wider transition-all duration-200 {active
									? 'bg-white/10 text-white shadow-sm font-semibold'
									: 'text-white/60 hover:text-white hover:bg-white/5'}"
							>
								{item.label}
							</a>
						{/each}
					</nav>
				</div>

				<!-- Right Actions -->
				<div class="flex items-center gap-3">
					<a
						href="/portfolio"
						target="_blank"
						rel="noopener noreferrer"
						class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-colors"
					>
						<span>View Live Site</span>
						<svg class="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
						</svg>
					</a>

					<!-- Logout Form -->
					<form action="/console/logout" method="POST" class="inline-block">
						<button
							type="submit"
							class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white/60 hover:text-jbc-red hover:bg-white/5 transition-colors cursor-pointer"
						>
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
							<span>Sign Out</span>
						</button>
					</form>
				</div>
			</div>
		</header>

		<!-- Sub-header Breadcrumb / Actions Bar for Mobile Nav -->
		<div class="lg:hidden border-b border-white/10 bg-[#171717] px-4 py-2 flex items-center gap-2 overflow-x-auto">
			{#each NAV as item}
				{@const isExact = item.href === '/console' && (page.url.pathname === '/console' && !page.url.searchParams.get('tab'))}
				{@const isMedia = item.href === '/console/media' && page.url.pathname.startsWith('/console/media')}
				{@const isTab = item.href.includes('tab=') && page.url.search.includes(item.href.split('?')[1])}
				{@const isProjectSubpage = item.href === '/console' && page.url.pathname.startsWith('/console/projects')}
				{@const active = isExact || isMedia || isTab || isProjectSubpage}
				<a
					href={item.href}
					class="px-3 py-1 text-xs font-medium uppercase tracking-wider rounded shrink-0 {active ? 'bg-white/15 text-white' : 'text-white/50'}"
				>
					{item.label}
				</a>
			{/each}
		</div>

		<!-- Main Content Container -->
		<main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{@render children()}
		</main>
	</div>
{/if}
