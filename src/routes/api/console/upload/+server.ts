import { uploadToStorage } from '$lib/server/storage';
import { saveMediaRecord } from '$lib/server/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const slug = (formData.get('slug') as string) || 'uploads';
		const customName = formData.get('name') as string | null;

		if (!file || typeof file === 'string' || !(file instanceof Blob)) {
			return json({ success: false, error: 'No valid image file provided' }, { status: 400 });
		}

		// Validate content type
		const allowedTypes = [
			'image/jpeg',
			'image/jpg',
			'image/png',
			'image/webp',
			'image/avif',
			'image/gif',
			'image/svg+xml'
		];

		if (!allowedTypes.includes(file.type)) {
			return json(
				{
					success: false,
					error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, AVIF, SVG, GIF.`
				},
				{ status: 400 }
			);
		}

		// Sanitize file name
		const rawName = customName || file.name || 'image.webp';
		const sanitizedName = rawName
			.toLowerCase()
			.replace(/[^a-z0-9.-]/g, '-')
			.replace(/-+/g, '-');

		const key = `projects/${slug}/${Date.now()}-${sanitizedName}`;
		const arrayBuffer = await file.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		const result = await uploadToStorage(uint8Array, key, file.type, platform);

		// Record in media table
		await saveMediaRecord(
			{
				key: result.key,
				url: result.url,
				filename: rawName,
				content_type: file.type,
				size: file.size
			},
			platform
		);

		return json({
			success: true,
			key: result.key,
			url: result.url,
			filename: rawName,
			size: file.size
		});
	} catch (err: any) {
		console.error('Admin upload error:', err);
		return json(
			{
				success: false,
				error: err.message || 'Failed to upload image'
			},
			{ status: 500 }
		);
	}
};
