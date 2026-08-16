import type { Cookies } from '@sveltejs/kit';

const COOKIE_SESSION_NAME = 'jbc_admin_session';
const COOKIE_RATELIMIT_NAME = 'jbc_ratelimit';
const DEFAULT_PASSWORD = 'jimi-admin-2026!';
const DEFAULT_SECRET = 'jbc-interior-architecture-secret-key-2026';

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_SECONDS = 300; // 5 minutes

// Simple lightweight constant-time token generation
async function createToken(secret: string): Promise<string> {
	const data = new TextEncoder().encode(`admin_authenticated_${secret}`);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Cryptographically sign a data string
async function signString(payload: string, secret: string): Promise<string> {
	const data = new TextEncoder().encode(`${payload}:${secret}`);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const sig = Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.slice(0, 16)
		.join('');
	return `${payload}.${sig}`;
}

// Verify a cryptographically signed data string
async function verifySignedString(signedStr: string, secret: string): Promise<string | null> {
	const dotIndex = signedStr.lastIndexOf('.');
	if (dotIndex === -1) return null;
	const payload = signedStr.slice(0, dotIndex);
	const expected = await signString(payload, secret);
	if (signedStr === expected) return payload;
	return null;
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

	cookies.set(COOKIE_SESSION_NAME, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});

	// Successfully authenticated: clear any failed attempt history
	await resetLoginRateLimit(cookies);
}

export async function clearAdminSession(cookies: Cookies): Promise<void> {
	cookies.delete(COOKIE_SESSION_NAME, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	});
}

export async function isAdminAuthenticated(cookies: Cookies, platform?: App.Platform): Promise<boolean> {
	const token = cookies.get(COOKIE_SESSION_NAME);
	if (!token) return false;

	const secret = getAdminSecret(platform);
	const expectedToken = await createToken(secret);
	return token === expectedToken;
}

export interface RateLimitStatus {
	isLocked: boolean;
	attempts: number;
	remainingAttempts: number;
	remainingSeconds: number;
}

/**
 * Check if the current client is locked out due to exceeding maximum password attempts.
 */
export async function getLoginRateLimitStatus(cookies: Cookies, platform?: App.Platform): Promise<RateLimitStatus> {
	const raw = cookies.get(COOKIE_RATELIMIT_NAME);
	if (!raw) {
		return {
			isLocked: false,
			attempts: 0,
			remainingAttempts: MAX_LOGIN_ATTEMPTS,
			remainingSeconds: 0
		};
	}

	const secret = getAdminSecret(platform);
	const verified = await verifySignedString(raw, secret);
	if (!verified) {
		return {
			isLocked: false,
			attempts: 0,
			remainingAttempts: MAX_LOGIN_ATTEMPTS,
			remainingSeconds: 0
		};
	}

	// Payload format: "attempts:lockedUntil"
	const [attemptsStr, lockedUntilStr] = verified.split(':');
	const attempts = parseInt(attemptsStr, 10) || 0;
	const lockedUntil = parseInt(lockedUntilStr, 10) || 0;
	const now = Date.now();

	if (lockedUntil > now) {
		const remainingSeconds = Math.ceil((lockedUntil - now) / 1000);
		return {
			isLocked: true,
			attempts,
			remainingAttempts: 0,
			remainingSeconds
		};
	}

	// If lockout expired, reset attempts
	if (lockedUntil > 0 && lockedUntil <= now) {
		await resetLoginRateLimit(cookies);
		return {
			isLocked: false,
			attempts: 0,
			remainingAttempts: MAX_LOGIN_ATTEMPTS,
			remainingSeconds: 0
		};
	}

	return {
		isLocked: false,
		attempts,
		remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - attempts),
		remainingSeconds: 0
	};
}

/**
 * Record a failed login attempt and lock if threshold is met.
 */
export async function recordFailedLoginAttempt(cookies: Cookies, platform?: App.Platform): Promise<RateLimitStatus> {
	const current = await getLoginRateLimitStatus(cookies, platform);
	const newAttempts = current.attempts + 1;
	const secret = getAdminSecret(platform);
	const now = Date.now();

	let lockedUntil = 0;
	let isLocked = false;
	let remainingSeconds = 0;

	if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
		isLocked = true;
		lockedUntil = now + LOCKOUT_DURATION_SECONDS * 1000;
		remainingSeconds = LOCKOUT_DURATION_SECONDS;
	}

	const payload = `${newAttempts}:${lockedUntil}`;
	const signedValue = await signString(payload, secret);

	cookies.set(COOKIE_RATELIMIT_NAME, signedValue, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: LOCKOUT_DURATION_SECONDS + 600 // preserve until expired
	});

	return {
		isLocked,
		attempts: newAttempts,
		remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - newAttempts),
		remainingSeconds
	};
}

/**
 * Reset and remove the rate limit tracking cookie on successful login.
 */
export async function resetLoginRateLimit(cookies: Cookies): Promise<void> {
	cookies.delete(COOKIE_RATELIMIT_NAME, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	});
}
