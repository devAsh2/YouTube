import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
			trim: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		video: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Video",
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
); // adds createdAt and updatedAt automatically

export const Comment = mongoose.model("Comment", commentSchema);
