/// @description Spawn coins randomly in play area
function spawnCoins() {
    // Clear any existing coins
    with (oCoin) {
        instance_destroy();
    }
    
    // Array to track spawned coin positions
    var _spawnedCoins = [];
    var _numSpawned = 0;
    
    // Calculate how many coins near edges vs center
    var _numEdgeCoins = floor(numCoins / 2);
    var _numCenterCoins = numCoins - _numEdgeCoins;
    
    // Spawn edge coins first
    var _attempts = 0;
    var _maxAttempts = 1000;
    
    while (_numSpawned < _numEdgeCoins && _attempts < _maxAttempts) {
        _attempts++;
        
        // Pick random distance from edge within range
        var _distFromEdge = irandom_range(edgeSpawnMinDist, edgeSpawnMaxDist);
        
        // Pick random edge (0=left, 1=right, 2=top, 3=bottom)
        var _edge = irandom(3);
        var _x, _y;
        
        switch (_edge) {
            case 0: // Left edge
                _x = playAreaX + _distFromEdge;
                _y = playAreaY + irandom_range(0, playAreaHeight);
                break;
            case 1: // Right edge
                _x = playAreaX + playAreaWidth - _distFromEdge;
                _y = playAreaY + irandom_range(0, playAreaHeight);
                break;
            case 2: // Top edge
                _x = playAreaX + irandom_range(0, playAreaWidth);
                _y = playAreaY + _distFromEdge;
                break;
            case 3: // Bottom edge
                _x = playAreaX + irandom_range(0, playAreaWidth);
                _y = playAreaY + playAreaHeight - _distFromEdge;
                break;
        }
        
        // Check if position is valid (no overlap with existing coins)
        var _valid = true;
        for (var i = 0; i < array_length(_spawnedCoins); i++) {
            var _existingCoin = _spawnedCoins[i];
            var _dist = point_distance(_x, _y, _existingCoin.x, _existingCoin.y);
            if (_dist < minCoinSpacing) {
                _valid = false;
                break;
            }
        }
        
        // Spawn coin if valid
        if (_valid) {
            var _coin = instance_create_layer(_x, _y, "Instances", oCoin);
            array_push(_spawnedCoins, {x: _x, y: _y});
            _numSpawned++;
            _attempts = 0; // Reset attempts on success
        }
    }
    
    // Spawn center coins
    _attempts = 0;
    while (_numSpawned < numCoins && _attempts < _maxAttempts) {
        _attempts++;
        
        // Spawn away from edges (in the center area)
        var _centerMargin = edgeSpawnMaxDist + 20;
        var _centerWidth = playAreaWidth - (_centerMargin * 2);
        var _centerHeight = playAreaHeight - (_centerMargin * 2);
        
        // Make sure we have valid center area
        if (_centerWidth > 0 && _centerHeight > 0) {
            var _x = playAreaX + _centerMargin + irandom_range(0, _centerWidth);
            var _y = playAreaY + _centerMargin + irandom_range(0, _centerHeight);
            
            // Check if position is valid (no overlap with existing coins)
            var _valid = true;
            for (var i = 0; i < array_length(_spawnedCoins); i++) {
                var _existingCoin = _spawnedCoins[i];
                var _dist = point_distance(_x, _y, _existingCoin.x, _existingCoin.y);
                if (_dist < minCoinSpacing) {
                    _valid = false;
                    break;
                }
            }
            
            // Spawn coin if valid
            if (_valid) {
                var _coin = instance_create_layer(_x, _y, "Instances", oCoin);
                array_push(_spawnedCoins, {x: _x, y: _y});
                _numSpawned++;
                _attempts = 0; // Reset attempts on success
            }
        } else {
            // If center area is too small, just spawn anywhere in play area
            var _x = playAreaX + irandom_range(0, playAreaWidth);
            var _y = playAreaY + irandom_range(0, playAreaHeight);
            
            // Check if position is valid (no overlap with existing coins)
            var _valid = true;
            for (var i = 0; i < array_length(_spawnedCoins); i++) {
                var _existingCoin = _spawnedCoins[i];
                var _dist = point_distance(_x, _y, _existingCoin.x, _existingCoin.y);
                if (_dist < minCoinSpacing) {
                    _valid = false;
                    break;
                }
            }
            
            // Spawn coin if valid
            if (_valid) {
                var _coin = instance_create_layer(_x, _y, "Instances", oCoin);
                array_push(_spawnedCoins, {x: _x, y: _y});
                _numSpawned++;
                _attempts = 0; // Reset attempts on success
            }
        }
    }
    
    // Log if we couldn't spawn all coins
    if (_numSpawned < numCoins) {
        show_debug_message("Warning: Could only spawn " + string(_numSpawned) + " out of " + string(numCoins) + " coins");
    }
}
