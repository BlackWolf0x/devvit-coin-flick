/// @ignore
function api_get_http_manager() {
	with (obj_http_manager) return self;
	return instance_create_depth(0, 0, 0, obj_http_manager);
}

/// @ignore
function api_register_request(_req, _callback) {
	var _manager = api_get_http_manager();
	_manager.register(_req, _callback);
}

/// @desc This function retrieves the game data (post date, daily seed, active coin) from the server.
/// @param {Function} _callback The callback that you want to be executed upon task completion.
function api_get_game_data(_callback) {
	
	// Build request url
	var _url = reddit_get_base_url() + "/api/get-game-data";
	
	// Build request headers
	var _headers = ds_map_create();
	
	// Only add Authorization header if we have a real token
	// On mobile, credentials are passed via cookies (use-credentials mode)
	var _token = reddit_get_token();
	if (_token != "noone" && _token != "") {
		ds_map_add(_headers, "Authorization", $"Bearer {_token}");
	}
	
	// Make request
	var _req = http_request(_url, "GET", _headers, "");
	
	// Free memory
	ds_map_destroy(_headers);
	
	// Register request callback
	if (is_callable(_callback)) api_register_request(_req, _callback);
	
	return _req;
}


/// @desc This function submits the player's completion time to the server.
/// @param {Real} _completionTime The completion time in milliseconds
/// @param {Function} _callback The callback that you want to be executed upon task completion.
function api_submit_time(_completionTime, _callback) {
	
	// Build request url
	var _url = reddit_get_base_url() + "/api/submit-time";
	
	// Build request headers
	var _headers = ds_map_create();
	
	// Only add Authorization header if we have a real token
	// On mobile, credentials are passed via cookies (use-credentials mode)
	var _token = reddit_get_token();
	if (_token != "noone" && _token != "") {
		ds_map_add(_headers, "Authorization", $"Bearer {_token}");
	}
	ds_map_add(_headers, "Content-Type", "application/json");
	
	// Build request body
	var _body = json_stringify({
		completionTime: _completionTime
	});
	
	// Make request
	var _req = http_request(_url, "POST", _headers, _body);
	
	// Free memory
	ds_map_destroy(_headers);
	
	// Register request callback
	if (is_callable(_callback)) api_register_request(_req, _callback);
	
	return _req;
}
