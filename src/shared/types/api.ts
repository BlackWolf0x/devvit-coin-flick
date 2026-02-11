export type ChallengeId = 'completion' | 'under30s' | 'under15s';

export interface UserDataResponse {
	balance: number;
	allChallenges: Record<ChallengeId, boolean>;
	uniqueCoins: number;
	activeCoin: string;
}

export interface ApiErrorResponse {
	message: string;
}

export interface ChallengeUpdateMessage {
	type: 'challenge-update';
	challenges: ChallengeId[];
	newBalance: number;
}
export interface BalanceUpdateMessage {
	type: 'balance-update';
	balance: number;
	uniqueCoins?: number;
	timestamp: number;
}
