import { useNavigationStore } from '@/stores/navigationStore';
import { useUserDataStore } from '@/stores/userDataStore';
import useEmblaCarousel from 'embla-carousel-react';
import { coins } from '../../shared/coins/coins';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { formatCoinName } from '@/lib/formatCoinName';
import { useState, useEffect } from 'react';

const fetchUserCoinData = async () => {
	const response = await fetch('/api/get-user-coin-data');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

const COINS_PER_PAGE_SMALL = 9; // 3x3 grid for screens < 500px
const COINS_PER_PAGE_LARGE = 12; // 4x3 grid for screens >= 500px
const BREAKPOINT_WIDTH = 500; // Width threshold in pixels

const setActiveCoin = async (coin: string) => {
	const response = await fetch('/api/set-active-coin', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ coin }),
	});
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to set active coin');
	}
	return response.json();
};

export default function MyCollection() {
	const goBack = useNavigationStore((state) => state.goBack);
	const uniqueCoins = useUserDataStore((state) => state.uniqueCoins);
	const queryClient = useQueryClient();

	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
	const [coinsPerPage, setCoinsPerPage] = useState(COINS_PER_PAGE_SMALL);
	const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		if (!emblaApi) return;

		const onSelect = () => {
			setCanScrollPrev(emblaApi.canScrollPrev());
			setCanScrollNext(emblaApi.canScrollNext());
			setCurrentPage(emblaApi.selectedScrollSnap() + 1);
		};

		onSelect();
		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);

		return () => {
			emblaApi.off('select', onSelect);
			emblaApi.off('reInit', onSelect);
		};
	}, [emblaApi]);

	useEffect(() => {
		const handleResize = () => {
			setCoinsPerPage(
				window.innerWidth >= BREAKPOINT_WIDTH ? COINS_PER_PAGE_LARGE : COINS_PER_PAGE_SMALL
			);
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const { data: userCoinData } = useQuery({
		queryKey: ['userCoinData'],
		queryFn: fetchUserCoinData,
	});

	const collection = userCoinData?.collection || {};
	const activeCoin = userCoinData?.activeCoin || null;

	const setActiveCoinMutation = useMutation({
		mutationFn: setActiveCoin,
		onMutate: async (newCoin) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['userCoinData'] });

			// Snapshot the previous value
			const previousData = queryClient.getQueryData(['userCoinData']);

			// Optimistically update to the new value
			queryClient.setQueryData(['userCoinData'], (old: any) => ({
				...old,
				activeCoin: newCoin,
			}));

			// Return context with the previous value
			return { previousData };
		},
		onError: (_err, _newCoin, context) => {
			// Rollback to the previous value on error
			if (context?.previousData) {
				queryClient.setQueryData(['userCoinData'], context.previousData);
			}
		},
		onSuccess: () => {
			// Clear selection after successful update
			setSelectedCoin(null);
		},
		onSettled: () => {
			// Refetch to ensure we're in sync with the server
			queryClient.invalidateQueries({ queryKey: ['userCoinData'] });
		},
	});

	const handleCoinClick = (coin: string, isOwned: boolean) => {
		if (!isOwned) return;
		// If clicking the same selected coin (and it's not the active one), unselect it
		if (selectedCoin === coin && coin !== activeCoin) {
			setSelectedCoin(null);
		} else {
			setSelectedCoin(coin);
		}
	};

	const handleSetActive = () => {
		if (selectedCoin) {
			setActiveCoinMutation.mutate(selectedCoin);
		}
	};

	const handleUnselect = () => {
		setSelectedCoin(null);
	};

	// Split coins into chunks based on screen size (9 for small, 12 for >= 500px)
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

			<div className="flex-1 mt-3 rounded-lg p-4 bg-white/85 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] flex flex-col">
				<div className="h-full pb-4 overflow-hidden" ref={emblaRef}>
					<div className="flex h-full touch-pan-y touch-pinch-zoom">
						{pages.map((pageCoins, pageIndex) => (
							<div
								key={pageIndex}
								className="flex-none basis-full min-w-0 grid gap-2 items-center"
								style={{
									gridTemplateColumns: `repeat(${
										coinsPerPage === COINS_PER_PAGE_LARGE ? 4 : 3
									}, minmax(0, 1fr))`,
									gridTemplateRows: `repeat(3, minmax(0, 1fr))`,
								}}
							>
								{pageCoins.map((coin) => {
									const count = collection[coin]
										? parseInt(collection[coin], 10)
										: 0;
									const isOwned = count > 0;
									const isActive = activeCoin === coin;
									const isSelected = selectedCoin === coin;

									return (
										<Popover key={coin}>
											<PopoverTrigger asChild>
												<div
													className={`relative flex flex-col items-center justify-center ${
														isOwned
															? 'cursor-pointer'
															: 'cursor-default'
													}`}
													onClick={() => handleCoinClick(coin, isOwned)}
												>
													<div className="relative">
														<img
															src={`/coins/${coin}.png`}
															width={64}
															height={64}
															className={`size-16 object-contain rounded-full border-2
																${!isOwned ? 'opacity-10' : ''}
																${isSelected || isActive ? 'border-green-500' : 'border-transparent'}
															`}
														/>
														{isActive && (
															<div className="absolute -top-1 -right-1 bg-green-500 rounded-full border-2 border-white p-0.5">
																<Check
																	size={16}
																	className="text-white"
																/>
															</div>
														)}
													</div>
													<span
														className={`text-sm font-semibold mt-1 ${
															isOwned
																? 'text-gray-700'
																: 'text-gray-400'
														}`}
													>
														x{count}
													</span>
												</div>
											</PopoverTrigger>
											<PopoverContent className="w-auto" side="top">
												<PopoverTitle className="capitalize">
													{formatCoinName(coin)}
												</PopoverTitle>
											</PopoverContent>
										</Popover>
									);
								})}
							</div>
						))}
					</div>
				</div>

				{selectedCoin ? (
					<div className="flex justify-center gap-2">
						<Button
							onClick={handleUnselect}
							variant="secondary"
							size="sm"
							disabled={setActiveCoinMutation.isPending}
						>
							<X />
							Unselect
						</Button>

						<Button
							onClick={handleSetActive}
							disabled={
								setActiveCoinMutation.isPending || selectedCoin === activeCoin
							}
							variant="default"
							size="sm"
						>
							<Check />
							{setActiveCoinMutation.isPending ? 'Setting...' : 'Set as Active'}
						</Button>
					</div>
				) : (
					pages.length > 1 && (
						<div className="flex justify-between items-center gap-2">
							<span className="text-sm text-gray-600">
								Page {currentPage} of {pages.length}
							</span>
							<div className="flex gap-2">
								<Button
									onClick={() => emblaApi?.scrollPrev()}
									variant="secondary"
									size="sm"
									disabled={!canScrollPrev}
								>
									<ChevronLeft />
									Prev
								</Button>

								<Button
									onClick={() => emblaApi?.scrollNext()}
									variant="secondary"
									size="sm"
									disabled={!canScrollNext}
								>
									Next
									<ChevronRight />
								</Button>
							</div>
						</div>
					)
				)}
			</div>
		</div>
	);
}
