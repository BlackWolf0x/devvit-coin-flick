/// @description Handle coin physics

// Handle shrinking animation
if (isShrinking) {
    image_xscale -= shrinkSpeed;
    image_yscale -= shrinkSpeed;
    
    // Destroy when fully shrunk
    if (image_xscale <= 0) {
        instance_destroy();
    }
    exit;  // Skip normal physics when shrinking
}

// Stop coin if velocity is very low (prevents endless drifting)
var _speed = sqrt(phy_linear_velocity_x * phy_linear_velocity_x + phy_linear_velocity_y * phy_linear_velocity_y);
var _stopThreshold = 10;  // Very low speed threshold

if (_speed < _stopThreshold && _speed > 0) {
    phy_linear_velocity_x = 0;
    phy_linear_velocity_y = 0;
    phy_angular_velocity = 0;
}
