import { Video } from "../models/Video.model.js";

// Video ownership middleware
export const checkVideoOwnership = async (req, res, next) => {
	try {
		const video = await Video.findById(req.params.id);

		if (!video) {
			return res.status(404).json({
				success: false,
				error: "Video not found",
				message: "No video exists with the provided ID",
			});
		}

		if (video.uploader.toString() !== req.userId) {
			return res.status(403).json({
				success: false,
				error: "Access denied",
				message: "You are not authorized to modify this video",
			});
		}

		// Attach video to request for controller to use
		req.video = video;
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: "Server error",
			message: "Error checking video ownership",
		});
	}
};

// Channel ownership middleware
export const checkChannelOwnership = async (req, res, next) => {
	try {
		const channel = await Channel.findById(req.params.id);

		if (!channel) {
			return res.status(404).json({
				success: false,
				error: "Channel not found",
				message: "No channel exists with the provided ID",
			});
		}

		if (channel.owner.toString() !== req.userId) {
			return res.status(403).json({
				success: false,
				error: "Access denied",
				message: "You are not authorized to modify this channel",
			});
		}

		// Attach channel to request for controller to use
		req.channel = channel;
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: "Server error",
			message: "Error checking channel ownership",
		});
	}
};
