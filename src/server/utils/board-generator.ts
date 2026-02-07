export const BOARD_SIZE = 8;

export function getDailyBoardSeed(): number {
	const now = new Date();
	// Using UTC to ensure consistency
	const year = now.getUTCFullYear();
	const month = now.getUTCMonth() + 1; // 0-indexed
	const day = now.getUTCDate();
	return year * 10000 + month * 100 + day;
}

// Simple LCG seeded random
class SeededRandom {
	private state: number;

	constructor(seed: number) {
		this.state = seed;
	}

	// Returns float between 0 and 1
	next(): number {
		this.state = (this.state * 1664525 + 1013904223) % 4294967296;
		return this.state / 4294967296;
	}

	// Returns integer between 0 and max (exclusive)
	irandom(max: number): number {
		const r = this.next();
		return Math.floor(r * max);
	}
}

export function generateDailyBoard() {
	const seed = getDailyBoardSeed();
	const rng = new SeededRandom(seed);

	// Initialize 8x8 board
	// 0 = empty
	// 1 = pawn
	// (Player pieces like Queen/Rook/Bishop/Knight start at fixed positions but are not part of the puzzle board array)
	const board = Array(BOARD_SIZE)
		.fill(0)
		.map(() => Array(BOARD_SIZE).fill(0));

	// Track occupied positions (string key "x,y")
	const occupied = new Set<string>();

	// Fixed pieces configurations
	// occupied_cells[? "0,0"] = true; // Queen's position
	// occupied_cells[? "1,0"] = true; // Rook's position
	// occupied_cells[? "2,0"] = true; // Bishop's position
	// occupied_cells[? "3,0"] = true; // Knight's position
	const fixed = [
		{ x: 0, y: 0 }, // Queen
		{ x: 1, y: 0 }, // Rook
		{ x: 2, y: 0 }, // Bishop
		{ x: 3, y: 0 }, // Knight
	];

	fixed.forEach((p) => {
		occupied.add(`${p.x},${p.y}`);
		// Do not place pieces on the board, just mark as occupied
	});

	const numPawns = 24;

	for (let i = 0; i < numPawns; i++) {
		let attempts = 0;
		let found = false;

		while (attempts < 100 && !found) {
			// In GM: irandom(BOARD_SIZE - 1) -> inclusive 0..7
			// Here: irandom(BOARD_SIZE) -> exclusive 0..8 i.e. 0..7
			const x = rng.irandom(BOARD_SIZE);
			const y = rng.irandom(BOARD_SIZE);
			const key = `${x},${y}`;

			if (!occupied.has(key)) {
				occupied.add(key);
				board[x]![y] = 1; // 1 for pawn
				found = true;
			}
			attempts++;
		}
	}

	return board;
}
