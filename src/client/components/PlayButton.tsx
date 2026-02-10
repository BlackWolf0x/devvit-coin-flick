import { connectRealtime, context, requestExpandedMode } from '@devvit/web/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const fetchPlayerCount = async () => {
	const response = await fetch('/api/player-count');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data.playerCount;
};

const updatePlayerCount = async () => {
	const response = await fetch('/api/player-count-update', {
		method: 'POST',
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

export function PlayButton() {
	const [realtimePlayerCount, setRealtimePlayerCount] = useState<number | null>(null);

	// Initial player counter
	const { data: playerCount = 0 } = useQuery({
		queryKey: ['playerCount'],
		queryFn: fetchPlayerCount,
	});

	// Player count update mutation
	const updateMutation = useMutation({
		mutationFn: updatePlayerCount,
	});

	// Connect to realtime channel for player count updates
	useEffect(() => {
		const { postId } = context;
		if (!postId) return;

		let connection: any;

		const setupRealtime = async () => {
			connection = await connectRealtime({
				channel: `players_${postId}`,
				onMessage: (data: any) => {
					if (data.count !== undefined) {
						setRealtimePlayerCount(data.count);
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

	// Start game and track player
	const handleStartGame = (e: React.MouseEvent<HTMLButtonElement>) => {
		requestExpandedMode(e.nativeEvent, 'game');
		updateMutation.mutate();
	};

	// Use realtime count if available, otherwise use fetched count
	const displayCount = realtimePlayerCount !== null ? realtimePlayerCount : playerCount;

	return (
		<>
			<button
				onClick={handleStartGame}
				className="cursor-pointer transition-transform scale-100 hover:scale-110"
			>
				<img src="/misc/btn-play.png" width={212} height={77} className="w-32" />
			</button>

			<p className="flex items-center gap-1 text-sm font-medium text-[#634B47]">
				<Users size={14} className="-mt-0.5" /> {displayCount.toLocaleString()}{' '}
				{displayCount === 1 ? 'Player' : 'Players'}
			</p>
		</>
	);
}
