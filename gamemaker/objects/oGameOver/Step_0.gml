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
    // Fade in popup
    losePopupAlpha = min(losePopupAlpha + 0.05, 1);
    
    // Check restart button
    var _onRestartBtn = point_in_rectangle(inputX, inputY,
        restartBtnX - restartBtnWidth/2, restartBtnY - restartBtnHeight/2,
        restartBtnX + restartBtnWidth/2, restartBtnY + restartBtnHeight/2);
    
    if (_pressed && _onRestartBtn) {
        audio_stop_all();
        room_restart();
    }
}

// Handle win screen
if (_gameState == "won") {
    // Fade in popup
    winPopupAlpha = min(winPopupAlpha + 0.05, 1);
    
    // Check restart button
    var _onRestartBtn = point_in_rectangle(inputX, inputY,
        restartBtnX - restartBtnWidth/2, restartBtnY - restartBtnHeight/2,
        restartBtnX + restartBtnWidth/2, restartBtnY + restartBtnHeight/2);
    
    if (_pressed && _onRestartBtn) {
        audio_stop_all();
        room_restart();
    }
}
