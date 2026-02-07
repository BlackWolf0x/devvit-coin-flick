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
    var _numSpawned = 0;
    
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
        
        // Spawn obstacles using remaining cells
        var _obstaclesSpawned = 0;
        while (_obstaclesSpawned < numObstacles && _cellIndex < array_length(_availableCells)) {
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
                _obstaclesSpawned++;
                _numSpawned++;
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
                    _obstaclesSpawned++;
                }
                array_push(_spawnedPositions, {x: _x, y: _y});
                _numSpawned++;
            }
        }
    }
    
    show_debug_message("Successfully spawned " + string(instance_number(oCoin)) + " coins and " + string(instance_number(oObstacle)) + " obstacles");
}
