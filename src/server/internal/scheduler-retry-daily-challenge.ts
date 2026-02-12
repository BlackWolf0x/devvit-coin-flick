import { Router } from 'express';
import { context, scheduler } from '@devvit/web/server';
import { createDailyChallengePost } from '../core/post';

const router = Router();

// Retry delays in milliseconds: 1 hour, 3 hours, 6 hours
const RETRY_DELAYS = [
	60 * 60 * 1000, // 1 hour
	3 * 60 * 60 * 1000, // 3 hours
	6 * 60 * 60 * 1000, // 6 hours
];

const MAX_RETRIES = 3;

/**
 * POST /internal/scheduler/retry-daily-challenge
 * Retry mechanism for failed daily challenge posts
 * Implements exponential backoff: 1 hour, 3 hours, 6 hours
 */
router.post('/internal/scheduler/retry-daily-challenge', async (req, res): Promise<void> => {
	try {
		const { attempt = 1, originalError = 'Unknown error' } = req.body?.data ?? {};

		console.log(
			`[SCHEDULER RETRY] Attempt ${attempt}/${MAX_RETRIES} to create daily challenge post`
		);

		// Try to create the post
		const post = await createDailyChallengePost();

		console.log(
			`[SCHEDULER RETRY] Success on attempt ${attempt}! Created post in r/${context.subredditName} with id ${post.id}`
		);

		res.json({
			status: 'success',
			message: `Daily challenge post created on retry attempt ${attempt}`,
			postId: post.id,
		});
	} catch (error) {
		console.error(`[SCHEDULER RETRY] Attempt ${req.body?.data?.attempt ?? 1} failed:`, error);
		const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
		const currentAttempt = req.body?.data?.attempt ?? 1;

		// If we haven't exceeded max retries, schedule another attempt
		if (currentAttempt < MAX_RETRIES) {
			try {
				const nextAttempt = currentAttempt + 1;
				const delayIndex = Math.min(currentAttempt, RETRY_DELAYS.length - 1);
				const delay = RETRY_DELAYS[delayIndex]!;
				const retryTime = new Date(Date.now() + delay);

				await scheduler.runJob({
					name: 'retry-daily-challenge',
					data: {
						attempt: nextAttempt,
						originalError: req.body?.data?.originalError ?? errorMessage,
					},
					runAt: retryTime,
				});

				console.log(
					`[SCHEDULER RETRY] Scheduled retry attempt ${nextAttempt} at ${retryTime.toISOString()}`
				);

				res.json({
					status: 'retry_scheduled',
					message: `Retry attempt ${nextAttempt} scheduled`,
					nextAttempt,
					retryAt: retryTime.toISOString(),
				});
			} catch (scheduleError) {
				console.error('[SCHEDULER RETRY] Failed to schedule next retry:', scheduleError);
				res.status(500).json({
					status: 'error',
					message: 'Failed to schedule retry',
				});
			}
		} else {
			// Max retries exceeded - log critical error
			console.error(
				`[SCHEDULER RETRY] CRITICAL: Failed to create daily challenge after ${MAX_RETRIES} attempts. Manual intervention required.`
			);
			console.error(`[SCHEDULER RETRY] Original error: ${req.body?.data?.originalError}`);
			console.error(`[SCHEDULER RETRY] Final error: ${errorMessage}`);

			res.status(500).json({
				status: 'error',
				message: `Failed after ${MAX_RETRIES} retry attempts. Manual intervention required.`,
			});
		}
	}
});

export default router;
