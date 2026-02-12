import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis } from '@devvit/web/server';

const router = Router();

/**
 * GET /api/leaderboard
 * Get top scores from leaderboard
 */
router.get('/api/leaderboard', async (_req: Request, res: Response): Promise<void> => {
	try {
		const { postId } = context;

		if (!postId) {
			res.status(400).json({
				status: 'error',
				message: 'Unable to find postId',
			});
			return;
		}

		const limit = 5;
		const leaderboardKey = `leaderboard:${postId}`;

		// Fetch top 5 users with lowest times (scores)
		// zRange returns entries in ascending order by score (lowest first)
		const entries = await redis.zRange(leaderboardKey, 0, limit - 1);

		// If no entries, return empty array
		if (!entries || entries.length === 0) {
			console.log('[LEADERBOARD] No entries found');
			res.json([]);
			return;
		}

		// Sort entries by score ascending (lowest time first) to ensure correct order
		const sortedEntries = [...entries].sort((a, b) => a.score - b.score);

		// Fetch user metadata in parallel
		const leaderboard = await Promise.all(
			sortedEntries.map(async (entry, index) => {
				const userId = entry.member;
				const userKey = `user:${userId}`;

				const userMeta = await redis.hGetAll(userKey);

				return {
					rank: index + 1,
					userId,
					username: userMeta.username ?? null,
					snoovatar: userMeta.avatar ?? null,
					score: entry.score,
				};
			})
		);

		res.json(leaderboard);
	} catch (error) {
		console.error('Leaderboard Error:', error);
		let errorMessage = 'Unknown error fetching leaderboard';
		if (error instanceof Error) {
			errorMessage = `Failed to fetch leaderboard: ${error.message}`;
		}
		res.status(500).json({ status: 'error', message: errorMessage });
	}
});

export default router;
