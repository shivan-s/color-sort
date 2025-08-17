/**
 * @module  Color "Database"
 */

interface Color {
	name: string;
}

interface SelectColor extends Color {
	id: number;
	rank: number | null;
	active: boolean;
}

interface InsertColor extends Color {
	id?: number;
	rank?: number | null;
	active?: boolean;
}

interface UpdateColor extends Partial<Color> {
	id: number;
	rank?: number | null;
	active?: boolean;
}

class DB {
	#colors: SelectColor[];
	#sequence = 0;

	constructor(colors: SelectColor[]) {
		this.#colors = colors;
		this.#sequence = this.#colors.length + 1;
	}

	async #delay() {
		const p = new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
		await p;
	}

	#logger() {
		console.log('Sequence: ', this.#sequence);
		console.log('Colors: ', this.#colors);
	}

	async findById(id: number): Promise<SelectColor | null> {
		await this.#delay();
		return this.#colors.find((c) => c.id === id) ?? null;
	}

	async findByIdOrThrow(id: number): Promise<SelectColor> {
		const color = await this.findById(id);
		if (color === null) throw Error('Not found');
		return color;
	}

	async findByRank(rank: number): Promise<SelectColor | null> {
		await this.#delay();
		const color = this.#colors.find((c) => c.rank === rank) ?? null;
		return color;
	}

	async all(): Promise<SelectColor[]> {
		await this.#delay();
		return this.#colors
			.sort((a, b) => b.id - a.id)
			.sort((a, b) => {
				if (a.rank === null) return -1;
				if (b.rank === null) return 1;
				return a.rank - b.rank;
			});
	}

	async insert(c: InsertColor): Promise<SelectColor> {
		await this.#delay();
		const { id = this.#sequence, name, rank = null, active = false } = c;
		if (this.#colors.some(({ id }) => c.id === id)) throw Error('ID not unique');
		this.#sequence += 1;
		const newMaterial = { id, name, rank, active };
		this.#colors = [...this.#colors, newMaterial];
		this.#logger();
		return newMaterial;
	}

	async update(c: UpdateColor): Promise<SelectColor> {
		await this.#delay();
		const cIdx = this.#colors.findIndex((color) => c.id === color.id);
		if (cIdx === -1) throw Error('ID not found');
		const color = this.#colors[cIdx];
		this.#colors[cIdx] = {
			...c,
			name: color.name,
			rank: c.rank ?? color.rank,
			active: c.active ?? color.active
		};
		this.#logger();
		return this.#colors[cIdx];
	}

	async deleteById(id: number): Promise<SelectColor> {
		await this.#delay();
		const cIdx = this.#colors.findIndex((c) => id === c.id);
		if (cIdx === -1) throw Error('ID not found');
		const [deletedColor] = this.#colors.splice(cIdx, 1);
		this.#logger();
		return deletedColor;
	}
}

export const db = new DB([
	{ id: 1, name: 'kahurangi', rank: 5, active: true },
	{ id: 2, name: 'kākāriki', rank: null, active: false },
	{ id: 3, name: 'karaka ', rank: null, active: false },
	{ id: 4, name: 'waiporoporo', rank: 4, active: true },
	{ id: 5, name: 'parauri', rank: 3, active: true },
	{ id: 6, name: 'pango', rank: 2, active: true },
	{ id: 7, name: 'māwhero', rank: null, active: false },
	{ id: 8, name: 'mā', rank: 6, active: true },
	{ id: 9, name: 'kōwhai', rank: null, active: false },
	{ id: 10, name: 'kiwikiwi', rank: null, active: false },
	{ id: 11, name: 'kikorangi', rank: null, active: false },
	{ id: 12, name: 'whero', rank: 1, active: true }
]);
