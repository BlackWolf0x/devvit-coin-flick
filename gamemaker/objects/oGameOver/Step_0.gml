/// @description Handle game over input

// Get input position
inputX = device_mouse_x(0);
inputY = device_mouse_y(0);

// Check for press
var _pressed = device_mouse_check_button_pressed(0, mb_left);

// Only process if game controller exists and game is over
if (!instance_exists(gameController)) exit;

var _gameState = gameController.gameState;

// Handle lose screen
if (_gameState == "lost") {
    layer_set_visible("GameOverUI", true);
    
    // Fade in popup
    losePopupAlpha = min(losePopupAlpha + 0.05, 1);
    
    // Check restart button hover for cursor (sprite is drawn at restartBtnY + topPadding)
    var _spriteWidth = sprite_get_width(sPlayAgainButton) * 0.5 * uiScale;
    var _spriteHeight = sprite_get_height(sPlayAgainButton) * 0.5 * uiScale;
    var _btnCenterY = restartBtnY + topPadding;
    var _onRestartBtn = point_in_rectangle(inputX, inputY,
        restartBtnX - _spriteWidth/2, _btnCenterY - _spriteHeight/2,
        restartBtnX + _spriteWidth/2, _btnCenterY + _spriteHeight/2);
    
    // Set cursor
    if (_onRestartBtn) {
        window_set_cursor(cr_handpoint);
    } else {
        window_set_cursor(cr_default);
    }
    
    // Check restart button click
    if (_pressed && _onRestartBtn) {
        room_restart();
    }
}

// Handle win screen
if (_gameState == "won") {
    layer_set_visible("GameOverUI", true);
    
    // Fade in popup
    winPopupAlpha = min(winPopupAlpha + 0.05, 1);
    
    // Check restart button hover for cursor (sprite is drawn at restartBtnY + topPadding)
    var _spriteWidth = sprite_get_width(sPlayAgainButton) * 0.5 * uiScale;
    var _spriteHeight = sprite_get_height(sPlayAgainButton) * 0.5 * uiScale;
    var _btnCenterY = restartBtnY + topPadding;
    var _onRestartBtn = point_in_rectangle(inputX, inputY,
        restartBtnX - _spriteWidth/2, _btnCenterY - _spriteHeight/2,
        restartBtnX + _spriteWidth/2, _btnCenterY + _spriteHeight/2);
    
    // Set cursor
    if (_onRestartBtn) {
        window_set_cursor(cr_handpoint);
    } else {
        window_set_cursor(cr_default);
    }
    
    // Check restart button click
    if (_pressed && _onRestartBtn) {
        room_restart();
    }
}
