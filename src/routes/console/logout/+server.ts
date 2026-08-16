import { clearAdminSession } from '$lib/server/auth';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	await clearAdminSession(cookies);
	throw redirect(303, '/console/login');
};

export const GET: RequestHandler = async ({ cookies }) => {
	await clearAdminSession(cookies);
	throw redirect(303, '/console/login');
};
