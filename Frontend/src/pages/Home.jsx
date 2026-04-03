import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSidebar } from "../hooks/SidebarContext";
import { useAuth } from "../hooks/AuthContext";
import { videoAPI } from "../services/api";
import FilterBar from "../components/FilterBar";
import VideoCard from "../components/VideoCard";

export default function Home() {
	const [activeFilter, setActiveFilter] = useState("All");
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { isOpen } = useSidebar();
	const { user } = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();
	const searchQuery = searchParams.get("search") || "";

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);

		const load = async () => {
			try {
				let result;
				if (searchQuery) {
					const response = await videoAPI.searchVideos(searchQuery);
					result = response.data.searchedVideos;
				} else if (activeFilter === "All") {
					const response = await videoAPI.getAllVideos();
					result = response.data.fetchedVideos;
				} else {
					const response = await videoAPI.getVideosByCategory(activeFilter);
					result = response.data.videos;
				}
				if (!cancelled) setVideos(result);
			} catch (err) {
				if (!cancelled) setError(err.message || 'Failed to fetch videos');
			} finally {
				if (!cancelled) setLoading(false);
			}
		};
		load();

		return () => {
			cancelled = true;
		};
	}, [activeFilter, searchQuery]);

	// When a category filter is selected, clear the search param
	const handleFilterChange = (category) => {
		setActiveFilter(category);
		if (searchQuery) {
			setSearchParams({});
		}
	};

	// When a search is active, reset category to "All"
	useEffect(() => {
		if (searchQuery) {
			setActiveFilter("All");
		}
	}, [searchQuery]);

	return (
		<div
			className={`min-h-screen transition-all duration-200 ${
				isOpen ? "md:ml-60" : "ml-0"
			}`}
		>
			<FilterBar
				activeFilter={activeFilter}
				onFilterChange={handleFilterChange}
			/>

			<div className="p-4">
				{loading ? (
					<p className="mt-10 text-center text-gray-500 dark:text-gray-400">
						Loading videos...
					</p>
				) : error ? (
					<p className="mt-10 text-center text-red-500 dark:text-red-400">
						{error}
					</p>
				) : videos.length === 0 ? (
					<p className="mt-10 text-center text-gray-500 dark:text-gray-400">
						{searchQuery
							? `No videos found for "${searchQuery}".`
							: "No videos found in this category."}
					</p>
				) : (
					<div
						className={`grid gap-x-4 gap-y-8 ${
							isOpen
								? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
								: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
						}`}
					>
						{videos.map((video) => (
							<VideoCard key={video._id} video={video} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
