import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis } from '@devvit/web/server';

const router = Router();

router.post('/api/reward', async (req: Request, res: Response): Promise<void> => {
	const { userId } = context;
	const amount = 10;

	if (!userId) {
		res.status(400).json({
			status: 'error',
			message: 'User must be logged in',
		});
		return;
	}

	try {
		const walletKey = `wallet:${userId}`;
		const newBalance = await redis.incrBy(walletKey, amount);
		console.log('🤑 new balance: ', newBalance);

		res.json({
			status: 'success',
			rewarded: amount,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: 'error',
			message: 'Failed to update wallet',
		});
	}
});

export default router;
