import { useNavigationStore } from '@/stores/navigationStore';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { formatCoinName } from '@/lib/formatCoinName';
import { SpMyBalance } from '@/components/SpMyBalance';
import { CHEST_COST } from '../../shared/config';

const openChest = async () => {
	const response = await fetch('/api/open-chest', {
		method: 'POST',
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	console.log(data);
	return data;
};

export default function ChestOpen() {
	const goBack = useNavigationStore((state) => state.goBack);

	const [shake, setShake] = useState(false);
	const [showChestOpened, setShowChestOpened] = useState(false);
	const [coinName, setCoinName] = useState<string | null>(null);
	const [showCostLabel, setShowCostLabel] = useState(true);

	// Player count update mutation
	const openChestMutation = useMutation({
		mutationFn: openChest,
	});

	function handleOpenChest() {
		// Hide cost label on first click
		setShowCostLabel(false);

		// Reset states if chest was already opened
		if (showChestOpened) {
			setShowChestOpened(false);
			setCoinName(null);
		}

		setShake(true);

		openChestMutation
			.mutateAsync()
			.then((data) => {
				setCoinName(data.coinId);
				setTimeout(() => {
					setShake(false);
					setShowChestOpened(true);
				}, 2000);
			})
			.catch((error) => {
				console.error('Error:', error);
				setShake(false);
			});
	}

	return (
		<div className="relative h-screen pt-6 flex flex-col justify-center items-center gap-4 px-4 pb-4">
			<SpMyBalance />

			<div className="relative mt-34 mb-6 w-[190px] h-[190px]">
				{showCostLabel && (
					<div className="absolute -top-4 left-1/2 -translate-x-1/2 w-43 bg-white rounded-xl text-center border border-black animate-bounce">
						Cost {CHEST_COST} Gold / Chest
					</div>
				)}

				{showChestOpened && coinName && (
					<div className="absolute -top-34 left-1/2 -translate-x-1/2 w-50 font-bold text-center capitalize">
						{formatCoinName(coinName)} Coin
					</div>
				)}

				{coinName && (
					<img
						src={`/coins/${coinName}.png`}
						width={192}
						height={192}
						className={`absolute z-20 left-1/2 -translate-x-1/2 transition-all delay-75 ${
							showChestOpened
								? '-top-24 opacity-100 w-20 animate-[flip-horizontal_2s_ease-in-out_infinite]'
								: 'top-0 opacity-0 w-10'
						}`}
					/>
				)}

				{/* Closed */}
				<div
					className={`chest-closed absolute z-10 top-0 left-0
						${shake ? 'animate-[shake_0.8s_ease-in-out_infinite]' : ''}
						${showChestOpened ? 'hidden' : ''}
					`}
				>
					<img src="/chest/chest-closed.png" width={190} height={190} />
				</div>

				{/* Open */}
				<div className={`chest-open relative ${showChestOpened ? '' : 'hidden'}`}>
					<img src="/chest/chest-open-lid.png" width={190} height={190} className="" />

					<img
						src="/chest/chest-open.png"
						width={190}
						height={190}
						className="absolute top-0 left-0 z-10"
					/>
				</div>

				{/* Light */}
				<img
					src="/chest/chest-light.png"
					width={190}
					height={190}
					className={`absolute z-20 -top-[30px] left-0 scale-125 animate-spin duration-10000 ${
						showChestOpened ? '' : 'hidden'
					}`}
				/>
			</div>

			<div className="flex items-center gap-2">
				<button
					onClick={goBack}
					disabled={shake}
					onContextMenu={(e) => e.preventDefault()}
					onTouchStart={(e) => e.preventDefault()}
					className="cursor-pointer transition-transform scale-100 active:scale-95 select-none disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<img
						src="/misc/btn-back.png"
						width={76}
						height={77}
						className="w-14 pointer-events-none"
						draggable={false}
					/>
				</button>
				<button
					onClick={handleOpenChest}
					disabled={shake}
					onContextMenu={(e) => e.preventDefault()}
					onTouchStart={(e) => e.preventDefault()}
					className="cursor-pointer transition-transform scale-100 active:scale-95 select-none disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<img
						src="/chest/btn-open-chest.png"
						width={212}
						height={77}
						className="w-38 pointer-events-none"
						draggable={false}
					/>
				</button>
			</div>
		</div>
	);
}
