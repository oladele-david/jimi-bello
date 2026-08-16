import { fail, redirect, type Actions } from '@sveltejs/kit';
import { verifyPassword, setAdminSession, clearAdminSession } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	if (locals.isAdmin) {
		const returnUrl = url.searchParams.get('returnUrl') || '/console';
		throw redirect(303, returnUrl);
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies, platform, url }) => {
		const formData = await request.formData();
		const password = formData.get('password') as string;
		const returnUrl = (formData.get('returnUrl') as string) || url.searchParams.get('returnUrl') || '/console';

		if (!password) {
			return fail(400, { error: 'Please enter password' });
		}

		const isValid = await verifyPassword(password, platform);
		if (!isValid) {
			return fail(400, { error: 'Invalid password. Access denied.' });
		}

		await setAdminSession(cookies, platform);
		throw redirect(303, returnUrl);
	},
	logout: async ({ cookies }) => {
		await clearAdminSession(cookies);
		throw redirect(303, '/console/login');
	}
};
