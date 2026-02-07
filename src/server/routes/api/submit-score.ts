import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis } from '@devvit/web/server';

const router = Router();

/**
 * POST /api/submit-score
 * Submit user score to leaderboard
 */
router.post('/api/submit-score', async (req: Request, res: Response): Promise<void> => {
	try {
		const { postId, userId, username, snoovatar } = context;
		const { totalMoves, cellsTravelled } = req.body;

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

		if (
			typeof totalMoves !== 'number' ||
			typeof cellsTravelled !== 'number' ||
			totalMoves < 0 ||
			cellsTravelled < 0
		) {
			res.status(400).json({
				status: 'error',
				message: 'Invalid score data',
			});
			return;
		}

		// Redis keys
		const userKey = `user:${userId}`;
		const leaderboardKey = `leaderboard:${postId}`;
		const statsKey = `user:${userId}:stats:${postId}`;

		// Create or update user data
		await redis.hSet(userKey, {
			username: username || 'Anonymous',
			avatar: snoovatar || 'none',
		});

		// Score calculation (higher is better - fewer moves/cells = higher score)
		const compositeScore = (1 / totalMoves) * 100000 + (1 / cellsTravelled) * 100;

		// Get previous score from leaderboard
		const previousScoreStr = await redis.zScore(leaderboardKey, userId);
		const previousScore = previousScoreStr ? Number(previousScoreStr) : null;

		// Only update if new score is better (or if no previous score exists)
		let accepted = false;
		if (previousScore === null || compositeScore > previousScore) {
			accepted = true;

			// Update leaderboard
			await redis.zAdd(leaderboardKey, {
				score: compositeScore,
				member: userId,
			});

			// Update leaderboard-specific stats for display
			await redis.hSet(statsKey, {
				totalMoves: totalMoves.toString(),
				cellsTravelled: cellsTravelled.toString(),
			});
		}

		res.json({
			status: 'success',
			accepted,
		});
	} catch (error) {
		let errorMessage = 'Unknown error submitting score';
		if (error instanceof Error) {
			errorMessage = `Failed to submit score: ${error.message}`;
		}
		res.status(500).json({ status: 'error', message: errorMessage });
	}
});

export default router;
