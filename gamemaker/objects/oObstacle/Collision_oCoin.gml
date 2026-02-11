/// @description Coin hit obstacle - add extra bounce

// Get game controller
var _controller = instance_find(oGameController, 0);

// Don't process collisions if game is over
if (_controller != noone && (_controller.gameState == "lost" || _controller.gameState == "won")) {
    exit;
}

// Only play sound if coin is moving significantly
var _coinSpeed = sqrt(other.phy_linear_velocity_x * other.phy_linear_velocity_x + other.phy_linear_velocity_y * other.phy_linear_velocity_y);
var _speedThreshold = 50;  // Minimum speed to play collision sound

if (_coinSpeed > _speedThreshold) {
    audio_play_sound(sndCoinHitObstacle, 1, false);
    
    // Add extra bounce for obstacle collisions
    // Calculate bounce direction (away from obstacle center)
    var _bounceDir = point_direction(x, y, other.x, other.y);
    
    // This gives a % boost to the bounce effect for obstacles only e.g 0.1 means 10%
    var _boostFactor = 0.2;
    var _boostX = lengthdir_x(_coinSpeed * _boostFactor, _bounceDir);
    var _boostY = lengthdir_y(_coinSpeed * _boostFactor, _bounceDir);
    
    with (other) {
        phy_linear_velocity_x += _boostX;
        phy_linear_velocity_y += _boostY;
    }
}
