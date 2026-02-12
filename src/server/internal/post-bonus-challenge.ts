import { Router } from 'express';
import { context, reddit, redis } from '@devvit/web/server';
import { getDailySeedFromDate } from '../utils/daily-seed';

const router = Router();

/**
 * Generate a random date from the past (within the last 5 years)
 * This ensures we get different bonus challenges each time
 */
function getRandomPastDate(): Date {
	const now = new Date();
	const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
	const randomTime =
		fiveYearsAgo.getTime() + Math.random() * (now.getTime() - fiveYearsAgo.getTime());
	return new Date(randomTime);
}

/**
 * POST /internal/menu/bonus-challenge-create
 * Called from the subreddit menu to create a bonus challenge post
 * Uses a random past date to generate unique challenges
 */
router.post('/internal/menu/bonus-challenge-create', async (_req, res): Promise<void> => {
	try {
		const { subredditName } = context;

		if (!subredditName) {
			throw new Error('subredditName is required');
		}

		// Generate a random past date for the bonus challenge (for variety)
		const randomDate = getRandomPastDate();
		const bonusSeed = getDailySeedFromDate(randomDate);

		// Get and increment the bonus challenge counter
		const bonusNumber = await redis.incrBy('bonus-challenge:counter', 1);

		// Create the post
		const post = await reddit.submitCustomPost({
			subredditName: subredditName,
			title: `Coin Flick - Bonus Challenge #${bonusNumber}`,
			entry: 'default',
		});

		// Store the bonus seed in Redis using the post ID
		const bonusSeedKey = `post:${post.id}:bonusSeed`;
		await redis.set(bonusSeedKey, bonusSeed.toString());

		console.log('[BONUS-CHALLENGE] Post created with ID:', post.id);
		console.log('[BONUS-CHALLENGE] Stored bonus seed in Redis:', bonusSeedKey);

		res.json({
			navigateTo: `https://reddit.com/r/${subredditName}/comments/${post.id}`,
		});
	} catch (error) {
		console.error(`Error creating bonus challenge post:`, error);
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
