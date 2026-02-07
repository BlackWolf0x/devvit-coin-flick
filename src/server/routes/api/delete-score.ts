import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis } from '@devvit/web/server';

const router = Router();

/**
 * DELETE /api/delete-score/:userId
 * Remove a user's score from the leaderboard
 */
router.post('/api/delete-score', async (req: Request, res: Response): Promise<void> => {
	try {
		const { postId, userId } = context;

		if (!postId) {
			res.status(400).json({
				status: 'error',
				message: 'Unable to find postId',
			});
			return;
		}

		if (!userId || typeof userId !== 'string') {
			res.status(400).json({
				status: 'error',
				message: 'userId is required',
			});
			return;
		}

		const leaderboardKey = `leaderboard:${postId}`;
		const statsKey = `user:${userId}:stats:${postId}`;

		// Remove from leaderboard and delete stats
		await Promise.all([redis.zRem(leaderboardKey, [userId]), redis.del(statsKey)]);

		res.json({
			status: 'success',
			message: 'Score deleted successfully',
		});
	} catch (error) {
		console.error('Delete Score Error:', error);
		let errorMessage = 'Unknown error deleting score';
		if (error instanceof Error) {
			errorMessage = `Failed to delete score: ${error.message}`;
		}
		res.status(500).json({ status: 'error', message: errorMessage });
	}
});

export default router;
