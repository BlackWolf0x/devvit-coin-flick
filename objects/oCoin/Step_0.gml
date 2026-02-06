/// @description Handle coin physics bounds

// Keep coin within room bounds
var _radius = coinRadius;

// Left wall
if (phy_position_x < _radius) {
    phy_position_x = _radius;
    phy_linear_velocity_x = -phy_linear_velocity_x * 0.8;
}
// Right wall
if (phy_position_x > room_width - _radius) {
    phy_position_x = room_width - _radius;
    phy_linear_velocity_x = -phy_linear_velocity_x * 0.8;
}
// Top wall
if (phy_position_y < _radius) {
    phy_position_y = _radius;
    phy_linear_velocity_y = -phy_linear_velocity_y * 0.8;
}
// Bottom wall
if (phy_position_y > room_height - _radius) {
    phy_position_y = room_height - _radius;
    phy_linear_velocity_y = -phy_linear_velocity_y * 0.8;
}
