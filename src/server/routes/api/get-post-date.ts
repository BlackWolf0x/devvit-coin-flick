import { Router } from "express";
import { context, reddit } from "@devvit/web/server";

const router = Router();

/**
 * GET /api/get-post-date
 * Get the creation date of the current Reddit post
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

		// Return the post creation date
		res.json({
			status: "success",
			postId: postId,
			createdAt: post.createdAt.toISOString(),
			createdAtTimestamp: post.createdAt.getTime(),
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
