export interface UserDataResponse {
	balance: number;
	allChallenges: Record<string, string>;
	uniqueCoins: number;
	activeCoin: string;
}

export interface ApiErrorResponse {
	message: string;
}
