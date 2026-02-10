/// @description Keep obstacle stationary

// Force position to stay at spawn location
phy_position_x = startX;
phy_position_y = startY;

// Force velocity to zero
phy_linear_velocity_x = 0;
phy_linear_velocity_y = 0;
phy_angular_velocity = 0;
phy_rotation = initialRotation;
