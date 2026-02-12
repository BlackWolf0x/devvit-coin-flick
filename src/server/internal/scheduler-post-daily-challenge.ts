import { Router } from 'express';
import { context, scheduler } from '@devvit/web/server';
import { createDailyChallengePost } from '../utils/create-daily-challenge';

const router = Router();

/**
 * POST /internal/scheduler/post-daily-challenge
 * Scheduled task that runs daily at midnight UTC to create a new daily challenge post
 * Cron: "0 0 * * *" (every day at 00:00 UTC)
 */
router.post('/internal/scheduler/post-daily-challenge', async (_req, res): Promise<void> => {
	try {
		console.log('[SCHEDULER] Starting daily challenge post creation...');

		const post = await createDailyChallengePost();

		console.log(
			`[SCHEDULER] Successfully created daily challenge post in r/${context.subredditName} with id ${post.id}`
		);

		res.json({
			status: 'success',
			message: `Daily challenge post created with id ${post.id}`,
		});
	} catch (error) {
		console.error('[SCHEDULER] Error creating daily challenge post:', error);
		const errorMessage = error instanceof Error ? error.message : 'Failed to create post';

		// Schedule a retry in 1 hour (first attempt)
		try {
			const retryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
			await scheduler.runJob({
				name: 'retry-daily-challenge',
				data: { attempt: 1, originalError: errorMessage },
				runAt: retryTime,
			});

			console.log(`[SCHEDULER] Scheduled retry attempt 1 at ${retryTime.toISOString()}`);
		} catch (scheduleError) {
			console.error('[SCHEDULER] Failed to schedule retry:', scheduleError);
		}

		res.status(500).json({
			status: 'error',
			message: errorMessage,
		});
	}
});

export default router;
