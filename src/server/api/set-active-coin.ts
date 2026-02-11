import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis } from '@devvit/web/server';
import { coins } from '../../shared/coins';

const router = Router();

type CoinType = (typeof coins)[number];

/**
 * POST /api/set-active-coin
 * Set a coin as the user's active coin if they own it
 */
router.post('/api/set-active-coin', async (req: Request, res: Response): Promise<void> => {
	try {
		const { postId, userId } = context;
		const { coin } = req.body;

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

		if (!coin) {
			res.status(400).json({
				status: 'error',
				message: 'Coin parameter is required',
			});
			return;
		}

		// Validate coin type
		if (!coins.includes(coin as CoinType)) {
			res.status(400).json({
				status: 'error',
				message: `Invalid coin type. Must be one of: ${coins.join(', ')}`,
			});
			return;
		}

		// Check if user owns this coin
		const userCollectionKey = `collection:${userId}`;
		const coinCountStr = await redis.hGet(userCollectionKey, coin);
		const coinCount = parseInt(coinCountStr || '0', 10); // base 10

		if (coinCount <= 0) {
			res.status(400).json({
				status: 'error',
				message: 'You do not own this coin',
			});
			return;
		}

		// Set as active coin
		const activeCoinKey = `activecoin:${userId}`;
		await redis.set(activeCoinKey, coin);

		res.json({
			status: 'success',
			activeCoin: coin,
		});
	} catch (error) {
		let errorMessage = 'Unknown error setting active coin';
		if (error instanceof Error) {
			errorMessage = `Failed to set active coin: ${error.message}`;
		}
		res.status(500).json({ status: 'error', message: errorMessage });
	}
});

export default router;
