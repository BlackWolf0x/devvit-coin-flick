/// @func clear_level_cache()
/// @desc Clears the cached level seed, forcing a fresh fetch on next game start
function clear_level_cache() {
	global.cached_level_seed = undefined;
	global.level_cache_valid = false;
	global.level_cache_timestamp = undefined;
	show_debug_message("Level cache cleared - next game will fetch fresh seed");
}

/// @func is_level_cache_valid()
/// @desc Returns true if cached level seed is available and valid (not expired)
function is_level_cache_valid() {
	if (!variable_global_exists("level_cache_valid") || 
	    !global.level_cache_valid || 
	    is_undefined(global.cached_level_seed)) {
		return false;
	}
	
	// Check if cache has expired (30 minutes = 1800000 milliseconds)
	var cache_expiry_time = 1800000; // 30 minutes
	if (variable_global_exists("level_cache_timestamp") && 
	    !is_undefined(global.level_cache_timestamp)) {
		var time_elapsed = current_time - global.level_cache_timestamp;
		if (time_elapsed > cache_expiry_time) {
			show_debug_message("Level cache expired after " + string(time_elapsed / 60000) + " minutes");
			clear_level_cache();
			return false;
		}
	}
	
	return true;
}

/// @func get_cached_level_seed()
/// @desc Returns the cached level seed if available, undefined otherwise
function get_cached_level_seed() {
	if (is_level_cache_valid()) {
		return global.cached_level_seed;
	}
	return undefined;
}

/// @func cache_level_seed(seed)
/// @desc Stores level seed in the cache for future use
/// @param {Real} seed The daily seed to cache
function cache_level_seed(_seed) {
	global.cached_level_seed = _seed;
	global.level_cache_valid = true;
	global.level_cache_timestamp = current_time;
	show_debug_message("Level seed cached for future restarts (expires in 30 minutes)");
}

/// @func get_cache_age_minutes()
/// @desc Returns the age of the cached seed in minutes, or -1 if no cache
function get_cache_age_minutes() {
	if (!is_level_cache_valid() || 
	    !variable_global_exists("level_cache_timestamp") || 
	    is_undefined(global.level_cache_timestamp)) {
		return -1;
	}
	
	var time_elapsed = current_time - global.level_cache_timestamp;
	return time_elapsed / 60000; // Convert milliseconds to minutes
}