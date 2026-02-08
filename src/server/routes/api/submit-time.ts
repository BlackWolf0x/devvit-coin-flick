import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis } from '@devvit/web/server';

const router = Router();

/**
 * POST /api/submit-time
 * Submit user completion time to leaderboard
 */
router.post('/api/submit-time', async (req: Request, res: Response): Promise<void> => {
	try {
		const { postId, userId, username, snoovatar } = context;
		const { completionTime } = req.body;

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
			typeof completionTime !== 'number' ||
			completionTime < 0
		) {
			res.status(400).json({
				status: 'error',
				message: 'Invalid time data',
			});
			return;
		}

		// Redis keys
		const userKey = `user:${userId}`;
		const leaderboardKey = `leaderboard:${postId}`;

		// Create or update user data
		await redis.hSet(userKey, {
			username: username || 'Anonymous',
			avatar: snoovatar || 'none',
		});

		// Get previous time from leaderboard
		const previousTimeStr = await redis.zScore(leaderboardKey, userId);
		const previousTime = previousTimeStr ? Number(previousTimeStr) : null;

		// Only update if new time is better (lower) or if no previous time exists
		let accepted = false;
		if (previousTime === null || completionTime < previousTime) {
			accepted = true;

			// Update leaderboard (lower time is better)
			await redis.zAdd(leaderboardKey, {
				score: completionTime,
				member: userId,
			});
		}

		res.json({
			status: 'success',
			accepted,
		});
	} catch (error) {
		let errorMessage = 'Unknown error submitting time';
		if (error instanceof Error) {
			errorMessage = `Failed to submit time: ${error.message}`;
		}
		res.status(500).json({ status: 'error', message: errorMessage });
	}
});

export default router;
