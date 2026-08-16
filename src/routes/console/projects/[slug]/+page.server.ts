import { getProjectBySlug, saveProject, deleteProject } from '$lib/server/db';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	const project = await getProjectBySlug(params.slug, platform);

	if (!project) {
		error(404, `Project "${params.slug}" not found in database.`);
	}

	return {
		project
	};
};

export const actions: Actions = {
	saveProject: async ({ request, params, platform }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const slug = (formData.get('slug') as string)?.trim().toLowerCase() || params.slug;
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

		const result = await saveProject(projectData, platform, false);

		if (!result.success) {
			return fail(400, { error: result.error || 'Failed to update project' });
		}

		// If slug changed, redirect to new URL
		if (slug !== params.slug) {
			throw redirect(303, `/console/projects/${slug}`);
		}

		return { success: true, message: 'Project changes saved to database successfully' };
	},

	deleteProject: async ({ params, platform }) => {
		const result = await deleteProject(params.slug, platform);
		if (!result.success) {
			return fail(500, { error: result.error || 'Failed to delete project' });
		}
		throw redirect(303, '/console');
	}
};
