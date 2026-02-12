import { SpChallenges } from '@/components/SpChallenges';
import { SpMyBalance } from '@/components/SpMyBalance';
import { SpCoinsCollected } from '@/components/SpCoinsCollected';
import { SpOpenChest } from '@/components/SpOpenChest';
import { SpPlayButton } from '@/components/SpPlayButton';
import { SpTopRightButtons } from '@/components/SpTopRightButtons';
import { AdminPanel } from '@/components/AdminPanel';

export default function Splash() {
	return (
		<div className="relative h-screen overflow-hidden flex flex-col justify-between">
			<SpMyBalance />

			<div className="absolute top-14 left-2 notmobile:top-20 notmobile:left-6 scale-75 notmobile:scale-100">
				<SpOpenChest />
			</div>

			<div className="absolute top-2 right-2 space-y-2 notmobile:top-6 notmobile:right-4 notmobile:space-y-3 scale-90 notmobile:scale-100">
				<SpTopRightButtons />
			</div>

			<div className="mt-auto mb-8 flex flex-col justify-center items-center">
				<SpCoinsCollected />
			</div>

			<div className="mb-6 notmobile:mb-8 w-3/4 notmobile:w-80 mx-auto space-y-2">
				<SpChallenges />
			</div>

			<div className="pb-4 flex flex-col items-center justify-center gap-3">
				<SpPlayButton />
			</div>

			<AdminPanel />
		</div>
	);
}
