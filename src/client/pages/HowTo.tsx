import { useNavigationStore } from '@/stores/navigationStore';

export default function Rules() {
	const goBack = useNavigationStore((state) => state.goBack);

	return (
		<div className="relative h-screen p-2 notmobile:p-4 flex flex-col">
			<header className="flex items-center gap-2">
				<button
					onClick={goBack}
					onContextMenu={(e) => e.preventDefault()}
					onTouchStart={(e) => e.preventDefault()}
					className="cursor-pointer transition-transform scale-100 active:scale-95 select-none disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<img
						src="/misc/btn-back.png"
						width={152}
						height={154}
						className="w-10 pointer-events-none"
						draggable={false}
					/>
				</button>

				<h1 className="text-lg font-semibold">How to Play</h1>
			</header>

			<div className="flex-1 mt-3 rounded-lg p-4 bg-white/85 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">
				<div className="flex-1 overflow-y-auto space-y-4">
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">Objective</h3>
						<p className="text-sm text-gray-700">
							Collect all coins on the table in the fastest time possible by flicking
							coins into each other.
						</p>
					</div>

					<div>
						<h3 className="font-semibold text-gray-900 mb-2">Rules</h3>
						<ul className="text-sm text-gray-700 space-y-2">
							<li className="flex gap-2">
								<span className="shrink-0 text-green-600 font-bold">•</span>
								<span>Select a coin on the table to begin.</span>
							</li>
							<li className="flex gap-2">
								<span className="shrink-0 text-green-600 font-bold">•</span>
								<span>
									Flick your coin so it hits exactly one other coin. If you hit
									none or more than one, you lose.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="shrink-0 text-green-600 font-bold">•</span>
								<span>
									The two coins can collide multiple times with each other.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="shrink-0 text-green-600 font-bold">•</span>
								<span>
									The coin you hit becomes the next coin to flick. You cannot
									select another coin.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="shrink-0 text-green-600 font-bold">•</span>
								<span>If any coin falls off the table, you lose.</span>
							</li>
							<li className="flex gap-2">
								<span className="shrink-0 text-green-600 font-bold">•</span>
								<span>
									Coins can bounce off obstacles freely, so use them to your
									advantage.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="shrink-0 text-green-600 font-bold">•</span>
								<span>The timer starts after your first shot.</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
