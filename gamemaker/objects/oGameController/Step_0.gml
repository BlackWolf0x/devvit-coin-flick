/// ⚠⚠⚠ this object really needs cleaning up and a lot of logic here should be handled elsewhere.

/// @description Handle input, selection, and shooting

// Get input position (works for both mouse and touch)
inputX = device_mouse_x(0);
inputY = device_mouse_y(0);

// Update cursor based on hover state
var _hoveringSelectableCoin = false;
var _hoveringButton = false;

// Check if hovering over buttons
with (oBtnVolume) {
    if (point_in_rectangle(other.inputX, other.inputY, bbox_left, bbox_top, bbox_right, bbox_bottom)) {
        _hoveringButton = true;
    }
}
with (oBtnRestartIcon) {
    if (point_in_rectangle(other.inputX, other.inputY, bbox_left, bbox_top, bbox_right, bbox_bottom)) {
        _hoveringButton = true;
    }
}

if (!coinsMoving && !waitingForHit && (gameState != "lost" && gameState != "won")) {
    // Only show hand cursor on first shot when no coin is selected yet
    if (isFirstShot && selectedCoin == noone) {
        var _hoveredCoin = instance_position(inputX, inputY, oCoin);
        if (_hoveredCoin != noone) {
            _hoveringSelectableCoin = true;
        }
    }
}

// Set cursor based on hover state
if (_hoveringButton || _hoveringSelectableCoin) {
    window_set_cursor(cr_handpoint);
} else {
    window_set_cursor(cr_default);
}

// Check for press (works for touch and mouse)
var _pressed = device_mouse_check_button_pressed(0, mb_left);
var _released = device_mouse_check_button_released(0, mb_left);
var _rightPressed = device_mouse_check_button_pressed(0, mb_right);

// Check for spacebar press
var _spacePressed = keyboard_check_pressed(vk_space);

// Handle right-click behavior
if (_rightPressed && !coinsMoving && !waitingForHit) {
    // If aim is locked, unlock it (don't unselect)
    if (aimLocked) {
        aimLocked = false;
        powerMeterActive = false;
        powerMeterValue = 0;
    }
    // If aim is not locked but on first shot with coin selected, unselect
    else if (isFirstShot && selectedCoin != noone) {
        selectedCoin.isSelected = false;
        selectedCoin = noone;
        isAiming = false;
    }
}

// Check if any coin has fallen off the table (more than half outside play area)
var _anyOutOfBounds = false;
with (oCoin) {
    var _playLeft = other.playAreaX;
    var _playTop = other.playAreaY;
    var _playRight = other.playAreaX + other.playAreaWidth;
    var _playBottom = other.playAreaY + other.playAreaHeight;
    
    // A coin falls when more than half of it is off the table
    // This means the center must be just past the edge (51% off = center 1% past edge)
    var _fallThreshold = coinRadius * 0.01;  // Very small threshold for ~51% off
    
    var _fallenOff = false;
    
    // Check each edge - coin falls if center is too far past the boundary
    // Left edge: coin center is to the left of (playLeft - fallThreshold)
    if (x < _playLeft - _fallThreshold) {
        _fallenOff = true;
    }
    // Right edge: coin center is to the right of (playRight + fallThreshold)
    else if (x > _playRight + _fallThreshold) {
        _fallenOff = true;
    }
    // Top edge: coin center is above (playTop - fallThreshold)
    else if (y < _playTop - _fallThreshold) {
        _fallenOff = true;
    }
    // Bottom edge: coin center is below (playBottom + fallThreshold)
    else if (y > _playBottom + _fallThreshold) {
        _fallenOff = true;
    }
    
    // Check corners - coin can fall off diagonally at corners
    // Only check corners if we're outside the table bounds on both axes
    if (!_fallenOff) {
        // Top-left corner
        if (x < _playLeft && y < _playTop) {
            var _distToCorner = point_distance(x, y, _playLeft, _playTop);
            if (_distToCorner > coinRadius - _fallThreshold) {
                _fallenOff = true;
            }
        }
        // Top-right corner
        else if (x > _playRight && y < _playTop) {
            var _distToCorner = point_distance(x, y, _playRight, _playTop);
            if (_distToCorner > coinRadius - _fallThreshold) {
                _fallenOff = true;
            }
        }
        // Bottom-left corner
        else if (x < _playLeft && y > _playBottom) {
            var _distToCorner = point_distance(x, y, _playLeft, _playBottom);
            if (_distToCorner > coinRadius - _fallThreshold) {
                _fallenOff = true;
            }
        }
        // Bottom-right corner
        else if (x > _playRight && y > _playBottom) {
            var _distToCorner = point_distance(x, y, _playRight, _playBottom);
            if (_distToCorner > coinRadius - _fallThreshold) {
                _fallenOff = true;
            }
        }
    }
    
    if (_fallenOff && !isShrinking) {
        audio_play_sound(sndCoinFall, 1, false);
        startCoinShrink(id);
        _anyOutOfBounds = true;
    }
}

