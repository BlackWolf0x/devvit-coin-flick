/// @description Handle shoot/flick button

// Get game controller
var _controller = instance_find(oGameController, 0);
if (_controller == noone) exit;

// Only visible and active when aim is locked (power mode active)
visible = (_controller.aimLocked && !_controller.coinsMoving);

// Exit early if not visible - don't process any input
if (!visible) exit;

// Get input position
var _inputX = device_mouse_x(0);
var _inputY = device_mouse_y(0);
var _pressed = device_mouse_check_button_pressed(0, mb_left);
var _spacePressed = keyboard_check_pressed(vk_space);

// Check if button is clicked
var _onButton = point_in_rectangle(_inputX, _inputY, 
    bbox_left, bbox_top, bbox_right, bbox_bottom);

// Handle button press (or spacebar) - allow shooting when aim is locked OR when aiming
if (((_pressed && _onButton) || _spacePressed) && !_controller.coinsMoving && 
    ((_controller.selectedCoin != noone) || _controller.aimLocked)) {
    // If aim is locked, shoot!
    if (_controller.aimLocked) {
        if (instance_exists(_controller.selectedCoin)) {
            // Calculate shot force from power meter
            var _shotForce = lerp(_controller.minShotForce, _controller.maxShotForce, _controller.powerMeterValue);
            
            // Scale force by play_scale to maintain consistent physics across platforms
            // Desktop (0.9 scale) should shoot with 90% force for same travel distance
            _shotForce *= global.play_scale;
            
            // Store for debug display
            _controller.lastShotForce = _shotForce;
            
            // Use the locked aim direction with power meter force
            var _forceX = lengthdir_x(_shotForce, _controller.aimDirection);
            var _forceY = lengthdir_y(_shotForce, _controller.aimDirection);
            
            // Apply impulse to the coin
            with (_controller.selectedCoin) {
                physics_apply_impulse(x, y, _forceX, _forceY);
            }
            
            // Play flick sound
            audio_play_sound(sndFlick, 1, false);
            
            // Track this shot
            _controller.lastShotCoin = _controller.selectedCoin;
            _controller.waitingForHit = true;
            _controller.isFirstShot = false;
            
            // Start timer on first shot
            if (!_controller.timerRunning) {
                _controller.timerRunning = true;
                _controller.startTime = current_time;
            }
            
            // Deselect immediately
            _controller.selectedCoin.isSelected = false;
            _controller.selectedCoin = noone;
            _controller.isAiming = false;
            _controller.aimLocked = false;
            _controller.powerMeterActive = false;
        }
    }
    // If aim is not locked but we're aiming, lock it
    else if (_controller.isAiming && !_controller.aimLocked) {
        _controller.aimLocked = true;
        _controller.powerMeterActive = true;
        _controller.powerMeterValue = 0;
        _controller.powerMeterDirection = 1;
    }
}
