import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'jbc_admin_session';
const DEFAULT_PASSWORD = 'jimi-admin-2026!';
const DEFAULT_SECRET = 'jbc-interior-architecture-secret-key-2026';

// Simple lightweight constant-time HMAC-like token generation
async function createToken(secret: string): Promise<string> {
	const data = new TextEncoder().encode(`admin_authenticated_${secret}`);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function getAdminPassword(platform?: App.Platform): string {
	return platform?.env?.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

export function getAdminSecret(platform?: App.Platform): string {
	return platform?.env?.ADMIN_SECRET || process.env.ADMIN_SECRET || DEFAULT_SECRET;
}

export async function verifyPassword(password: string, platform?: App.Platform): Promise<boolean> {
	const expected = getAdminPassword(platform);
	return password === expected;
}

export async function setAdminSession(cookies: Cookies, platform?: App.Platform): Promise<void> {
	const secret = getAdminSecret(platform);
	const token = await createToken(secret);

	cookies.set(COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});
}

export async function clearAdminSession(cookies: Cookies): Promise<void> {
	cookies.delete(COOKIE_NAME, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	});
}

export async function isAdminAuthenticated(cookies: Cookies, platform?: App.Platform): Promise<boolean> {
	const token = cookies.get(COOKIE_NAME);
	if (!token) return false;

	const secret = getAdminSecret(platform);
	const expectedToken = await createToken(secret);
	return token === expectedToken;
}
