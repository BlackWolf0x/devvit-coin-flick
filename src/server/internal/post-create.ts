import { Router } from 'express';
import { context } from '@devvit/web/server';
import { createDailyChallengePost } from '../core/post';

const router = Router();

/**
 * POST /internal/menu/daily-challenge-create
 * Called from the subreddit menu to create a new daily challenge post
 */
router.post('/internal/menu/daily-challenge-create', async (_req, res): Promise<void> => {
	try {
		const post = await createDailyChallengePost();

		res.json({
			navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
		});
	} catch (error) {
		console.error(`Error creating daily challenge post:`, error);
		const errorMessage = error instanceof Error ? error.message : 'Failed to create post';

		// Return a toast notification for better UX
		res.json({
			showToast: {
				text: errorMessage,
				appearance: 'neutral',
			},
		});
	}
});

export default router;
