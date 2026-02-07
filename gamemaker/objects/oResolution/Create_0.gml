global.is_mobile = display_get_height() > display_get_width();

global.is_mobile = !global.is_mobile;


if (global.is_mobile) {
    // Mobile: Keep default size (750x1168 - set in room properties)
    show_debug_message("Mobile detected - Using default room size 750x1168");
} else {
    // Desktop: Set room and window size to 1000x730
    var _width = 1448;
    var _height = 1168;
    
    room_width = _width;
    room_height = _height;
    
    // Enable views if not already enabled
    view_enabled = true;
    view_visible[0] = true;
    
    // Update camera/view to match new room size
    var cam = view_camera[0];
    camera_set_view_size(cam, _width, _height);
    
    // Set view port to match window
    view_wport[0] = _width;
    view_hport[0] = _height;
    
    // Set GUI layer size
    display_set_gui_size(_width, _height);
    
    // Update surface size
    surface_resize(application_surface, _width, _height);
    
    // Update window size
    window_set_size(_width, _height);
    
    // Center the view at 0,0
    camera_set_view_pos(cam, 0, 0);
    
    show_debug_message("Desktop detected - Room size set to " + string(_width) + "x" + string(_height));
}