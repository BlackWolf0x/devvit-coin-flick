import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis, realtime } from '@devvit/web/server';
import { ADMIN_USERS } from '../../shared/config';

const router = Router();

/**
 * POST /api/admin/clear-collection
 * Admin endpoint to clear a user's coin collection
 */
router.post('/api/admin/clear-collection', async (req: Request, res: Response): Promise<void> => {
	// try {
	// 	const { userId } = context;
	// 	let { targetUserId } = req.body;
	// 	// Check if requester is admin
	// 	if (!userId || !ADMIN_USERS.includes(userId)) {
	// 		res.status(403).json({
	// 			status: 'error',
	// 			message: 'Unauthorized: Admin access required',
	// 		});
	// 		return;
	// 	}
	// 	// Default to current user if no target specified
	// 	if (!targetUserId) {
	// 		targetUserId = userId;
	// 	}
	// 	// Clear the user's collection
	// 	const userCollectionKey = `collection:${targetUserId}`;
	// 	await redis.del(userCollectionKey);
	// 	// Clear active coin
	// 	const activeCoinKey = `activecoin:${targetUserId}`;
	// 	await redis.del(activeCoinKey);
	// 	// Send real-time update to target user's wallet channel
	// 	await realtime.send(`wallet_${targetUserId}`, {
	// 		type: 'balance-update',
	// 		balance: await redis
	// 			.get(`wallet:${targetUserId}`)
	// 			.then((val) => parseInt(val || '0', 10)),
	// 		uniqueCoins: 0,
	// 		timestamp: Date.now(),
	// 	});
	// 	// Send active coin update
	// 	await realtime.send(`wallet_${targetUserId}`, {
	// 		type: 'active-coin-update',
	// 		activeCoin: null,
	// 		timestamp: Date.now(),
	// 	});
	// 	res.json({
	// 		status: 'success',
	// 		targetUserId,
	// 		message: 'Collection cleared successfully',
	// 	});
	// } catch (error) {
	// 	let errorMessage = 'Unknown error clearing collection';
	// 	if (error instanceof Error) {
	// 		errorMessage = `Failed to clear collection: ${error.message}`;
	// 	}
	// 	res.status(500).json({ status: 'error', message: errorMessage });
	// }
});

export default router;
