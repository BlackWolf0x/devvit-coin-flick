import { useNavigationStore } from '@/stores/navigationStore';
import { useUserDataStore } from '@/stores/userDataStore';
import useEmblaCarousel from 'embla-carousel-react';
import { coins } from '../../shared/coins/coins';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';

const fetchUserCoinData = async () => {
	const response = await fetch('/api/get-user-coin-data');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

export default function MyCollection() {
	const goBack = useNavigationStore((state) => state.goBack);
	const uniqueCoins = useUserDataStore((state) => state.uniqueCoins);

	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

	const { data: userCoinData } = useQuery({
		queryKey: ['userCoinData'],
		queryFn: fetchUserCoinData,
	});

	const collection = userCoinData?.collection || {};
	const activeCoin = userCoinData?.activeCoin || null;

	// Split coins into chunks of 12 (3 rows x 4 columns)
	const coinsPerPage = 12;
	const pages = [];
	for (let i = 0; i < coins.length; i += coinsPerPage) {
		pages.push(coins.slice(i, i + coinsPerPage));
	}

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

				<h1 className="text-lg font-semibold">My Collection</h1>

				<p className="ml-auto text-sm font-semibold">
					{uniqueCoins ?? 0}/{coins.length} Coins{' '}
					<span className="hidden notmobile:inline">Collected</span>
				</p>
			</header>

			<div className="flex-1 mt-3 rounded-lg p-4 bg-white shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] flex flex-col">
				<div className="flex-1 overflow-hidden" ref={emblaRef}>
					<div className="flex h-full touch-pan-y touch-pinch-zoom">
						{pages.map((pageCoins, pageIndex) => (
							<div
								key={pageIndex}
								className="flex-none basis-full min-w-0 grid grid-cols-4 gap-2 content-start"
							>
								{pageCoins.map((coin) => {
									const count = collection[coin]
										? parseInt(collection[coin], 10)
										: 0;
									const isOwned = count > 0;
									const isActive = activeCoin === coin;

									return (
										<div
											key={coin}
											className="relative flex flex-col items-center"
										>
											<div className="relative">
												<img
													src={`/coins/${coin}.png`}
													width={64}
													height={64}
													className={`size-14 object-contain ${
														!isOwned ? 'opacity-10' : ''
													}`}
												/>
												{isActive && (
													<div className="absolute -top-1 -right-1 bg-green-500 rounded-full border-2 border-white p-0.5">
														<Check size={16} className="text-white" />
													</div>
												)}
											</div>
											{isOwned && (
												<span className="text-xs font-semibold text-gray-700">
													x{count}
												</span>
											)}
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>

				{pages.length > 1 && (
					<div className="flex justify-center gap-4 mt-4">
						<button
							onClick={() => emblaApi?.scrollPrev()}
							className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
						>
							← Prev
						</button>
						<button
							onClick={() => emblaApi?.scrollNext()}
							className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
						>
							Next →
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
