import { useRef, useState, useEffect, useCallback } from "react";
import {
	Play,
	Pause,
	Volume2,
	VolumeX,
	Maximize,
	Minimize,
	Settings,
} from "lucide-react";

// Extract YouTube video ID from any YouTube URL format
function getYouTubeId(url) {
	if (!url) return null;
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
	];
	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) return match[1];
	}
	return null;
}

export default function VideoPlayer({ video }) {
	const videoRef = useRef(null);
	const containerRef = useRef(null);
	const progressRef = useRef(null);

	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [buffering, setBuffering] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [showVolume, setShowVolume] = useState(false);

	// Auto-hide controls
	useEffect(() => {
		let timeout;
		if (isPlaying && showControls) {
			timeout = setTimeout(() => setShowControls(false), 3000);
		}
		return () => clearTimeout(timeout);
	}, [isPlaying, showControls]);

	const handleUserActivity = useCallback(() => {
		setShowControls(true);
	}, []);

	const togglePlay = () => {
		if (!videoRef.current) return;
		if (isPlaying) videoRef.current.pause();
		else videoRef.current.play();
	};

	const toggleMute = () => {
		if (!videoRef.current) return;
		videoRef.current.muted = !isMuted;
		setIsMuted(!isMuted);
	};

	const handleVolumeChange = (e) => {
		const v = parseFloat(e.target.value);
		setVolume(v);
		if (videoRef.current) {
			videoRef.current.volume = v;
			setIsMuted(v === 0);
		}
	};

	const handleProgressClick = (e) => {
		if (!progressRef.current || !videoRef.current) return;
		const rect = progressRef.current.getBoundingClientRect();
		const pct = (e.clientX - rect.left) / rect.width;
		const newTime = pct * duration;
		videoRef.current.currentTime = newTime;
		setCurrentTime(newTime);
	};

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			containerRef.current?.requestFullscreen();
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	};

	useEffect(() => {
		const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
		document.addEventListener("fullscreenchange", onFSChange);
		return () => document.removeEventListener("fullscreenchange", onFSChange);
	}, []);

	const formatTime = (s) => {
		if (isNaN(s)) return "0:00";
		const h = Math.floor(s / 3600);
		const m = Math.floor((s % 3600) / 60);
		const sec = Math.floor(s % 60);
		if (h > 0)
			return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
		return `${m}:${sec.toString().padStart(2, "0")}`;
	};

	const progressPct = duration ? (currentTime / duration) * 100 : 0;

	if (!video) return null;

	// YouTube video — use iframe embed with native YT controls
	const ytId = getYouTubeId(video.videoUrl);
	if (ytId) {
		return (
			<div
				className="relative w-full overflow-hidden rounded-xl bg-black"
				style={{ paddingBottom: "56.25%" }}
			>
				<iframe
					className="absolute inset-0 h-full w-full"
					src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0&modestbranding=1`}
					title={video.title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
				/>
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className="group relative w-full overflow-hidden rounded-xl bg-black"
			onMouseMove={handleUserActivity}
			onTouchStart={handleUserActivity}
		>
			{/* Video element */}
			<div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
				<video
					ref={videoRef}
					className="absolute inset-0 h-full w-full bg-black"
					poster={video.thumbnailUrl}
					preload="auto"
					onClick={togglePlay}
					onLoadedMetadata={() => {
						if (videoRef.current) {
							setDuration(videoRef.current.duration);
							setBuffering(false);
						}
					}}
					onTimeUpdate={() => {
						if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
					}}
					onPlay={() => setIsPlaying(true)}
					onPause={() => setIsPlaying(false)}
					onEnded={() => setIsPlaying(false)}
					onWaiting={() => setBuffering(true)}
					onCanPlay={() => setBuffering(false)}
				>
					<source src={video.videoUrl} type="video/mp4" />
				</video>

				{/* Buffering spinner — YouTube style */}
				{buffering && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						<div className="h-12 w-12 rounded-full border-[3px] border-white/30 border-t-white animate-spin" />
					</div>
				)}

				{/* Big center play button when paused */}
				{!isPlaying && !buffering && (
					<button
						onClick={togglePlay}
						className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity"
					>
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform hover:scale-110">
							<Play size={32} className="ml-1 text-white" fill="white" />
						</div>
					</button>
				)}
			</div>

			{/* Controls overlay */}
			<div
				className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-3 pb-2 pt-16 transition-opacity duration-300 ${
					showControls ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
			>
				{/* Progress bar */}
				<div
					ref={progressRef}
					className="group/progress mb-1 flex h-5 cursor-pointer items-center"
					onClick={handleProgressClick}
				>
					<div className="relative h-[3px] w-full rounded-full bg-white/30 transition-all group-hover/progress:h-[5px]">
						{/* Filled */}
						<div
							className="absolute left-0 top-0 h-full rounded-full bg-red-600"
							style={{ width: `${progressPct}%` }}
						/>
						{/* Scrub dot */}
						<div
							className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-red-600 opacity-0 shadow transition-opacity group-hover/progress:opacity-100"
							style={{ left: `${progressPct}%`, marginLeft: "-6px" }}
						/>
					</div>
				</div>

				{/* Bottom controls row */}
				<div className="flex items-center justify-between">
					{/* Left controls */}
					<div className="flex items-center gap-1">
						{/* Play/Pause */}
						<button
							onClick={togglePlay}
							className="rounded-full p-1.5 transition-colors hover:bg-white/10"
						>
							{isPlaying ? (
								<Pause size={22} className="text-white" fill="white" />
							) : (
								<Play size={22} className="ml-0.5 text-white" fill="white" />
							)}
						</button>

						{/* Volume */}
						<div
							className="relative flex items-center"
							onMouseEnter={() => setShowVolume(true)}
							onMouseLeave={() => setShowVolume(false)}
						>
							<button
								onClick={toggleMute}
								className="rounded-full p-1.5 transition-colors hover:bg-white/10"
							>
								{isMuted || volume === 0 ? (
									<VolumeX size={22} className="text-white" />
								) : (
									<Volume2 size={22} className="text-white" />
								)}
							</button>
							<div
								className={`flex items-center overflow-hidden transition-all duration-200 ${
									showVolume ? "w-20 opacity-100" : "w-0 opacity-0"
								}`}
							>
								<input
									type="range"
									min="0"
									max="1"
									step="0.05"
									value={isMuted ? 0 : volume}
									onChange={handleVolumeChange}
									className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
								/>
							</div>
						</div>

						{/* Time */}
						<span className="ml-1 select-none text-xs font-medium text-white/90">
							{formatTime(currentTime)} / {formatTime(duration)}
						</span>
					</div>

					{/* Right controls */}
					<div className="flex items-center gap-1">
						<button className="rounded-full p-1.5 transition-colors hover:bg-white/10">
							<Settings size={20} className="text-white" />
						</button>
						<button
							onClick={toggleFullscreen}
							className="rounded-full p-1.5 transition-colors hover:bg-white/10"
						>
							{isFullscreen ? (
								<Minimize size={20} className="text-white" />
							) : (
								<Maximize size={20} className="text-white" />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
