import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MoreVertical, Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { channelAPI, videoAPI } from "../services/api";
import { useAuth } from "../hooks/AuthContext";
import { useSidebar } from "../hooks/SidebarContext";
import { formatViews, timeAgo } from "../utils/formatters";

export default function ChannelPage() {
	const { channelId } = useParams();
	const { user } = useAuth();
	const { isOpen } = useSidebar();
	const [channel, setChannel] = useState(null);
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [actionError, setActionError] = useState("");

	// Create modal state
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [createTitle, setCreateTitle] = useState("");
	const [createDescription, setCreateDescription] = useState("");
	const [createThumbnailUrl, setCreateThumbnailUrl] = useState("");
	const [createVideoUrl, setCreateVideoUrl] = useState("");
	const [createCategory, setCreateCategory] = useState("Other");
	const [createLoading, setCreateLoading] = useState(false);

	// Edit modal state
	const [editingVideo, setEditingVideo] = useState(null);
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [editLoading, setEditLoading] = useState(false);

	// 3-dot menu
	const [openMenuId, setOpenMenuId] = useState(null);

	const isOwner =
		user &&
		channel?.owner &&
		(channel.owner._id === (user.id || user._id) ||
			channel.owner === (user.id || user._id));

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const [channelRes, videosRes] = await Promise.all([
					channelAPI.getChannel(channelId),
					channelAPI.getChannelVideos(channelId),
				]);
				setChannel(channelRes.data.fetchedChannel);
				setVideos(videosRes.data.videos);
			} catch {
				setError("Failed to load channel");
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [channelId]);

	const handleDelete = async (videoId) => {
		if (!confirm("Delete this video? This action cannot be undone.")) return;
		try {
			await videoAPI.deleteVideo(videoId);
			setVideos((prev) => prev.filter((v) => v._id !== videoId));
			setActionError("");
		} catch {
			setActionError("Failed to delete video");
		}
	};

	const openEdit = (video) => {
		setEditingVideo(video);
		setEditTitle(video.title);
		setEditDescription(video.description || "");
		setOpenMenuId(null);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		setEditLoading(true);
		try {
			const res = await videoAPI.updateVideo(editingVideo._id, {
				title: editTitle.trim(),
				description: editDescription.trim(),
			});
			const updated = res.data.updatedVideo;
			setVideos((prev) =>
				prev.map((v) => (v._id === updated._id ? { ...v, ...updated } : v)),
			);
			setEditingVideo(null);
			setActionError("");
		} catch {
			setActionError("Failed to update video");
		} finally {
			setEditLoading(false);
		}
	};

	const resetCreateForm = () => {
		setCreateTitle("");
		setCreateDescription("");
		setCreateThumbnailUrl("");
		setCreateVideoUrl("");
		setCreateCategory("Other");
	};

	const openCreateModal = () => {
		setActionError("");
		resetCreateForm();
		setShowCreateModal(true);
	};

	const closeCreateModal = () => {
		setShowCreateModal(false);
		setCreateLoading(false);
	};

	const handleCreateSubmit = async (e) => {
		e.preventDefault();
		setCreateLoading(true);
		setActionError("");

		try {
			const res = await videoAPI.createVideo({
				title: createTitle.trim(),
				description: createDescription.trim(),
				thumbnailUrl: createThumbnailUrl.trim(),
				videoUrl: createVideoUrl.trim(),
				category: createCategory,
				channelId,
			});

			const created = res.data.uploadedVideo;
			setVideos((prev) => [created, ...prev]);
			closeCreateModal();
		} catch (err) {
			const data = err.response?.data;
			setActionError(
				data?.details?.[0] || data?.error || "Failed to create video",
			);
		} finally {
			setCreateLoading(false);
		}
	};

	if (loading) {
		return (
			<div
				className={`flex h-[60vh] items-center justify-center transition-all duration-200 ${isOpen ? "md:ml-60" : "ml-0"}`}
			>
				<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
			</div>
		);
	}

	if (error || !channel) {
		return (
			<div
				className={`flex h-[60vh] items-center justify-center transition-all duration-200 ${isOpen ? "md:ml-60" : "ml-0"}`}
			>
				<p className="text-gray-500 dark:text-gray-400">
					{error || "Channel not found"}
				</p>
			</div>
		);
	}

	const channelHandle =
		channel.handle ||
		"@" +
			channel.channelName
				.toLowerCase()
				.replace(/\s+/g, "")
				.replace(/[^a-z0-9._]/g, "");

	return (
		<div
			className={`transition-all duration-200 ${isOpen ? "md:ml-60" : "ml-0"}`}
		>
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				{/* Banner */}
				<div
					className="h-28 w-full rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 sm:h-40"
					style={
						channel.channelBanner
							? {
									backgroundImage: `url(${channel.channelBanner})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}
							: {}
					}
				/>

				{/* Channel info */}
				<div className="flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center">
					{/* Avatar */}
					<img
						src={
							channel.owner?.avatar ||
							`https://ui-avatars.com/api/?name=${encodeURIComponent(channel.channelName.charAt(0))}&background=random&color=fff&size=128`
						}
						alt={channel.channelName}
						className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20"
					/>
					<div className="min-w-0 flex-1">
						<h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
							{channel.channelName}
						</h1>
						<div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-gray-500 dark:text-gray-400">
							<span>{channelHandle}</span>
							<span>&bull;</span>
							<span>
								{formatViews(channel.subscribers || 0)} subscriber
								{channel.subscribers !== 1 ? "s" : ""}
							</span>
							<span>&bull;</span>
							<span>
								{videos.length} video{videos.length !== 1 ? "s" : ""}
							</span>
						</div>
						{channel.description && (
							<p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
								{channel.description}
							</p>
						)}
					</div>
				</div>

				{/* Videos tab */}
				<div className="flex items-end justify-between border-b border-gray-200 dark:border-zinc-700">
					<div className="inline-block border-b-2 border-gray-900 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white dark:text-white">
						Videos
					</div>
					{isOwner && (
						<button
							onClick={openCreateModal}
							className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							<Plus size={16} />
							Upload video
						</button>
					)}
				</div>

				{actionError && (
					<div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
						{actionError}
					</div>
				)}

				{/* Videos grid */}
				{videos.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
						<p className="text-lg font-medium">No videos yet</p>
						<p className="mt-1 text-sm">
							{isOwner
								? "Upload your first video to get started"
								: "This channel hasn't uploaded any videos yet"}
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 xl:grid-cols-4">
						{videos.map((video) => (
							<div key={video._id} className="group relative">
								<Link to={`/video/${video._id}`} className="block no-underline">
									{/* Thumbnail */}
									<div className="relative w-full overflow-hidden rounded-xl">
										<img
											src={video.thumbnailUrl}
											alt={video.title}
											className="aspect-video w-full object-cover transition-transform duration-200 group-hover:scale-105"
											loading="lazy"
										/>
									</div>
									{/* Info */}
									<div className="mt-3 pr-8">
										<h3 className="line-clamp-2 text-sm font-medium leading-5 text-gray-900 dark:text-white">
											{video.title}
										</h3>
										<p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
											{formatViews(video.views)} views &bull;{" "}
											{timeAgo(video.createdAt)}
										</p>
									</div>
								</Link>

								{/* Owner 3-dot menu */}
								{isOwner && (
									<div className="absolute right-0 top-[calc(100%-2.5rem)]">
										<button
											onClick={(e) => {
												e.preventDefault();
												setOpenMenuId(
													openMenuId === video._id ? null : video._id,
												);
											}}
											className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-700"
										>
											<MoreVertical size={16} />
										</button>
										{openMenuId === video._id && (
											<div className="absolute right-0 z-10 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
												<button
													onClick={() => openEdit(video)}
													className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
												>
													<Pencil size={14} />
													Edit
												</button>
												<button
													onClick={() => {
														setOpenMenuId(null);
														handleDelete(video._id);
													}}
													className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-zinc-700"
												>
													<Trash2 size={14} />
													Delete
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

			{/* Create Video Modal */}
			{showCreateModal && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
						<h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
							Upload video
						</h2>
						<form onSubmit={handleCreateSubmit} className="space-y-4">
							<div>
								<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
									Title
								</label>
								<input
									type="text"
									value={createTitle}
									onChange={(e) => setCreateTitle(e.target.value)}
									required
									className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
								/>
							</div>

							<div>
								<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
									Thumbnail URL
								</label>
								<input
									type="url"
									value={createThumbnailUrl}
									onChange={(e) => setCreateThumbnailUrl(e.target.value)}
									required
									placeholder="https://example.com/thumb.jpg"
									className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
								/>
							</div>

							<div>
								<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
									Video URL
								</label>
								<input
									type="url"
									value={createVideoUrl}
									onChange={(e) => setCreateVideoUrl(e.target.value)}
									required
									placeholder="https://example.com/video.mp4"
									className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
								/>
								<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
									Accepted by backend: direct video files like .mp4, .avi, .mov,
									.wmv, .flv, .webm
								</p>
							</div>

							<div>
								<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
									Category
								</label>
								<select
									value={createCategory}
									onChange={(e) => setCreateCategory(e.target.value)}
									className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
								>
									<option>Education</option>
									<option>Music</option>
									<option>Gaming</option>
									<option>News</option>
									<option>Sports</option>
									<option>Technology</option>
									<option>Entertainment</option>
									<option>Other</option>
								</select>
							</div>

							<div>
								<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
									Description
								</label>
								<textarea
									value={createDescription}
									onChange={(e) => setCreateDescription(e.target.value)}
									rows={4}
									className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
								/>
							</div>

							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={closeCreateModal}
									className="rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={
										createLoading ||
										!createTitle.trim() ||
										!createThumbnailUrl.trim() ||
										!createVideoUrl.trim()
									}
									className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{createLoading ? "Uploading..." : "Upload"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Edit Video Modal */}
			{editingVideo && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
						<h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
							Edit video
						</h2>
						<form onSubmit={handleEditSubmit} className="space-y-4">
							<div>
								<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
									Title
								</label>
								<input
									type="text"
									value={editTitle}
									onChange={(e) => setEditTitle(e.target.value)}
									required
									className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
								/>
							</div>
							<div>
								<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
									Description
								</label>
								<textarea
									value={editDescription}
									onChange={(e) => setEditDescription(e.target.value)}
									rows={4}
									className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
								/>
							</div>
							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={() => setEditingVideo(null)}
									className="rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={editLoading || !editTitle.trim()}
									className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{editLoading ? "Saving..." : "Save"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
