import { Router } from 'express';
import { context } from '@devvit/web/server';
import { createLevelCreatorPost } from '../../core/post';

const router = Router();

/**
 * POST /internal/menu/level-creator-create
 * Called from the subreddit menu to create a new level creator post
 */
router.post('/internal/menu/level-creator-create', async (_req, res): Promise<void> => {
	try {
		const post = await createLevelCreatorPost();

		res.json({
			navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
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
