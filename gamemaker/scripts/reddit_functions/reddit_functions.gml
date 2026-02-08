/// @desc This function allows you to get the base url where your game is running
/// which is necessary when trying to access your reddit server side API.
function reddit_get_base_url() {
	
	static _domain = undefined;
	
	// This is cached so if we computed this already return it
	if (!is_undefined(_domain)) return _domain;
		
	// Try the built in runtime function
	_domain = url_get_domain();
	if (_domain == "localhost") {
		// This was not yet fixed (2024.13 or prev) lets use OS info
		var _info = os_get_info();
		var _href = ds_map_find_value(_info, "window.location.href");
		ds_map_destroy(_info);
		
		// We don't have OS information on this (fallback to domain)
		if (is_undefined(_href)) return _domain;
		
		// Let's try to look for 'index.html'
		var _cutoff = string_pos("index.html", _href);
		if (_cutoff == 0) {
			// Second pass lets do 'runner.html' instead
			_cutoff = string_pos("runner.html", _href);	 
			if (_cutoff == 0) return _domain; // Don't know what else more can be done here
		}
		
		// Remove everything after index.html (inclusive)
		_domain = string_delete(_href, _cutoff - 1 /* remove trailing '/' */, string_length(_href));
	}
	else {
		// Let's fetch the OS info
		var _info = os_get_info();
		var _protocol = ds_map_find_value(_info, "window.location.protocol");
		ds_map_destroy(_info);
		
		// We don't have OS information on this (fallback to 'https')
		_protocol ??= "https:";
		
		// Make sure we add the protocol to it
		_domain = $"{_protocol}//{_domain}";
	}

	return _domain;
}

/// @desc This function gives you the auth token necessary to pass into any calls to
/// your server side API. This token needs to be added the the header map following the format:
///		header_map[? "Authorization"] = $"Bearer {<token>};
function reddit_get_token() {
	static _token = undefined;
	
	if (!is_undefined(_token)) return _token;
	
	_token = "noone";
	
	// Try getting token from parameter_string (desktop browser)
	for (var _i = 0; _i < parameter_count(); ++_i) {
		var _param = parameter_string(_i);
		if (string_starts_with(_param, "token=")) {
			_token = string_delete(_param, 1, 6);
			//show_debug_message("Token found via parameter_string: " + _token);
			return _token;
		}
	}
	
	// Try getting token from os_get_info (mobile/alternative)
	var _info = os_get_info();
	
	// Check for token in URL hash or search params
	var _href = ds_map_find_value(_info, "window.location.href");
	if (!is_undefined(_href)) {
		//show_debug_message("Checking href for token: " + string(_href));
		var _token_pos = string_pos("token=", _href);
		if (_token_pos > 0) {
			var _token_start = _token_pos + 6;
			var _token_end = string_pos("&", string_copy(_href, _token_start, string_length(_href)));
			if (_token_end == 0) {
				_token = string_copy(_href, _token_start, string_length(_href));
			} else {
				_token = string_copy(_href, _token_start, _token_end - 1);
			}
			//show_debug_message("Token found via href: " + _token);
		}
	}
	
	// Check for devvit token in os_get_info
	var _devvit_token = ds_map_find_value(_info, "devvit.token");
	if (!is_undefined(_devvit_token) && _devvit_token != "") {
		_token = _devvit_token;
		//show_debug_message("Token found via devvit.token: " + _token);
	}
	
	ds_map_destroy(_info);
	
	//show_debug_message("Final token value: " + _token);
	return _token;
}

/// @desc Returns true if this is a Reddit/Devvit build (not a test/local build)
/// Checks if we have a valid token and are running on a Reddit domain
function is_reddit_build() {
	static _is_reddit = undefined;
	
	if (!is_undefined(_is_reddit)) return _is_reddit;
	
	// Check for a valid token (not "noone")
	var _token = reddit_get_token();
	if (_token == "noone" || _token == "") {
		_is_reddit = false;
		//show_debug_message("is_reddit_build: false (no valid token)");
		return _is_reddit;
	}
	
	// Check if we're on a reddit domain
	var _url = reddit_get_base_url();
	if (string_pos("reddit", string_lower(_url)) > 0 || string_pos("devvit", string_lower(_url)) > 0) {
		_is_reddit = true;
		//show_debug_message("is_reddit_build: true (reddit domain detected)");
		return _is_reddit;
	}
	
	// If we have a token but not on reddit domain, still consider it a reddit build
	// (could be a development server with token)
	_is_reddit = true;
	//show_debug_message("is_reddit_build: true (valid token present)");
	return _is_reddit;
}