import type { Request, Response } from 'express';
import { Router } from 'express';
import { context, redis, realtime } from '@devvit/web/server';
import { ADMIN_USERS } from '../../shared/config';

const router = Router();

/**
 * POST /api/admin/give-currency
 * Admin endpoint to give currency to any user
 */
router.post('/api/admin/give-currency', async (req: Request, res: Response): Promise<void> => {
	// try {
	// 	const { userId } = context;
	// 	let { targetUserId, amount } = req.body;
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
	// 	if (!amount || typeof amount !== 'number' || amount <= 0) {
	// 		res.status(400).json({
	// 			status: 'error',
	// 			message: 'Valid positive amount is required',
	// 		});
	// 		return;
	// 	}
	// 	// Add currency to target user's wallet
	// 	const walletKey = `wallet:${targetUserId}`;
	// 	const newBalance = await redis.incrBy(walletKey, amount);
	// 	// Send real-time update to target user's wallet channel
	// 	await realtime.send(`wallet_${targetUserId}`, {
	// 		type: 'balance-update',
	// 		balance: newBalance,
	// 		timestamp: Date.now(),
	// 	});
	// 	res.json({
	// 		status: 'success',
	// 		targetUserId,
	// 		amount,
	// 		newBalance,
	// 	});
	// } catch (error) {
	// 	let errorMessage = 'Unknown error giving currency';
	// 	if (error instanceof Error) {
	// 		errorMessage = `Failed to give currency: ${error.message}`;
	// 	}
	// 	res.status(500).json({ status: 'error', message: errorMessage });
	// }
});

export default router;
