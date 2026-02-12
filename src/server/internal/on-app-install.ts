import { Router } from 'express';
import { context } from '@devvit/web/server';
import { createDailyChallengePost } from '../core/post';

const router = Router();

/**
 * POST /internal/on-app-install
 * Called when the app is installed - creates an initial daily challenge post
 */
router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
	try {
		const post = await createDailyChallengePost();

		res.json({
			status: 'success',
			message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
		});
	} catch (error) {
		console.error(`Error creating post on app install:`, error);
		const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
		res.status(400).json({
			status: 'error',
			message: errorMessage,
		});
	}
});

export default router;
