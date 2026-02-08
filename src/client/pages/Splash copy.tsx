import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { context, requestExpandedMode } from '@devvit/web/client';
import { Button } from '@/components/ui/button';
import ChessboardPreview from '@/components/ChessboardPreview';
import DevBox from '@/components/DevBox';
import { ArrowUp, BookOpenText, ChessQueen, Crown, MoveRight, Trophy, Users } from 'lucide-react';

interface SplashProps {
	onShowLeaderboard: () => void;
	onShowRules: () => void;
}

// API functions
const fetchPlayerCount = async () => {
	const response = await fetch('/api/player-count');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data.playerCount;
};

const fetchTopPlayer = async () => {
	const response = await fetch('/api/top-player');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data.topPlayer;
};

const trackPlayer = async () => {
	const response = await fetch('/api/track-player', {
		method: 'POST',
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data.playerCount;
};

export default function Splash({ onShowLeaderboard, onShowRules }: SplashProps) {
	const queryClient = useQueryClient();

	// Fetch player count
	const { data: playerCount = 0 } = useQuery({
		queryKey: ['playerCount'],
		queryFn: fetchPlayerCount,
	});

	// Fetch top player
	const { data: topPlayer } = useQuery({
		queryKey: ['topPlayer'],
		queryFn: fetchTopPlayer,
	});

	// Track player mutation
	const trackPlayerMutation = useMutation({
		mutationFn: trackPlayer,
		onSuccess: (newCount) => {
			// Update the player count in cache
			queryClient.setQueryData(['playerCount'], newCount);
		},
	});

	const handleStartGame = (e: React.MouseEvent<HTMLButtonElement>) => {
		// Track the player
		trackPlayerMutation.mutate();

		// Expand to game mode
		requestExpandedMode(e.nativeEvent, 'game');
	};

	return (
		<div className="relative h-screen bg-background pt-6 flex flex-col justify-between items-center gap-3">
			{/* Header */}
			<header className="px-4 space-y-1 text-center">
				<h1 className="text-xl font-bold font-title leading-6">
					Can you beat this in fewer moves?
				</h1>
				{topPlayer && topPlayer.totalMoves ? (
					<div className="text-xs font-medium text-primary">
						Best: {topPlayer.totalMoves} {topPlayer.totalMoves === 1 ? 'move' : 'moves'}{' '}
						by u/{topPlayer.username}
					</div>
				) : (
					<div className="text-xs font-medium text-muted-foreground">
						Be the first to complete this puzzle!
					</div>
				)}
			</header>

			{/* Content */}
			<div className="flex flex-col items-center gap-2 px-4">
				

				<Button onClick={handleStartGame} className="mt-1">
					Play <MoveRight />
				</Button>
			</div>

			{/* Footer */}
			<footer className="w-full p-2 pl-4 border-t flex justify-between items-center">
				<p className="flex items-center gap-1 text-xs font-bold text-primary">
					<Users size={14} className="-mt-0.5" /> {playerCount.toLocaleString()}{' '}
					{playerCount === 1 ? 'Player' : 'Players'}
				</p>

				<div className="flex items-center gap-2">
					<Button
						onClick={onShowRules}
						variant="outline"
						size={'sm'}
						className="text-[0.8rem]"
					>
						<BookOpenText /> Rules
					</Button>

					<Button
						onClick={onShowLeaderboard}
						variant="outline"
						size={'sm'}
						className="text-[0.8rem]"
					>
						<Trophy /> Leaderboard
					</Button>
				</div>
			</footer>

			{/* Dev Tools */}
			<DevBox />
		</div>
	);
}
