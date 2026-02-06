/// @description Draw aiming guide and UI

// Draw play area boundary
draw_set_color(c_white);
draw_set_alpha(0.3);
draw_rectangle(playAreaX, playAreaY, playAreaX + playAreaWidth, playAreaY + playAreaHeight, true);
draw_set_alpha(0.1);
draw_rectangle(playAreaX + 1, playAreaY + 1, playAreaX + playAreaWidth - 1, playAreaY + playAreaHeight - 1, true);
draw_set_alpha(1);

// Draw the aiming guide line if we have a selected coin
if (isAiming && selectedCoin != noone && instance_exists(selectedCoin)) {
    var _coinX = selectedCoin.x;
    var _coinY = selectedCoin.y;
    var _coinRadius = selectedCoin.coinRadius;
    
    // Direction of the shot
    var _dirX = lengthdir_x(1, aimDirection);
    var _dirY = lengthdir_y(1, aimDirection);
    
    // Start drawing from the edge of the coin
    var _startX = _coinX + _dirX * (_coinRadius + 5);
    var _startY = _coinY + _dirY * (_coinRadius + 5);
    
    // Distance to endpoint
    var _totalDist = point_distance(_coinX, _coinY, guideEndX, guideEndY) - _coinRadius - 5;
    
    // Draw guide dots
    if (aimLocked) {
        draw_set_color(c_lime);  // Green when locked
    } else {
        draw_set_color(guideColor);  // White when aiming
    }
    
    for (var i = 0; i < _totalDist; i += guideDotSpacing) {
        var _dotX = _startX + _dirX * i;
        var _dotY = _startY + _dirY * i;
        
        // Fade dots slightly as they go further
        var _alpha = 0.9 - (i / _totalDist) * 0.4;
        draw_set_alpha(_alpha);
        draw_circle(_dotX, _dotY, guideDotRadius, false);
    }
    
    // Draw ghost circle at collision point (same size as coin)
    draw_set_alpha(0.7);
    if (hitCoin != noone) {
        // Hit another coin - show where our coin will be when it hits
        draw_set_color(c_lime);
    } else {
        // Hit a wall
        draw_set_color(c_white);
    }
    draw_circle(guideEndX, guideEndY, _coinRadius, true);
    draw_circle(guideEndX, guideEndY, _coinRadius - 2, true);
    
    // If hitting another coin, also highlight that coin
    if (hitCoin != noone && instance_exists(hitCoin)) {
        draw_set_color(c_red);
        draw_set_alpha(0.5);
        draw_circle(hitCoin.x, hitCoin.y, hitCoin.coinRadius + 3, true);
        draw_circle(hitCoin.x, hitCoin.y, hitCoin.coinRadius + 5, true);
    }
    
    draw_set_alpha(1);
    draw_set_color(c_white);
}

// Draw shoot button
var _btnLeft = shootBtnX - shootBtnWidth/2;
var _btnTop = shootBtnY - shootBtnHeight/2;
var _btnRight = shootBtnX + shootBtnWidth/2;
var _btnBottom = shootBtnY + shootBtnHeight/2;

// Button background
if (shootBtnPressed) {
    draw_set_color(c_green);
} else if (aimLocked) {
    draw_set_color(c_lime);  // Bright green when ready to shoot
} else if (selectedCoin != noone) {
    draw_set_color(c_olive);  // Dim when aiming but not locked
} else {
    draw_set_color(c_gray);
}
draw_set_alpha(0.8);
draw_roundrect(_btnLeft, _btnTop, _btnRight, _btnBottom, false);

// Button border
draw_set_color(c_white);
draw_set_alpha(1);
draw_roundrect(_btnLeft, _btnTop, _btnRight, _btnBottom, true);

// Button text
draw_set_halign(fa_center);
draw_set_valign(fa_middle);
draw_set_color(c_white);
if (aimLocked) {
    draw_text(shootBtnX, shootBtnY, "SHOOT!");
} else if (selectedCoin != noone) {
    draw_text(shootBtnX, shootBtnY, "CLICK TO LOCK");
} else {
    draw_text(shootBtnX, shootBtnY, "SELECT COIN");
}

// Reset draw settings
draw_set_halign(fa_left);
draw_set_valign(fa_top);

// Draw cancel button (only when aim is locked)
if (aimLocked) {
    var _cancelLeft = cancelBtnX - cancelBtnWidth/2;
    var _cancelTop = cancelBtnY - cancelBtnHeight/2;
    var _cancelRight = cancelBtnX + cancelBtnWidth/2;
    var _cancelBottom = cancelBtnY + cancelBtnHeight/2;
    
    // Check if hovering
    var _hovering = point_in_rectangle(inputX, inputY, _cancelLeft, _cancelTop, _cancelRight, _cancelBottom);
    
    // Button background
    if (_hovering) {
        draw_set_color(c_orange);
    } else {
        draw_set_color(c_maroon);
    }
    draw_set_alpha(0.8);
    draw_roundrect(_cancelLeft, _cancelTop, _cancelRight, _cancelBottom, false);
    
    // Button border
    draw_set_color(c_white);
    draw_set_alpha(1);
    draw_roundrect(_cancelLeft, _cancelTop, _cancelRight, _cancelBottom, true);
    
    // Button text
    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);
    draw_set_color(c_white);
    draw_text(cancelBtnX, cancelBtnY, "CANCEL");
    
    // Reset draw settings
    draw_set_halign(fa_left);
    draw_set_valign(fa_top);
}

