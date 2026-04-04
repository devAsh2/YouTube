import {
	createComment,
	deleteComment,
	fetchComments,
	updateComment,
} from "../controllers/comment.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { checkCommentOwnership } from "../middleware/ownership.middleware.js";

export function commentRoutes(app) {
	// Get comments for a specific video
	app.get("/api/comments/:videoId", fetchComments);
	// Create a new comment
	app.post("/api/comments", authenticateToken, createComment);
	// Update a comment
	app.put(
		"/api/comments/:id",
		authenticateToken,
		checkCommentOwnership,
		updateComment,
	);
	// Delete a comment
	app.delete(
		"/api/comments/:id",
		authenticateToken,
		checkCommentOwnership,
		deleteComment,
	);
}
