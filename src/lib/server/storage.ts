import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const LOCAL_UPLOADS_DIR = join(process.cwd(), 'static', 'uploads');

export async function uploadToStorage(
	data: Uint8Array | ArrayBuffer,
	key: string,
	contentType: string,
	platform?: App.Platform
): Promise<{ key: string; url: string }> {
	const bucket = platform?.env?.IMAGES_BUCKET;

	// Normalize key (strip leading slashes)
	const normalizedKey = key.replace(/^\/+/, '');

	if (bucket) {
		await bucket.put(normalizedKey, data, {
			httpMetadata: {
				contentType: contentType || 'image/webp'
			}
		});
		return {
			key: normalizedKey,
			url: `/api/images/${normalizedKey}`
		};
	}

	// Fallback to local filesystem during Vite dev mode
	try {
		const targetPath = join(LOCAL_UPLOADS_DIR, normalizedKey);
		const parentDir = join(targetPath, '..');
		if (!existsSync(parentDir)) {
			mkdirSync(parentDir, { recursive: true });
		}
		const buffer = data instanceof Uint8Array ? data : new Uint8Array(data);
		writeFileSync(targetPath, buffer);

		return {
			key: normalizedKey,
			url: `/uploads/${normalizedKey}`
		};
	} catch (err) {
		console.error('Failed to save to local uploads fallback:', err);
		throw err;
	}
}

export async function getFromStorage(
	key: string,
	platform?: App.Platform
): Promise<{ data: BodyInit | Uint8Array | ReadableStream; contentType: string; size?: number } | null> {
	const bucket = platform?.env?.IMAGES_BUCKET;
	const normalizedKey = key.replace(/^\/+/, '');

	if (bucket) {
		const object = await bucket.get(normalizedKey);
		if (!object) return null;

		return {
			data: object.body,
			contentType: object.httpMetadata?.contentType || 'image/webp',
			size: object.size
		};
	}

	// Local filesystem fallback
	try {
		const targetPath = join(LOCAL_UPLOADS_DIR, normalizedKey);
		if (existsSync(targetPath)) {
			const fileBuffer = readFileSync(targetPath);
			const ext = normalizedKey.split('.').pop()?.toLowerCase();
			let contentType = 'image/webp';
			if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
			if (ext === 'png') contentType = 'image/png';
			if (ext === 'svg') contentType = 'image/svg+xml';
			if (ext === 'avif') contentType = 'image/avif';

			return {
				data: fileBuffer,
				contentType,
				size: fileBuffer.length
			};
		}
	} catch {
		// Ignore
	}

	return null;
}

export async function deleteFromStorage(key: string, platform?: App.Platform): Promise<boolean> {
	const bucket = platform?.env?.IMAGES_BUCKET;
	const normalizedKey = key.replace(/^\/+/, '');

	if (bucket) {
		await bucket.delete(normalizedKey);
		return true;
	}

	try {
		const targetPath = join(LOCAL_UPLOADS_DIR, normalizedKey);
		if (existsSync(targetPath)) {
			unlinkSync(targetPath);
			return true;
		}
	} catch {
		// Ignore
	}

	return true;
}
