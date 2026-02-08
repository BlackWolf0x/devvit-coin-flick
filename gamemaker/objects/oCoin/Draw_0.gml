/// @description Draw coin with selection indicator

// Draw shadow underneath the coin
draw_sprite_ext(sCoinShadow, 0, x, y, image_xscale, image_yscale, image_angle, c_white, 1);

// Draw the coin sprite
draw_self();

// If selected, draw a highlight ring
if (isSelected) {
    draw_set_color(c_lime);
    draw_set_alpha(0.8);
    
    // Draw thick circle using primitive - creates a crisp ring
    draw_primitive_begin(pr_trianglestrip);
    var _segments = 64; // More segments = smoother circle
    var _thickness = 3;
    var _radius = coinRadius + 3; // Slightly outside the coin
    for (var i = 0; i <= _segments; i++) {
        var _angle = (i / _segments) * 360;
        var _outerX = x + lengthdir_x(_radius, _angle);
        var _outerY = y + lengthdir_y(_radius, _angle);
        var _innerX = x + lengthdir_x(_radius - _thickness, _angle);
        var _innerY = y + lengthdir_y(_radius - _thickness, _angle);
        draw_vertex(_outerX, _outerY);
        draw_vertex(_innerX, _innerY);
    }
    draw_primitive_end();
    
    draw_set_alpha(1);
    draw_set_color(c_white);
}
