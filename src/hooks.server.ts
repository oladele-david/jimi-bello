import { redirect, type Handle } from '@sveltejs/kit';
import { isAdminAuthenticated } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const authenticated = await isAdminAuthenticated(event.cookies, event.platform);
	event.locals.isAdmin = authenticated;

	const { pathname } = event.url;

	// Protected console routes
	if (pathname.startsWith('/console') && pathname !== '/console/login' && pathname !== '/console/logout') {
		if (!authenticated) {
			const returnUrl = encodeURIComponent(pathname + event.url.search);
			throw redirect(303, `/console/login?returnUrl=${returnUrl}`);
		}
	}

	// Protected console API routes
	if (pathname.startsWith('/api/console')) {
		if (!authenticated) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	}

	// Redirect authenticated user away from login page to /console on GET
	if (pathname === '/console/login' && authenticated && event.request.method === 'GET') {
		const returnUrl = event.url.searchParams.get('returnUrl') || '/console';
		throw redirect(303, returnUrl);
	}

	return resolve(event);
};
