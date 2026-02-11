/// @description Control visibility based on aim state

// Get game controller
var _controller = instance_find(oGameController, 0);
if (_controller == noone) exit;

// Only visible when aiming but aim is NOT locked
visible = (_controller.isAiming && !_controller.aimLocked && _controller.selectedCoin != noone);

// After first shot (when unselect is unavailable), center horizontally
if (!_controller.isFirstShot) {
    x = room_width / 2;
}