// Draw power meter when aim is locked
if (powerMeterActive && aimLocked) {
    var _meterLeft = powerMeterX - powerMeterWidth / 2;
    var _meterTop = powerMeterY - powerMeterHeight / 2;
    var _meterRight = powerMeterX + powerMeterWidth / 2;
    var _meterBottom = powerMeterY + powerMeterHeight / 2;
    
    // Draw meter background (dark)
    draw_set_color(c_dkgray);
    draw_set_alpha(0.7);
    draw_roundrect(_meterLeft - 3, _meterTop - 3, _meterRight + 3, _meterBottom + 3, false);
    
    // Draw meter border
    draw_set_color(c_white);
    draw_set_alpha(1);
    draw_roundrect(_meterLeft - 3, _meterTop - 3, _meterRight + 3, _meterBottom + 3, true);
    
    // Draw gradient background for meter (shows full range)
    // Green at bottom, yellow in middle, red at top
    var _segments = 20;
    var _segmentHeight = powerMeterHeight / _segments;
    for (var i = 0; i < _segments; i++) {
        var _ratio = i / _segments;
        // Gradient: green -> yellow -> red (bottom to top)
        var _col;
        if (_ratio < 0.5) {
            _col = merge_color(c_green, c_yellow, _ratio * 2);
        } else {
            _col = merge_color(c_yellow, c_red, (_ratio - 0.5) * 2);
        }
        draw_set_color(_col);
        draw_set_alpha(0.3); // Dim background
        var _segTop = _meterBottom - (i + 1) * _segmentHeight;
        var _segBottom = _meterBottom - i * _segmentHeight;
        draw_rectangle(_meterLeft, _segTop, _meterRight, _segBottom, false);
    }
    
    // Draw filled portion based on current power
    var _fillHeight = powerMeterHeight * powerMeterValue;
    var _fillTop = _meterBottom - _fillHeight;
    
    // Draw filled segments
    for (var i = 0; i < _segments; i++) {
        var _segTop = _meterBottom - (i + 1) * _segmentHeight;
        var _segBottom = _meterBottom - i * _segmentHeight;
        
        // Only draw if this segment is within the filled area
        if (_segBottom >= _fillTop) {
            var _ratio = i / _segments;
            var _col;
            if (_ratio < 0.5) {
                _col = merge_color(c_green, c_yellow, _ratio * 2);
            } else {
                _col = merge_color(c_yellow, c_red, (_ratio - 0.5) * 2);
            }
            draw_set_color(_col);
            draw_set_alpha(1);
            
            // Clip the top segment if needed
            var _drawTop = max(_segTop, _fillTop);
            draw_rectangle(_meterLeft, _drawTop, _meterRight, _segBottom, false);
        }
    }
    
    // Draw power indicator line
    draw_set_color(c_white);
    draw_set_alpha(1);
    draw_line_width(_meterLeft - 5, _fillTop, _meterRight + 5, _fillTop, 2);
    
    // Draw power percentage text
    draw_set_halign(fa_center);
    draw_set_valign(fa_bottom);
    var _powerPercent = round(powerMeterValue * 100);
    draw_text(powerMeterX, _meterTop - 8, string(_powerPercent) + "%");
    
    // Draw "POWER" label
    draw_set_valign(fa_top);
    draw_text(powerMeterX, _meterBottom + 8, "POWER");
    
    // Reset
    draw_set_halign(fa_left);
    draw_set_valign(fa_top);
}

// Draw instructions at top
draw_set_color(c_white);
draw_set_alpha(0.8);
if (aimLocked) {
    draw_text(10, 10, "Aim LOCKED! Press SHOOT to fire at current power.");
} else if (selectedCoin != noone) {
    draw_text(10, 10, "Aim by moving mouse. LEFT CLICK to lock aim.");
} else {
    draw_text(10, 10, "Click a coin to select it.");
}
draw_set_alpha(1);

// Draw timer
if (timerRunning || gameState == "won") {
    var _seconds = elapsedTime / 1000;
    var _minutes = floor(_seconds / 60);
    var _secs = floor(_seconds mod 60);
    var _ms = floor((_seconds - floor(_seconds)) * 100);
    
    var _timeStr = string(_minutes) + ":" + 
                   ((_secs < 10) ? "0" : "") + string(_secs) + "." +
                   ((_ms < 10) ? "0" : "") + string(_ms);
    
    draw_set_color(c_white);
    draw_set_alpha(0.9);
    draw_set_halign(fa_right);
    draw_set_valign(fa_top);
    draw_text(room_width - 10, 10, "Time: " + _timeStr);
    draw_set_halign(fa_left);
}

// Debug: Display last shot force
if (lastShotForce > 0) {
    draw_set_color(c_lime);
    draw_set_alpha(1);
    draw_text(10, 40, "DEBUG - Last Shot Force: " + string(round(lastShotForce)));
    draw_text(10, 60, "Min: " + string(minShotForce) + " | Max: " + string(maxShotForce));
}

