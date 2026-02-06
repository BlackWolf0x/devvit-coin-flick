/// @description Draw aiming guide and UI

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

// Draw instructions at top
draw_set_color(c_white);
draw_set_alpha(0.8);
if (aimLocked) {
    draw_text(10, 10, "Aim LOCKED! Press SHOOT or click elsewhere to cancel.");
} else if (selectedCoin != noone) {
    draw_text(10, 10, "Aim by moving mouse. LEFT CLICK to lock aim.");
} else {
    draw_text(10, 10, "Click a coin to select it.");
}
draw_set_alpha(1);
