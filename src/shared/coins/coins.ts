import { WeightedSystem } from "./weighted-system";

export const coins = [
    'clover',
    'club',
    'diamond',
    'heart',
    'spade',
    'bell',
    'medal',
    'shield',
    'music',
    'beer',
    'lightning',
    'snowflake',
    'crescent-moon',
    'fire',
    'skull',
    'sun',
    'atom',
    'trophy',
    'star',
    'crown'
] as const;

// Define coin types and their weights
export const coinWeightedSystem = new WeightedSystem({
    'clover': 10,
    'club': 100,
    'diamond': 100,
    'heart': 100,
    'spade': 100,
    'bell': 80,
    'medal': 80,
    'shield': 80,
    'music': 80,
    'beer': 80,
    'lightning': 50,
    'snowflake': 50,
    'crescent-moon': 50,
    'fire': 50,
    'skull': 50,
    'sun': 30,
    'atom': 20,
    'trophy': 10,
    'star': 5,
    'crown': 5,
});