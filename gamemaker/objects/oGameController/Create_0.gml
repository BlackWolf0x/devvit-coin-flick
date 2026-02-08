/// @description Initialize game controller

// Visual debug log for mobile/browser (can't see console there)
global.debug_logs = [];
global.max_debug_logs = 20; // Keep last 20 messages

/// @func debug_log(msg)
/// @param {String} msg The message to log
function debug_log(msg) {
    show_debug_message(msg);
    array_push(global.debug_logs, string(msg));
    if (array_length(global.debug_logs) > global.max_debug_logs) {
        array_delete(global.debug_logs, 0, 1);
    }
}

// Load volume settings
if (!variable_global_exists("volume_muted")) {
    volumeSettings_load();
}

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
powerMeterX = room_width / 2;  // Centered horizontally
powerMeterY = global.is_mobile ? room_height * 0.76 : room_height * 0.7; 
powerMeterWidth = 50;
powerMeterHeight = 300;

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


// Score submission state
timeSubmitted = false;
submissionStatus = "";  // "submitting", "success", "failed", or ""

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

// Coin spawning settings (MUST be defined before spawnCoins() is called)
numCoins = 6;  // Total number of coins to spawn
numObstacles = 4;  // Number of obstacles to spawn
edgeSpawnMinDist = 50;  // Minimum distance from edge for "close" spawns
edgeSpawnMaxDist = 120;  // Maximum distance from edge for "close" spawns
minCoinSpacing = 120;  // Minimum distance between coin/obstacle centers (increased to prevent touching)

// Flag to track if level is ready
levelReady = false;

debug_log("=== GAME STARTING ===");

// Check if this is a Reddit build or test build
if (is_reddit_build()) {
    debug_log("Reddit build detected");
    debug_log("Platform: " + (global.is_mobile ? "Mobile" : "Desktop"));
    
    // Initialize cache if it doesn't exist
    if (!variable_global_exists("level_cache_valid")) {
        global.cached_level_seed = undefined;
        global.level_cache_valid = false;
        global.level_cache_timestamp = undefined;
    }
    
    // Check if we have valid cached seed
    if (is_level_cache_valid()) {
        var _cachedSeed = get_cached_level_seed();
        debug_log("Using cached seed: " + string(_cachedSeed));
        debug_log("Cache age: " + string(get_cache_age_minutes()) + " minutes");
        
        // Use cached seed
        random_set_seed(_cachedSeed);
        spawnCoins();
        levelReady = true;
        debug_log("Level spawned from cache!");
    } else {
        // No valid cache, fetch from server
        debug_log("Fetching post date for seeded level...");
        
        // REDDIT BUILD: Fetch post date and use it as seed for consistent level generation
        api_get_post_date(function(_http_status, _ok, _result, _payload) {
            debug_log("=== POST DATE RESPONSE ===");
            debug_log("HTTP: " + string(_http_status ?? "undef"));
            debug_log("OK: " + string(_ok ?? "undef"));
            
            if (_ok && !is_undefined(_result) && _result != "") {
                try {
                    var _data = json_parse(_result);
                    debug_log("JSON parsed OK");
                    
                    if (_data.status == "success") {
                        var _dailySeed = _data.dailySeed;
                        debug_log("Daily seed: " + string(_dailySeed));
                        
                        // Cache the seed for future restarts
                        cache_level_seed(_dailySeed);
                        
                        // Use daily seed for consistent level generation
                        // All posts created on the same day will have the same level
                        random_set_seed(_dailySeed);
                        debug_log("Random seed set!");
                        
                        // Now spawn the level with this seed
                        spawnCoins();
                        debug_log("Seeded level spawned!");
                        
                        // Mark level as ready
                        oGameController.levelReady = true;
                    } else {
                        debug_log("Error: " + string(_data.message));
                        // Fallback: use randomize if API fails
                        randomize();
                        spawnCoins();
                        oGameController.levelReady = true;
                    }
                } catch(_ex) {
                    debug_log("JSON Error: " + string(_ex));
                    // Fallback: use randomize if parsing fails
                    randomize();
                    spawnCoins();
                    oGameController.levelReady = true;
                }
            } else {
                debug_log("Request failed or empty");
                // Fallback: use randomize if request fails
                randomize();
                spawnCoins();
                oGameController.levelReady = true;
            }
            debug_log("======================");
        });
    }
} else {
    // TEST BUILD: Use random level generation
    debug_log("Test build detected");
    debug_log("Platform: " + (global.is_mobile ? "Mobile" : "Desktop"));
    debug_log("Generating random level...");
    randomize();
    spawnCoins();
    levelReady = true;
    debug_log("Random level spawned!");
}