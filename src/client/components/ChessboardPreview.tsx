import { useMemo, useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { context } from '@devvit/web/client';

export default function ChessboardPreview() {
	const board = context.postData?.board as number[][] | undefined;
	// Only show loading if board data is not immediately available
	const [showLoading, setShowLoading] = useState(!board);
	const [fadeOut, setFadeOut] = useState(false);

	// Hide loading when board data becomes available
	useEffect(() => {
		if (board && showLoading) {
			// Start fade out when data arrives
			setFadeOut(true);

			// Remove overlay after fade completes
			const hideTimer = setTimeout(() => {
				setShowLoading(false);
			}, 300); // Match the fade duration

			return () => clearTimeout(hideTimer);
		}
	}, [board, showLoading]);

	// Custom piece components
	const customPieces = useMemo(
		() => ({
			bP: () => (
				<img src="/chess-pieces/pawn.svg" alt="pawn" className="w-full h-full p-0.5" />
			),
		}),
		[]
	);

	// Convert board array to chess position object
	const boardPosition = useMemo(() => {
		const position: Record<string, { pieceType: string }> = {};
		const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

		// Always prepare the board data, but only show when loading is done
		if (board) {
			// Real board data: place pawns based on board data
			for (let x = 0; x < 8; x++) {
				const file = files[x];
				for (let y = 0; y < 8; y++) {
					if (board[x]?.[y] === 1) {
						const rank = y + 1;
						position[`${file}${rank}`] = { pieceType: 'bP' };
					}
				}
			}
		}

		return position;
	}, [board]);

	return (
		<div className="relative">
			<Chessboard
				options={{
					position: boardPosition,
					allowDragging: false,
					boardStyle: {
						border: '1px solid #D9BE9E',
					},
					lightSquareStyle: { backgroundColor: '#EDD6BB' },
					darkSquareStyle: { backgroundColor: '#D9BE9E' },
					pieces: customPieces,
					showNotation: false,
				}}
			/>

			{/* Loading overlay with animated dots */}
			{showLoading && (
				<div
					className={`absolute inset-0 pointer-events-none grid grid-cols-8 grid-rows-8 transition-opacity duration-300 ${
						fadeOut ? 'opacity-0' : 'opacity-100'
					}`}
				>
					{Array.from({ length: 64 }).map((_, index) => {
						const row = Math.floor(index / 8);
						const col = index % 8;
						const delay = (row + col) * 0.03; // Faster diagonal wave

						return (
							<div key={index} className="flex items-center justify-center">
								<div
									className="w-2 h-2 bg-black/30 rounded-full animate-pulse"
									style={{
										animationDelay: `${delay}s`,
										animationDuration: '1s',
									}}
								/>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
