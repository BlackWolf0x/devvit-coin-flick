import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

// API functions
const submitScore = async (scoreData: { totalMoves: number; cellsTravelled: number }) => {
	const response = await fetch('/api/submit-score', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(scoreData),
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};

const deleteScore = async () => {
	const response = await fetch(`/api/delete-score`, {
		method: 'POST',
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};

export default function DevBox() {
	const [isOpen, setIsOpen] = useState(false);

	// Submit score mutation
	const submitScoreMutation = useMutation({
		mutationFn: submitScore,
		onSuccess: (data) => {
			console.log('👌👌', data);
		},
		onError: (error) => {
			console.error('Error submitting score:', error);
		},
	});

	// Delete score mutation
	const deleteScoreMutation = useMutation({
		mutationFn: deleteScore,
		onSuccess: (data) => {
			console.log('Score deleted:', data);
		},
		onError: (error) => {
			console.error('Error deleting score:', error);
		},
	});

	const handleSubmitScore = () => {
		submitScoreMutation.mutate({
			totalMoves: 5,
			cellsTravelled: 20,
		});
	};

	const handleDeleteScore = () => {
		deleteScoreMutation.mutate();
	};

	return (
		<>
			{/* Hover trigger area */}
			<div className="fixed top-0 right-0 w-20 h-20 z-50 group">
				{/* Floating button - hidden by default, appears on hover */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center font-bold text-lg opacity-0 group-hover:opacity-100"
					aria-label="Development Tools"
				>
					🛠️
				</button>
			</div>

			{/* Options menu */}
			{isOpen && (
				<div className="fixed top-20 right-4 z-50 bg-background border rounded-lg shadow-xl p-4 min-w-[200px]">
					<h3 className="text-sm font-bold mb-3 text-foreground">Dev Tools</h3>
					<div className="flex flex-col gap-2">
						<Button
							size="sm"
							onClick={handleSubmitScore}
							disabled={submitScoreMutation.isPending}
						>
							{submitScoreMutation.isPending ? 'Submitting...' : 'Test Submit Score'}
						</Button>
						<Button
							size="sm"
							variant="destructive"
							onClick={handleDeleteScore}
							disabled={deleteScoreMutation.isPending}
						>
							{deleteScoreMutation.isPending ? 'Deleting...' : 'Delete My Score'}
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
