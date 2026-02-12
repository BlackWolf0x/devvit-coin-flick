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
topPadding = 70;

// Input tracking
inputX = 0;
inputY = 0;

midX = room_width / 2;
midY = room_height / 2;
x = midX;
y = midY;

// Hide sprite until game is over
//visible = false;

layer_set_visible("GameOverUI", false);
