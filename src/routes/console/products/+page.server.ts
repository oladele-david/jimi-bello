import { getProducts, deleteProduct, seedDefaultProducts } from '$lib/server/db';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const products = await getProducts(platform);
	return {
		products
	};
};

export const actions: Actions = {
	deleteProduct: async ({ request, platform }) => {
		const formData = await request.formData();
		const slug = formData.get('slug') as string;

		if (!slug) {
			return fail(400, { error: 'Product slug is required for deletion' });
		}

		const result = await deleteProduct(slug, platform);
		if (!result.success) {
			return fail(500, { error: result.error || 'Failed to delete product' });
		}

		return { success: true, message: `Product "${slug}" deleted successfully` };
	},

	seedDefaults: async ({ platform }) => {
		try {
			await seedDefaultProducts(platform, true);
			return { success: true, message: 'Products catalogue reset to default pieces successfully' };
		} catch (err: any) {
			return fail(500, { error: err.message || 'Failed to re-seed products' });
		}
	}
};
