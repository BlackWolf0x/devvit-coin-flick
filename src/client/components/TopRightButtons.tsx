import { ChartColumnDecreasing } from 'lucide-react';

export function TopRightButtons() {
	return (
		<>
			<button className="relative w-14 flex justify-center">
				<div className="size-10 rounded-full bg-[#634B47] border border-black text-white">
					<ChartColumnDecreasing size={28} />
				</div>

				<div className="relative z-10 -top-2 px-2 py-1 rounded-full bg-white border border-black text-xs text-black uppercase">
					Ranks
				</div>
			</button>
		</>
	);
}
