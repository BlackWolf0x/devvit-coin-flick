import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis } from '@devvit/web/server';
import type { UserDataResponse, ApiErrorResponse, ChallengeId } from '../../shared/types/api';

const router = Router();

router.get('/api/user-data', async (req: Request, res: Response): Promise<void> => {
	const { userId, postId } = context;

	if (!userId) {
		res.status(400).json({
			message: 'User must be logged in',
		} satisfies ApiErrorResponse);
		return;
	}

	try {
		const userCollectionKey = `collection:${userId}`;

		// Gift user a 'clover' coin only once (if they don't have it yet)
		const cloverCount = await redis.hGet(userCollectionKey, 'clover');

		if (!cloverCount) {
			// Gift the user 1 clover coin
			await redis.hIncrBy(userCollectionKey, 'clover', 1);
		}

		const balance = await redis.get(`wallet:${userId}`);
		const allChallengesRaw = await redis.hGetAll(`challenge:${userId}:${postId}`);

		// Convert challenge strings to booleans
		const allChallenges: Record<ChallengeId, boolean> = {
			completion: allChallengesRaw['completion'] === 'true',
			under30s: allChallengesRaw['under30s'] === 'true',
			under15s: allChallengesRaw['under15s'] === 'true',
		};

		// Get user's unique coins in collection (number of keys in the hash)
		const collection = await redis.hGetAll(userCollectionKey);
		const uniqueCoins = Object.keys(collection).length;

		// Get user's active coin
		const activeCoinKey = `activecoin:${userId}`;
		const activeCoin = await redis.get(activeCoinKey);

		res.json({
			balance: parseInt(balance || '0', 10),
			allChallenges,
			uniqueCoins,
			activeCoin: activeCoin || 'clover',
		} satisfies UserDataResponse);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Failed to get user balance',
		} satisfies ApiErrorResponse);
	}
});

export default router;
