import { Channel } from "../models/Channel.model.js";
import { Video } from "../models/Video.model.js";
import { User } from "../models/User.model.js";
import { handleDatabaseError } from "../middleware/validation.middleware.js";

export const createChannel = async (req, res) => {
	try {
		const { channelName, description, channelBanner } = req.body;

		const channel = await Channel.create({
			channelName,
			description,
			channelBanner,
			owner: req.userId,
		});

		// Push channel to user's channels array
		await User.findByIdAndUpdate(req.userId, {
			$push: { channels: channel._id },
		});

		return res.status(201).json({
			success: true,
			message: "Channel created successfully",
			createdChannel: channel,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

export const fetchChannels = async (req, res) => {
	try {
		const channels = await Channel.find({});
		return res.status(200).json({
			success: true,
			message: "Channels fetched successfully",
			fetchedChannels: channels,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

export const fetchChannel = async (req, res) => {
	try {
		const channelId = req.params.id;
		const channel = await Channel.findById(channelId).populate(
			"owner",
			"username avatar",
		);
		if (!channel) {
			return res
				.status(404)
				.json({ success: false, error: "Channel not found" });
		}
		return res.status(200).json({
			success: true,
			message: "Channel fetched successfully",
			fetchedChannel: channel,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

export const updateChannel = async (req, res) => {
	try {
		// Ownership and existence already checked by middleware
		// Channel is available as req.channel
		const channelId = req.params.id;
		const updatedChannel = await Channel.findByIdAndUpdate(
			channelId,
			req.body,
			{ returnDocument: "after", runValidators: true },
		);

		console.log("Updated channel successfully:", updatedChannel);

		res.status(200).json({
			success: true,
			message: "Channel updated successfully",
			updatedChannel: updatedChannel,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

export const deleteChannel = async (req, res) => {
	try {
		// Ownership and existence already checked by middleware
		// Channel is available as req.channel
		const channelId = req.params.id;
		const deletedChannel = await Channel.findByIdAndDelete(channelId);
		console.log("Deleted channel successfully");

		res.status(200).json({
			success: true,
			message: "Channel deleted successfully",
			deletedChannel: deletedChannel,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

//Controller to get channel videos
export const getChannelVideos = async (req, res) => {
	try {
		const channelId = req.params.channelId;
		const videos = await Video.find({ channelId })
			.populate("channelId", "channelName")
			.sort({ createdAt: -1 });
		return res.status(200).json({
			success: true,
			message: "Channel videos fetched successfully",
			videos: videos,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};
