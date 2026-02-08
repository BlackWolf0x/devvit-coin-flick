/// @description Coin hit obstacle sound

// Get game controller
var _controller = instance_find(oGameController, 0);

// Don't process collisions if game is over
if (_controller != noone && (_controller.gameState == "lost" || _controller.gameState == "won")) {
    exit;
}

audio_play_sound(sndCoinHitObstacle, 1, false);
