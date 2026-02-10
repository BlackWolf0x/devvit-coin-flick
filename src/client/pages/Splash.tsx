import { DailyChallenges } from '@/components/DailyChallenges';
import { MyBalance } from '@/components/MyBalance';
import { MyCoins } from '@/components/MyCoins';
import { PlayButton } from '@/components/PlayButton';
import { TopRightButtons } from '@/components/TopRightButtons';

export default function Splash() {
	return (
		<div className="relative h-screen overflow-hidden flex flex-col justify-between">
			<MyBalance />

			<div className="absolute top-2 right-2 space-y-2">
				<TopRightButtons />
			</div>

			<div className="mt-auto mb-4 flex flex-col justify-center items-center space-y-2">
				<MyCoins />
			</div>

			<div className="mb-6 w-3/4 mx-auto space-y-2">
				<DailyChallenges />
			</div>

			<div className="pb-3 flex flex-col items-center justify-center gap-1">
				<PlayButton />
			</div>
		</div>
	);
}
