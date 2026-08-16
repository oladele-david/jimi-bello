import { getMediaList, deleteMediaRecord } from '$lib/server/db';
import { deleteFromStorage } from '$lib/server/storage';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const media = await getMediaList(platform);
	return {
		media
	};
};

export const actions: Actions = {
	deleteMedia: async ({ request, platform }) => {
		const formData = await request.formData();
		const key = formData.get('key') as string;

		if (!key) {
			return fail(400, { error: 'Media key is required for deletion' });
		}

		await deleteFromStorage(key, platform);
		await deleteMediaRecord(key, platform);

		return { success: true, message: 'Media file removed successfully' };
	}
};
