/// @description Spawn coins and obstacles randomly in play area with even distribution
function spawnCoins() {
    // Clear any existing coins and obstacles
    with (oCoin) {
        instance_destroy();
    }
    with (oObstacle) {
        instance_destroy();
    }
    
    // Array to track spawned positions (both coins and obstacles)
    var _spawnedPositions = [];
    var _obstaclePositions = []; // Track obstacles separately for stricter spacing
    var _numSpawned = 0;
    
    // Calculate obstacle spacing requirement (6x radius)
    // Base sprite width is used, scaled by play_scale * 0.5
    var _obstacleBaseRadius = sprite_get_width(sObstacle) / 2;
    var _obstacleRadius = _obstacleBaseRadius * global.play_scale * 0.5;
    var _minObstacleSpacing = _obstacleRadius * 6;
    
    // Calculate total objects to spawn
    var _totalObjects = numCoins + numObstacles;
    
    // Calculate how many coins near edges vs center
    var _numEdgeCoins = floor(numCoins / 2);
    var _numCenterCoins = numCoins - _numEdgeCoins;
    
    // ALWAYS use mobile dimensions for spawning (portrait: 952x1440)
    var _baseWidth = 952;
    var _baseHeight = 1440;
    var _spawnWidth = _baseWidth * global.play_scale;
    var _spawnHeight = _baseHeight * global.play_scale;
    var _spawnX = (room_width - _spawnWidth) / 2 + global.left_padding;
    var _spawnY = (room_height - _spawnHeight) / 2 + global.top_padding;
    
    // Create grid cells for better distribution
    var _gridCols = ceil(sqrt(_totalObjects * 1.5));
    var _gridRows = ceil(sqrt(_totalObjects * 1.5));
    var _cellWidth = _spawnWidth / _gridCols;
    var _cellHeight = _spawnHeight / _gridRows;
    
    // Create array of available cells
    var _availableCells = [];
    for (var _row = 0; _row < _gridRows; _row++) {
        for (var _col = 0; _col < _gridCols; _col++) {
            array_push(_availableCells, {row: _row, col: _col});
        }
    }
    
    // Shuffle available cells
    for (var i = array_length(_availableCells) - 1; i > 0; i--) {
        var j = irandom(i);
        var _temp = _availableCells[i];
        _availableCells[i] = _availableCells[j];
        _availableCells[j] = _temp;
    }
    
    // Start with desired spacing, will reduce if needed
    var _currentSpacing = minCoinSpacing;
    var _minAllowedSpacing = 40; // Absolute minimum
    
    // Keep trying with reduced spacing until we spawn all objects
    while (_numSpawned < _totalObjects && _currentSpacing >= _minAllowedSpacing) {
        // Reset for this attempt
        _numSpawned = 0;
        _spawnedPositions = [];
        _obstaclePositions = [];
        
        // Clear any objects from previous attempt
        with (oCoin) {
            instance_destroy();
        }
        with (oObstacle) {
            instance_destroy();
        }
        
        var _cellIndex = 0;
        
        // Spawn edge coins first
        var _edgeCoinsSpawned = 0;
        while (_edgeCoinsSpawned < _numEdgeCoins && _cellIndex < array_length(_availableCells)) {
            // Get next cell
            var _cell = _availableCells[_cellIndex];
            _cellIndex++;
            
            // Calculate cell bounds (using spawn dimensions)
            var _cellX = _spawnX + (_cell.col * _cellWidth);
            var _cellY = _spawnY + (_cell.row * _cellHeight);
            
            // Try each edge to see if this cell is near one
            var _spawned = false;
            var _edges = [0, 1, 2, 3];
            
            // Shuffle edges
            for (var i = 3; i > 0; i--) {
                var j = irandom(i);
                var _temp = _edges[i];
                _edges[i] = _edges[j];
                _edges[j] = _temp;
            }
            
            for (var _edgeIdx = 0; _edgeIdx < 4; _edgeIdx++) {
                var _edge = _edges[_edgeIdx];
                
                // Pick random distance from edge within range
                var _distFromEdge = irandom_range(edgeSpawnMinDist, edgeSpawnMaxDist);
                
                var _x, _y;
                var _isNearEdge = false;
                
                switch (_edge) {
                    case 0: // Left edge
                        if (_cellX < _spawnX + edgeSpawnMaxDist + _cellWidth) {
                            _x = _spawnX + _distFromEdge;
                            _y = _cellY + random(_cellHeight);
                            _isNearEdge = true;
                        }
                        break;
                    case 1: // Right edge
                        if (_cellX > _spawnX + _spawnWidth - edgeSpawnMaxDist - _cellWidth) {
                            _x = _spawnX + _spawnWidth - _distFromEdge;
                            _y = _cellY + random(_cellHeight);
                            _isNearEdge = true;
                        }
                        break;
                    case 2: // Top edge
                        if (_cellY < _spawnY + edgeSpawnMaxDist + _cellHeight) {
                            _x = _cellX + random(_cellWidth);
                            _y = _spawnY + _distFromEdge;
                            _isNearEdge = true;
                        }
                        break;
                    case 3: // Bottom edge
                        if (_cellY > _spawnY + _spawnHeight - edgeSpawnMaxDist - _cellHeight) {
                            _x = _cellX + random(_cellWidth);
                            _y = _spawnY + _spawnHeight - _distFromEdge;
                            _isNearEdge = true;
                        }
                        break;
                }
                
                // If this cell isn't near this edge, try next edge
                if (!_isNearEdge) continue;
                
                // Check if position is valid (no overlap with existing objects)
                var _valid = true;
                for (var i = 0; i < array_length(_spawnedPositions); i++) {
                    var _existing = _spawnedPositions[i];
                    var _dist = point_distance(_x, _y, _existing.x, _existing.y);
                    if (_dist < _currentSpacing) {
                        _valid = false;
                        break;
                    }
                }
                
                // Spawn coin if valid
                if (_valid) {
                    // For desktop, swap x and y to achieve -90 deg rotation
                    var _finalX, _finalY;
                    if (global.is_mobile) {
                        _finalX = _x;
                        _finalY = _y;
                    } else {
                        // Rotate -90 degrees: swap and adjust
                        // Convert to relative coordinates
                        var _relX = _x - _spawnX;
                        var _relY = _y - _spawnY;
                        // Swap and flip: new_x = y, new_y = width - x
                        _finalX = playAreaX + _relY;
                        _finalY = playAreaY + (_spawnWidth - _relX);
                    }
                    
                    var _coin = instance_create_layer(_finalX, _finalY, "Instances", oCoin);
                    array_push(_spawnedPositions, {x: _x, y: _y});
                    _edgeCoinsSpawned++;
                    _numSpawned++;
                    _spawned = true;
                    break; // Successfully spawned, move to next cell
                }
            }
        }
        
        // Spawn center coins using remaining cells
        var _centerCoinsSpawned = 0;
        while (_centerCoinsSpawned < _numCenterCoins && _cellIndex < array_length(_availableCells)) {
            // Get next cell
            var _cell = _availableCells[_cellIndex];
            _cellIndex++;
            
            // Calculate random position within cell (using spawn dimensions)
            var _cellX = _spawnX + (_cell.col * _cellWidth);
            var _cellY = _spawnY + (_cell.row * _cellHeight);
            
            // Add some padding from cell edges for variety
            var _padding = min(_cellWidth, _cellHeight) * 0.2;
            var _x = _cellX + _padding + random(_cellWidth - _padding * 2);
            var _y = _cellY + _padding + random(_cellHeight - _padding * 2);
            
            // Clamp to spawn area
            _x = clamp(_x, _spawnX + 30, _spawnX + _spawnWidth - 30);
            _y = clamp(_y, _spawnY + 30, _spawnY + _spawnHeight - 30);
            
            // Check if position is valid (no overlap with existing objects)
            var _valid = true;
            for (var i = 0; i < array_length(_spawnedPositions); i++) {
                var _existing = _spawnedPositions[i];
                var _dist = point_distance(_x, _y, _existing.x, _existing.y);
                if (_dist < _currentSpacing) {
                    _valid = false;
                    break;
                }
            }
            
            // Spawn coin if valid
            if (_valid) {
                // For desktop, swap x and y to achieve -90 deg rotation
                var _finalX, _finalY;
                if (global.is_mobile) {
                    _finalX = _x;
                    _finalY = _y;
                } else {
                    // Rotate -90 degrees: swap and adjust
                    var _relX = _x - _spawnX;
                    var _relY = _y - _spawnY;
                    _finalX = playAreaX + _relY;
                    _finalY = playAreaY + (_spawnWidth - _relX);
                }
                
                var _coin = instance_create_layer(_finalX, _finalY, "Instances", oCoin);
                array_push(_spawnedPositions, {x: _x, y: _y});
                _centerCoinsSpawned++;
                _numSpawned++;
            }
        }
        
        // Spawn obstacles - one in each quarter of the table
        var _obstaclesSpawned = 0;
        var _quarterWidth = _spawnWidth / 2;
        var _quarterHeight = _spawnHeight / 2;
        
        // Define corner exclusion zone (distance from each corner)
        var _cornerExclusionRadius = 150;
        
        // Define the 4 table corners
        var _corners = [
            {x: _spawnX, y: _spawnY}, // Top-left
            {x: _spawnX + _spawnWidth, y: _spawnY}, // Top-right
            {x: _spawnX, y: _spawnY + _spawnHeight}, // Bottom-left
            {x: _spawnX + _spawnWidth, y: _spawnY + _spawnHeight} // Bottom-right
        ];
        
        // Define the 4 quarters (top-left, top-right, bottom-left, bottom-right)
        var _quarters = [
            {x: _spawnX, y: _spawnY, w: _quarterWidth, h: _quarterHeight}, // Top-left
            {x: _spawnX + _quarterWidth, y: _spawnY, w: _quarterWidth, h: _quarterHeight}, // Top-right
            {x: _spawnX, y: _spawnY + _quarterHeight, w: _quarterWidth, h: _quarterHeight}, // Bottom-left
            {x: _spawnX + _quarterWidth, y: _spawnY + _quarterHeight, w: _quarterWidth, h: _quarterHeight} // Bottom-right
        ];
        
        // Shuffle quarters for randomness
        for (var i = array_length(_quarters) - 1; i > 0; i--) {
            var j = irandom(i);
            var _temp = _quarters[i];
            _quarters[i] = _quarters[j];
            _quarters[j] = _temp;
        }
        
        // Spawn one obstacle in each quarter
        for (var _quarterIdx = 0; _quarterIdx < min(numObstacles, 4); _quarterIdx++) {
            var _quarter = _quarters[_quarterIdx];
            var _attempts = 0;
            var _maxAttempts = 100;
            var _spawned = false;
            
            while (!_spawned && _attempts < _maxAttempts) {
                _attempts++;
                
                // Random position within this quarter with padding from edges
                var _padding = 30;
                var _x = _quarter.x + _padding + random(_quarter.w - _padding * 2);
                var _y = _quarter.y + _padding + random(_quarter.h - _padding * 2);
                
                // Clamp to spawn area
                _x = clamp(_x, _spawnX + 30, _spawnX + _spawnWidth - 30);
                _y = clamp(_y, _spawnY + 30, _spawnY + _spawnHeight - 30);
                
                // Check if position is too close to any corner
                var _tooCloseToCorner = false;
                for (var i = 0; i < array_length(_corners); i++) {
                    var _corner = _corners[i];
                    var _distToCorner = point_distance(_x, _y, _corner.x, _corner.y);
                    if (_distToCorner < _cornerExclusionRadius) {
                        _tooCloseToCorner = true;
                        break;
                    }
                }
                
                // Skip this position if too close to a corner
                if (_tooCloseToCorner) {
                    continue;
                }
                
                // Check if position is valid (no overlap with existing objects)
                var _valid = true;
                for (var i = 0; i < array_length(_spawnedPositions); i++) {
                    var _existing = _spawnedPositions[i];
                    var _dist = point_distance(_x, _y, _existing.x, _existing.y);
                    if (_dist < _currentSpacing) {
                        _valid = false;
                        break;
                    }
                }
                
                // Additional check: maintain stricter spacing between obstacles
                if (_valid) {
                    for (var i = 0; i < array_length(_obstaclePositions); i++) {
                        var _existing = _obstaclePositions[i];
                        var _dist = point_distance(_x, _y, _existing.x, _existing.y);
                        if (_dist < _minObstacleSpacing) {
                            _valid = false;
                            break;
                        }
                    }
                }
                
                // Spawn obstacle if valid
                if (_valid) {
                    // For desktop, swap x and y to achieve -90 deg rotation
                    var _finalX, _finalY;
                    if (global.is_mobile) {
                        _finalX = _x;
                        _finalY = _y;
                    } else {
                        // Rotate -90 degrees: swap and adjust
                        var _relX = _x - _spawnX;
                        var _relY = _y - _spawnY;
                        _finalX = playAreaX + _relY;
                        _finalY = playAreaY + (_spawnWidth - _relX);
                    }
                    
                    var _obstacle = instance_create_layer(_finalX, _finalY, "Instances", oObstacle);
                    array_push(_spawnedPositions, {x: _x, y: _y});
                    array_push(_obstaclePositions, {x: _x, y: _y});
                    _obstaclesSpawned++;
                    _numSpawned++;
                    _spawned = true;
                }
            }
            
            // If we couldn't spawn in this quarter after max attempts, log it
            if (!_spawned) {
                show_debug_message("Warning: Could not spawn obstacle in quarter " + string(_quarterIdx));
            }
        }
        
        // If we didn't spawn all objects, reduce spacing and try again
        if (_numSpawned < _totalObjects) {
            _currentSpacing -= 5;
            show_debug_message("Reducing spacing to " + string(_currentSpacing) + " to fit all objects");
        }
    }
    
    // Final check - if still not enough objects, force spawn remaining
    if (_numSpawned < _totalObjects) {
        show_debug_message("Force spawning remaining " + string(_totalObjects - _numSpawned) + " objects");
        
        var _coinsSpawned = instance_number(oCoin);
        var _obstaclesSpawned = instance_number(oObstacle);
        
        var _forceAttempts = 0;
        while (_numSpawned < _totalObjects && _forceAttempts < 5000) {
            _forceAttempts++;
            
            // Random position anywhere in spawn area
            var _x = _spawnX + random(_spawnWidth);
            var _y = _spawnY + random(_spawnHeight);
            
            // Check minimum spacing (very relaxed)
            var _valid = true;
            for (var i = 0; i < array_length(_spawnedPositions); i++) {
                var _existing = _spawnedPositions[i];
                var _dist = point_distance(_x, _y, _existing.x, _existing.y);
                if (_dist < _minAllowedSpacing) {
                    _valid = false;
                    break;
                }
            }
            
            // If spawning an obstacle, check stricter spacing against other obstacles
            if (_valid && _obstaclesSpawned < numObstacles && _coinsSpawned >= numCoins) {
                for (var i = 0; i < array_length(_obstaclePositions); i++) {
                    var _existing = _obstaclePositions[i];
                    var _dist = point_distance(_x, _y, _existing.x, _existing.y);
                    if (_dist < _minObstacleSpacing) {
                        _valid = false;
                        break;
                    }
                }
            }
            
            if (_valid) {
                // For desktop, swap x and y to achieve -90 deg rotation
                var _finalX, _finalY;
                if (global.is_mobile) {
                    _finalX = _x;
                    _finalY = _y;
                } else {
                    // Rotate -90 degrees: swap and adjust
                    var _relX = _x - _spawnX;
                    var _relY = _y - _spawnY;
                    _finalX = playAreaX + _relY;
                    _finalY = playAreaY + (_spawnWidth - _relX);
                }
                
                // Spawn coins first, then obstacles
                if (_coinsSpawned < numCoins) {
                    var _coin = instance_create_layer(_finalX, _finalY, "Instances", oCoin);
                    _coinsSpawned++;
                } else if (_obstaclesSpawned < numObstacles) {
                    var _obstacle = instance_create_layer(_finalX, _finalY, "Instances", oObstacle);
                    array_push(_obstaclePositions, {x: _x, y: _y});
                    _obstaclesSpawned++;
                }
                array_push(_spawnedPositions, {x: _x, y: _y});
                _numSpawned++;
            }
        }
    }
    
    show_debug_message("Successfully spawned " + string(instance_number(oCoin)) + " coins and " + string(instance_number(oObstacle)) + " obstacles");
}
