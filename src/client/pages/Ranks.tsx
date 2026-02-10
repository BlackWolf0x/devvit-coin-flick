import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useNavigationStore } from '@/stores/navigationStore';

// API function
const fetchRanks = async () => {
	const response = await fetch('/api/leaderboard');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};

export default function Ranks() {
	const goBack = useNavigationStore((state) => state.goBack);
	const { data, isLoading, error } = useQuery({
		queryKey: ['leaderboard'],
		queryFn: fetchRanks,
	});

	return (
		<div className="relative h-screen pt-4 gap-4 px-4">
			{/* Header */}
			<header className="mb-6 flex items-center justify-center gap-4">
				<Button onClick={goBack} variant="outline" size={'icon'}>
					<ArrowLeft />
				</Button>
				<div className="sm:space-y-1">
					<h1 className="h-6 text-xl font-bold font-title">Ranks</h1>
					<p className="text-xs text-muted-foreground">Top 5 players by fewest moves</p>
				</div>
			</header>

			{/* Content */}
			<div
				className={`w-full h-[calc(100%-84px)] space-y-3 flex flex-col items-center ${
					!data && 'justify-center'
				}`}
			>
				{isLoading ? (
					<LoaderCircle size={24} className="animate-spin" />
				) : error ? (
					<div className="text-center text-destructive">Error loading ranks</div>
				) : !data || data.length === 0 ? (
					<div className="text-center text-muted-foreground">
						No plays yet. Be the first!
					</div>
				) : (
					<>
						{data.map((entry: any) => (
							<div
								key={entry.userId}
								className="w-full flex items-center justify-between px-4 py-2 bg-secondary rounded-lg border"
							>
								<div className="flex items-center gap-3">
									<span className="text-lg font-bold">#{entry.rank}</span>

									<figure className="w-8">
										{entry.snoovatar === 'none' ? (
											<img
												src="/misc/snoo.png"
												className="grayscale opacity-40"
											/>
										) : (
											<img src={entry.snoovatar} />
										)}
									</figure>

									<div>
										<h4 className="font-semibold">
											{entry.username || 'Anonymous'}
										</h4>
										<div className="text-sm sm:hidden">
											In{' '}
											<span className="text-primary font-medium">
												{entry.totalMoves}{' '}
												{entry.totalMoves === 1 ? ' move' : ' moves'}
											</span>{' '}
											&{' '}
											<span className="text-primary font-medium">
												{entry.cellsTravelled}{' '}
												{entry.cellsTravelled === 1 ? ' cell' : ' cells'}{' '}
											</span>
										</div>
									</div>
								</div>

								<div className="text-right hidden sm:block">
									<p className="text-sm font-bold text-primary">
										{entry.totalMoves} moves
									</p>
									<p className="text-xs font-medium text-muted-foreground">
										{entry.cellsTravelled} cells
									</p>
								</div>
							</div>
						))}
					</>
				)}
			</div>
		</div>
	);
}
