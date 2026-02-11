/// @desc Get the sprite for a coin based on its name
/// @param {String} _coinName The name of the coin (e.g., "beer", "club", "diamond")
/// @return {Asset.GMSprite} The sprite asset for the coin, or sCoin if not found
function getCoinSprite(_coinName) {
	// Map coin names to sprite assets
	switch (_coinName) {
		case "clover":
			return sCoinClover;
		case "club":
			return sCoinClub;
		case "diamond":
			return sCoinDiamond;
		case "heart":
			return sCoinHeart;
		case "spade":
			return sCoinSpade;
		case "bell":
			return sCoinBell;
		case "medal":
			return sCoinMedal;
		case "shield":
			return sCoinShield;
		case "music":
			return sCoinMusic;
		case "beer":
			return sCoinBeer;
		case "lightning":
			return sCoinLightning;
		case "snowflake":
			return sCoinSnowflake;
		case "crescent-moon":
			return sCoinCrescentMoon;
		case "fire":
			return sCoinFire;
		case "skull":
			return sCoinSkull;
		case "sun":
			return sCoinSun;
		case "atom":
			return sCoinAtom;
		case "trophy":
			return sCoinTrophy;
		case "star":
			return sCoinStar;
		case "crown":
			return sCoinCrown;
		case "none":
		default:
			return sCoinClover; // Default coin sprite
	}
}
