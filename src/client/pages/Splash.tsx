import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

// API functions
const fetchUserData = async () => {
	const response = await fetch('/api/user-data');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data.rewarded || '0';
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

	// Fetch user balance
	const { data: balance = '0' } = useQuery({
		queryKey: ['userBalance'],
		queryFn: fetchUserData,
	});

	// Reward mutation
	const rewardMutation = useMutation({
		mutationFn: rewardUser,
		onSuccess: () => {
			// Refetch user data to get updated balance
			queryClient.invalidateQueries({ queryKey: ['userBalance'] });
		},
	});

	const handleReward = () => {
		rewardMutation.mutate();
	};

	return (
		<div className="relative h-screen bg-background pt-6 flex flex-col justify-center items-center gap-6">
			<div className="text-center space-y-4">
				<h1 className="text-2xl font-bold">Your Balance</h1>
				<div className="text-4xl font-bold text-primary">{balance} coins</div>
			</div>

			<Button onClick={handleReward} disabled={rewardMutation.isPending}>
				<Trophy /> {rewardMutation.isPending ? 'Rewarding...' : 'Get Reward'}
			</Button>
		</div>
	);
}
