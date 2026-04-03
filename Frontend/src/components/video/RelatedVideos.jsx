import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { videoAPI } from "../../services/api";
import { formatViews, timeAgo } from "../../utils/formatters";

export default function RelatedVideos({ video }) {
	const [videos, setVideos] = useState([]);

	useEffect(() => {
		const load = async () => {
			try {
				let result = [];
				if (video.category) {
					const res = await videoAPI.getVideosByCategory(video.category);
					result = (res.data.videos || []).filter((v) => v._id !== video._id);
				}
				// Fall back to all videos if no category matches
				if (result.length === 0) {
					const res = await videoAPI.getAllVideos();
					result = (res.data.fetchedVideos || [])
						.filter((v) => v._id !== video._id)
						.slice(0, 15);
				}
				setVideos(result);
			} catch {
				console.error("Failed to load related videos");
			}
		};
		if (video?._id) load();
	}, [video?._id, video?.category]);

	if (videos.length === 0) return null;

	return (
		<div>
			<h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
				Related videos
			</h3>
			<div className="space-y-3">
				{videos.map((v) => (
					<Link
						key={v._id}
						to={`/video/${v._id}`}
						className="group flex gap-2 no-underline"
					>
						<div className="relative w-40 shrink-0 overflow-hidden rounded-lg">
							<img
								src={v.thumbnailUrl}
								alt={v.title}
								className="aspect-video w-full object-cover transition-transform duration-200 group-hover:scale-105"
								loading="lazy"
							/>
						</div>
						<div className="min-w-0 flex-1">
							<h4 className="line-clamp-2 text-sm font-medium leading-snug text-gray-900 dark:text-white">
								{v.title}
							</h4>
							<p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
								{v.channelId?.channelName || "Unknown"}
							</p>
							<p className="text-xs text-gray-600 dark:text-gray-400">
								{formatViews(v.views || 0)} views &bull; {timeAgo(v.createdAt)}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
