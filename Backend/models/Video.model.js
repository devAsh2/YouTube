import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		thumbnailUrl: {
			type: String,
			required: true,
		},
		videoUrl: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			trim: true,
			maxlength: 5000,
		},
		channelId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Channel",
			required: true,
		},
		uploader: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		views: {
			type: Number,
			default: 0,
		},
		likes: {
			type: Number,
			default: 0,
		},
		dislikes: {
			type: Number,
			default: 0,
		},
		likedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		dislikedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
				default: [],
			},
		],
		category: {
			type: String,
			enum: [
				"Education",
				"Entertainment",
				"Gaming",
				"Music",
				"Sports",
				"News",
				"Technology",
				"Other",
			],
			default: "Entertainment",
		},
	},
	{
		timestamps: true,
	},
);

export const Video = mongoose.model("Video", videoSchema);
