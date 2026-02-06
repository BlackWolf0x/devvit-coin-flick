/// @description Mark collision between coins

// When two coins collide, mark both as having been hit
// This ensures we detect the collision regardless of which coin is "active"
wasHit = true;
other.wasHit = true;
