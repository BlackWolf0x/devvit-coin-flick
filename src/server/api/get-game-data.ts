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

		// Generate daily seed from post creation date
		const dailySeed = getDailySeedFromDate(post.createdAt);

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
