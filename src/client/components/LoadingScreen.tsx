import { forwardRef } from 'react';

interface LoadingScreenProps {
	isVisible: boolean;
	statusText: string;
	progressValue: number;
	progressMax: number;
	progressHidden: boolean;
}

const LoadingScreen = forwardRef<HTMLDivElement, LoadingScreenProps>(
	({ isVisible, statusText, progressValue, progressMax, progressHidden }, ref) => {
		return (
			<div
				ref={ref}
				className={`absolute inset-0 flex flex-col justify-center items-center text-center pointer-events-none transition-opacity duration-500 ${
					isVisible ? 'opacity-100' : 'opacity-0'
				}`}
				id="loading"
			>
				<div
					id="spinner"
					className="mb-8 relative size-18 bg-secondary flex items-center justify-center rounded-md"
				>
					<img
						src="/chess-pieces/knight.svg"
						width={80}
						height={80}
						className="relative z-10 size-10 animate-[flip-horizontal_1.6s_ease-in-out_infinite]"
					/>
					<div className="absolute z-0 top-0 left-0 right-0 bottom-0 rounded-2xl bg-secondary animate-ping" />
				</div>

				<div className="inline-block align-top text-center m-2.5 p-2.5" id="status">
					{statusText}
				</div>

				<progress
					value={progressValue}
					max={progressMax}
					id="progress"
					hidden={progressHidden}
					className="w-[250px] h-2.5 appearance-none p-1.25 m-2.5
                        [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-bar]:h-2.5 [&::-webkit-progress-bar]:rounded-2xl
                        [&::-webkit-progress-value]:bg-primary [&::-webkit-progress-value]:h-2.5 [&::-webkit-progress-value]:rounded-2xl"
				/>
			</div>
		);
	}
);

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
