import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';

export const load = () => {
	const colors = db
		.all()
		.sort((a, b) => parseInt(a.name.slice(0)[0], 36) - parseInt(b.name.slice(0)[0], 36));
	return { colors };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const fd = await request.formData();
		const name = fd.get('name')?.toString();
		if (!name) return fail(400, 'Name is invalid');
		const newColor = db.insert({ name });
		return { newColor };
	}
};
