import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis, realtime } from '@devvit/web/server';

const router = Router();

router.get('/api/user-data', async (req: Request, res: Response): Promise<void> => {
	const { userId, postId } = context;

	if (!userId) {
		res.status(400).json({
			status: 'error',
			message: 'User must be logged in',
		});
		return;
	}

	try {
		const balance = await redis.get(`wallet:${userId}`);
		const allChallenges = await redis.hGetAll(`challenge:${userId}:${postId}`);

		res.json({
			status: 'success',
			balance: balance || '0',
			allChallenges,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: 'error',
			message: 'Failed to get user balance',
		});
	}
});

export default router;
