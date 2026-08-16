import { getProjects } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const projects = await getProjects(platform);
	return {
		projects
	};
};
