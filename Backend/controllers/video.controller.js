import { handleDatabaseError } from "../middleware/validation.middleware.js";
import { Video } from "../models/Video.model.js";

//Function to post a video
export const uploadVideo = async (req, res) => {
	try {
		const { title, description, thumbnailUrl, videoUrl, channelId, category } =
			req.body;

		// Create a video document in the database
		const video = await Video.create({
			title,
			description,
			thumbnailUrl,
			videoUrl,
			channelId,
			category,
			uploader: req.userId,
		});

		// Update channel's videos array to include this video
		await Channel.findByIdAndUpdate(
			channelId,
			{ $push: { videos: video._id } },
			{ new: true, runValidators: true },
		);

		return res.status(201).json({
			success: true,
			message: "Video uploaded successfully",
			uploadedVideo: video,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};
// Function to fetch all videos
export const fetchVideos = async (req, res) => {
	try {
		const videos = await Video.find({})
			.populate("channelId", "channelName") // Populate channel name from Channel model
			.populate("uploader", "username"); // Populate username from User model
		return res.status(200).json({
			success: true,
			message: "Videos fetched successfully",
			fetchedVideos: videos,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

// Function to fetch a single video
export const fetchVideo = async (req, res) => {
	try {
		const videoId = req.params.id;
		const video = await Video.findById(videoId)
			.populate("channelId", "channelName") // Populate channel name from Channel model
			.populate("uploader", "username"); // Populate username from User model
		return res.status(200).json({
			success: true,
			message: "Video fetched successfully",
			fetchedVideo: video,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};
// Function to update a video
export const updateVideo = async (req, res) => {
	try {
		// Ownership and existence already checked by middleware
		// Update the video
		const videoId = req.params.id;
		const updatedVideo = await Video.findByIdAndUpdate(videoId, req.body, {
			new: true,
			runValidators: true,
		});

		console.log("Updated video successfully:", updatedVideo.title);

		res.status(200).json({
			success: true,
			message: "Video updated successfully",
			updatedVideo: updatedVideo,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

export const deleteVideo = async (req, res) => {
	try {
		// Ownership and existence already checked by middleware
		// Video is available as req.video
		const deletedVideo = await Video.findByIdAndDelete(req.params.id);
		console.log("Deleted video successfully");

		res.status(200).json({
			success: true,
			message: "Video deleted successfully",
			deletedVideo: deletedVideo,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

//Function to search a video based on title
export const searchVideos = async (req, res) => {
	try {
		const { q } = req.query;
		const videos = await Video.find({
			title: { $regex: q, $options: "i" },
		});
		return res.status(200).json({
			success: true,
			message: `Found ${videos.length} videos for search query: "${q}"`,
			searchedVideos: videos,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

//Function to filter videos based on category
export const filterVidoesByCategory = async (req, res) => {
	try {
		const category = req.params.category;

		const videos = await Video.find({ category });
		return res.status(200).json({
			success: true,
			message: `Found ${videos.length} videos in ${category} category`,
			videos: videos,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

// LIke and dislike functionality
export const likeVideo = async (req, res) => {
	try {
		const videoId = req.params.id;
		const video = await Video.findByIdAndUpdate(
			videoId,
			{
				$inc: { likes: 1 },
			},
			{ new: true },
		);
		res.status(200).json({
			success: true,
			message: "Video liked successfully",
			video: video,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

export const dislikeVideo = async (req, res) => {
	try {
		const video = await Video.findByIdAndUpdate(
			req.params.id,
			{
				$inc: { dislikes: 1 },
			},
			{ new: true },
		);
		res.status(200).json({
			success: true,
			message: "Video disliked successfully",
			video: video,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

// view increment functionality
export const incrementView = async (req, res) => {
	try {
		const video = await Video.findByIdAndUpdate(
			req.params.id,
			{
				$inc: { views: 1 },
			},
			{ new: true },
		);
		res.status(200).json({
			success: true,
			message: "Video view incremented successfully",
			video: video,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};
