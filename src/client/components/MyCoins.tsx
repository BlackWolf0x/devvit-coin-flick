import { MoveRight } from 'lucide-react';
import { useNavigationStore } from '@/stores/navigationStore';

export function MyCoins() {
	const navigate = useNavigationStore((state) => state.navigate);

	return (
		<>
			<img src="/coins/club.png" width={192} height={192} className="w-20 mb-4" />

			<p className="mb-2 text-sm font-semibold">5/100 Coins Collected</p>

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
