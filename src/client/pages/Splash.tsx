import { PlayButton } from '@/components/PlayButton';

export default function Splash() {
	return (
		<div className="relative h-screen overflow-hidden flex flex-col justify-between">
			<div className="mt-auto pb-3 flex flex-col items-center justify-center gap-1">
				<PlayButton />
			</div>
		</div>
	);
}
