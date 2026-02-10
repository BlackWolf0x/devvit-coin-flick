import { MoveRight } from 'lucide-react';

export function MyCoins() {
	return (
		<>
			<img src="/coins/club.png" width={192} height={192} className="w-28" />

			<p>5/100 Coins Collected</p>

			<button className="flex justify-between items-center rounded-full px-3 py-1 uppercase text-xs font-medium bg-[#F9DA67] border border-[#C2A744] text-[#634B47]">
				My Collection
				<MoveRight size={20} className="ml-2" />
			</button>
		</>
	);
}
