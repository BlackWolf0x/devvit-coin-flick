import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, realtime, redis } from '@devvit/web/server';

const router = Router();

type ChallengeId = 'completion' | 'under60s' | 'under30s';

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

		// Check challenges
		const challengeKey = `challenge:${userId}:${postId}`;
		let totalReward = 0;

		// Get challenges status
		const allChallenges = await redis.hGetAll(challengeKey);
		let dailyCompletion = allChallenges['completion'] === 'true';
		let dailyUnder60s = allChallenges['under60s'] === 'true';
		let dailyUnder30s = allChallenges['under30s'] === 'true';
		let challengesCompleted: ChallengeId[] = [];

		if (!dailyCompletion) {
			totalReward += 10; // Reward for completion
			dailyCompletion = true;
			challengesCompleted.push('completion');
		}

		if (!dailyUnder60s && completionTime < 60000) {
			totalReward += 10; // Reward for under 60 seconds
			dailyUnder60s = true;
			challengesCompleted.push('under60s');
		}

		if (!dailyUnder30s && completionTime < 30000) {
			totalReward += 10; // Reward for under 30 seconds
			dailyUnder30s = true;
			challengesCompleted.push('under30s');
		}

		// Update challenges status
		await redis.hSet(challengeKey, {
			completion: dailyCompletion.toString(),
			under60s: dailyUnder60s.toString(),
			under30s: dailyUnder30s.toString(),
		});

		// In case challenges completed
		if (totalReward > 0) {
			// Update balance
			const walletKey = `wallet:${userId}`;
			const newBalance = await redis.incrBy(walletKey, totalReward);

			// Send notice realtime
			await realtime.send(`challenges_${userId}_${postId}`, {
				type: 'challenge-update',
				challenges: challengesCompleted,
				newBalance
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
