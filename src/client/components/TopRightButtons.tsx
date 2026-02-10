import { ChartColumnDecreasing, GraduationCap } from 'lucide-react';

interface TopRightButtonsProps {
	onShowLeaderboard: () => void;
	onShowHowTo: () => void;
}

export function TopRightButtons({ onShowLeaderboard, onShowHowTo }: TopRightButtonsProps) {
	return (
		<>
			<button
				onClick={onShowLeaderboard}
				className="cursor-pointer relative w-16 flex flex-col items-center justify-center"
			>
				<div className="size-10 rounded-full flex justify-center items-center bg-[#634B47] border border-black text-white">
					<ChartColumnDecreasing size={20} className="mb-1" />
				</div>

				<div className="relative z-10 -top-2 px-2 h-4 flex items-center rounded-full bg-white border border-black text-[0.63rem] font-semibold text-black uppercase">
					Ranks
				</div>
			</button>

			<button
				onClick={onShowHowTo}
				className="cursor-pointer relative w-16 flex flex-col items-center justify-center"
			>
				<div className="size-10 rounded-full flex justify-center items-center bg-[#634B47] border border-black text-white">
					<GraduationCap size={20} className="mb-1" />
				</div>

				<div className="relative z-10 -top-2 px-2 h-4 flex items-center rounded-full bg-white border border-black text-[0.63rem] font-semibold text-black uppercase">
					How to
				</div>
			</button>
		</>
	);
}
