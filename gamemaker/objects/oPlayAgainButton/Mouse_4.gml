/// @description Only restart if game is over

// Get game controller
var _controller = instance_find(oGameController, 0);

// Only allow restart if game is over
if (_controller != noone && (_controller.gameState == "lost" || _controller.gameState == "won")) {
    room_restart();
}