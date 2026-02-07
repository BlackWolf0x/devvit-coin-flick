import { memo } from 'react';

interface CreatorBoardProps {
	board: number[][];
	onSquareClick: (x: number, y: number) => void;
	isMaxPawns: boolean;
}

// Memoized square component for better performance
const Square = memo(
	({
		hasPawn,
		isLight,
		isMaxPawns,
		onClick,
	}: {
		hasPawn: boolean;
		isLight: boolean;
		isMaxPawns: boolean;
		onClick: () => void;
	}) => {
		const showDot = !hasPawn && !isMaxPawns;

		return (
			<button
				onClick={onClick}
				className={`aspect-square relative flex items-center justify-center cursor-pointer group ${
					isLight ? 'bg-[#EDD6BB]' : 'bg-[#D9BE9E]'
				}`}
				style={{ touchAction: 'none' }}
			>
				{hasPawn ? (
					<img
						src="/chess-pieces/pawn.svg"
						alt="pawn"
						className="w-[70%] h-[70%] pointer-events-none select-none"
						draggable={false}
					/>
				) : (
					showDot && (
						<div className="w-3 h-3 rounded-full bg-white/50 group-hover:bg-black/60 transition-colors duration-100 pointer-events-none" />
					)
				)}
			</button>
		);
	}
);

Square.displayName = 'Square';

function CreatorBoard({ board, onSquareClick, isMaxPawns }: CreatorBoardProps) {
	return (
		<div
			className="w-full aspect-square grid grid-cols-8 grid-rows-8 border border-[#D9BE9E]"
			style={{ touchAction: 'none' }}
		>
			{Array.from({ length: 8 }).map((_, rankIndex) => {
				// Render from rank 8 (top) to rank 1 (bottom)
				const y = 7 - rankIndex;

				return Array.from({ length: 8 }).map((_, fileIndex) => {
					const x = fileIndex;
					const isLight = (x + y) % 2 === 0;
					const hasPawn = board[x]?.[y] === 1;

					return (
						<Square
							key={`${x}-${y}`}
							hasPawn={hasPawn}
							isLight={isLight}
							isMaxPawns={isMaxPawns}
							onClick={() => onSquareClick(x, y)}
						/>
					);
				});
			})}
		</div>
	);
}

export default memo(CreatorBoard);
