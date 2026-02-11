import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, realtime, redis } from '@devvit/web/server';
import { coinWeightedSystem } from '../../shared/coins/coins';

const router = Router();

/**
 * POST /api/open-chest
 * Open a chest and get a random coin based on weighted probabilities
 */
router.post('/api/open-chest', async (req: Request, res: Response): Promise<void> => {
	try {
		const { postId, userId } = context;
		const chestCost = 1;

		if (!postId) {
			res.status(400).json({
				status: 'error',
				message: 'Unable to find postId',
			});
			return;
		}

		if (!userId) {
			res.status(400).json({
				status: 'error',
				message: 'User must be logged in',
			});
			return;
		}

		// Check user balance
		const balanceStr = await redis.get(`wallet:${userId}`);
		const currentBalance = parseInt(balanceStr || '0', 10);

		if (currentBalance < chestCost) {
			res.status(400).json({
				status: 'error',
				message: 'Insufficient balance',
				balance: currentBalance,
				required: chestCost,
			});
			return;
		}

		// Deduct chest cost from balance atomically
		const newBalance = await redis.incrBy(`wallet:${userId}`, -chestCost);

		// Get a random coin based on weights
		const randomCoinId = coinWeightedSystem.getRandomItem();

		// Unlock/Increment in user profile
		const userCollectionKey = `collection:${userId}`;

		// Add 1 coin
		await redis.hIncrBy(userCollectionKey, randomCoinId, 1);

		// Get user's unique coins count
		const collection = await redis.hGetAll(userCollectionKey);
		const uniqueCoins = Object.keys(collection).length;

		// Send real-time update to user's wallet channel
		await realtime.send(`wallet_${userId}`, {
			type: 'balance-update',
			balance: newBalance,
			uniqueCoins,
			timestamp: Date.now(),
		});

		res.json({
			status: 'success',
			coinId: randomCoinId,
			balance: newBalance,
		});
	} catch (error) {
		let errorMessage = 'Unknown error opening chest';
		if (error instanceof Error) {
			errorMessage = `Failed to open chest: ${error.message}`;
		}
		res.status(500).json({ status: 'error', message: errorMessage });
	}
});

export default router;