// Set game state to lost if any coin went out of bounds
if (_anyOutOfBounds) {
    if (gameState != "lost") {  // Only play sound once
        audio_play_sound(sndLose, 1, false);
        gameState = "lost";
    }
}

// Exit early if game is over (let oGameOver handle input)
if (gameState == "lost" || gameState == "won") {
    // Stop timer when won
    if (gameState == "won") {
        timerRunning = false;
    }
    exit;
}

// Check if any coins are moving
coinsMoving = false;
with (oCoin) {
    var _speed = sqrt(phy_linear_velocity_x * phy_linear_velocity_x + phy_linear_velocity_y * phy_linear_velocity_y);
    if (_speed > other.movementThreshold) {
        other.coinsMoving = true;
        break;
    }
}

// Check if we were waiting for a hit and coins stopped moving
if (waitingForHit && !coinsMoving) {
    // Count how many coins were hit
    var _hitCount = 0;
    var _hitCoinId = noone;
    
    with (oCoin) {
        if (wasHit) {
            _hitCount++;
            // Store the coin that's NOT the one we shot
            if (id != other.lastShotCoin) {
                _hitCoinId = id;
            }
        }
    }
    
    // Must have exactly 2 hits: the shooter and exactly 1 target
    if (_hitCount == 2 && instance_exists(_hitCoinId)) {
        // Success! Capture (destroy) the coin we just shot with shrink animation
        if (instance_exists(lastShotCoin)) {
            audio_play_sound(sndCoinCollect, 1, false);
            startCoinShrink(lastShotCoin);
        }
        
        // Check if only 1 non-shrinking coin remains - WIN!
        var _nonShrinkingCoins = 0;
        var _lastCoin = noone;
        with (oCoin) {
            if (!isShrinking) {
                _nonShrinkingCoins++;
                _lastCoin = id;
            }
        }
        
        if (_nonShrinkingCoins == 1) {
            // Collect the last coin
            if (instance_exists(_lastCoin)) {
                startCoinShrink(_lastCoin);
            }
            // Play win sound
            audio_play_sound(sndWin, 1, false);
            gameState = "won";
            
            // Submit time to leaderboard
            if (!timeSubmitted) {
                timeSubmitted = true;
                
                if (is_reddit_build()) {
                    // REDDIT BUILD: Submit time to server
                    submissionStatus = "submitting";
                    
                    api_submit_time(elapsedTime, function(_http_status, _ok, _result, _payload) {
                        if (_ok && !is_undefined(_result) && _result != "") {
                            try {
                                var _data = json_parse(_result);
                                if (_data.status == "success") {
                                    oGameController.submissionStatus = "success";
                                } else {
                                    oGameController.submissionStatus = "failed";
                                }
                            } catch(_ex) {
                                oGameController.submissionStatus = "failed";
                            }
                        } else {
                            oGameController.submissionStatus = "failed";
                        }
                    });
                } else {
                    // TEST BUILD: Skip submission
                    submissionStatus = "success";
                }
            }
        } else {
            // Auto-select the hit coin for next shot
            selectedCoin = _hitCoinId;
            selectedCoin.isSelected = true;
            isAiming = true;
            aimLocked = false;
        }
    } else {
        // Wrong number of hits - player loses!
        audio_play_sound(sndLose, 1, false);
        gameState = "lost";
    }
    
    // Reset all wasHit flags
    with (oCoin) {
        wasHit = false;
    }
    
    waitingForHit = false;
    lastShotCoin = noone;
}

// Check if shoot button is pressed
var _onShootBtn = false;  // Now handled by oBtnFlick

// Check if unselect button is pressed (only for first shot)
var _onUnselectBtn = false;  // Now handled by oBtnUnselect

// Check if lock aim button is pressed
var _onLockAimBtn = false;
with (oBtnLockAim) {
    if (visible && point_in_rectangle(other.inputX, other.inputY, bbox_left, bbox_top, bbox_right, bbox_bottom)) {
        _onLockAimBtn = true;
    }
}

