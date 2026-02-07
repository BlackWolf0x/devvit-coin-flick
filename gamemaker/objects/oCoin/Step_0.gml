/// @description Handle coin physics bounds

// Stop coin if velocity is very low (prevents endless drifting)
var _speed = sqrt(phy_linear_velocity_x * phy_linear_velocity_x + phy_linear_velocity_y * phy_linear_velocity_y);
var _stopThreshold = 10;  // Very low speed threshold

if (_speed < _stopThreshold && _speed > 0) {
    phy_linear_velocity_x = 0;
    phy_linear_velocity_y = 0;
    phy_angular_velocity = 0;
}

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
