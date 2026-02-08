/// @description Initialize coin properties

// Apply scale
image_xscale = global.play_scale * 0.5;
image_yscale = global.play_scale * 0.5;

// Random rotation for visual variety
image_angle = random(360);

// Coin radius for collision calculations (after scaling)
coinRadius = sprite_width / 2 * global.play_scale;

// Create scaled physics fixture
var fix = physics_fixture_create();
physics_fixture_set_circle_shape(fix, coinRadius);
physics_fixture_set_density(fix, 1.0);
physics_fixture_set_restitution(fix, 0.5);  // Less bouncy
physics_fixture_set_linear_damping(fix, 0.1);  // Very low base damping for long travel
physics_fixture_set_angular_damping(fix, 0.8);  // Moderate angular damping
physics_fixture_set_friction(fix, 0.2);  // Low friction
physics_fixture_bind(fix, id);
physics_fixture_delete(fix);

// Set physics rotation after fixture is created
phy_rotation = image_angle;

// Selection state
isSelected = false;

// Hit detection
wasHit = false;

// Shrinking state (when going out of bounds)
isShrinking = false;
shrinkSpeed = 0.05;  // How fast to shrink (per step)

// Friction/damping will slow down the coin over time
// (configured in physics settings)
