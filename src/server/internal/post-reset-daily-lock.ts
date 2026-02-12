import { Router } from 'express';
import { redis } from '@devvit/web/server';

const router = Router();

/**
 * POST /internal/menu/dev-reset-daily-lock
 * Developer tool to reset the daily challenge lock for testing
 * This allows posting multiple daily challenges in the same day during development
 */
router.post('/internal/menu/dev-reset-daily-lock', async (_req, res): Promise<void> => {
	try {
		// Get current counter before reset
		const currentCounter = await redis.get('challenge:counter');

		// Clear the daily post lock
		await redis.del('daily-challenge:last-posted-date');

		res.json({
			showToast: {
				text: `Daily lock reset! You can now post again. (Counter at #${
					currentCounter ?? '0'
				})`,
				appearance: 'success',
			},
		});
	} catch (error) {
		console.error('[DEV RESET] Error resetting daily lock:', error);
		const errorMessage = error instanceof Error ? error.message : 'Failed to reset lock';

		res.json({
			showToast: {
				text: `Reset failed: ${errorMessage}`,
				appearance: 'neutral',
			},
		});
	}
});

export default router;
