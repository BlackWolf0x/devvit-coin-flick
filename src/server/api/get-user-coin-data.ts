import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis } from '@devvit/web/server';

const router = Router();

/**
 * GET /api/get-user-coin-data
 * Get the user's coin collection and active coin
 */
router.get('/api/get-user-coin-data', async (_req: Request, res: Response): Promise<void> => {
	try {
		const { postId, userId } = context;

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

		// Get user's coin collection
		const userCollectionKey = `collection:${userId}`;
		const collection = await redis.hGetAll(userCollectionKey);

		// Get user's active coin
		const activeCoinKey = `activecoin:${userId}`;
		const activeCoin = await redis.get(activeCoinKey);

		res.json({
			status: 'success',
			collection: collection || {},
			activeCoin: activeCoin || 'clover',
		});
	} catch (error) {
		let errorMessage = 'Unknown error fetching user coin data';
		if (error instanceof Error) {
			errorMessage = `Failed to fetch user coin data: ${error.message}`;
		}
		res.status(500).json({ status: 'error', message: errorMessage });
	}
});

export default router;
