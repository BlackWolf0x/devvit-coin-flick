import { useEffect, useState } from 'react';
import type { UserDataResponse, ChallengeUpdateMessage } from '../../shared/types/api';
import { useUserDataStore } from '@/stores/userDataStore';
import { connectRealtime, context } from '@devvit/web/client';

const fetchUserData = async (): Promise<UserDataResponse> => {
	const response = await fetch('/api/user-data');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};

export function UserDataProvider({ children }: { children: React.ReactNode }) {
	const { setBalance, setUniqueCoins, setActiveCoin, setAllChallenges, updateChallenges } =
		useUserDataStore();

	const [initialized, setInitialized] = useState(false);

	// Fetch user data only once on mount
	useEffect(() => {
		if (initialized) return;

		fetchUserData()
			.then((userData) => {
				setBalance(userData.balance);
				setUniqueCoins(userData.uniqueCoins);
				setActiveCoin(userData.activeCoin);
				setAllChallenges(userData.allChallenges);
				setInitialized(true);
			})
			.catch((error) => {
				console.error('Failed to fetch user data:', error);
			});
	}, [initialized, setBalance, setUniqueCoins, setActiveCoin, setAllChallenges]);

	// Initialize realtime connections
	useEffect(() => {
		const { userId, postId } = context;
		if (!userId) return;

		let balanceConnection: any;
		let challengeConnection: any;

		const setupRealtime = async () => {
			// Balance updates
			balanceConnection = await connectRealtime({
				channel: `wallet_${userId}`,
				onMessage: (data: any) => {
					if (data.type === 'balance-update') {
						setBalance(data.balance);
						if (data.uniqueCoins !== undefined) {
							setUniqueCoins(data.uniqueCoins);
						}
					} else if (data.type === 'active-coin-update') {
						setActiveCoin(data.activeCoin);
					}
				},
			});

			// Challenge updates
			if (postId) {
				challengeConnection = await connectRealtime({
					channel: `challenges_${userId}_${postId}`,
					onMessage: (data: any) => {
						if (data.type === 'challenge-update') {
							const message = data as ChallengeUpdateMessage;
							setBalance(message.newBalance);
							updateChallenges(message.challenges);
						}
					},
				});
			}
		};

		setupRealtime();

		return () => {
			if (balanceConnection) {
				balanceConnection.disconnect();
			}
			if (challengeConnection) {
				challengeConnection.disconnect();
			}
		};
	}, [setBalance, setUniqueCoins, updateChallenges]);

	return <>{children}</>;
}
