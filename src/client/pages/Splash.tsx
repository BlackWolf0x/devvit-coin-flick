import { DailyChallenges } from '@/components/DailyChallenges';
import { MyBalance } from '@/components/MyBalance';
import { MyCoins } from '@/components/MyCoins';
import { OpenChestSplash } from '@/components/OpenChestSplash';
import { PlayButton } from '@/components/PlayButton';
import { TopRightButtons } from '@/components/TopRightButtons';
import { connectRealtime, context } from '@devvit/web/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface SplashProps {
	onShowLeaderboard: () => void;
	onShowHowTo: () => void;
	onShowChest: () => void;
	onShowMyCollection: () => void;
}

// API functions
const fetchUserData = async () => {
	const response = await fetch('/api/user-data');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

export default function Splash({
	onShowLeaderboard,
	onShowHowTo,
	onShowChest,
	onShowMyCollection,
}: SplashProps) {
	const queryClient = useQueryClient();

	const [realtimeBalance, setRealtimeBalance] = useState<number | null>(null);

	// Fetch user data
	const { data: userData } = useQuery({
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
					if (data.type === 'balance-update') {
						setRealtimeBalance(data.balance);
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
	}, [queryClient]);

	// Use realtime balance if available, otherwise use fetched balance
	const displayBalance = realtimeBalance !== null ? realtimeBalance : parseInt(userData?.balance);

	return (
		<div className="relative h-screen overflow-hidden flex flex-col justify-between">
			<div className="absolute top-4 left-2 scale-90">
				<MyBalance displayBalance={displayBalance} />
			</div>

			<div className="absolute top-14 left-2 scale-75">
				<OpenChestSplash displayBalance={displayBalance} onOpenChest={onShowChest} />
			</div>

			<div className="absolute top-2 right-2 space-y-2 scale-90">
				<TopRightButtons onShowLeaderboard={onShowLeaderboard} onShowHowTo={onShowHowTo} />
			</div>

			<div className="mt-auto mb-8 flex flex-col justify-center items-center">
				<MyCoins onShowMyCollection={onShowMyCollection} />
			</div>

			<div className="mb-6 w-3/4 mx-auto space-y-2">
				<DailyChallenges />
			</div>

			<div className="pb-4 flex flex-col items-center justify-center gap-3">
				<PlayButton />
			</div>
		</div>
	);
}
