/// @description Handle unselect button

// Get game controller
var _controller = instance_find(oGameController, 0);
if (_controller == noone) exit;

// Get input position
var _inputX = device_mouse_x(0);
var _inputY = device_mouse_y(0);
var _pressed = device_mouse_check_button_pressed(0, mb_left);

// Check if button is clicked
var _onButton = point_in_rectangle(_inputX, _inputY, 
    bbox_left, bbox_top, bbox_right, bbox_bottom);

// Only visible on first shot when a coin is selected
visible = (_controller.isFirstShot && _controller.selectedCoin != noone);

// Handle button press (only on first shot)
if (_pressed && _onButton && _controller.isFirstShot && _controller.selectedCoin != noone) {
    // Unselect the coin
    _controller.selectedCoin.isSelected = false;
    _controller.selectedCoin = noone;
    _controller.isAiming = false;
    _controller.aimLocked = false;
    _controller.powerMeterActive = false;
}
