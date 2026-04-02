import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
	{
		channelName: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		description: {
			type: String,
			trim: true,
			maxlength: 1000,
		},
		channelBanner: {
			type: String,
			default: null,
		},
		subscribers: {
			type: Number,
			default: 0,
		},
		videos: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Video",
			},
		],
	},
	{
		timestamps: true,
	},
);

export const Channel = mongoose.model("Channel", channelSchema);
