import { useRef, useEffect, useState, useCallback } from 'react';
import GameLoadingScreen from './GameLoadingScreen.tsx';
import { useGameMakerGlobals } from '../hooks/useGameMakerGlobals';
import { useGameLoader } from '../hooks/useGameLoader';
import { useGameModule } from '../hooks/useGameModule';
import { SpMyBalance } from './SpMyBalance';
import '../types/gamemaker.ts';

const GameCanvas = () => {
	// 🔧 DEV MODE: Set to true to show loading screen for styling
	const DEV_SHOW_LOADING_ONLY = false;

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const startingDimensions = useRef<{
		width?: number;
		height?: number;
		aspect?: number;
	}>({});

	const [isLoading, setIsLoading] = useState(true);
	const [statusText, setStatusText] = useState('Loading Game...');
	const [progressValue, setProgressValue] = useState(0);
	const [progressMax, setProgressMax] = useState(100);
	const [progressHidden, setProgressHidden] = useState(true);

	// Setup GameMaker globals
	useGameMakerGlobals();

	const ensureAspectRatio = useCallback(() => {
		const canvas = canvasRef.current;
		const { width, height, aspect } = startingDimensions.current;

		if (!canvas || !height || !width || !aspect) {
			return;
		}

		canvas.style.height = '100%';
		canvas.style.width = '100%';
	}, []);

	const handleStatusChange = useCallback((text: string) => {
		setStatusText(text);
	}, []);

	const handleProgressChange = useCallback((value: number, max: number, hidden: boolean) => {
		setProgressValue(value);
		setProgressMax(max);
		setProgressHidden(hidden);
	}, []);

	const handleLoadingComplete = useCallback(() => {
		setIsLoading(false);
	}, []);

	const { setupModule } = useGameModule({
		canvasRef,
		onStatusChange: handleStatusChange,
		onProgressChange: handleProgressChange,
		onLoadingComplete: handleLoadingComplete,
		ensureAspectRatio,
	});

	const { loadGame } = useGameLoader();

	useEffect(() => {
		// 🔧 DEV MODE: Skip game loading if in dev mode
		if (DEV_SHOW_LOADING_ONLY) {
			console.log('🔧 DEV MODE: Loading screen only');
			setProgressHidden(false);
			setProgressValue(50);
			setProgressMax(100);
			return;
		}

		// Setup window size callback
		window.onGameSetWindowSize = (width: number, height: number) => {
			console.log(`Window size set to width: ${width}, height: ${height}`);
			startingDimensions.current = {
				width,
				height,
				aspect: width / height,
			};
		};

		// Setup resize observer
		const resizeObserver = new ResizeObserver(() => {
			window.requestAnimationFrame(() => ensureAspectRatio());
			setTimeout(() => window.requestAnimationFrame(() => ensureAspectRatio()), 100);
		});
		resizeObserver.observe(document.body);

		// Mobile scrolling disabled
		if (/Android|iPhone|iPod/i.test(navigator.userAgent)) {
			document.body.classList.add('scrollingDisabled');
		}

		// Initialize game
		setupModule();
		loadGame(handleStatusChange);

		return () => {
			resizeObserver.disconnect();
		};
	}, [ensureAspectRatio, setupModule, loadGame, handleStatusChange]);

	const handleCanvasClick = () => {
		canvasRef.current?.focus();
	};

	return (
		<>
			{/* Hidden balance component to keep it reactive to store updates */}
			<div className="hidden">
				<SpMyBalance />
			</div>
			<canvas
				ref={canvasRef}
				className={`border-0 outline-0 relative my-auto transition-opacity duration-500 ${
					isLoading ? 'opacity-0' : 'opacity-100'
				}`}
				id="canvas"
				onContextMenu={(e) => e.preventDefault()}
				onClick={handleCanvasClick}
				tabIndex={-1}
			/>
			<GameLoadingScreen
				isVisible={isLoading}
				statusText={statusText}
				progressValue={progressValue}
				progressMax={progressMax}
				progressHidden={progressHidden}
			/>
		</>
	);
};

export default GameCanvas;
