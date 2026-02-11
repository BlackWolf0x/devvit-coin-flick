/// @description Control visibility based on aim lock state

// Get game controller
var _controller = instance_find(oGameController, 0);
if (_controller == noone) exit;

// Only visible when aim is locked
visible = _controller.aimLocked;
