import { saveProject } from '$lib/server/db';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	saveProject: async ({ request, platform }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const slug = (formData.get('slug') as string)?.trim().toLowerCase();
		const category = formData.get('category') as any;
		const year = formData.get('year') as string;
		const location = formData.get('location') as string;
		const scope = formData.get('scope') as string;
		const excerpt = formData.get('excerpt') as string;
		const shape = (formData.get('shape') as any) || 'square';
		const hero = formData.get('hero') as string;
		const bodyJson = formData.get('bodyJson') as string;
		const galleryJson = formData.get('galleryJson') as string;

		if (!title || !slug || !hero) {
			return fail(400, { error: 'Title, Slug, and Hero Image are required.' });
		}

		let body: string[] = [];
		let gallery: { id: string; caption: string }[] = [];

		try {
			if (bodyJson) body = JSON.parse(bodyJson);
			if (galleryJson) gallery = JSON.parse(galleryJson);
		} catch {
			return fail(400, { error: 'Malformed JSON in body or gallery fields' });
		}

		const projectData = {
			slug,
			title,
			category,
			year,
			location,
			scope,
			excerpt,
			body,
			hero,
			gallery,
			shape
		};

		const result = await saveProject(projectData, platform, true);

		if (!result.success) {
			return fail(400, { error: result.error || 'Failed to save new project' });
		}

		throw redirect(303, '/console');
	}
};
