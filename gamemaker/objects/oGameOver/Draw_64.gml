/// @description Draw game over screens

// Only draw if game controller exists
if (!instance_exists(gameController)) exit;

var _gameState = gameController.gameState;

// Draw lose popup
if (_gameState == "lost") {
    // Dark overlay
    draw_set_color(c_black);
    draw_set_alpha(0.7 * losePopupAlpha);
    draw_rectangle(0, 0, room_width, room_height, false);
    
    // Popup background
    var _popupWidth = 400;
    var _popupHeight = 250;
    var _popupX = room_width / 2;
    var _popupY = room_height / 2 - 30;
    
    draw_set_color(c_dkgray);
    draw_set_alpha(0.95 * losePopupAlpha);
    draw_roundrect(_popupX - _popupWidth/2, _popupY - _popupHeight/2,
                   _popupX + _popupWidth/2, _popupY + _popupHeight/2, false);
    
    // Popup border
    draw_set_color(c_red);
    draw_set_alpha(losePopupAlpha);
    draw_roundrect(_popupX - _popupWidth/2, _popupY - _popupHeight/2,
                   _popupX + _popupWidth/2, _popupY + _popupHeight/2, true);
    
    // "YOU LOST" text
    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);
    draw_set_color(c_red);
    draw_set_alpha(losePopupAlpha);
    draw_text_transformed(_popupX, _popupY - 40, "YOU LOST!", 2, 2, 0);
    
    // Reason text
    draw_set_color(c_white);
    draw_text(_popupX, _popupY + 10, "You failed to hit exactly one coin!");
    
    // Restart button
    var _btnLeft = restartBtnX - restartBtnWidth/2;
    var _btnTop = restartBtnY - restartBtnHeight/2;
    var _btnRight = restartBtnX + restartBtnWidth/2;
    var _btnBottom = restartBtnY + restartBtnHeight/2;
    
    // Check if hovering
    var _hovering = point_in_rectangle(inputX, inputY, _btnLeft, _btnTop, _btnRight, _btnBottom);
    
    // Button background
    if (_hovering) {
        draw_set_color(c_lime);
    } else {
        draw_set_color(c_green);
    }
    draw_set_alpha(0.9 * losePopupAlpha);
    draw_roundrect(_btnLeft, _btnTop, _btnRight, _btnBottom, false);
    
    // Button border
    draw_set_color(c_white);
    draw_set_alpha(losePopupAlpha);
    draw_roundrect(_btnLeft, _btnTop, _btnRight, _btnBottom, true);
    
    // Button text
    draw_set_color(c_white);
    draw_text(restartBtnX, restartBtnY, "RESTART");
    
    // Reset draw settings
    draw_set_halign(fa_left);
    draw_set_valign(fa_top);
    draw_set_alpha(1);
}

// Draw win popup
if (_gameState == "won") {
    // Dark overlay
    draw_set_color(c_black);
    draw_set_alpha(0.7 * winPopupAlpha);
    draw_rectangle(0, 0, room_width, room_height, false);
    
    // Popup background
    var _popupWidth = 450;
    var _popupHeight = 300;
    var _popupX = room_width / 2;
    var _popupY = room_height / 2 - 30;
    
    draw_set_color(c_dkgray);
    draw_set_alpha(0.95 * winPopupAlpha);
    draw_roundrect(_popupX - _popupWidth/2, _popupY - _popupHeight/2,
                   _popupX + _popupWidth/2, _popupY + _popupHeight/2, false);
    
    // Popup border
    draw_set_color(c_lime);
    draw_set_alpha(winPopupAlpha);
    draw_roundrect(_popupX - _popupWidth/2, _popupY - _popupHeight/2,
                   _popupX + _popupWidth/2, _popupY + _popupHeight/2, true);
    
    // "YOU WON!" text
    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);
    draw_set_color(c_lime);
    draw_set_alpha(winPopupAlpha);
    draw_text_transformed(_popupX, _popupY - 60, "YOU WON!", 2.5, 2.5, 0);
    
    // Time display
    var _seconds = gameController.elapsedTime / 1000;
    var _minutes = floor(_seconds / 60);
    var _secs = floor(_seconds mod 60);
    
    var _timeStr = string(_minutes) + ":" + 
                   ((_secs < 10) ? "0" : "") + string(_secs);
    
    draw_set_color(c_white);
    draw_text(_popupX, _popupY - 10, "Time: " + _timeStr);
    
    // Submission status
    var _statusText = "";
    var _statusColor = c_white;
    switch (gameController.submissionStatus) {
        case "submitting":
            _statusText = "Submitting...";
            _statusColor = c_yellow;
            break;
        case "success":
            _statusText = "Time submitted!";
            _statusColor = c_lime;
            break;
        case "failed":
            _statusText = "Submission failed";
            _statusColor = c_red;
            break;
    }
    
    if (_statusText != "") {
        draw_set_color(_statusColor);
        draw_text(_popupX, _popupY + 20, _statusText);
    }

    
    // Restart button
    var _btnLeft = restartBtnX - restartBtnWidth/2;
    var _btnTop = restartBtnY - restartBtnHeight/2;
    var _btnRight = restartBtnX + restartBtnWidth/2;
    var _btnBottom = restartBtnY + restartBtnHeight/2;
    
    // Check if hovering
    var _hovering = point_in_rectangle(inputX, inputY, _btnLeft, _btnTop, _btnRight, _btnBottom);
    
    // Button background
    if (_hovering) {
        draw_set_color(c_lime);
    } else {
        draw_set_color(c_green);
    }
    draw_set_alpha(0.9 * winPopupAlpha);
    draw_roundrect(_btnLeft, _btnTop, _btnRight, _btnBottom, false);
    
    // Button border
    draw_set_color(c_white);
    draw_set_alpha(winPopupAlpha);
    draw_roundrect(_btnLeft, _btnTop, _btnRight, _btnBottom, true);
    
    // Button text
    draw_set_color(c_white);
    draw_text(restartBtnX, restartBtnY, "PLAY AGAIN");
    
    // Reset draw settings
    draw_set_halign(fa_left);
    draw_set_valign(fa_top);
    draw_set_alpha(1);
}
