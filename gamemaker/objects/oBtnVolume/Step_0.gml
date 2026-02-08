/// @description Handle volume button clicks

// Get input position
var _inputX = device_mouse_x(0);
var _inputY = device_mouse_y(0);
var _pressed = device_mouse_check_button_pressed(0, mb_left);

// Check if button is clicked
var _onButton = point_in_rectangle(_inputX, _inputY, 
    bbox_left, bbox_top, bbox_right, bbox_bottom);

if (_pressed && _onButton) {
    // Toggle volume
    volumeSettings_toggle();
    
    // Update sprite
    if (global.volume_muted) {
        sprite_index = sVolOff;
    } else {
        sprite_index = sVolOn;
    }
}
