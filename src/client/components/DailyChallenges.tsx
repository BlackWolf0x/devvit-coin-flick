import { ChallengeId } from '@shared/types/api';
import { Check } from 'lucide-react';

interface DailyChallengesProps {
	allChallenges: Record<ChallengeId, boolean> | undefined;
}

const challenges = [
	{
		id: 'completion' as ChallengeId,
		label: 'Daily completion',
		reward: 10,
	},
	{
		id: 'under60s' as ChallengeId,
		label: 'Finish under 60s',
		reward: 10,
	},
	{
		id: 'under30s' as ChallengeId,
		label: 'Finish under 15s',
		reward: 10,
	},
];

export function DailyChallenges({ allChallenges }: DailyChallengesProps) {
	return (
		<>
			{challenges.map((challenge) => {
				const isCompleted = allChallenges?.[challenge.id] === true;

				return (
					<div
						key={challenge.id}
						className="p-2 flex-1 flex text-sm items-center rounded-lg bg-[#866D5F] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)]"
					>
						<div className="mr-4 size-6 rounded-md bg-[#634B47] flex justify-center items-center">
							{isCompleted && <Check size={20} className="text-lime-400" />}
						</div>
						<span className="text-white">{challenge.label}</span>
						<span className="ml-auto font-extrabold text-amber-500">
							+{challenge.reward} Gold
						</span>
					</div>
				);
			})}
		</>
	);
}
