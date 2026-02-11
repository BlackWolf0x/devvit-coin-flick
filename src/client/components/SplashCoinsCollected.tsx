import { MoveRight } from 'lucide-react';
import { useNavigationStore } from '@/stores/navigationStore';
import { coins } from '../../shared/coins/coins';

interface SplashCoinsCollectedProps {
	activeCoin: string | undefined;
	uniqueCoins: number | undefined;
}

export function SplashCoinsCollected({ activeCoin, uniqueCoins }: SplashCoinsCollectedProps) {
	const navigate = useNavigationStore((state) => state.navigate);

	return (
		<>
			{activeCoin ? (
				<img
					src={`/coins/${activeCoin}.png`}
					width={192}
					height={192}
					className="w-20 mb-4"
					alt={`${activeCoin} coin`}
				/>
			) : (
				<div className="size-20 mb-4 rounded-full bg-amber-800 opacity-10 animate-pulse"></div>
			)}

			<p className="mb-2 text-sm font-semibold">
				{uniqueCoins ? uniqueCoins : 0}/{coins.length} Coins Collected
			</p>

			<button
				onClick={() => navigate('pageMyCollection')}
				className="cursor-pointer flex justify-between items-center rounded-full px-3 py-1 uppercase text-xs font-medium bg-[#F9DA67] border border-[#C2A744] text-[#634B47]"
			>
				My Collection
				<MoveRight size={20} className="ml-2" />
			</button>
		</>
	);
}
