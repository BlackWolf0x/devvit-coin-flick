/// @description Initialize coin properties

// Coin radius for collision calculations
coinRadius = sprite_width / 2;

// Selection state
isSelected = false;

// Shot force (constant for now)
shotForce = 2000;

// Hit detection
wasHit = false;

// Friction/damping will slow down the coin over time
// (configured in physics settings)
