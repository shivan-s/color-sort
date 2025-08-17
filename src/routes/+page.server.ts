import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const colors = (await db.all()).sort(
		(a, b) => parseInt(a.name.slice(0)[0], 36) - parseInt(b.name.slice(0)[0], 36)
	);
	return { colors };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const fd = await request.formData();
		const name = fd.get('name')?.toString();
		if (!name) return fail(400, 'Name is invalid');
		const newColor = await db.insert({ name });
		return { newColor };
	},
	delete: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id')?.toString();
		if (!id) return fail(400, 'ID is invalid');
		const deletedColor = await db.deleteById(parseInt(id));
		return { deletedColor };
	},
	activate: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id')?.toString();
		if (!id) return fail(400, 'ID is invalid');
		const newRank =
			Math.max(...(await db.all()).filter((c) => c.active).map((c) => c.rank ?? 0)) + 1;
		const updatedColor = await db.update({ id: parseInt(id), active: true, rank: newRank });
		return { updatedColor };
	},
	deactivate: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id')?.toString();
		if (!id) return fail(400, 'ID is invalid');
		const updatedColor = await db.update({ id: parseInt(id), active: false, rank: null });
		return { updatedColor };
	},
	promote: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id')?.toString();
		if (!id) return fail(400, 'ID is invalid');
		const color = await db.findByIdOrThrow(parseInt(id));
		if (color.rank === null) throw Error('Rank cannot be null');
		const above = structuredClone(
			(await db.all())
				.filter((c) => c.rank)
				.filter((c) => c.rank !== null && c.rank < color.rank!)
				.reverse()[0]
		);
		await db.update({ id: above.id, rank: color.rank });
		const updatedColor = await db.update({ id: color.id, rank: above.rank });
		return { updatedColor };
	},
	demote: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id')?.toString();
		if (!id) return fail(400, 'ID is invalid');
		const color = await db.findByIdOrThrow(parseInt(id));
		if (color.rank === null) throw Error('Rank cannot be null');
		const below = structuredClone(
			(await db.all())
				.filter((c) => c.rank)
				.filter((c) => c.rank !== null && c.rank > color.rank!)[0]
		);
		await db.update({ id: below.id, rank: color.rank });
		const updatedColor = await db.update({ id: color.id, rank: below.rank });
		return { updatedColor };
	}
};
