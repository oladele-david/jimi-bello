import { error } from '@sveltejs/kit';
import { projects, projectBySlug } from '$lib/data/site';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const project = projectBySlug(params.slug);

	if (!project) {
		error(404, 'Project not found');
	}

	// Wraps around, so the last project still offers somewhere to go next.
	const index = projects.indexOf(project);
	const next = projects[(index + 1) % projects.length];

	return { project, next };
};
