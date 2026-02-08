/// @description Start the shrink animation for a coin
/// @param {Id.Instance} coinId The coin instance to shrink

function startCoinShrink(_coinId) {
    if (instance_exists(_coinId) && !_coinId.isShrinking) {
        with (_coinId) {
            isShrinking = true;
            // Stop physics movement
            phy_linear_velocity_x = 0;
            phy_linear_velocity_y = 0;
            phy_angular_velocity = 0;
            // Disable collision detection so it can't be targeted
            phy_active = false;
        }
        return true;
    }
    return false;
}
