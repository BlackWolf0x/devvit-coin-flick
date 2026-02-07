/// @description Initialize coin properties

// Apply scale
image_xscale = global.play_scale * 0.5;
image_yscale = global.play_scale * 0.5;

// Create scaled physics fixture
var fix = physics_fixture_create();
physics_fixture_set_circle_shape(fix, 48 * global.play_scale);
physics_fixture_set_density(fix, 1.0);
physics_fixture_set_restitution(fix, 0.7);
physics_fixture_set_linear_damping(fix, 0.54);
physics_fixture_set_angular_damping(fix, 0.5);
physics_fixture_set_friction(fix, 0.3);
physics_fixture_bind(fix, id);
physics_fixture_delete(fix);

// Coin radius for collision calculations (after scaling)
coinRadius = 48 * global.play_scale;

// Selection state
isSelected = false;

// Shot force (constant for now)
shotForce = 2000;

// Hit detection
wasHit = false;

// Shrinking state (when going out of bounds)
isShrinking = false;
shrinkSpeed = 0.05;  // How fast to shrink (per step)

// Friction/damping will slow down the coin over time
// (configured in physics settings)
