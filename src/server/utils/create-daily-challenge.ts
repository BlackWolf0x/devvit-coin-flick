import { context, reddit, redis } from '@devvit/web/server';
import { getDailySeedFromDate } from './daily-seed';

/**
 * Create a daily challenge post
 * Checks if a post was already created today and increments the challenge counter
 */
export const createDailyChallengePost = async () => {
	const { subredditName } = context;

	if (!subredditName) {
		throw new Error('subredditName is required');
	}

	// Check if we already posted today
	const todaySeed = getDailySeedFromDate();
	const lastPostedSeed = await redis.get('daily-challenge:last-posted-date');

	if (lastPostedSeed === todaySeed.toString()) {
		throw new Error(
			'Daily challenge already posted for today. Please wait until tomorrow (UTC).'
		);
	}

	// Get and increment the challenge counter
	const challengeNumber = await redis.incrBy('challenge:counter', 1);

	// Create the post
	const post = await reddit.submitCustomPost({
		subredditName: subredditName,
		title: `Coin Flick - Daily Challenge #${challengeNumber}`,
		entry: 'default',
	});

	// Store today's date to prevent duplicate posts
	await redis.set('daily-challenge:last-posted-date', todaySeed.toString());

	return post;
};
