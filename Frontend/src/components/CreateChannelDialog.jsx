import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../hooks/AuthContext";
import { channelAPI } from "../services/api";

export default function CreateChannelDialog({ onClose, onCreated }) {
	const { user, setUser } = useAuth();
	const [channelName, setChannelName] = useState(user?.username || "");
	const [handle, setHandle] = useState("");
	const [isHandleDirty, setIsHandleDirty] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const buildHandle = (value) => {
		const normalized = value
			.trim()
			.toLowerCase()
			.replace(/^@+/, "")
			.replace(/\s+/g, "")
			.replace(/[^a-z0-9._]/g, "");

		return normalized ? `@${normalized}` : "";
	};

	useEffect(() => {
		if (!isHandleDirty) {
			setHandle(buildHandle(channelName));
		}
	}, [channelName, isHandleDirty]);

	useEffect(() => {
		setHandle(buildHandle(user?.username || ""));
	}, [user?.username]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);
		const normalizedHandle = buildHandle(handle || channelName);

		try {
			const response = await channelAPI.createChannel({
				channelName: channelName.trim(),
				handle: normalizedHandle,
			});
			const newChannel = response.data.createdChannel;

			// Update user's channels in AuthContext
			setUser((prev) => ({
				...prev,
				channels: [...(prev.channels || []), newChannel._id],
			}));

			onCreated(newChannel._id);
		} catch (err) {
			const data = err.response?.data;
			setError(
				data?.details?.[0] || data?.error || data?.message || err.message,
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
			<div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white px-5 py-5 shadow-xl dark:bg-zinc-900 sm:max-w-lg sm:px-8 sm:py-7">
				{/* Header */}
				<div className="mb-6 flex items-start justify-between">
					<h2 className="text-2xl font-medium text-gray-900 dark:text-white">
						How you'll appear
					</h2>
					<button
						onClick={onClose}
						className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800"
					>
						<X size={20} className="text-gray-500 dark:text-gray-400" />
					</button>
				</div>

				{/* Avatar Preview */}
				<div className="mb-6 flex justify-center">
					<img
						src={user?.avatar}
						alt={user?.username}
						className="h-24 w-24 rounded-full object-cover"
					/>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Error */}
					{error && (
						<div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
							{error}
						</div>
					)}

					{/* Name */}
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
							Name
						</label>
						<input
							type="text"
							value={channelName}
							onChange={(e) => setChannelName(e.target.value)}
							required
							minLength={3}
							className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
						/>
					</div>

					{/* Handle */}
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
							Handle
						</label>
						<input
							type="text"
							value={handle}
							onChange={(e) => {
								setIsHandleDirty(true);
								setHandle(e.target.value);
							}}
							placeholder="@yourhandle"
							className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
						/>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							YouTube suggests a handle from your name, but you can edit it
							here.
						</p>
					</div>

					<p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
						By clicking Create channel you agree to YouTube's Terms of Service.
						Changes made to your name and profile picture are visible only on
						YouTube in this app.
					</p>

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading || !channelName.trim()}
							className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isLoading ? "Creating..." : "Create channel"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
