import { useCallback } from 'react';

interface UseGameModuleProps {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	onStatusChange: (text: string) => void;
	onProgressChange: (value: number, max: number, hidden: boolean) => void;
	onLoadingComplete: () => void;
	ensureAspectRatio: () => void;
}

export const useGameModule = ({
	canvasRef,
	onStatusChange,
	onProgressChange,
	onLoadingComplete,
	ensureAspectRatio,
}: UseGameModuleProps) => {
	const setupModule = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		window.Module = {
			preRun: [],
			postRun: [],
			print: (text: string) => {
				console.log(text);
				if (text === 'Entering main loop.') {
					ensureAspectRatio();
					// Hide loading screen when game starts
					onLoadingComplete();
				}
			},
			printErr: (text: string) => {
				console.error(text);
			},
			canvas: canvas,
			setStatus: (text: string) => {
				if (!window.Module.setStatus.last) {
					window.Module.setStatus.last = { time: Date.now(), text: '' };
				}
				if (text === window.Module.setStatus.last.text) return;

				const m = text.match(/([^(]+)\((\d+(?:\.\d+)?)\/(\d+)\)/);
				const now = Date.now();
				if (m && now - window.Module.setStatus.last.time < 30) return;

				window.Module.setStatus.last.time = now;
				window.Module.setStatus.last.text = text;

				if (m) {
					onProgressChange(parseInt(m[2]!, 10) * 100, parseInt(m[3]!, 10) * 100, false);
				} else {
					onProgressChange(0, 100, true);

					if (!text) {
						onLoadingComplete();
					}
				}
				onStatusChange(text);
			},
			totalDependencies: 0,
			monitorRunDependencies: (left: number) => {
				window.Module.totalDependencies = Math.max(window.Module.totalDependencies, left);
				window.Module.setStatus(
					left
						? `Preparing... (${window.Module.totalDependencies - left}/${
								window.Module.totalDependencies
						  })`
						: 'All downloads complete.'
				);
			},
		};

		window.Module.setStatus('Downloading...');

		window.onerror = () => {
			window.Module.setStatus('Exception thrown, see JavaScript console');
			window.Module.setStatus = (text: string) => {
				if (text) window.Module.printErr(`[post-exception status] ${text}`);
			};
		};

		if (typeof window === 'object') {
			window.Module.arguments = window.location.search.substr(1).trim().split('&');
			if (!window.Module.arguments[0]) {
				window.Module.arguments = [];
			}
		}
	}, [canvasRef, onStatusChange, onProgressChange, onLoadingComplete, ensureAspectRatio]);

	return { setupModule };
};
