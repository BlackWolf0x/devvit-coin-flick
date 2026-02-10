/// @description Initialize volume button


// position for desktop
if (!global.is_mobile) {
	x = room_width - 100;
	y = 26;
	image_xscale = 0.4	
	image_yscale = 0.4
}

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
