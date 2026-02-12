import { ChallengeId } from '@shared/types/api';
import { Check } from 'lucide-react';
import { useUserDataStore } from '@/stores/userDataStore';

const challenges = [
	{
		id: 'completion' as ChallengeId,
		label: 'Daily completion',
		reward: 10,
	},
	{
		id: 'under30s' as ChallengeId,
		label: 'Finish under 30s',
		reward: 10,
	},
	{
		id: 'under15s' as ChallengeId,
		label: 'Finish under 15s',
		reward: 10,
	},
];

export function SpChallenges() {
	const allChallenges = useUserDataStore((state) => state.allChallenges);

	return (
		<>
			{challenges.map((challenge) => {
				const isCompleted = allChallenges?.[challenge.id] === true;

				return (
					<div
						key={challenge.id}
						className={`p-2 flex-1 flex text-sm items-center rounded-lg bg-[#675247] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] `}
					>
						<div
							className={`mr-4 size-6 rounded-md bg-[#3e3525] flex justify-center items-center 
								${!allChallenges && 'opacity-10 animate-pulse'} 
							`}
						>
							{isCompleted && <Check size={20} className="text-lime-400" />}
						</div>

						<span className={`text-white`}>{challenge.label}</span>

						<span
							className={`ml-auto font-extrabold text-amber-500 ${
								isCompleted && 'line-through'
							}`}
						>
							+{challenge.reward} Gold
						</span>
					</div>
				);
			})}
		</>
	);
}
