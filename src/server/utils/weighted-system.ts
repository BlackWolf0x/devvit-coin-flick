/**
 * A weighted random system for selecting items based on their weights
 * 
 * @example
 * const coinWeightSystem = new WeightedSystem({
 *   "star-coin": 10,
 *   "heart-coin": 5,
 *   "normal-coin": 85
 * });
 * 
 * const randomCoin = coinWeightSystem.getRandomItem(); // Returns "star-coin", "heart-coin", or "normal-coin"
 */
export class WeightedSystem<T extends string = string> {
	private items: Map<T, number>;
	private totalWeight: number;

	constructor(weights: Record<T, number>) {
		this.items = new Map();
		this.totalWeight = 0;

		// Populate the map and calculate total weight
		for (const [key, weight] of Object.entries(weights) as [T, number][]) {
			if (weight < 0) {
				throw new Error(`Weight for "${key}" must be non-negative`);
			}
			this.items.set(key, weight);
			this.totalWeight += weight;
		}

		if (this.totalWeight === 0) {
			throw new Error('Total weight must be greater than 0');
		}
	}

	/**
	 * Get a random item based on weights
	 * @returns The key of the randomly selected item
	 */
	getRandomItem(): T {
		const random = Math.random() * this.totalWeight;
		let cumulative = 0;

		for (const [key, weight] of this.items.entries()) {
			cumulative += weight;
			if (random <= cumulative) {
				return key;
			}
		}

		// Fallback (should never reach here due to floating point precision)
		const lastKey = Array.from(this.items.keys())[this.items.size - 1];
		if (!lastKey) {
			throw new Error('No items available in weighted system');
		}
		return lastKey;
	}

	/**
	 * Get the weight of a specific item
	 */
	getWeight(key: T): number | undefined {
		return this.items.get(key);
	}

	/**
	 * Get all items and their weights
	 */
	getItems(): Record<T, number> {
		return Object.fromEntries(this.items) as Record<T, number>;
	}

	/**
	 * Get the total weight of all items
	 */
	getTotalWeight(): number {
		return this.totalWeight;
	}

	/**
	 * Get the percentage chance of an item being selected
	 */
	getPercentage(key: T): number | undefined {
		const weight = this.items.get(key);
		if (weight === undefined) return undefined;
		return (weight / this.totalWeight) * 100;
	}
}
