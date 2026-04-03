import { Comment } from "../models/Comment.model.js";
import { handleDatabaseError } from "../middleware/validation.middleware.js";

export const createComment = async (req, res) => {
	try {
		const { description, video } = req.body;

		const comment = await Comment.create({
			description,
			video,
			author: req.userId,
		});

		return res.status(201).json({
			success: true,
			message: "Comment created successfully",
			createdComment: comment,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

export const fetchComments = async (req, res) => {
	try {
		const videoId = req.params.videoId;
		const comments = await Comment.find({ video: videoId })
			.populate("author", "username avatar")
			.sort({ createdAt: -1 });
		return res.status(200).json({
			success: true,
			message: "Comments fetched successfully",
			fetchedComments: comments,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

export const updateComment = async (req, res) => {
	try {
		// Ownership and existence already checked by middleware
		// Comment is available as req.comment
		const updatedComment = await Comment.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true },
		);

		console.log("Updated comment successfully");

		res.status(200).json({
			success: true,
			message: "Comment updated successfully",
			updatedComment: updatedComment,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

export const deleteComment = async (req, res) => {
	try {
		// Ownership and existence already checked by middleware
		// Comment is available as req.comment
		const deletedComment = await Comment.findByIdAndDelete(req.params.id);
		console.log("Deleted comment successfully");

		res.status(200).json({
			success: true,
			message: "Comment deleted successfully",
			deletedComment: deletedComment,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};
