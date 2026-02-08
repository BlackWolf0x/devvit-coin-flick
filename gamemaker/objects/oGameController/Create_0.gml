/// @description Initialize game controller

// Currently selected coin
selectedCoin = noone;

// Aiming state
isAiming = false;
aimLocked = false;  // TRUE = aim is locked in, ready to shoot
aimDirection = 0;   // Angle in degrees

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
minShotForce = 500;      // Minimum shot power
maxShotForce = 8000;     // Maximum shot power
powerMeterSpeed = 1;     // How fast the meter oscillates (higher = faster)
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
movementThreshold = 25;  // Speed threshold to consider coins "moving" (matches coin stop threshold)

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
// Set default padding if not already set
global.top_padding = -16;
global.left_padding = 0;

// Define base play area size (before scaling)
var _baseWidth = 952;
var _baseHeight = 1440;

// Define play area size based on platform
var _playAreaWidth, _playAreaHeight;

if (global.is_mobile) {
    // Mobile: Portrait orientation (tall)
    _playAreaWidth = _baseWidth * global.play_scale;
    _playAreaHeight = _baseHeight * global.play_scale;
} else {
    // Desktop: Landscape orientation (wide) - swap dimensions and scale
    _playAreaWidth = _baseHeight * global.play_scale;
    _playAreaHeight = _baseWidth * global.play_scale;
}

// Center the play area with optional padding offsets
playAreaX = (room_width - _playAreaWidth) / 2 + global.left_padding;
playAreaY = (room_height - _playAreaHeight) / 2 + global.top_padding;
playAreaWidth = _playAreaWidth;
playAreaHeight = _playAreaHeight;


// Coin spawning settings
numCoins = 6;  // Total number of coins to spawn
numObstacles = 4;  // Number of obstacles to spawn
edgeSpawnMinDist = 50;  // Minimum distance from edge for "close" spawns
edgeSpawnMaxDist = 120;  // Maximum distance from edge for "close" spawns
minCoinSpacing = 120;  // Minimum distance between coin/obstacle centers (increased to prevent touching)

// Initialize random seed
//randomize();

// Spawn coins at start
spawnCoins();
