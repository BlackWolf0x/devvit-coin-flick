import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { context } from '@devvit/web/client';
import { ADMIN_USERS } from '../../shared/config';

const giveCurrency = async (targetUserId: string, amount: number) => {
	const response = await fetch('/api/admin/give-currency', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ targetUserId, amount }),
	});
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to give currency');
	}
	return response.json();
};

const clearCollection = async (targetUserId: string) => {
	const response = await fetch('/api/admin/clear-collection', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ targetUserId }),
	});
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to clear collection');
	}
	return response.json();
};

export function AdminPanel() {
	const [isOpen, setIsOpen] = useState(false);
	const [targetUserId, setTargetUserId] = useState('');
	const [amount, setAmount] = useState('100');
	const [showConfirm, setShowConfirm] = useState(false);

	// Check if current user is admin
	const { userId } = context;
	const isAdmin = userId && ADMIN_USERS.includes(userId);

	const giveCurrencyMutation = useMutation({
		mutationFn: ({ userId, amt }: { userId: string | null; amt: number }) =>
			giveCurrency(userId || '', amt),
		onSuccess: () => {
			setTargetUserId('');
			setAmount('100');
		},
	});

	const clearCollectionMutation = useMutation({
		mutationFn: (userId: string | null) => clearCollection(userId || ''),
		onSuccess: () => {
			setTargetUserId('');
			setShowConfirm(false);
		},
	});

	// Don't render anything if not admin
	if (!isAdmin) {
		return null;
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const amt = parseInt(amount, 10);
		if (isNaN(amt) || amt <= 0) {
			return;
		}
		// Use targetUserId if provided, otherwise null (will default to current user on server)
		giveCurrencyMutation.mutate({ userId: targetUserId || null, amt });
	};

	const handleClearCollection = () => {
		setShowConfirm(true);
	};

	const confirmClearCollection = () => {
		clearCollectionMutation.mutate(targetUserId || null);
	};

	const cancelClearCollection = () => {
		setShowConfirm(false);
	};

	if (!isOpen) {
		return (
			<button
				onClick={() => setIsOpen(true)}
				className="fixed bottom-4 right-4 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
				title="Admin Panel"
			>
				<Settings size={24} />
			</button>
		);
	}

	return (
		<div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border-2 border-red-600 p-4 z-50">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-bold text-red-600">Admin Panel</h3>
				<button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded">
					<X size={20} />
				</button>
			</div>

			{showConfirm ? (
				<div className="space-y-3">
					<p className="text-sm text-gray-700">
						Are you sure you want to clear{' '}
						<span className="font-semibold">{targetUserId || 'your'}</span> coin
						collection? This cannot be undone.
					</p>
					<div className="flex gap-2">
						<Button
							onClick={cancelClearCollection}
							className="flex-1"
							variant="outline"
							disabled={clearCollectionMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							onClick={confirmClearCollection}
							className="flex-1 bg-red-600 hover:bg-red-700 text-white"
							variant="destructive"
							disabled={clearCollectionMutation.isPending}
						>
							{clearCollectionMutation.isPending ? 'Clearing...' : 'Yes, Clear'}
						</Button>
					</div>
					{clearCollectionMutation.isError && (
						<p className="text-sm text-red-600">
							Error: {clearCollectionMutation.error.message}
						</p>
					)}
					{clearCollectionMutation.isSuccess && (
						<p className="text-sm text-green-600">Collection cleared successfully!</p>
					)}
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-3">
					<div>
						<label className="text-sm font-medium text-gray-700 block mb-1">
							User ID (optional - defaults to you)
						</label>
						<input
							type="text"
							value={targetUserId}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setTargetUserId(e.target.value)
							}
							placeholder={userId || 't2_xxxxx'}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
						/>
					</div>

					<div>
						<label className="text-sm font-medium text-gray-700 block mb-1">
							Amount
						</label>
						<input
							type="number"
							value={amount}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setAmount(e.target.value)
							}
							placeholder="100"
							min="1"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
						/>
					</div>

					<Button
						type="submit"
						disabled={giveCurrencyMutation.isPending}
						className="w-full"
						variant="default"
					>
						{giveCurrencyMutation.isPending ? 'Giving...' : 'Give Currency'}
					</Button>

					<Button
						type="button"
						onClick={handleClearCollection}
						disabled={clearCollectionMutation.isPending}
						className="w-full bg-red-600 hover:bg-red-700 text-white"
						variant="destructive"
					>
						Clear Collection
					</Button>

					{giveCurrencyMutation.isError && (
						<p className="text-sm text-red-600">
							Error: {giveCurrencyMutation.error.message}
						</p>
					)}

					{giveCurrencyMutation.isSuccess && (
						<p className="text-sm text-green-600">Currency given successfully!</p>
					)}
				</form>
			)}
		</div>
	);
}
