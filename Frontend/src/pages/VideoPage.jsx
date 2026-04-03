import { useParams } from "react-router-dom";
import { useSidebar } from "../hooks/SidebarContext";
import { useVideo } from "../hooks/useVideo";
import VideoPlayer from "../components/video/VideoPlayer";
import VideoInfo from "../components/video/VideoInfo";
import CommentsSection from "../components/video/CommentsSection";
import RelatedVideos from "../components/video/RelatedVideos";

export default function VideoPage() {
	const { videoId } = useParams();
	const { isOpen } = useSidebar();
	const { video, loading, error, likeVideo, dislikeVideo } = useVideo(videoId);

	if (loading) {
		return (
			<div
				className={`min-h-screen p-6 transition-all duration-200 ${isOpen ? "md:ml-60" : "ml-0"}`}
			>
				<p className="text-center text-gray-500 dark:text-gray-400">
					Loading video...
				</p>
			</div>
		);
	}

	if (error || !video) {
		return (
			<div
				className={`min-h-screen p-6 transition-all duration-200 ${isOpen ? "md:ml-60" : "ml-0"}`}
			>
				<p className="text-center text-red-500">{error || "Video not found"}</p>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen transition-all duration-200 ${isOpen ? "md:ml-60" : "ml-0"}`}
		>
			<div className="flex flex-col gap-6 p-4 lg:flex-row">
				{/* Main content */}
				<div className="min-w-0 flex-1">
					<VideoPlayer video={video} />
					<VideoInfo
						video={video}
						onLike={likeVideo}
						onDislike={dislikeVideo}
					/>
					<CommentsSection videoId={videoId} />
				</div>
				{/* Sidebar */}
				<div className="w-full shrink-0 lg:w-96">
					<RelatedVideos video={video} />
				</div>
			</div>
		</div>
	);
}
