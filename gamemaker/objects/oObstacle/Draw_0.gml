/// @description Draw obstacle with shadow

// Draw shadow underneath the obstacle
draw_sprite_ext(sCupShadow, 0, x, y, image_xscale, image_yscale, image_angle, c_white, 1);

// Draw the obstacle sprite
draw_self();
