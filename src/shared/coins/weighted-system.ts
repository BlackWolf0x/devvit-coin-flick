import { coins } from './coins';

type CoinType = (typeof coins)[number];

/**
 * A weighted random system for selecting coins based on their weights
 * 
 * @example
 * const coinWeightSystem = new WeightedSystem({
 *   "club": 10,
 *   "spade": 5,
 *   "diamond": 85
 * });
 * 
 * const randomCoin = coinWeightSystem.getRandomItem(); // Returns "club", "spade", or "diamond"
 */
export class WeightedSystem {
	private items: Map<CoinType, number>;
	private totalWeight: number;

	constructor(weights: Partial<Record<CoinType, number>>) {
		this.items = new Map();
		this.totalWeight = 0;

		// Populate the map and calculate total weight
		for (const [key, weight] of Object.entries(weights) as [CoinType, number][]) {
			if (weight < 0) {
				throw new Error(`Weight for "${key}" must be non-negative`);
			}
			if (!coins.includes(key as CoinType)) {
				throw new Error(`Invalid coin type: "${key}". Must be one of: ${coins.join(', ')}`);
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
	getRandomItem(): CoinType {
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
	getWeight(key: CoinType): number | undefined {
		return this.items.get(key);
	}

	/**
	 * Get all items and their weights
	 */
	getItems(): Partial<Record<CoinType, number>> {
		return Object.fromEntries(this.items) as Partial<Record<CoinType, number>>;
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
	getPercentage(key: CoinType): number | undefined {
		const weight = this.items.get(key);
		if (weight === undefined) return undefined;
		return (weight / this.totalWeight) * 100;
	}
}
