import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis } from '@devvit/web/server';
import { WeightedSystem } from '../../utils/weighted-system';

const router = Router();

// Define coin types and their weights
const coinWeightSystem = new WeightedSystem({
	'normal-coin': 70,
	'star-coin': 20,
	'heart-coin': 10,
});

/**
 * POST /api/open-chest
 * Open a chest and get a random coin based on weighted probabilities
 */
router.post('/api/open-chest', async (req: Request, res: Response): Promise<void> => {
	try {
		const { postId, userId } = context;
        const chestCost = 15;

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
		const randomCoin = coinWeightSystem.getRandomItem();
        console.log(randomCoin)

        // TODO: Unlock in user profile ⚠️⚠️⚠️

		res.json({
			status: 'success',
			coin: randomCoin,
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
