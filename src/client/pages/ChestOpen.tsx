import { useNavigationStore } from '@/stores/navigationStore';
import { useMutation } from '@tanstack/react-query';

const openChest = async () => {
	const response = await fetch('/api/open-chest', {
		method: 'POST',
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	console.log(data);
	return data;
};

export default function ChestOpen() {
	const goBack = useNavigationStore((state) => state.goBack);

	// Player count update mutation
	const openChestMutation = useMutation({
		mutationFn: openChest,
	});

	return (
		<div className="relative h-screen pt-6 flex flex-col gap-4 px-4 pb-4">
			<button
				onClick={goBack}
				className="absolute top-4 left-4 text-white hover:opacity-80 transition-opacity"
			>
				← Back
			</button>
			<div className="flex-1 flex items-center justify-center">
				<h1 className="text-2xl text-white">Chest Open Page</h1>

				<button onClick={() => openChestMutation.mutate()}>Open Chest</button>
			</div>
		</div>
	);
}
