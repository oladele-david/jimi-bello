import { getFromStorage } from '$lib/server/storage';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, platform }) => {
	const key = params.key;
	if (!key) {
		error(400, 'Image key is required');
	}

	const file = await getFromStorage(key, platform);
	if (!file) {
		error(404, 'Image not found');
	}

	const headers = new Headers();
	headers.set('Content-Type', file.contentType || 'image/webp');
	headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	if (file.size) {
		headers.set('Content-Length', file.size.toString());
	}

	return new Response(file.data as any, {
		status: 200,
		headers
	});
};
