export type ChallengeId = 'completion' | 'under60s' | 'under30s';

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
