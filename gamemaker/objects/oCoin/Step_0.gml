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

// Apply dynamic damping - increases as coin slows down for more realistic stopping
var _speed = sqrt(phy_linear_velocity_x * phy_linear_velocity_x + phy_linear_velocity_y * phy_linear_velocity_y);

// Apply additional velocity reduction when moving (simulates table friction)
if (_speed > 0) {
    // Calculate damping factor based on speed (more damping at lower speeds)
    var _maxSpeed = 600;  // Reference speed for damping calculation
    var _speedRatio = clamp(_speed / _maxSpeed, 0, 1);
    
    // Damping increases as speed decreases (inverse relationship)
    // At high speeds: almost no damping (0.995), at low speeds: more damping (0.93)
    var _additionalDamping = lerp(0.93, 0.995, _speedRatio);
    
    // Apply damping
    phy_linear_velocity_x *= _additionalDamping;
    phy_linear_velocity_y *= _additionalDamping;
    phy_angular_velocity *= _additionalDamping;
}

// Stop coin completely if velocity is very low (prevents endless drifting)
var _stopThreshold = 25;  // Threshold for complete stop

if (_speed < _stopThreshold && _speed > 0) {
    phy_linear_velocity_x = 0;
    phy_linear_velocity_y = 0;
    phy_angular_velocity = 0;
}
