interface ChestOpenProps {
	onBack: () => void;
}

export default function ChestOpen({ onBack }: ChestOpenProps) {
	return (
		<div className="relative h-screen bg-background pt-6 flex flex-col gap-4 px-4 pb-4">
			<button
				onClick={onBack}
				className="absolute top-4 left-4 text-white hover:opacity-80 transition-opacity"
			>
				← Back
			</button>
			<div className="flex-1 flex items-center justify-center">
				<h1 className="text-2xl text-white">Chest Open Page</h1>
			</div>
		</div>
	);
}
