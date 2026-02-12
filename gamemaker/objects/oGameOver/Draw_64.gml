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
    draw_set_alpha(1);
    
    // Draw popup background sprite
    draw_sprite_ext(sScreenCard, 0, midX, midY, 0.5 * uiScale, 0.5 * uiScale, 0, c_white, 1);
    
	// "YOU LOST" text
    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);
    draw_set_color(#FF5656);
	draw_set_font(saira_bold);
    draw_set_alpha(1);
    draw_text_transformed(midX, midY - 144 * uiScale, "YOU LOST!", 1 * uiScale, 1 * uiScale, 0)

    
    // Reason text
    draw_set_color(c_white);
	draw_set_font(saira_medium);
    
    // Show different message based on lose type
    if (gameController.loseType == "coinFall") {
        draw_text_transformed(midX, midY - 50 * uiScale, "All coins must stay on", 1 * uiScale, 1 * uiScale, 0);
        draw_text_transformed(midX, midY + 6 * uiScale, "the table.", 1 * uiScale, 1 * uiScale, 0);
    } else {
        draw_text_transformed(midX, midY - 50 * uiScale, "You failed to hit exactly", 1 * uiScale, 1 * uiScale, 0);
        draw_text_transformed(midX, midY + 6 * uiScale, "one coin.", 1 * uiScale, 1 * uiScale, 0);
    }
	
    draw_set_font(-1);
    // Sprite restart button
    var _spriteWidth = sprite_get_width(sPlayAgainButton) * 0.5 * uiScale;
    var _spriteHeight = sprite_get_height(sPlayAgainButton) * 0.5 * uiScale;
    var _btnLeft = restartBtnX - _spriteWidth/2;
    var _btnTop = restartBtnY - _spriteHeight/2;
    var _btnRight = restartBtnX + _spriteWidth/2;
    var _btnBottom = restartBtnY + _spriteHeight/2;
    
    // Check if hovering
    var _hovering = point_in_rectangle(inputX, inputY, _btnLeft, _btnTop, _btnRight, _btnBottom);
    
    // Draw button sprite (slightly brighter when hovering)
    draw_sprite_ext(sPlayAgainButton, 0, restartBtnX, restartBtnY + topPadding, 0.5 * uiScale, 0.5 * uiScale, 0, c_white, 1);
    
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
    draw_set_alpha(1);
    
    // Draw popup background sprite
    draw_sprite_ext(sScreenCard, 0, midX, midY, 0.5 * uiScale, 0.5 * uiScale, 0, c_white, 1);
    
    // "YOU WIN" text
    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);
    draw_set_color(#62CE4C);
	draw_set_font(saira_bold);
    draw_set_alpha(1);
	draw_text_transformed(midX, midY - 144 * uiScale, "YOU WON!", 1 * uiScale, 1 * uiScale, 0)

    
    // Time display
    var _seconds = gameController.elapsedTime / 1000;
    var _minutes = floor(_seconds / 60);
    var _secs = floor(_seconds mod 60);
    
    var _timeStr = string(_minutes) + ":" + 
                   ((_secs < 10) ? "0" : "") + string(_secs);
    
    draw_set_color(c_white);
	draw_set_font(saira_medium);
    draw_text_transformed(midX, midY - 50 * uiScale, "Time: " + _timeStr, 1 * uiScale, 1 * uiScale, 0);
    
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
            _statusColor = #62CE4C;
            break;
        case "failed":
            _statusText = "Submission failed";
            _statusColor = #FF5656;
            break;
    }
    
    if (_statusText != "") {
        draw_set_color(_statusColor);
		draw_set_font(saira_medium_small);
        draw_text_transformed(midX, midY + 20 * uiScale, _statusText, 1 * uiScale, 1 * uiScale, 0);
    }
	
	draw_set_font(-1);
    
    // Sprite restart button
    var _spriteWidth = sprite_get_width(sPlayAgainButton) * 0.5 * uiScale;
    var _spriteHeight = sprite_get_height(sPlayAgainButton) * 0.5 * uiScale;
    var _btnLeft = restartBtnX - _spriteWidth/2;
    var _btnTop = restartBtnY - _spriteHeight/2;
    var _btnRight = restartBtnX + _spriteWidth/2;
    var _btnBottom = restartBtnY + _spriteHeight/2;
    
    // Check if hovering
    var _hovering = point_in_rectangle(inputX, inputY, _btnLeft, _btnTop, _btnRight, _btnBottom);
    
    // Draw button sprite (slightly brighter when hovering)
	draw_sprite_ext(sPlayAgainButton, 0, restartBtnX, restartBtnY + topPadding, 0.5 * uiScale, 0.5 * uiScale, 0, c_white, 1);
    
    // Reset draw settings
    draw_set_halign(fa_left);
    draw_set_valign(fa_top);
    draw_set_alpha(1);
}
