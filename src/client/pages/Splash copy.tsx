import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { connectRealtime, requestExpandedMode } from '@devvit/web/client';
import { context } from '@devvit/web/client';
import { Button } from '@/components/ui/button';
import { Calendar, MoveRight, Trophy } from 'lucide-react';

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

	const handleStartGame = (e: React.MouseEvent<HTMLButtonElement>) => {
		requestExpandedMode(e.nativeEvent, 'game');
	};
	return (
		<div className="relative h-screen overflow-hidden flex flex-col justify-between">
			<div>
				{/* <div className="text-center space-y-4">
				<h1 className="text-3xl font-medium ">
					Did you collect your <span className="text-primary">gold</span> today?
				</h1>
				<div className="text-4xl font-bold text-primary">{displayBalance} coins</div>
			</div> */}

				{/* <Button onClick={handleReward} disabled={rewardMutation.isPending}>
					<Trophy /> {rewardMutation.isPending ? 'Rewarding...' : 'Get Reward'}
					</Button> */}
				<img src="misc/coin.png" width={96} height={96} className="size-24" />

				<div className="mt-20 px-6 grid grid-cols-3 gap-4 text-[#3fe7a7]">
					<div className="relative rounded-md flex flex-col justify-center items-center p-2 border-2 border-[#7ce0ff] bg-linear-to-t from-[#1c284f] to-[#213469] shadow-[0px_7px_0px_-4px_#7ce0ff]">
						<div className="absolute inset-0 w-full h-full flex justify-center items-center opacity-10">
							<img
								src="/misc/pentagon.svg"
								width={72}
								height={72}
								className="size-16"
							/>
						</div>

						<span className="text-xs font-medium">Daily</span>
						<Calendar size={32} />
						<span className="font-bold text-sm text-amber-400">+10 Gold</span>
					</div>
				</div>
			</div>

			<div className="p-1">
				<div className="w-full h-24 relative overflow-hidden rounded-md bg-black">
					<img
						src="/misc/fx.png"
						width={540}
						height={960}
						className="w-full h-full absolute z-10 top-0 left-0 inset-0 mix-blend-overlay"
					/>

					<video
						autoPlay
						loop
						muted
						playsInline
						poster="/misc/splash-bg.png"
						className="absolute top-0 left-0 w-full h-full object-cover scale-125"
					>
						<source src="/misc/splash-bg-hor.mp4" type="video/mp4" />
					</video>

					<div className="relative z-20 w-full h-full flex justify-center items-center">
						<Button onClick={handleStartGame} className="mt-1">
							Play Game <MoveRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