// Handle coin selection and aim lock (only if coins not moving and not waiting for hit)
if (_pressed && !_onShootBtn && !_onUnselectBtn && !_onLockAimBtn && !coinsMoving && !waitingForHit) {
    // Check if click is inside play area (ignore clicks outside)
    var _inPlayArea = point_in_rectangle(inputX, inputY, 
        playAreaX, playAreaY, 
        playAreaX + playAreaWidth, playAreaY + playAreaHeight);
    
    if (!_inPlayArea) {
        // Click is outside play area, ignore it
        exit;
    }
    
    // MOBILE: If aim is locked, unlock it and redirect aim to click position
    if (global.is_mobile && aimLocked && selectedCoin != noone && instance_exists(selectedCoin)) {
        // Unlock aim
        aimLocked = false;
        powerMeterActive = false;
        powerMeterValue = 0;
        
        // Redirect aim to where we clicked
        var _dx = inputX - selectedCoin.x;
        var _dy = inputY - selectedCoin.y;
        
        if (abs(_dx) > 5 || abs(_dy) > 5) {
            aimDirection = point_direction(selectedCoin.x, selectedCoin.y, inputX, inputY);
        }
        
        // Keep coin selected and aiming active
    }
    // DESKTOP: If aim is locked, shoot!
    else if (!global.is_mobile && aimLocked && selectedCoin != noone && instance_exists(selectedCoin)) {
        // Calculate shot force from power meter
        var _shotForce = lerp(minShotForce, maxShotForce, powerMeterValue);
        
        // Scale force by play_scale to maintain consistent physics across platforms
        _shotForce *= global.play_scale;
        
        // Store for debug display
        lastShotForce = _shotForce;
        
        // Use the locked aim direction with power meter force
        var _forceX = lengthdir_x(_shotForce, aimDirection);
        var _forceY = lengthdir_y(_shotForce, aimDirection);
        
        // Apply impulse to the coin
        with (selectedCoin) {
            physics_apply_impulse(x, y, _forceX, _forceY);
        }
        
        // Play flick sound
        audio_play_sound(sndFlick, 1, false);
        
        // Track this shot
        lastShotCoin = selectedCoin;
        waitingForHit = true;
        isFirstShot = false;
        
        // Start timer on first shot
        if (!timerRunning) {
            timerRunning = true;
            startTime = current_time;
        }
        
        // Deselect immediately
        selectedCoin.isSelected = false;
        selectedCoin = noone;
        isAiming = false;
        aimLocked = false;
        powerMeterActive = false;
    }
    // Otherwise, handle normal selection/locking
    else {
        // Check if clicking on a coin
        var _clickedCoin = instance_position(inputX, inputY, oCoin);
        
        if (_clickedCoin != noone) {
            // First shot: can select any coin
            if (isFirstShot) {
                // If no coin selected yet, select this one
                if (selectedCoin == noone) {
                    selectedCoin = _clickedCoin;
                    selectedCoin.isSelected = true;
                    isAiming = true;
                    aimLocked = false;
                }
                // On desktop: clicking locks aim
                // On mobile: clicking does nothing (must use button)
                else if (!global.is_mobile) {
                    // If clicking on the already selected coin, lock aim
                    if (_clickedCoin == selectedCoin && isAiming && !aimLocked) {
                        aimLocked = true;
                        powerMeterActive = true;
                        powerMeterValue = 0;
                        powerMeterDirection = 1;
                    }
                    // If clicking on a different coin while one is selected, lock aim (don't change selection)
                    else if (_clickedCoin != selectedCoin && selectedCoin != noone && isAiming && !aimLocked) {
                        aimLocked = true;
                        powerMeterActive = true;
                        powerMeterValue = 0;
                        powerMeterDirection = 1;
                    }
                }
            } 
            // After first shot: clicking any coin locks aim (desktop only)
            else if (!global.is_mobile) {
                // Lock aim when clicking on any coin (selected or not)
                if (isAiming && !aimLocked) {
                    aimLocked = true;
                    powerMeterActive = true;
                    powerMeterValue = 0;
                    powerMeterDirection = 1;
                }
            }
        } else {
            // Clicked on empty space
            // On desktop: lock aim if currently aiming
            // On mobile: do nothing (must use button)
            if (!global.is_mobile && isAiming && !aimLocked && selectedCoin != noone) {
                aimLocked = true;
                powerMeterActive = true;
                powerMeterValue = 0;
                powerMeterDirection = 1;
            }
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
    hitObstacle = noone;
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
        if (id != other.selectedCoin && !isShrinking) {  // Skip shrinking coins
            // Vector from selected coin to this coin
            var _toX = x - _coinX;
            var _toY = y - _coinY;
            
            // Project onto ray direction
            var _proj = _toX * _dirX + _toY * _dirY;
            
            // Only consider coins in front of us (allow slightly negative for very close coins)
            if (_proj > -_coinRadius * 0.5) {
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
                    
                    // Accept intersection even if very close (>= -1 instead of > 0)
                    if (_intersectDist >= -1 && _intersectDist < other.tempHitDist) {
                        other.tempHitDist = max(0, _intersectDist);  // Clamp to 0 minimum
                        other.hitCoin = id;
                    }
                }
            }
        }
    }
    
    // Check collision with obstacles (circle-ray intersection)
    with (oObstacle) {
        // Vector from selected coin to this obstacle
        var _toX = x - _coinX;
        var _toY = y - _coinY;
        
        // Project onto ray direction
        var _proj = _toX * _dirX + _toY * _dirY;
        
        // Only consider obstacles in front of us
        if (_proj > 0) {
            // Closest point on ray to this obstacle's center
            var _closestX = _coinX + _dirX * _proj;
            var _closestY = _coinY + _dirY * _proj;
            
            // Distance from ray to obstacle center
            var _distToObstacle = point_distance(_closestX, _closestY, x, y);
            
            // Combined radius (coin + obstacle)
            var _combinedRadius = _coinRadius + obstacleRadius;
            
            // Check if ray intersects this obstacle
            if (_distToObstacle < _combinedRadius) {
                // Calculate exact intersection point
                var _backDist = sqrt(_combinedRadius * _combinedRadius - _distToObstacle * _distToObstacle);
                var _intersectDist = _proj - _backDist;
                
                // Accept any positive intersection distance
                if (_intersectDist > 0 && _intersectDist < other.tempHitDist) {
                    other.tempHitDist = _intersectDist;
                    other.hitCoin = noone; // Clear hitCoin since we hit an obstacle
                    other.hitObstacle = id; // Store which obstacle we hit
                }
            }
        }
    }
    
    // Calculate final collision point
    collisionX = _coinX + _dirX * tempHitDist;
    collisionY = _coinY + _dirY * tempHitDist;
    guideEndX = collisionX;
    guideEndY = collisionY;
    
    // Calculate bounce direction
    if (hitCoin != noone && instance_exists(hitCoin)) {
        // Bouncing off another coin - calculate reflection based on collision normal
        // Normal vector from hit coin center to collision point
        var _normalX = collisionX - hitCoin.x;
        var _normalY = collisionY - hitCoin.y;
        var _normalLen = sqrt(_normalX * _normalX + _normalY * _normalY);
        
        if (_normalLen > 0) {
            _normalX /= _normalLen;
            _normalY /= _normalLen;
            
            // Reflect the incoming direction vector across the normal
            // Formula: reflected = incoming - 2 * (incoming · normal) * normal
            var _dotProduct = _dirX * _normalX + _dirY * _normalY;
            var _reflectX = _dirX - 2 * _dotProduct * _normalX;
            var _reflectY = _dirY - 2 * _dotProduct * _normalY;
            
            bounceDirection = point_direction(0, 0, _reflectX, _reflectY);
        } else {
            bounceDirection = aimDirection + 180;  // Fallback: reverse direction
        }
    } else if (hitObstacle != noone && instance_exists(hitObstacle)) {
        // Bouncing off obstacle - calculate reflection based on collision normal
        var _normalX = collisionX - hitObstacle.x;
        var _normalY = collisionY - hitObstacle.y;
        var _normalLen = sqrt(_normalX * _normalX + _normalY * _normalY);
        
        if (_normalLen > 0) {
            _normalX /= _normalLen;
            _normalY /= _normalLen;
            
            // Reflect the incoming direction vector across the normal
            var _dotProduct = _dirX * _normalX + _dirY * _normalY;
            var _reflectX = _dirX - 2 * _dotProduct * _normalX;
            var _reflectY = _dirY - 2 * _dotProduct * _normalY;
            
            bounceDirection = point_direction(0, 0, _reflectX, _reflectY);
        } else {
            bounceDirection = aimDirection + 180;  // Fallback: reverse direction
        }
    } else {
        // Hit a wall - simple reflection
        // Determine which wall we hit
        var _hitLeft = (collisionX <= _coinRadius + 5);
        var _hitRight = (collisionX >= room_width - _coinRadius - 5);
        var _hitTop = (collisionY <= _coinRadius + 5);
        var _hitBottom = (collisionY >= room_height - _coinRadius - 5);
        
        if (_hitLeft || _hitRight) {
            // Reflect horizontally
            bounceDirection = 180 - aimDirection;
        } else if (_hitTop || _hitBottom) {
            // Reflect vertically
            bounceDirection = -aimDirection;
        } else {
            bounceDirection = aimDirection + 180;  // Fallback
        }
    }
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

// Update timer
if (timerRunning) {
    elapsedTime = current_time - startTime;
}
