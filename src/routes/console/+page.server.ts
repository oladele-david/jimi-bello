import { getProjects, deleteProject, seedDefaultProjects } from '$lib/server/db';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const projects = await getProjects(platform);
	return {
		projects
	};
};

export const actions: Actions = {
	deleteProject: async ({ request, platform }) => {
		const formData = await request.formData();
		const slug = formData.get('slug') as string;

		if (!slug) {
			return fail(400, { error: 'Project slug is required for deletion' });
		}

		const result = await deleteProject(slug, platform);
		if (!result.success) {
			return fail(500, { error: result.error || 'Failed to delete project' });
		}

		return { success: true, message: `Project "${slug}" deleted successfully` };
	},

	seedDefaults: async ({ platform }) => {
		try {
			await seedDefaultProjects(platform, true);
			return { success: true, message: 'Database reset to default projects successfully' };
		} catch (err: any) {
			return fail(500, { error: err.message || 'Failed to re-seed projects' });
		}
	}
};
