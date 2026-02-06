/// @description Initialize game controller

// Currently selected coin
selectedCoin = noone;

// Aiming state
isAiming = false;
aimLocked = false;  // TRUE = aim is locked in, ready to shoot
aimDirection = 0;   // Angle in degrees

// Shoot button properties
shootBtnX = room_width / 2;
shootBtnY = room_height - 80;
shootBtnWidth = 150;
shootBtnHeight = 60;
shootBtnPressed = false;

// Cancel button properties
cancelBtnX = room_width / 2 - 180;
cancelBtnY = room_height - 80;
cancelBtnWidth = 150;
cancelBtnHeight = 60;

// Guide line properties
guideColor = c_white;
guideDotSpacing = 15;
guideDotRadius = 4;

// Collision detection result
collisionX = 0;
collisionY = 0;
hitCoin = noone;
guideEndX = 0;
guideEndY = 0;

// Touch/mouse input
inputX = 0;
inputY = 0;

// Power meter settings
minShotForce = 100;      // Minimum shot power
maxShotForce = 3000;     // Maximum shot power
powerMeterSpeed = 1.5;     // How fast the meter oscillates (higher = faster)
powerMeterValue = 0;     // Current position (0 to 1)
powerMeterDirection = 1; // 1 = going up, -1 = going down
powerMeterActive = false; // Whether meter is oscillating

// Power meter visual properties
powerMeterX = room_width - 60;
powerMeterY = room_height / 2;
powerMeterWidth = 30;
powerMeterHeight = 200;

// Debug info
lastShotForce = 0;

// Movement control
coinsMoving = false;  // Track if any coins are moving
movementThreshold = 1;  // Speed threshold to consider coins "moving"

// Game state
gameState = "start";  // "start", "playing", "lost", "won"
isFirstShot = true;  // Track if this is the first shot
lastShotCoin = noone;  // The coin that was just shot
waitingForHit = false;  // Waiting to see if shot coin hits another

// Timer
startTime = 0;
elapsedTime = 0;
timerRunning = false;

// Play area bounds
playAreaX = 100;
playAreaY = 100;
playAreaWidth = room_width - 200;
playAreaHeight = room_height - 200;

// Coin spawning settings
numCoins = 8;  // Total number of coins to spawn
numObstacles = 4;  // Number of obstacles to spawn
edgeSpawnMinDist = 50;  // Minimum distance from edge for "close" spawns
edgeSpawnMaxDist = 120;  // Maximum distance from edge for "close" spawns
minCoinSpacing = 80;  // Minimum distance between coin centers

// Initialize random seed
randomize();

// Spawn coins at start
spawnCoins();
