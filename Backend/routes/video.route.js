import {
	deleteVideo,
	dislikeVideo,
	fetchVideo,
	fetchVideos,
	filterVidoesByCategory,
	incrementView,
	likeVideo,
	searchVideos,
	updateVideo,
	uploadVideo,
} from "../controllers/video.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
	handleSearchValidation,
	handleVideoValidation,
} from "../middleware/validation.middleware.js";
import { checkVideoOwnership } from "../middleware/ownership.middleware.js";

export function videoRoutes(app) {
	// Get all videos
	app.get("/api/videos", authenticateToken, fetchVideos);
	// Get a specific video
	app.get("/api/videos/:id", authenticateToken, fetchVideo);
	// Post a video
	app.post(
		"/api/videos",
		authenticateToken,
		handleVideoValidation,
		uploadVideo,
	);
	// Update a video
	app.put(
		"/api/videos/:id",
		authenticateToken,
		checkVideoOwnership,
		updateVideo,
	);
	// Delete a video
	app.delete(
		"/api/videos/:id",
		authenticateToken,
		checkVideoOwnership,
		deleteVideo,
	);
	// Search video route by title
	app.get(
		"/api/videos/search",
		authenticateToken,
		handleSearchValidation,
		searchVideos,
	);
	// Filter videos by category
	app.get(
		"/api/videos/category/:category",
		authenticateToken,
		filterVidoesByCategory,
	);
	// video like and dislike routes:
	app.post("/api/videos/:id/like", authenticateToken, likeVideo);
	app.post("/api/videos/:id/dislike", authenticateToken, dislikeVideo);
	// video view increment route:
	app.post("/api/videos/:id/view", authenticateToken, incrementView);
}
