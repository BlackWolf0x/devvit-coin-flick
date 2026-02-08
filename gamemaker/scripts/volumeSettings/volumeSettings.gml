/// @description Volume settings management using localStorage

/// @function volumeSettings_load()
/// @description Load volume settings from localStorage
function volumeSettings_load() {
    // Load from localStorage (defaults to false/unmuted)
    global.volume_muted = settings_load("volume_muted", 0);
    
    // Apply the volume setting
    if (global.volume_muted) {
        audio_master_gain(0);
    } else {
        audio_master_gain(1);
    }
    
    return global.volume_muted;
}

/// @function volumeSettings_save()
/// @description Save volume settings to localStorage
function volumeSettings_save() {
    settings_save("volume_muted", global.volume_muted ? 1 : 0);
}

/// @function volumeSettings_toggle()
/// @description Toggle volume mute/unmute
function volumeSettings_toggle() {
    global.volume_muted = !global.volume_muted;
    
    // Apply the volume setting
    if (global.volume_muted) {
        audio_master_gain(0);
    } else {
        audio_master_gain(1);
    }
    
    // Save the setting
    volumeSettings_save();
    
    return global.volume_muted;
}

/// @func settings_save(key, value)
/// @param {String} key The setting key
/// @param {Any} value The value to save
function settings_save(_key, _value) {
    // For HTML5/Browser builds, use localStorage
    if (os_browser != browser_not_a_browser) {
        var _json = json_stringify({value: _value});
        var _full_key = "coin_game_" + _key; // Prefix to avoid conflicts
        // Use localStorage via JavaScript
        var _js = "localStorage.setItem('" + _full_key + "', '" + _json + "');";
        html5_run_script(_js);
    } else {
        // Fallback for non-browser builds (desktop testing)
        ini_open("settings.ini");
        ini_write_real("Settings", _key, _value);
        ini_close();
    }
}

/// @func settings_load(key, default_value)
/// @param {String} key The setting key
/// @param {Any} default_value Default value if not found
/// @return {Any} The loaded value or default
function settings_load(_key, _default_value) {
    // For HTML5/Browser builds, use localStorage
    if (os_browser != browser_not_a_browser) {
        var _full_key = "coin_game_" + _key;
        // Get value from localStorage via JavaScript
        var _js = "localStorage.getItem('" + _full_key + "')";
        var _result = html5_run_script(_js);
        
        // If nothing found, return default
        if (_result == "" || _result == undefined || _result == "null") {
            return _default_value;
        }
        
        try {
            var _parsed = json_parse(_result);
            return _parsed.value;
        } catch(_ex) {
            return _default_value;
        }
    } else {
        // Fallback for non-browser builds
        ini_open("settings.ini");
        var _value = ini_read_real("Settings", _key, _default_value);
        ini_close();
        return _value;
    }
}

/// @func settings_clear(key)
/// @param {String} key The setting key to remove
function settings_clear(_key) {
    if (os_browser != browser_not_a_browser) {
        var _full_key = "coin_game_" + _key;
        var _js = "localStorage.removeItem('" + _full_key + "');";
        html5_run_script(_js);
    } else {
        ini_open("settings.ini");
        ini_key_delete("Settings", _key);
        ini_close();
    }
}
