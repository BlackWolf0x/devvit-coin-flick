import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigationStore } from '@/stores/navigationStore';

export default function Rules() {
	const goBack = useNavigationStore((state) => state.goBack);

	return (
		<div className="relative h-screen bg-background pt-4 gap-4 px-4">
			{/* Header */}
			<header className="mb-6 flex items-center justify-center gap-4">
				<Button onClick={goBack} variant="outline" size={'icon'}>
					<ArrowLeft />
				</Button>
				<div className="sm:space-y-1">
					<h1 className="h-6 text-xl font-bold font-title">Rules</h1>
					<p className="text-xs text-muted-foreground">How to play Sweep Chess</p>
				</div>
			</header>

			{/* Content */}
			<div className="w-full h-[calc(100%-84px)] space-y-3 flex flex-col">
				<div className="w-full px-4 py-3 bg-secondary rounded-lg border">
					<h3 className="font-semibold mb-1">Objective</h3>
					<p className="text-sm text-muted-foreground">
						Clear the board by capturing all pieces using fewer moves and less
						distance(cells).
					</p>
				</div>

				<div className="w-full px-4 py-3 bg-secondary rounded-lg border">
					<h3 className="font-semibold mb-2">How to Play</h3>
					<ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
						<li>Any white piece can be placed on an empty cell.</li>
						<li>The Knight can be placed on a pawn, capturing it.</li>
						<li>Valid moves are highlighted.</li>
						<li>Pawns do not block movement. Pieces pass through and wipe them.</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
