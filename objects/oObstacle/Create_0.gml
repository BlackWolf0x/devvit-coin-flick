/// @description Initialize obstacle properties

// Store initial position
startX = x;
startY = y;

// Obstacle radius for collision calculations
obstacleRadius = sprite_width / 2;

// Kinematic physics object - doesn't move but coins can bounce off it
// Physics properties are set in the object definition
