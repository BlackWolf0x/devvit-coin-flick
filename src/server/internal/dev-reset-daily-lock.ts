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
		console.log('[DEV RESET] Resetting daily challenge lock...');

		// Get current values before reset
		const lastPostedDate = await redis.get('daily-challenge:last-posted-date');
		const currentCounter = await redis.get('challenge:counter');

		// Clear the daily post lock
		await redis.del('daily-challenge:last-posted-date');

		console.log('[DEV RESET] Reset complete');
		console.log(`[DEV RESET] Previous last posted date: ${lastPostedDate ?? 'none'}`);
		console.log(`[DEV RESET] Current challenge counter: ${currentCounter ?? '0'}`);

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
