/// @description Initialize volume button

// Load volume settings on first creation
if (!variable_global_exists("volume_muted")) {
    volumeSettings_load();
}

// Set initial sprite based on mute state
if (global.volume_muted) {
    sprite_index = sVolOff;
} else {
    sprite_index = sVolOn;
}
