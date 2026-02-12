/// @description Mark collision between coins

// Get game controller
var _controller = instance_find(oGameController, 0);

// Don't process collisions if game is over
if (_controller != noone && (_controller.gameState == "lost" || _controller.gameState == "won")) {
    exit;
}

// Only play sound if at least one coin is moving significantly
var _mySpeed = sqrt(phy_linear_velocity_x * phy_linear_velocity_x + phy_linear_velocity_y * phy_linear_velocity_y);
var _otherSpeed = sqrt(other.phy_linear_velocity_x * other.phy_linear_velocity_x + other.phy_linear_velocity_y * other.phy_linear_velocity_y);
var _speedThreshold = 50;  // Minimum speed to play collision sound

// When two coins collide, mark both as having been hit
// This ensures we detect the collision regardless of which coin is "active"
wasHit = true;
other.wasHit = true;

// Play coin collision sound only if coins are actually moving
// (only play if this coin's ID is less than the other's to avoid duplicate sounds)
if (id < other.id && (_mySpeed > _speedThreshold || _otherSpeed > _speedThreshold)) {
    audio_play_sound(sndCoinHitCoin, 1, false);
    
    // Create spark VFX at collision point
    var _collisionX = (x + other.x) / 2;
    var _collisionY = (y + other.y) / 2;
    part_particles_create(global.spark_system, _collisionX, _collisionY, global.spark_particle, 10);
}
