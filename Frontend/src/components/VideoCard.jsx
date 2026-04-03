import { Link } from "react-router-dom";
import { formatViews, timeAgo } from "../utils/formatters";

export default function VideoCard({ video }) {
	return (
		<Link to={`/video/${video.id}`} className="group no-underline">
			{/* Thumbnail */}
			<div className="relative w-full overflow-hidden rounded-xl">
				<img
					src={video.thumbnailUrl}
					alt={video.title}
					className="aspect-video w-full object-cover transition-transform duration-200 group-hover:scale-105"
					loading="lazy"
				/>
			</div>

			{/* Video info */}
			<div className="mt-3 flex gap-3">
				{/* Channel avatar */}
				<img
					src={video.channelAvatar}
					alt={video.channelName}
					className="h-9 w-9 shrink-0 rounded-full object-cover"
				/>
				{/* Text info */}
				<div className="min-w-0 flex-1">
					<h3 className="line-clamp-2 text-sm font-medium leading-5 text-gray-900 dark:text-white">
						{video.title}
					</h3>
					<p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
						{video.channelName}
					</p>
					<p className="text-xs text-gray-600 dark:text-gray-400">
						{formatViews(video.views)} views &bull; {timeAgo(video.uploadDate)}
					</p>
				</div>
			</div>
		</Link>
	);
}
