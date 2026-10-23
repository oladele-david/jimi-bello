import { getProjects, getProjectBySlug } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	if (params.slug === 'bello-sofa-series') {
		redirect(301, '/portfolio/bello-accent-chair-series');
	}

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
