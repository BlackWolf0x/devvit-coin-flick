import { Router } from "express";
import { context, reddit } from "@devvit/web/server";

const router = Router();

/**
 * Generate a daily seed from a date (same format as board-generator)
 * This ensures consistent levels for posts created on the same day
 */
function getDailySeedFromDate(date: Date): number {
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth() + 1; // 0-indexed
	const day = date.getUTCDate();
	return year * 10000 + month * 100 + day;
}

/**
 * GET /api/get-post-date
 * Get the creation date of the current Reddit post and return a daily seed
 */
router.get("/api/get-post-date", async (_req, res): Promise<void> => {
	const { postId } = context;

	if (!postId) {
		console.error("API Get Post Date Error: postId not found in devvit context");
		res.status(400).json({
			status: "error",
			message: "postId is required but missing from context",
		});
		return;
	}

	try {
		// Fetch the post data from Reddit
		const post = await reddit.getPostById(postId);
		
		if (!post) {
			res.status(404).json({
				status: "error",
				message: "Post not found",
			});
			return;
		}

		// Generate daily seed from post creation date
		const dailySeed = getDailySeedFromDate(post.createdAt);

		// Return the post creation date and daily seed
		res.json({
			status: "success",
			postId: postId,
			createdAt: post.createdAt.toISOString(),
			createdAtTimestamp: post.createdAt.getTime(),
			dailySeed: dailySeed, // Consistent seed for the day the post was created
		});
	} catch (error) {
		console.error(`API Get Post Date Error for post ${postId}:`, error);
		let errorMessage = "Unknown error fetching post date";
		if (error instanceof Error) {
			errorMessage = `Failed to fetch post date: ${error.message}`;
		}
		res.status(400).json({ status: "error", message: errorMessage });
	}
});

export default router;
