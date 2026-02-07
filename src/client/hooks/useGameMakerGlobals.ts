import { useEffect } from 'react';

export const useGameMakerGlobals = () => {
	useEffect(() => {
		// GameMaker async method support
		window.g_pAddAsyncMethod = -1;
		window.setAddAsyncMethod = (asyncMethod: any) => {
			window.g_pAddAsyncMethod = asyncMethod;
			console.log('setAddAsyncMethod called with:', asyncMethod);
		};

		// Exception handling
		window.g_pJSExceptionHandler = undefined;
		window.setJSExceptionHandler = (exceptionHandler: any) => {
			if (typeof exceptionHandler === 'function') {
				window.g_pJSExceptionHandler = exceptionHandler;
			}
		};

		window.hasJSExceptionHandler = () => {
			return (
				window.g_pJSExceptionHandler !== undefined &&
				typeof window.g_pJSExceptionHandler === 'function'
			);
		};

		window.doJSExceptionHandler = (exceptionJSON: string) => {
			if (typeof window.g_pJSExceptionHandler === 'function') {
				const exception = JSON.parse(exceptionJSON);
				window.g_pJSExceptionHandler(exception);
			}
		};

		// WAD/Resource loading
		window.g_pWadLoadCallback = undefined;
		window.setWadLoadCallback = (wadLoadCallback: any) => {
			window.g_pWadLoadCallback = wadLoadCallback;
		};

		window.onFirstFrameRendered = () => {
			console.log('First frame rendered!');
		};

		// Ad system stubs
		window.triggerAd = (adId: string, ...callbacks: any[]) => {
			console.log('triggerAd called with adId:', adId);
			if (callbacks.length > 0 && typeof callbacks[0] === 'function') {
				setTimeout(() => callbacks[0](), 100);
			}
		};

		window.triggerPayment = (itemId: string, callback: any) => {
			console.log('triggerPayment called with itemId:', itemId);
			if (typeof callback === 'function') {
				setTimeout(() => callback({ id: itemId }), 1000);
			}
		};

		// UI utility functions
		window.toggleElement = (id: string) => {
			const elem = document.getElementById(id);
			if (elem) {
				elem.style.display = elem.style.display === 'block' ? 'none' : 'block';
			}
		};

		// Multiplayer/networking stubs
		const acceptableRollbackFramesRef = { value: 0 };
		window.set_acceptable_rollback = (frames: number) => {
			acceptableRollbackFramesRef.value = frames;
			console.log('Set acceptable rollback frames:', frames);
		};

		window.report_stats = (statsData: any) => {
			console.log('Game stats reported:', statsData);
		};

		window.log_next_game_state = () => {
			console.log('Game state logging requested');
		};

		window.wallpaper_update_config = (config: string) => {
			console.log('Wallpaper config update:', config);
		};

		window.wallpaper_reset_config = () => {
			console.log('Wallpaper config reset');
		};

		// Mock accelerometer API to prevent permissions policy violations
		if (!('DeviceMotionEvent' in window)) {
			(window as any).DeviceMotionEvent = class MockDeviceMotionEvent extends Event {
				constructor(type: string, eventInitDict?: any) {
					super(type, eventInitDict);
				}
			};
		}

		if (!('DeviceOrientationEvent' in window)) {
			(window as any).DeviceOrientationEvent = class MockDeviceOrientationEvent extends (
				Event
			) {
				constructor(type: string, eventInitDict?: any) {
					super(type, eventInitDict);
				}
			};
		}
	}, []);
};
