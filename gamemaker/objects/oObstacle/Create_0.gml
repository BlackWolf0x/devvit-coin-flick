/// @description Initialize obstacle properties

// Apply scale (2x smaller than before)
image_xscale = global.play_scale * 0.5;
image_yscale = global.play_scale * 0.5;

// Random rotation for visual variety
image_angle = random(360);

// Store initial rotation for physics
initialRotation = image_angle;

// Obstacle radius for collision calculations (after scaling)
// Use sprite_get_width to get base size, then apply the same scaling
var _baseRadius = sprite_get_width(sprite_index) / 2;
obstacleRadius = _baseRadius * global.play_scale * 0.5;

// Create scaled physics fixture
var fix = physics_fixture_create();
physics_fixture_set_circle_shape(fix, obstacleRadius);
physics_fixture_set_density(fix, 10.0);
physics_fixture_set_restitution(fix, 0.8);
physics_fixture_set_friction(fix, 0.3);
physics_fixture_set_kinematic(fix);
var _fixture_id = physics_fixture_bind(fix, id);
physics_fixture_delete(fix);

// Make sure it's kinematic (immovable)
phy_fixed_rotation = true;

// Store initial position
startX = x;
startY = y;

// Kinematic physics object - doesn't move but coins can bounce off it
// Physics properties are set in the object definition
