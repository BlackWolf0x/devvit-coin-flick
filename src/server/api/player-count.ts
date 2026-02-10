import { Router } from 'express';
import { context, redis } from '@devvit/web/server';

const router = Router();

/**
 * GET /api/player-count
 * Get the count of unique players who clicked "Make Your Move" for this post
 */
router.get('/api/player-count', async (_req, res): Promise<void> => {
	try {
		const { postId } = context;

		if (!postId) {
			res.status(400).json({
				status: 'error',
				message: 'postId is required',
			});
			return;
		}

		const key = `players:${postId}`;
		// Use zCard to get count of unique players in sorted set
		const count = await redis.zCard(key);

		res.json({
			status: 'success',
			playerCount: count ?? 0,
		});
	} catch (error) {
		console.error('Error fetching player count:', error);
		res.status(500).json({
			status: 'error',
			message: 'Failed to fetch player count',
		});
	}
});

export default router;
