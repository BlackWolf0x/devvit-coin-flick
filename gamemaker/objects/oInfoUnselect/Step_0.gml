/// @description Control visibility based on unselect availability

// Get game controller
var _controller = instance_find(oGameController, 0);
if (_controller == noone) exit;

// Only visible on first shot when a coin is selected AND aim is not locked
// (when unselecting is available)
visible = (_controller.isFirstShot && _controller.selectedCoin != noone && !_controller.aimLocked);
