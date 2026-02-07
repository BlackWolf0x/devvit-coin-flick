import { Router } from "express";
import { context } from "@devvit/web/server";

const router = Router();

/**
 * GET /api/board-data
 * Get the board data for the current post
 */
router.get("/api/board-data", async (_req, res): Promise<void> => {
	const { postId, postData } = context;

	if (!postId) {
		console.error("API Board Data Error: postId not found in devvit context");
		res.status(400).json({
			status: "error",
			message: "postId is required but missing from context",
		});
		return;
	}

	try {
		// Return the board data from postData
		res.json({
			status: "success",
			postId: postId,
			board: postData?.board || [],
			gameId: postData?.gameId || null,
		});
	} catch (error) {
		console.error(`API Board Data Error for post ${postId}:`, error);
		let errorMessage = "Unknown error fetching board data";
		if (error instanceof Error) {
			errorMessage = `Failed to fetch board data: ${error.message}`;
		}
		res.status(400).json({ status: "error", message: errorMessage });
	}
});

export default router;
