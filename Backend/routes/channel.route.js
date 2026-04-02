import {
	createChannel,
	deleteChannel,
	fetchChannel,
	fetchChannels,
	getChannelVideos,
	updateChannel,
} from "../controllers/channel.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { checkChannelOwnership } from "../middleware/ownership.middleware.js";

export function channelRoutes(app) {
	// Get all channels
	app.get("/api/channels", authenticateToken, fetchChannels);
	// Get a specific channel
	app.get("/api/channels/:id", authenticateToken, fetchChannel);
	// Create a new channel
	app.post("/api/channels", authenticateToken, createChannel);
	// Update a channel
	app.put(
		"/api/channels/:id",
		authenticateToken,
		checkChannelOwnership,
		updateChannel,
	);
	// Delete a channel
	app.delete(
		"/api/channels/:id",
		authenticateToken,
		checkChannelOwnership,
		deleteChannel,
	);
	// get channel videos
	app.get(
		"/api/channels/:channelId/videos",
		authenticateToken,
		getChannelVideos,
	);
}
