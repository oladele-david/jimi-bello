import { getProductBySlug, saveProduct, deleteProduct } from '$lib/server/db';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	const product = await getProductBySlug(params.slug, platform);

	if (!product) {
		error(404, `Product "${params.slug}" not found in catalogue database.`);
	}

	return {
		product
	};
};

export const actions: Actions = {
	saveProduct: async ({ request, params, platform }) => {
		const formData = await request.formData();

		const title = (formData.get('title') as string)?.trim();
		const slug = (formData.get('slug') as string)?.trim().toLowerCase() || params.slug;
		const category = (formData.get('category') as string)?.trim() || 'Living';
		const price = (formData.get('price') as string)?.trim();
		const priceNote = (formData.get('priceNote') as string)?.trim() || undefined;
		const leadTime = (formData.get('leadTime') as string)?.trim() || undefined;
		const description = (formData.get('description') as string)?.trim();
		const image = (formData.get('image') as string)?.trim();
		const material = (formData.get('material') as string)?.trim() || undefined;
		const dimensions = (formData.get('dimensions') as string)?.trim() || undefined;
		const featured = formData.get('featured') === 'true';

		const galleryJson = formData.get('galleryJson') as string;
		const detailsJson = formData.get('detailsJson') as string;

		if (!title || !slug || !price || !image) {
			return fail(400, { error: 'Title, URL Slug, Price, and Primary Image are required.' });
		}

		let gallery: string[] = [];
		let details: { label: string; value: string }[] = [];

		try {
			if (galleryJson) gallery = JSON.parse(galleryJson);
			if (detailsJson) details = JSON.parse(detailsJson);
		} catch {
			return fail(400, { error: 'Malformed gallery or specification details.' });
		}

		const productData = {
			slug,
			title,
			category,
			price,
			priceNote,
			leadTime,
			description,
			image,
			material,
			dimensions,
			gallery,
			featured,
			details
		};

		const result = await saveProduct(productData, platform, false);

		if (!result.success) {
			return fail(400, { error: result.error || 'Failed to update product' });
		}

		if (slug !== params.slug) {
			throw redirect(303, `/console/products/${slug}`);
		}

		return { success: true, message: 'Product updated successfully' };
	},

	deleteProduct: async ({ params, platform }) => {
		const result = await deleteProduct(params.slug as string, platform);
		if (!result.success) {
			return fail(500, { error: result.error || 'Failed to delete product' });
		}
		throw redirect(303, '/console/products');
	}
};
