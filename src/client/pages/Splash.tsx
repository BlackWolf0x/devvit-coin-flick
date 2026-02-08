import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { connectRealtime } from '@devvit/web/client';
import { context } from '@devvit/web/client';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

// API functions
const fetchUserData = async () => {
	const response = await fetch('/api/user-data');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data.balance || '0';
};

const rewardUser = async () => {
	const response = await fetch('/api/reward', {
		method: 'POST',
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

export default function Splash() {
	const queryClient = useQueryClient();
	const [realtimeBalance, setRealtimeBalance] = useState<number | null>(null);

	// Fetch user balance
	const { data: balance = '0' } = useQuery({
		queryKey: ['userBalance'],
		queryFn: fetchUserData,
	});

	// Reward mutation
	const rewardMutation = useMutation({
		mutationFn: rewardUser,
	});

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

						// Update React Query cache
						queryClient.setQueryData(['userBalance'], data.balance.toString());
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

	const handleReward = () => {
		rewardMutation.mutate();
	};

	// Use realtime balance if available, otherwise use fetched balance
	const displayBalance = realtimeBalance !== null ? realtimeBalance : parseInt(balance);

	return (
		<div className="relative h-screen bg-background pt-6 flex flex-col justify-center items-center gap-6">
			<div className="text-center space-y-4">
				<h1 className="text-2xl font-bold">Your Balance</h1>
				<div className="text-4xl font-bold text-primary">{displayBalance} coins</div>
			</div>

			<Button onClick={handleReward} disabled={rewardMutation.isPending}>
				<Trophy /> {rewardMutation.isPending ? 'Rewarding...' : 'Get Reward'}
			</Button>
		</div>
	);
}
