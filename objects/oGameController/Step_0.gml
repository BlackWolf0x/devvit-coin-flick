/// @description Handle input, selection, and shooting

// Get input position (works for both mouse and touch)
inputX = device_mouse_x(0);
inputY = device_mouse_y(0);

// Check for press (works for touch and mouse)
var _pressed = device_mouse_check_button_pressed(0, mb_left);
var _released = device_mouse_check_button_released(0, mb_left);

// Check if shoot button is pressed
var _onShootBtn = point_in_rectangle(inputX, inputY, 
    shootBtnX - shootBtnWidth/2, shootBtnY - shootBtnHeight/2,
    shootBtnX + shootBtnWidth/2, shootBtnY + shootBtnHeight/2);

// Handle shoot button press (only when aim is locked)
if (_pressed && _onShootBtn && selectedCoin != noone && aimLocked) {
    // Shoot the selected coin immediately on press!
    if (instance_exists(selectedCoin)) {
        // Calculate shot force from power meter EXACTLY now
        var _shotForce = lerp(minShotForce, maxShotForce, powerMeterValue);
        
        // Store for debug display
        lastShotForce = _shotForce;
        
        // Use the locked aim direction with power meter force
        var _forceX = lengthdir_x(_shotForce, aimDirection);
        var _forceY = lengthdir_y(_shotForce, aimDirection);
        
        // Apply impulse to the coin
        with (selectedCoin) {
            physics_apply_impulse(x, y, _forceX, _forceY);
        }
        
        // Deselect immediately
        selectedCoin.isSelected = false;
        selectedCoin = noone;
        isAiming = false;
        aimLocked = false;
        powerMeterActive = false;
    }
}

// Clean up shootBtnPressed state on release
if (_released) {
    shootBtnPressed = false;
}

// Handle coin selection and aim lock
if (_pressed && !_onShootBtn) {
    // Check if clicking on a coin
    var _clickedCoin = instance_position(inputX, inputY, oCoin);
    
    if (_clickedCoin != noone) {
        // If clicking on the already selected coin, toggle lock
        if (_clickedCoin == selectedCoin && isAiming) {
            // Already selected, lock the aim and start power meter
            aimLocked = true;
            powerMeterActive = true;
            powerMeterValue = 0;
            powerMeterDirection = 1;
        } else {
            // Deselect previous coin
            if (selectedCoin != noone && instance_exists(selectedCoin)) {
                selectedCoin.isSelected = false;
            }
            
            // Select the new coin
            selectedCoin = _clickedCoin;
            selectedCoin.isSelected = true;
            isAiming = true;
            aimLocked = false;
        }
    } else {
        // Clicked on empty space
        if (isAiming && !aimLocked) {
            // Lock the current aim and start power meter
            aimLocked = true;
            powerMeterActive = true;
            powerMeterValue = 0;
            powerMeterDirection = 1;
        } else {
            // Deselect everything
            if (selectedCoin != noone && instance_exists(selectedCoin)) {
                selectedCoin.isSelected = false;
            }
            selectedCoin = noone;
            isAiming = false;
            aimLocked = false;
        }
    }
}

// Update aim direction while aiming (but NOT locked)
if (isAiming && !aimLocked && selectedCoin != noone && instance_exists(selectedCoin)) {
    var _dx = inputX - selectedCoin.x;
    var _dy = inputY - selectedCoin.y;
    
    if (abs(_dx) > 5 || abs(_dy) > 5) {
        // Aim direction follows the cursor directly
        aimDirection = point_direction(selectedCoin.x, selectedCoin.y, inputX, inputY);
    }
}

// Calculate guide collision (raycast)
if (isAiming && selectedCoin != noone && instance_exists(selectedCoin)) {
    var _coinX = selectedCoin.x;
    var _coinY = selectedCoin.y;
    var _coinRadius = selectedCoin.coinRadius;
    
    // Direction of the shot
    var _dirX = lengthdir_x(1, aimDirection);
    var _dirY = lengthdir_y(1, aimDirection);
    
    // Reset collision info
    hitCoin = noone;
    var _maxDist = max(room_width, room_height) * 1.5;
    
    // Use a temporary instance variable so it can be accessed in with() block
    tempHitDist = _maxDist;
    
    // Check collision with walls first
    // Calculate distance to each wall
    var _distToWall = _maxDist;
    
    // Left wall
    if (_dirX < 0) {
        var _d = (_coinRadius - _coinX) / _dirX;
        if (_d > 0 && _d < _distToWall) _distToWall = _d;
    }
    // Right wall
    if (_dirX > 0) {
        var _d = (room_width - _coinRadius - _coinX) / _dirX;
        if (_d > 0 && _d < _distToWall) _distToWall = _d;
    }
    // Top wall
    if (_dirY < 0) {
        var _d = (_coinRadius - _coinY) / _dirY;
        if (_d > 0 && _d < _distToWall) _distToWall = _d;
    }
    // Bottom wall
    if (_dirY > 0) {
        var _d = (room_height - _coinRadius - _coinY) / _dirY;
        if (_d > 0 && _d < _distToWall) _distToWall = _d;
    }
    
    tempHitDist = _distToWall;
    
    // Check collision with other coins (circle-ray intersection)
    with (oCoin) {
        if (id != other.selectedCoin) {
            // Vector from selected coin to this coin
            var _toX = x - _coinX;
            var _toY = y - _coinY;
            
            // Project onto ray direction
            var _proj = _toX * _dirX + _toY * _dirY;
            
            // Only consider coins in front of us
            if (_proj > 0) {
                // Closest point on ray to this coin's center
                var _closestX = _coinX + _dirX * _proj;
                var _closestY = _coinY + _dirY * _proj;
                
                // Distance from ray to coin center
                var _distToCoin = point_distance(_closestX, _closestY, x, y);
                
                // Combined radius (both coins)
                var _combinedRadius = _coinRadius + coinRadius;
                
                // Check if ray intersects this coin
                if (_distToCoin < _combinedRadius) {
                    // Calculate exact intersection point
                    // Back up from closest point by the amount we're inside the circle
                    var _backDist = sqrt(_combinedRadius * _combinedRadius - _distToCoin * _distToCoin);
                    var _intersectDist = _proj - _backDist;
                    
                    if (_intersectDist > _coinRadius && _intersectDist < other.tempHitDist) {
                        other.tempHitDist = _intersectDist;
                        other.hitCoin = id;
                    }
                }
            }
        }
    }
    
    // Calculate final collision point
    collisionX = _coinX + _dirX * tempHitDist;
    collisionY = _coinY + _dirY * tempHitDist;
    guideEndX = collisionX;
    guideEndY = collisionY;
}

// Power meter oscillation
if (powerMeterActive) {
    // Update power meter value
    powerMeterValue += powerMeterDirection * powerMeterSpeed * (1/60); // Assuming 60 FPS
    
    // Bounce at boundaries
    if (powerMeterValue >= 1) {
        powerMeterValue = 1;
        powerMeterDirection = -1;
    } else if (powerMeterValue <= 0) {
        powerMeterValue = 0;
        powerMeterDirection = 1;
    }
}
