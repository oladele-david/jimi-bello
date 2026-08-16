import { getProjects, getProjectBySlug } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	const project = await getProjectBySlug(params.slug, platform);

	if (!project) {
		error(404, 'Project not found');
	}

	const allProjects = await getProjects(platform);
	const index = allProjects.findIndex((p) => p.slug === project.slug);
	const next = allProjects.length > 0 ? allProjects[(index + 1) % allProjects.length] : project;

	return {
		project,
		next
	};
};
