import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const materials = db.all();
	return { materials, pageTitle: 'Material Selection' };
};
