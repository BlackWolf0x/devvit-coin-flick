import { Router } from 'express';
import { context, reddit } from '@devvit/web/server';

const router = Router();

/**
 * POST /internal/menu/level-creator-create
 * Called from the subreddit menu to create a new level creator post
 */
router.post('/internal/menu/level-creator-create', async (_req, res): Promise<void> => {
	try {
		const { subredditName } = context;

		if (!subredditName) {
			throw new Error('subredditName is required');
		}

		const post = await reddit.submitCustomPost({
			subredditName: subredditName,
			title: 'Create Your Own Sweep Chess Level',
			entry: 'creator',
			postData: {
				type: 'creator',
				// Add any initial creator data here
			},
		});

		res.json({
			navigateTo: `https://reddit.com/r/${subredditName}/comments/${post.id}`,
		});
	} catch (error) {
		console.error(`Error creating level creator post:`, error);
		const errorMessage =
			error instanceof Error ? error.message : 'Failed to create level creator post';

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
