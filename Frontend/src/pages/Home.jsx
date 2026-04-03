import { useState } from "react";
import { videos } from "../data/dummyData";
import { useSidebar } from "../hooks/SidebarContext";
import FilterBar from "../components/FilterBar";
import VideoCard from "../components/VideoCard";

export default function Home() {
	const [activeFilter, setActiveFilter] = useState("All");
	const { isOpen } = useSidebar();

	const filteredVideos =
		activeFilter === "All"
			? videos
			: videos.filter((v) => v.category === activeFilter);

	return (
		<div
			className={`min-h-screen transition-all duration-200 ${
				isOpen ? "md:ml-60" : "ml-0"
			}`}
		>
			<FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

			<div className="p-4">
				{filteredVideos.length === 0 ? (
					<p className="mt-10 text-center text-gray-500 dark:text-gray-400">
						No videos found in this category.
					</p>
				) : (
					<div
						className={`grid gap-x-4 gap-y-8 ${
							isOpen
								? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
								: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
						}`}
					>
						{filteredVideos.map((video) => (
							<VideoCard key={video.id} video={video} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
