/// @description Draw coin with selection indicator

// Draw shadow underneath the coin
draw_sprite_ext(sCoinShadow, 0, x, y, image_xscale, image_yscale, image_angle, c_white, 1);

// Draw the coin sprite
draw_self();

// If selected, draw a highlight ring
if (isSelected) {
    draw_set_color(c_lime);
    draw_set_alpha(0.8);
    draw_circle(x, y, coinRadius + 4, true);
    draw_circle(x, y, coinRadius + 6, true);
    draw_set_alpha(1);
    draw_set_color(c_white);
}
