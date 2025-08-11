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

interface UpdateColor extends Color {
	id: number;
	rank?: number | null;
	active?: boolean;
}

class DB {
	#sequence = 0;
	#colors: SelectColor[] = [{ id: 1, name: 'Blue', rank: 1, active: false }];

	get #sequence(): number {
		return this.#sequence;
	}

	#incrementSequence(): void {
		this.#sequence += 1;
	}

	findById(id: number): SelectColor | null {
		return this.#colors.find((m) => m.id === id) ?? null;
	}

	all(): SelectColor[] {
		return this.#colors.sort((a, b) => {
			if (a.rank === null) return -1;
			if (b.rank === null) return 1;
			return b.rank - a.rank;
		});
	}

	insert(m: InsertColor): SelectColor {
		const { id = this.#sequence, name, rank = null, active = false } = m;
		if (this.#colors.some(({ id }) => m.id === id)) throw Error('ID not unique');
		this.#incrementSequence();
		const newMaterial = { id, name, rank, active };
		this.#colors = [...this.#colors, newMaterial];
		return newMaterial;
	}

	update(m: UpdateColor): SelectColor {
		const { id, name, rank, active } = m;
		const color = this.#colors.find(({ id }) => m.id === id);
		if (color) throw Error('ID not found');
		this.#colors = [...this.#colors, newMaterial];
		return newMaterial;
	}
}

export const db = new DB();
