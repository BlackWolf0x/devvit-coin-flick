import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis } from '@devvit/web/server';

const router = Router();

/**
 * GET /api/top-player
 * Get the top player (best score) for this post
 */
router.get('/api/top-player', async (_req, res: Response): Promise<void> => {
	try {
		const { postId } = context;

		if (!postId) {
			res.status(400).json({
				status: 'error',
				message: 'Unable to find postId',
			});
			return;
		}

		const leaderboardKey = `leaderboard:${postId}`;

		// Fetch the top player (highest score is at the end when sorted ascending)
		const entries = await redis.zRange(leaderboardKey, -1, -1);

		// If no entries, return null
		if (!entries || entries.length === 0) {
			res.json({
				status: 'success',
				topPlayer: null,
			});
			return;
		}

		// Get the top entry (highest score)
		const topEntry = entries[0];
		if (!topEntry) {
			res.json({
				status: 'success',
				topPlayer: null,
			});
			return;
		}

		const userId = topEntry.member;

		// Fetch user metadata and stats
		const userKey = `user:${userId}`;
		const statsKey = `user:${userId}:stats:${postId}`;

		const [userMeta, userStats] = await Promise.all([
			redis.hGetAll(userKey),
			redis.hGetAll(statsKey),
		]);

		const topPlayer = {
			username: userMeta.username ?? 'Anonymous',
			totalMoves: userStats.totalMoves ? Number(userStats.totalMoves) : null,
			cellsTravelled: userStats.cellsTravelled ? Number(userStats.cellsTravelled) : null,
		};

		res.json({
			status: 'success',
			topPlayer,
		});
	} catch (error) {
		console.error('Top Player Error:', error);
		let errorMessage = 'Unknown error fetching top player';
		if (error instanceof Error) {
			errorMessage = `Failed to fetch top player: ${error.message}`;
		}
		res.status(500).json({ status: 'error', message: errorMessage });
	}
});

export default router;
