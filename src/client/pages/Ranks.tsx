import { useQuery } from '@tanstack/react-query';
import { useNavigationStore } from '@/stores/navigationStore';

// API function
const fetchRanks = async () => {
	const response = await fetch('/api/leaderboard');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};

const formatTime = (milliseconds: number) => {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const ms = Math.floor((milliseconds % 1000) / 10); // Get centiseconds (2 digits)
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return {
		minutes,
		seconds,
		ms,
	};
};

export default function Ranks() {
	const goBack = useNavigationStore((state) => state.goBack);
	const { data, isLoading, error } = useQuery({
		queryKey: ['leaderboard'],
		queryFn: fetchRanks,
	});

	return (
		<div className="relative h-screen p-2 notmobile:p-4 flex flex-col">
			<header className="flex items-center gap-2">
				<button
					onClick={goBack}
					onContextMenu={(e) => e.preventDefault()}
					onTouchStart={(e) => e.preventDefault()}
					className="cursor-pointer transition-transform scale-100 active:scale-95 select-none disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<img
						src="/misc/btn-back.png"
						width={152}
						height={154}
						className="w-10 pointer-events-none"
						draggable={false}
					/>
				</button>

				<h1 className="text-lg font-semibold">Leaderboard</h1>
				<p className="ml-auto text-sm font-semibold">Top 5 Players</p>
			</header>

			<div className="flex-1 mt-3 rounded-lg p-4 bg-white/85 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">
				{isLoading ? (
					<div className="flex-1 flex items-center justify-center">
						<div className="text-center text-gray-600">Loading...</div>
					</div>
				) : error ? (
					<div className="flex-1 flex items-center justify-center">
						<div className="text-center text-red-600">Error loading leaderboard</div>
					</div>
				) : !data || data.length === 0 ? (
					<div className="flex-1 flex items-center justify-center">
						<div className="text-center text-gray-600">No times yet. Be the first!</div>
					</div>
				) : (
					<div className="flex-1 overflow-y-auto space-y-2">
						{data.map((entry: any) => (
							<div
								key={entry.userId}
								className="flex items-center gap-2 p-3 rounded-lg border-2 border-gray-200 shadow-sm"
							>
								{/* Rank Badge */}
								<div
									className={`shrink-0 size-8 rounded-full flex items-center justify-center text-sm font-medium bg-secondary text-black`}
								>
									#{entry.rank}
								</div>

								{/* Avatar */}
								<div className="shrink-0 w-10 h-10">
									{entry.snoovatar === 'none' ? (
										<img
											src="/misc/snoo.png"
											className="w-full h-full object-contain grayscale opacity-40"
											alt="Avatar"
										/>
									) : (
										<img
											src={entry.snoovatar}
											className="w-full h-full object-contain"
											alt="Avatar"
										/>
									)}
								</div>

								{/* Username */}
								<div className="flex-1 min-w-0">
									<h4 className="font-semibold text-gray-900 truncate">
										{entry.username || 'Anonymous'}
									</h4>
								</div>

								{/* Time */}
								<div className="shrink-0 text-right">
									<p className="text-lg font-bold text-green-600">
										{formatTime(entry.score).minutes > 0 && (
											<>
												{formatTime(entry.score).minutes}
												<span className="text-sm text-black opacity-50">
													m{' '}
												</span>
												<span className="text-sm text-black opacity-50">
													:{' '}
												</span>
											</>
										)}
										{formatTime(entry.score).seconds}
										<span className="text-sm text-black opacity-50">s </span>
										<span className="text-sm text-black opacity-50">: </span>
										<span className="text-sm">
											{formatTime(entry.score).ms}
											<span className="text-black opacity-50"> ms</span>
										</span>
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
