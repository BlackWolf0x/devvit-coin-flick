/// @description Draw aiming guide and UI

// Draw active coin display (top-left corner)
if (variable_global_exists("active_coin_name")) {
    draw_set_color(c_white);
    draw_set_alpha(0.9);
    draw_set_halign(fa_left);
    draw_set_valign(fa_top);
    draw_set_font(saira_regular);
    draw_text(10, 10, "Active Coin: " + string(global.active_coin_name));
    draw_set_font(-1);
    draw_set_alpha(1);
}

// Draw play area boundary
//draw_set_color(c_white);
//draw_set_alpha(0.3); // 0.3
//draw_rectangle(playAreaX, playAreaY, playAreaX + playAreaWidth, playAreaY + playAreaHeight, true);
//draw_set_alpha(0.1); // 0.1
//draw_rectangle(playAreaX + 1, playAreaY + 1, playAreaX + playAreaWidth - 1, playAreaY + playAreaHeight - 1, true);
//draw_set_alpha(1);

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
    // Draw thick circle using primitive - creates a crisp ring
    draw_primitive_begin(pr_trianglestrip);
    var _segments = 64; // More segments = smoother circle
    var _thickness = 3;
    for (var i = 0; i <= _segments; i++) {
        var _angle = (i / _segments) * 360;
        var _outerX = guideEndX + lengthdir_x(_coinRadius, _angle);
        var _outerY = guideEndY + lengthdir_y(_coinRadius, _angle);
        var _innerX = guideEndX + lengthdir_x(_coinRadius - _thickness, _angle);
        var _innerY = guideEndY + lengthdir_y(_coinRadius - _thickness, _angle);
        draw_vertex(_outerX, _outerY);
        draw_vertex(_innerX, _innerY);
    }
    draw_primitive_end();
    
    // If hitting another coin, also highlight that coin
    if (hitCoin != noone && instance_exists(hitCoin)) {
        draw_set_color(c_red);
        draw_set_alpha(0.5);
        // Draw thick circle using primitive
        draw_primitive_begin(pr_trianglestrip);
        var _targetRadius = hitCoin.coinRadius + 4;
        for (var i = 0; i <= _segments; i++) {
            var _angle = (i / _segments) * 360;
            var _outerX = hitCoin.x + lengthdir_x(_targetRadius, _angle);
            var _outerY = hitCoin.y + lengthdir_y(_targetRadius, _angle);
            var _innerX = hitCoin.x + lengthdir_x(_targetRadius - _thickness, _angle);
            var _innerY = hitCoin.y + lengthdir_y(_targetRadius - _thickness, _angle);
            draw_vertex(_outerX, _outerY);
            draw_vertex(_innerX, _innerY);
        }
        draw_primitive_end();
    }
    
    // Draw bounce direction indicator (only for obstacles)
    if (hitObstacle != noone && instance_exists(hitObstacle)) {
        draw_set_color(c_white);
        
        // Draw dotted line in the same style as the main guide
        for (var i = 0; i < bounceLength; i += guideDotSpacing) {
            var _dotX = guideEndX + lengthdir_x(i, bounceDirection);
            var _dotY = guideEndY + lengthdir_y(i, bounceDirection);
            
            // Fade dots slightly as they go further
            var _alpha = 0.9 - (i / bounceLength) * 0.4;
            draw_set_alpha(_alpha);
            draw_circle(_dotX, _dotY, guideDotRadius, false);
        }
    }
    
    draw_set_alpha(1);
    draw_set_color(c_white);
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
    //draw_set_halign(fa_center);
    //draw_set_valign(fa_bottom);
    //var _powerPercent = round(powerMeterValue * 100);
    //draw_text(powerMeterX, _meterTop - 8, string(_powerPercent) + "%");
    
    // Draw "POWER" label
    //draw_set_valign(fa_top);
    //draw_text(powerMeterX, _meterBottom + 8, "POWER");
    
    // Reset
    draw_set_halign(fa_left);
    draw_set_valign(fa_top);
}

// Draw timer (always visible, shows 0:00 before first shot)
var _seconds = elapsedTime / 1000;
var _minutes = floor(_seconds / 60);
var _secs = floor(_seconds mod 60);

var _timeStr = string(_minutes) + ":" + 
               ((_secs < 10) ? "0" : "") + string(_secs);

draw_set_font(saira_regular);
draw_set_color(c_white);
draw_set_alpha(0.9);
draw_set_halign(fa_center);
draw_set_valign(fa_top);
draw_text(global.is_mobile ? 98: 108, global.is_mobile? 80 : 32, _timeStr);
draw_set_halign(fa_left);
draw_set_font(-1);

// Draw error message if level failed to load
if (gameState == "error") {
    draw_set_color(c_red);
    draw_set_font(saira_regular);
    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);
    
    draw_text(room_width / 2, room_height / 2 - 40, "ERROR");
    
    draw_set_color(c_white);
    draw_text(room_width / 2, room_height / 2, "Failed to load level");
    draw_text(room_width / 2, room_height / 2 + 40, "Please refresh the page");
    
    draw_set_halign(fa_left);
    draw_set_valign(fa_top);
    draw_set_font(-1);
    return; // Don't draw anything else
}

// Draw "Select a coin" message when no coin is selected (only on first shot)
if (selectedCoin == noone && isFirstShot) {
    draw_set_color(c_white);
	draw_set_font(saira_regular);
    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);
    
    // Draw in the button area (bottom center of screen)
    var _textY = global.is_mobile ? room_height - 140 : room_height - 90;
    draw_text(room_width / 2, _textY, "Select a coin");
    
    draw_set_halign(fa_left);
    draw_set_valign(fa_top);
	draw_set_font(-1);

}
