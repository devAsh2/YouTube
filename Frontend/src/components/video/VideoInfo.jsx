import { useState } from "react";
import {
	ThumbsUp,
	ThumbsDown,
	Share2,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { formatViews, timeAgo } from "../../utils/formatters";
import { useAuth } from "../../hooks/AuthContext";

export default function VideoInfo({ video, onLike, onDislike }) {
	const [showFullDescription, setShowFullDescription] = useState(false);
	const { user } = useAuth();

	const channelName = video.channelId?.channelName || "Unknown Channel";
	const uploaderName = video.uploader?.username || "";

	const userId = user?.id || user?._id;
	const isLiked = userId && video.likedBy?.includes(userId);
	const isDisliked = userId && video.dislikedBy?.includes(userId);

	return (
		<div className="mt-3">
			{/* Title */}
			<h1 className="text-lg font-semibold leading-snug text-gray-900 dark:text-white">
				{video.title}
			</h1>

			{/* Channel row + actions */}
			<div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				{/* Channel info */}
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
						{channelName.charAt(0).toUpperCase()}
					</div>
					<div>
						<p className="text-sm font-medium text-gray-900 dark:text-white">
							{channelName}
						</p>
						{uploaderName && (
							<p className="text-xs text-gray-500 dark:text-gray-400">
								@{uploaderName}
							</p>
						)}
					</div>
					<button className="ml-4 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
						Subscribe
					</button>
				</div>

				{/* Action buttons */}
				<div className="flex items-center gap-2">
					{/* Like / Dislike pill */}
					<div className="flex items-center overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
						<button
							onClick={onLike}
							className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700 ${
								isLiked
									? "text-blue-600 dark:text-blue-400"
									: "text-gray-700 dark:text-gray-200"
							}`}
						>
							<ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
							{formatViews(video.likes || 0)}
						</button>
						<div className="h-6 w-px bg-gray-300 dark:bg-zinc-600" />
						<button
							onClick={onDislike}
							className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700 ${
								isDisliked
									? "text-blue-600 dark:text-blue-400"
									: "text-gray-700 dark:text-gray-200"
							}`}
						>
							<ThumbsDown
								size={18}
								fill={isDisliked ? "currentColor" : "none"}
							/>
						</button>
					</div>

					{/* Share */}
					<button className="flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700">
						<Share2 size={18} />
						Share
					</button>
				</div>
			</div>

			{/* Description card */}
			<div className="mt-3 rounded-xl bg-gray-100 p-3 dark:bg-zinc-800">
				<div className="flex gap-2 text-sm font-medium text-gray-900 dark:text-white">
					<span>{formatViews(video.views || 0)} views</span>
					<span>&bull;</span>
					<span>{timeAgo(video.createdAt)}</span>
					{video.category && (
						<>
							<span>&bull;</span>
							<span className="text-blue-600 dark:text-blue-400">
								#{video.category}
							</span>
						</>
					)}
				</div>
				{video.description && (
					<>
						<p
							className={`mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 ${!showFullDescription ? "line-clamp-2" : ""}`}
						>
							{video.description}
						</p>
						{video.description.length > 150 && (
							<button
								onClick={() => setShowFullDescription(!showFullDescription)}
								className="mt-1 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white"
							>
								{showFullDescription ? (
									<>
										Show less <ChevronUp size={16} />
									</>
								) : (
									<>
										Show more <ChevronDown size={16} />
									</>
								)}
							</button>
						)}
					</>
				)}
			</div>
		</div>
	);
}
