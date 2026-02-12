import { useEffect, useState } from 'react';
import type { UserDataResponse, ChallengeUpdateMessage } from '../../shared/types/api';
import { useUserDataStore } from '@/stores/userDataStore';
import { connectRealtime, context } from '@devvit/web/client';
import toast from 'react-hot-toast';
import { CHALLENGE_COMPLETE_AUDIO } from '../../shared/config';

const fetchUserData = async (): Promise<UserDataResponse> => {
	const response = await fetch('/api/user-data');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};

const getChallengeLabel = (challengeId: string): string => {
	switch (challengeId) {
		case 'completion':
			return 'Daily completion';
		case 'under30s':
			return 'Finish under 30s';
		case 'under15s':
			return 'Finish under 15s';
		default:
			return 'Challenge Completed';
	}
};

export function UserDataProvider({ children }: { children: React.ReactNode }) {
	const { setBalance, setUniqueCoins, setActiveCoin, setAllChallenges, updateChallenges } =
		useUserDataStore();

	const [initialized, setInitialized] = useState(false);

	// Pre-load audio for faster playback
	const challengeAudio = new Audio(CHALLENGE_COMPLETE_AUDIO);
	challengeAudio.volume = 0.5;

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

							// Delay audio and toast to avoid overlapping with game ending sound
							setTimeout(() => {
								// Play audio for challenge completion
								challengeAudio.currentTime = 0; // Reset to start
								challengeAudio.play().catch((err) => {
									console.log('Audio play failed:', err);
								});

								// Show toast notifications for completed challenges with staggered timing
								message.challenges.forEach((challengeId, index) => {
									setTimeout(() => {
										const label = getChallengeLabel(challengeId);
										toast.success(`🎉 ${label}!`, {
											duration: 5000,
										});
									}, index * 800); // Stagger by 800ms between each toast
								});
							}, 3000);
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
