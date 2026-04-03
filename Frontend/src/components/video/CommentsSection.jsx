import { useState, useEffect } from "react";
import { MoreVertical, Pencil, Trash2, LogIn } from "lucide-react";
import { commentAPI } from "../../services/api";
import { useAuth } from "../../hooks/AuthContext";
import { timeAgo } from "../../utils/formatters";
import { Link } from "react-router-dom";

export default function CommentsSection({ videoId }) {
	const { user } = useAuth();
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState("");
	const [menuOpenId, setMenuOpenId] = useState(null);

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const res = await commentAPI.getComments(videoId);
				setComments(res.data.fetchedComments);
			} catch {
				console.error("Failed to load comments");
			} finally {
				setLoading(false);
			}
		};
		fetchComments();
	}, [videoId]);

	const handleAddComment = async () => {
		if (!newComment.trim() || submitting) return;
		setSubmitting(true);
		try {
			const res = await commentAPI.addComment({
				description: newComment.trim(),
				video: videoId,
			});
			const created = res.data.createdComment;
			const withAuthor = {
				...created,
				author: {
					_id: user.id || user._id,
					username: user.username,
					avatar: user.avatar,
				},
			};
			setComments((prev) => [withAuthor, ...prev]);
			setNewComment("");
		} catch {
			console.error("Failed to add comment");
		} finally {
			setSubmitting(false);
		}
	};

	const handleUpdate = async (commentId) => {
		if (!editText.trim()) return;
		try {
			const res = await commentAPI.updateComment(commentId, {
				description: editText.trim(),
			});
			setComments((prev) =>
				prev.map((c) =>
					c._id === commentId
						? { ...c, description: res.data.updatedComment.description }
						: c,
				),
			);
			setEditingId(null);
			setEditText("");
		} catch {
			console.error("Failed to update comment");
		}
	};

	const handleDelete = async (commentId) => {
		try {
			await commentAPI.deleteComment(commentId);
			setComments((prev) => prev.filter((c) => c._id !== commentId));
		} catch {
			console.error("Failed to delete comment");
		}
		setMenuOpenId(null);
	};

	const startEdit = (comment) => {
		setEditingId(comment._id);
		setEditText(comment.description);
		setMenuOpenId(null);
	};

	const isOwner = (comment) => {
		const authorId = comment.author?._id || comment.author;
		const userId = user?.id || user?._id;
		return authorId === userId;
	};

	return (
		<div className="mt-6">
			<h3 className="text-base font-semibold text-gray-900 dark:text-white">
				{comments.length} Comment{comments.length !== 1 ? "s" : ""}
			</h3>

			{/* Add comment / Sign-in prompt */}
			{user ? (
				<div className="mt-4 flex gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
						{user.username?.charAt(0).toUpperCase()}
					</div>
					<div className="flex-1">
						<input
							type="text"
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
							placeholder="Add a comment..."
							className="w-full border-b border-gray-300 bg-transparent py-1 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-gray-900 dark:border-zinc-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-white"
						/>
						<div className="mt-2 flex justify-end gap-2">
							{newComment.trim() && (
								<button
									onClick={() => setNewComment("")}
									className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
								>
									Cancel
								</button>
							)}
							<button
								onClick={handleAddComment}
								disabled={!newComment.trim() || submitting}
								className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{submitting ? "Posting..." : "Comment"}
							</button>
						</div>
					</div>
				</div>
			) : (
				<Link
					to="/auth"
					className="mt-4 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:hover:bg-blue-900/40"
				>
					<LogIn size={20} className="shrink-0 text-blue-500" />
					<div>
						<p className="text-sm font-medium text-blue-700 dark:text-blue-300">
							Sign in to comment
						</p>
						<p className="text-xs text-blue-500 dark:text-blue-400">
							Join the conversation — click to sign in
						</p>
					</div>
				</Link>
			)}

			{/* Comments list */}
			{loading ? (
				<p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
					Loading comments...
				</p>
			) : comments.length === 0 ? (
				<p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
					No comments yet. Be the first!
				</p>
			) : (
				<div className="mt-4 space-y-4">
					{comments.map((comment) => (
						<div key={comment._id} className="flex gap-3">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
								{(comment.author?.username || "U").charAt(0).toUpperCase()}
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<span className="text-[13px] font-medium text-gray-900 dark:text-white">
										@{comment.author?.username || "User"}
									</span>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{timeAgo(comment.createdAt)}
									</span>
								</div>
								{editingId === comment._id ? (
									<div className="mt-1">
										<input
											type="text"
											value={editText}
											onChange={(e) => setEditText(e.target.value)}
											onKeyDown={(e) =>
												e.key === "Enter" && handleUpdate(comment._id)
											}
											className="w-full border-b border-blue-500 bg-transparent py-1 text-sm text-gray-900 outline-none dark:text-white"
											autoFocus
										/>
										<div className="mt-2 flex justify-end gap-2">
											<button
												onClick={() => setEditingId(null)}
												className="rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
											>
												Cancel
											</button>
											<button
												onClick={() => handleUpdate(comment._id)}
												className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
											>
												Save
											</button>
										</div>
									</div>
								) : (
									<p className="mt-0.5 text-sm text-gray-800 dark:text-gray-200">
										{comment.description}
									</p>
								)}
							</div>
							{/* Actions menu for comment owner */}
							{isOwner(comment) && editingId !== comment._id && (
								<div className="relative">
									<button
										onClick={() =>
											setMenuOpenId(
												menuOpenId === comment._id ? null : comment._id,
											)
										}
										className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-800"
									>
										<MoreVertical
											size={16}
											className="text-gray-500 dark:text-gray-400"
										/>
									</button>
									{menuOpenId === comment._id && (
										<div className="absolute right-0 z-10 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
											<button
												onClick={() => startEdit(comment)}
												className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
											>
												<Pencil size={14} /> Edit
											</button>
											<button
												onClick={() => handleDelete(comment._id)}
												className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-zinc-700"
											>
												<Trash2 size={14} /> Delete
											</button>
										</div>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
