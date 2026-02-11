import { create } from 'zustand';
import type { ChallengeId } from '../../shared/types/api';

interface UserDataState {
	balance: number | null;
	uniqueCoins: number | null;
	activeCoin: string | null;
	allChallenges: Record<ChallengeId, boolean> | null;

	// Actions
	setBalance: (balance: number) => void;
	setUniqueCoins: (uniqueCoins: number) => void;
	setActiveCoin: (activeCoin: string) => void;
	setAllChallenges: (challenges: Record<ChallengeId, boolean>) => void;
	updateChallenges: (completedChallenges: ChallengeId[]) => void;
	reset: () => void;
}

export const useUserDataStore = create<UserDataState>((set) => ({
	balance: null,
	uniqueCoins: null,
	activeCoin: null,
	allChallenges: null,

	setBalance: (balance) => set({ balance }),
	setUniqueCoins: (uniqueCoins) => set({ uniqueCoins }),
	setActiveCoin: (activeCoin) => set({ activeCoin }),
	setAllChallenges: (challenges) => set({ allChallenges: challenges }),

	updateChallenges: (completedChallenges) =>
		set((state) => {
			const updated = { ...(state.allChallenges || {}) } as Record<ChallengeId, boolean>;
			completedChallenges.forEach((challengeId) => {
				updated[challengeId] = true;
			});
			return { allChallenges: updated };
		}),

	reset: () =>
		set({
			balance: null,
			uniqueCoins: null,
			activeCoin: null,
			allChallenges: null,
		}),
}));
