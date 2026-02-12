import { Router } from 'express';
import { context, reddit, redis } from '@devvit/web/server';
import { getDailySeedFromDate } from '../utils/daily-seed';

const router = Router();

/**
 * GET /api/get-game-data
 * Get the post creation date, daily seed, and user's active coin
 */
router.get('/api/get-game-data', async (_req, res): Promise<void> => {
	const { postId, userId } = context;

	if (!postId) {
		console.error('API Get Game Data Error: postId not found in devvit context');
		res.status(400).json({
			status: 'error',
			message: 'postId is required but missing from context',
		});
		return;
	}

	try {
		// Fetch the post data from Reddit
		const post = await reddit.getPostById(postId);

		if (!post) {
			res.status(404).json({
				status: 'error',
				message: 'Post not found',
			});
			return;
		}

		// Check if this is a bonus challenge with a custom seed stored in Redis
		let dailySeed: number;
		const bonusSeedKey = `post:${postId}:bonusSeed`;
		const storedBonusSeed = await redis.get(bonusSeedKey);

		if (storedBonusSeed) {
			// Use the stored bonus seed
			dailySeed = parseInt(storedBonusSeed, 10);
			console.log('[GET-GAME-DATA] Using bonus seed:', dailySeed);
		} else {
			// Generate daily seed from post creation date
			dailySeed = getDailySeedFromDate(post.createdAt);
			console.log('[GET-GAME-DATA] Using daily seed from creation date:', dailySeed);
		}

		// Get user's active coin (if logged in)
		let activeCoin = 'clover';
		if (userId) {
			const activeCoinKey = `activecoin:${userId}`;
			const userActiveCoin = await redis.get(activeCoinKey);
			if (userActiveCoin) {
				activeCoin = userActiveCoin;
			}
		}

		// Return the post creation date, daily seed, and active coin
		res.json({
			status: 'success',
			postId: postId,
			createdAt: post.createdAt.toISOString(),
			createdAtTimestamp: post.createdAt.getTime(),
			dailySeed: dailySeed, // Consistent seed for the day the post was created
			activeCoin: activeCoin, // User's active coin or 'none' if not set
		});
	} catch (error) {
		console.error(`API Get Game Data Error for post ${postId}:`, error);
		let errorMessage = 'Unknown error fetching game data';
		if (error instanceof Error) {
			errorMessage = `Failed to fetch game data: ${error.message}`;
		}
		res.status(400).json({ status: 'error', message: errorMessage });
	}
});

export default router;
