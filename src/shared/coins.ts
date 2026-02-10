import { WeightedSystem } from "./weighted-system";

export const coins = [
    'club',
    'spade',
    'diamond',
    'heart',
    'beer'
] as const;

// Define coin types and their weights
export const coinWeightedSystem = new WeightedSystem({
	'club': 50,
	'spade': 50,
	'diamond': 50,
	'heart': 50,
    'beer': 20
});