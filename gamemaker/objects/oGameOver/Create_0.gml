/// @description Initialize game over screen

// Reference to game controller
gameController = instance_find(oGameController, 0);

// Popup animation
losePopupAlpha = 0;
winPopupAlpha = 0;

// Button properties
restartBtnX = room_width / 2;
restartBtnY = room_height / 2 + 60;
restartBtnWidth = 200;
restartBtnHeight = 70;

// Input tracking
inputX = 0;
inputY = 0;
