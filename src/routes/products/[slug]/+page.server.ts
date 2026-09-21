import { getProductBySlug, getProducts } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const load: PageServerLoad = async ({ params, platform }) => {
	const product = await getProductBySlug(params.slug, platform);
	if (!product) {
		error(404, 'Product not found');
	}

	// Suggest up to 3 other pieces in the catalogue
	const allProducts = await getProducts(platform);
	const related = allProducts.filter((p) => p.slug !== product.slug).slice(0, 3);

	return {
		product,
		related
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const phone = String(form.get('phone') ?? '').trim();
		const subject = String(form.get('subject') ?? '').trim();
		const message = String(form.get('message') ?? '').trim();

		const errors: Record<string, string> = {};
		if (!name) errors.name = 'Please provide your name.';
		if (!email) errors.email = 'Please provide a valid email address.';
		else if (!EMAIL.test(email)) errors.email = 'That email address does not look right.';
		if (!message) errors.message = 'Please include details about your enquiry.';

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				values: { name, email, phone, subject, message }
			});
		}

		console.log('[product-enquiry]', { name, email, phone, subject, message });

		return {
			success: true,
			message: 'Thank you for your enquiry. Our team will review your specifications and contact you shortly.'
		};
	}
};
