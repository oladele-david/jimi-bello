import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	return {
		isAdmin: locals.isAdmin ?? false,
		pathname: url.pathname
	};
};
