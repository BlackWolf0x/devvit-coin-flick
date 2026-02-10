import { Router } from 'express';
import { context, redis, realtime } from '@devvit/web/server';

const router = Router();

/**
 * POST /api/track-player
 * Track when a player clicks "Make Your Move" button
 * Uses Redis Sorted Set to ensure uniqueness per post
 * Score is set to timestamp for potential future use (e.g., first play time)
 */
router.post('/api/player-count-update', async (_req, res): Promise<void> => {
	try {
		const { postId, userId } = context;

		if (!postId) {
			res.status(400).json({
				status: 'error',
				message: 'postId is required',
			});
			return;
		}

		if (!userId) {
			res.status(401).json({
				status: 'error',
				message: 'User must be logged in',
			});
			return;
		}

		// Add username to the sorted set of players for this post
		// zAdd automatically handles uniqueness - if username exists, it just updates the score
		const key = `players:${postId}`;
		await redis.zAdd(key, {
			member: userId,
			score: Date.now(),
		});

		// Get the total count of unique players
		const count = await redis.zCard(key);

		// Send real-time update
		await realtime.send(`players_${postId}`, {
			count,
		});

		res.json({
			status: 'success',
		});
	} catch (error) {
		console.error('Error tracking player:', error);
		res.status(500).json({
			status: 'error',
			message: 'Failed to track player',
		});
	}
});

export default router;
