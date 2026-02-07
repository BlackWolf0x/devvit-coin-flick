/// @description Handle lock aim button

// Get game controller
var _controller = instance_find(oGameController, 0);
if (_controller == noone) exit;

// Get input position
var _inputX = device_mouse_x(0);
var _inputY = device_mouse_y(0);
var _pressed = device_mouse_check_button_pressed(0, mb_left);
var _spacePressed = keyboard_check_pressed(vk_space);

// Check if button is clicked
var _onButton = point_in_rectangle(_inputX, _inputY, 
    bbox_left, bbox_top, bbox_right, bbox_bottom);

// Only visible when aiming but aim not locked yet
visible = (_controller.isAiming && !_controller.aimLocked && _controller.selectedCoin != noone && !_controller.coinsMoving);

// Handle button press (or spacebar)
if (((_pressed && _onButton) || _spacePressed) && 
    _controller.isAiming && !_controller.aimLocked && _controller.selectedCoin != noone) {
    // Lock the aim
    _controller.aimLocked = true;
    _controller.powerMeterActive = true;
    _controller.powerMeterValue = 0;
    _controller.powerMeterDirection = 1;
}
