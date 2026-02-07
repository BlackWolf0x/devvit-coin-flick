/// @description Initialize obstacle properties

// Apply scale
image_xscale = global.play_scale;
image_yscale = global.play_scale;

// Create scaled physics fixture
var fix = physics_fixture_create();
physics_fixture_set_circle_shape(fix, 48 * global.play_scale);
physics_fixture_set_density(fix, 10.0);
physics_fixture_set_restitution(fix, 0.8);
physics_fixture_set_friction(fix, 0.3);
physics_fixture_set_kinematic(fix);
physics_fixture_bind(fix, id);
physics_fixture_delete(fix);

// Store initial position
startX = x;
startY = y;

// Obstacle radius for collision calculations (after scaling)
obstacleRadius = 48 * global.play_scale;

// Kinematic physics object - doesn't move but coins can bounce off it
// Physics properties are set in the object definition
