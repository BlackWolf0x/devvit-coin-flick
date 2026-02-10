import { requestExpandedMode } from '@devvit/web/client';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { useState } from 'react';

const fetchPlayerCount = async () => {
	const response = await fetch('/api/player-count');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data.playerCount;
};

const trackPlayer = async () => {
	const response = await fetch('/api/player-count-update', {
		method: 'POST',
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data.playerCount;
};

export function PlayButton() {
	const [realtimePlayerCount, setRealtimePlayerCount] = useState<number | null>(null);

	// Start game
	const handleStartGame = (e: React.MouseEvent<HTMLButtonElement>) => {
		requestExpandedMode(e.nativeEvent, 'game');
	};

	// Initial player counter
	const { data: playerCount = 0 } = useQuery({
		queryKey: ['playerCount'],
		queryFn: fetchPlayerCount,
	});

	return (
		<div>
			<button
				onClick={handleStartGame}
				className="cursor-pointer transition-transform scale-100 hover:scale-110"
			>
				<img src="/misc/btn-play.png" width={212} height={77} className="w-32" />
			</button>

			<p className="flex items-center gap-1 text-xs font-bold text-primary">
				<Users size={14} className="-mt-0.5" /> {playerCount.toLocaleString()}{' '}
				{playerCount === 1 ? 'Player' : 'Players'}
			</p>
		</div>
	);
}
