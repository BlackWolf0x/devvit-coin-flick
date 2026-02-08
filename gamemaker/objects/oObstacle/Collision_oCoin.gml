/// @description Coin hit obstacle sound

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
}
