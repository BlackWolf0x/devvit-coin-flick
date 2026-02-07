import { Router } from "express";
import { context, reddit } from "@devvit/web/server";
import { InitResponse } from "../../../shared/types/api";

const router = Router();

/**
 * GET /api/init
 * Initialize the app with user and post information
 */
router.get<
	{ postId: string },
	InitResponse | { status: string; message: string }
>("/api/init", async (_req, res): Promise<void> => {
	const { postId } = context;

	if (!postId) {
		console.error("API Init Error: postId not found in devvit context");
		res.status(400).json({
			status: "error",
			message: "postId is required but missing from context",
		});
		return;
	}

	try {
		const username = await reddit.getCurrentUsername();

		res.json({
			type: "init",
			postId: postId,
			username: username ?? "anonymous",
		});
	} catch (error) {
		console.error(`API Init Error for post ${postId}:`, error);
		let errorMessage = "Unknown error during initialization";
		if (error instanceof Error) {
			errorMessage = `Initialization failed: ${error.message}`;
		}
		res.status(400).json({ status: "error", message: errorMessage });
	}
});

export default router;
