/// @description Mark collision between coins

// Get game controller
var _controller = instance_find(oGameController, 0);

// Don't process collisions if game is over
if (_controller != noone && (_controller.gameState == "lost" || _controller.gameState == "won")) {
    exit;
}

// When two coins collide, mark both as having been hit
// This ensures we detect the collision regardless of which coin is "active"
wasHit = true;
other.wasHit = true;

// Play coin collision sound only once per collision pair
// (only play if this coin's ID is less than the other's)
if (id < other.id) {
    audio_play_sound(sndCoinHitCoin, 1, false);
}
