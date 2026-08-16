import { fail, redirect, type Actions } from '@sveltejs/kit';
import {
	verifyPassword,
	setAdminSession,
	clearAdminSession,
	getLoginRateLimitStatus,
	recordFailedLoginAttempt
} from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, cookies, platform }) => {
	if (locals.isAdmin) {
		const returnUrl = url.searchParams.get('returnUrl') || '/console';
		throw redirect(303, returnUrl);
	}

	const rateLimit = await getLoginRateLimitStatus(cookies, platform);

	return {
		rateLimit
	};
};

export const actions: Actions = {
	login: async ({ request, cookies, platform, url }) => {
		const formData = await request.formData();
		const password = formData.get('password') as string;
		const returnUrl = (formData.get('returnUrl') as string) || url.searchParams.get('returnUrl') || '/console';

		// 1. Check if user is currently locked out
		const rateLimit = await getLoginRateLimitStatus(cookies, platform);
		if (rateLimit.isLocked) {
			const minutes = Math.ceil(rateLimit.remainingSeconds / 60);
			return fail(429, {
				error: `Console locked due to multiple failed attempts. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} (${rateLimit.remainingSeconds}s) before trying again.`,
				isLocked: true,
				remainingSeconds: rateLimit.remainingSeconds
			});
		}

		if (!password) {
			return fail(400, {
				error: 'Please enter password',
				isLocked: false,
				remainingAttempts: rateLimit.remainingAttempts
			});
		}

		// 2. Validate password
		const isValid = await verifyPassword(password, platform);
		if (!isValid) {
			const updatedRateLimit = await recordFailedLoginAttempt(cookies, platform);

			if (updatedRateLimit.isLocked) {
				const minutes = Math.ceil(updatedRateLimit.remainingSeconds / 60);
				return fail(429, {
					error: `Too many failed attempts. Console locked for ${minutes} minutes.`,
					isLocked: true,
					remainingSeconds: updatedRateLimit.remainingSeconds
				});
			}

			return fail(400, {
				error: `Invalid password. ${updatedRateLimit.remainingAttempts} attempt${updatedRateLimit.remainingAttempts === 1 ? '' : 's'} remaining before lockout.`,
				isLocked: false,
				remainingAttempts: updatedRateLimit.remainingAttempts
			});
		}

		// 3. Set authenticated session (automatically clears rate limit history)
		await setAdminSession(cookies, platform);
		throw redirect(303, returnUrl);
	},
	logout: async ({ cookies }) => {
		await clearAdminSession(cookies);
		throw redirect(303, '/console/login');
	}
};
