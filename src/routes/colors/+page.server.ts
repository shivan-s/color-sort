import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const colors = (await db.all()).filter((c) => c.active);
	return { colors, pageTitle: 'Color Selection' };
};
