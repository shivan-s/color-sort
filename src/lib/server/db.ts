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

class DB {
	#colors: SelectColor[] = [{ id: 1, name: 'Blue', rank: 1, active: false }];
	#sequence = this.#colors.length + 1;

	#logger() {
		console.log('Sequence: ', this.#sequence);
		console.log('Colors: ', this.#colors);
	}

	findById(id: number): SelectColor | null {
		return this.#colors.find((m) => m.id === id) ?? null;
	}

	all(): SelectColor[] {
		return this.#colors
			.sort((a, b) => b.id - a.id)
			.sort((a, b) => {
				if (a.rank === null) return -1;
				if (b.rank === null) return 1;
				return b.rank - a.rank;
			});
	}

	insert(c: InsertColor): SelectColor {
		const { id = this.#sequence, name, rank = null, active = false } = c;
		if (this.#colors.some(({ id }) => c.id === id)) throw Error('ID not unique');
		this.#sequence += 1;
		const newMaterial = { id, name, rank, active };
		this.#colors = [...this.#colors, newMaterial];
		this.#logger();
		return newMaterial;
	}

	deleteById(id: number): SelectColor {
		const cIdx = this.#colors.findIndex((c) => id === c.id);
		if (cIdx === -1) throw Error('ID not found');
		const [deletedColor] = this.#colors.splice(cIdx, 1);
		this.#logger();
		return deletedColor;
	}
}

export const db = new DB();
