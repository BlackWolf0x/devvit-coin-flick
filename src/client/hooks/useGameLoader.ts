import { useCallback } from 'react';
import { InitResponse } from '@shared/types/api';

type RunnerManifest = {
	manifestFiles: string[];
	manifestFilesMD5: string[];
	mainJS?: string;
	unx?: string;
	index?: string;
	runner?: { version?: string; yyc?: boolean };
};

export const useGameLoader = () => {
	const loadRunnerManifest = useCallback(async (): Promise<void> => {
		try {
			const res = await fetch('/runner.json', {
				credentials: 'include',
				cache: 'no-cache',
			});
			if (!res.ok) throw new Error(`runner.json HTTP ${res.status}`);
			const manifest = (await res.json()) as RunnerManifest;

			if (
				!Array.isArray(manifest.manifestFiles) ||
				!Array.isArray(manifest.manifestFilesMD5)
			) {
				throw new Error('runner.json missing arrays');
			}
			if (manifest.manifestFiles.length !== manifest.manifestFilesMD5.length) {
				console.warn('[runner.json] manifestFiles and manifestFilesMD5 length mismatch');
			}

			window.manifestFiles = () => manifest.manifestFiles.join(';');
			window.manifestFilesMD5 = () => manifest.manifestFilesMD5.slice();
		} catch (e) {
			console.warn('Falling back to hardcoded manifest (runner.json not available):', e);

			window.manifestFiles = () =>
				['runner.data', 'runner.js', 'runner.wasm', 'audio-worklet.js', 'game.unx'].join(
					';'
				);

			window.manifestFilesMD5 = () => [
				'585214623b669175a702fed30de7d21d',
				'8669aa66d44cfb4f13a098cd6b0296e1',
				'd29ac123833b56dcfbe188f10e5ecb85',
				'e8f1e8db8cf996f8715a6f2164c2e44e',
				'00a26996df3ce310bb5836ef7f4b0e3c',
			];
		}
	}, []);

	const fetchInitialData = useCallback(async () => {
		try {
			const response = await fetch('/api/init');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = (await response.json()) as InitResponse;
			if (data.type === 'init') {
				console.log(`Game initialized for user: ${data.username}, post: ${data.postId}`);
			} else {
				console.error('Invalid response type from /api/init', data);
			}
		} catch (error) {
			console.error('Error fetching initial data:', error);
		}
	}, []);

	const loadGame = useCallback(
		async (onStatusChange: (text: string) => void) => {
			try {
				await fetchInitialData();
				await loadRunnerManifest();

				const script = document.createElement('script');
				script.src = '/runner.js';
				script.async = true;
				script.type = 'text/javascript';

				script.onload = () => {
					console.log('Game script loaded successfully');
				};

				script.onerror = (error) => {
					console.error('Failed to load game script:', error);
					onStatusChange('Failed to load game');
				};

				document.head.appendChild(script);
			} catch (error) {
				console.error('Error loading game:', error);
				onStatusChange('Error loading game');
			}
		},
		[fetchInitialData, loadRunnerManifest]
	);

	return { loadGame };
};
