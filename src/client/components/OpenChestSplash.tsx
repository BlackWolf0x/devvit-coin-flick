import { useNavigationStore } from '@/stores/navigationStore';

interface OpenChestSplashProps {
	displayBalance: number | undefined;
}

export function OpenChestSplash({ displayBalance }: OpenChestSplashProps) {
	const navigate = useNavigationStore((state) => state.navigate);

	return (
		<>
			<button className="relative cursor-pointer" onClick={() => navigate('pageChestOpen')}>
				<img
					src="/misc/chest-splash.png"
					width={106}
					height={92}
					className={`w-[53px] h-[46px] absolute z-10 top-0 left-1/2 -translate-x-1/2 ${
						displayBalance && displayBalance >= 15
							? 'animate-[shake_0.8s_ease-in-out_infinite]'
							: ''
					}`}
				/>
				<img
					src="/misc/btn-open-splash.png"
					width={128}
					height={140}
					className="w-[64] h-[70] mt-3"
				/>
			</button>
		</>
	);
}
