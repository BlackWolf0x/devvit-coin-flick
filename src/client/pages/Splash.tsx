import { SpChallenges } from '@/components/SpChallenges';
import { SpMyBalance } from '@/components/SpMyBalance';
import { SpCoinsCollected } from '@/components/SpCoinsCollected';
import { SpOpenChest } from '@/components/SpOpenChest';
import { SpPlayButton } from '@/components/SpPlayButton';
import { SpTopRightButtons } from '@/components/SpTopRightButtons';
import { connectRealtime, context } from '@devvit/web/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type {
	UserDataResponse,
	ChallengeUpdateMessage,
	ChallengeId,
	BalanceUpdateMessage,
} from '../../shared/types/api';

// API functions
const fetchUserData = async (): Promise<UserDataResponse> => {
	const response = await fetch('/api/user-data');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};

export default function Splash() {
	const [realtimeBalance, setRealtimeBalance] = useState<number | null>(null);
	const [realtimeUniqueCoins, setRealtimeUniqueCoins] = useState<number | null>(null);
	const [realtimeChallenges, setRealtimeChallenges] = useState<Record<
		ChallengeId,
		boolean
	> | null>(null);

	// Fetch user data
	const { data: userData } = useQuery<UserDataResponse>({
		queryKey: ['userData'],
		queryFn: fetchUserData,
	});

	console.log(userData);

	// Connect to realtime channel for balance updates
	useEffect(() => {
		const { userId } = context;
		if (!userId) return;

		let connection: any;

		const setupRealtime = async () => {
			connection = await connectRealtime({
				channel: `wallet_${userId}`,
				onMessage: (data: any) => {
					const message = data as BalanceUpdateMessage;
					if (message.type === 'balance-update') {
						setRealtimeBalance(message.balance);
						if (message.uniqueCoins !== undefined) {
							setRealtimeUniqueCoins(message.uniqueCoins);
						}
					}
				},
			});
		};

		setupRealtime();

		return () => {
			if (connection) {
				connection.disconnect();
			}
		};
	}, []);

	// Connect to realtime channel for challenge updates
	useEffect(() => {
		const { userId, postId } = context;
		if (!userId || !postId) return;

		let connection: any;

		const setupRealtime = async () => {
			connection = await connectRealtime({
				channel: `challenges_${userId}_${postId}`,
				onMessage: (data: any) => {
					if (data.type === 'challenge-update') {
						const message = data as ChallengeUpdateMessage;
						setRealtimeBalance(message.newBalance);

						// Update challenges state by merging with existing
						setRealtimeChallenges((prev) => {
							const base =
								prev ||
								userData?.allChallenges ||
								({} as Record<ChallengeId, boolean>);
							const updated = { ...base };
							message.challenges.forEach((challengeId) => {
								updated[challengeId] = true;
							});
							return updated;
						});
					}
				},
			});
		};

		setupRealtime();

		return () => {
			if (connection) {
				connection.disconnect();
			}
		};
	}, [userData?.allChallenges]);

	// Use realtime balance if available, otherwise use fetched balance
	const displayBalance = realtimeBalance !== null ? realtimeBalance : userData?.balance;
	const displayUniqueCoins =
		realtimeUniqueCoins !== null ? realtimeUniqueCoins : userData?.uniqueCoins;
	const displayChallenges = realtimeChallenges || userData?.allChallenges;

	return (
		<div className="relative h-screen overflow-hidden flex flex-col justify-between">
			<div className="absolute top-4 left-2 notmobile:top-6 notmobile:left-4 scale-90 notmobile:scale-100">
				<SpMyBalance displayBalance={displayBalance} />
			</div>

			<div className="absolute top-14 left-2 notmobile:top-20 notmobile:left-6 scale-75 notmobile:scale-100">
				<SpOpenChest displayBalance={displayBalance} />
			</div>

			<div className="absolute top-2 right-2 space-y-2 notmobile:top-6 notmobile:right-4 notmobile:space-y-3 scale-90 notmobile:scale-100">
				<SpTopRightButtons />
			</div>

			<div className="mt-auto mb-8 flex flex-col justify-center items-center">
				<SpCoinsCollected
					activeCoin={userData?.activeCoin}
					uniqueCoins={displayUniqueCoins}
				/>
			</div>

			<div className="mb-6 notmobile:mb-8 w-3/4 notmobile:w-80 mx-auto space-y-2">
				<SpChallenges allChallenges={displayChallenges} />
			</div>

			<div className="pb-4 flex flex-col items-center justify-center gap-3">
				<SpPlayButton />
			</div>
		</div>
	);
}
