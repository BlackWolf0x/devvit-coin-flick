/// @description Initialize coin properties

// Set sprite based on active coin (if available)
if (variable_global_exists("active_coin_sprite")) {
    sprite_index = global.active_coin_sprite;
}

// Apply scale
image_xscale = global.play_scale * 0.5;
image_yscale = global.play_scale * 0.5;

// Random rotation for visual variety
image_angle = random(360);

// Coin radius for collision calculations (after scaling)
// Use sprite_get_width to get base size, then apply the same scaling
var _baseRadius = sprite_get_width(sprite_index) / 2;
coinRadius = _baseRadius * global.play_scale * 0.5;

// PHYSICS SCALING: Scale all physics properties to maintain consistent feel across platforms
// Smaller coins (desktop at 0.9 scale) need proportionally adjusted physics
var _scaledDensity = 1.0 * global.play_scale;
var _scaledLinearDamping = 0.1 / global.play_scale;  // Inverse scale - smaller coins need MORE damping
var _scaledAngularDamping = 0.8 / global.play_scale;  // Inverse scale
var _scaledFriction = 0.2 / global.play_scale;  // Inverse scale - more friction for smaller coins
var _bounciness = 0.7;

// Create scaled physics fixture
var fix = physics_fixture_create();
physics_fixture_set_circle_shape(fix, coinRadius);
physics_fixture_set_density(fix, _scaledDensity);
physics_fixture_set_restitution(fix, _bounciness);  // Bounciness doesn't need scaling
physics_fixture_set_linear_damping(fix, _scaledLinearDamping);
physics_fixture_set_angular_damping(fix, _scaledAngularDamping);
physics_fixture_set_friction(fix, _scaledFriction);
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

// Create spark particle system for collision VFX
global.spark_system = part_system_create();
part_system_depth(global.spark_system, -100);

global.spark_particle = part_type_create();
part_type_shape(global.spark_particle, pt_shape_star);
part_type_size(global.spark_particle, 0.05, 0.15, -0.01, 0);
part_type_color2(global.spark_particle, c_yellow, c_orange);
part_type_alpha3(global.spark_particle, 0.8, 0.6, 0);
part_type_speed(global.spark_particle, 1, 3, -0.1, 0);
part_type_direction(global.spark_particle, 0, 360, 0, 0);
part_type_life(global.spark_particle, 10, 20);
