import { Check } from 'lucide-react';

export function DailyChallenges() {
	return (
		<>
			<div className="p-2 flex-1 flex text-sm items-center rounded-lg bg-[#866D5F] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)]">
				<div className="mr-4 size-6 rounded-md bg-[#634B47] flex justify-center items-center">
					<Check size={20} className="text-lime-400" />
				</div>
				<span className="text-white">Daily Completion</span>
				<span className="ml-auto font-extrabold text-amber-500">+10 Gold</span>
			</div>

			<div className="p-2 flex-1 flex text-sm items-center rounded-lg bg-[#866D5F] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)]">
				<div className="mr-4 size-6 rounded-md bg-[#634B47] flex justify-center items-center">
					<Check size={20} className="text-lime-400" />
				</div>
				<span className="text-white">Daily Completion</span>
				<span className="ml-auto font-extrabold text-amber-500">+10 Gold</span>
			</div>

			<div className="p-2 flex-1 flex text-sm items-center rounded-lg bg-[#866D5F] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)]">
				<div className="mr-4 size-6 rounded-md bg-[#634B47] flex justify-center items-center">
					<Check size={20} className="text-lime-400" />
				</div>
				<span className="text-white">Daily Completion</span>
				<span className="ml-auto font-extrabold text-amber-500">+10 Gold</span>
			</div>
		</>
	);
}
