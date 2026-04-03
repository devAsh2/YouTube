import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useVideo } from '../../hooks/useVideo';
import './VideoPlayer.css';

const VideoPlayer = ({ videoId }) => {
    const { video, loading, error } = useVideo(videoId);
    
    // Refs for DOM manipulation
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    // State management
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showControls, setShowControls] = useState(true);

    // Auto-hide controls logic - only when playing
    useEffect(() => {
        let timeout;
        if (isPlaying && showControls) {
            timeout = setTimeout(() => setShowControls(false), 3000);
        }
        return () => clearTimeout(timeout);
    }, [isPlaying, showControls]);

    const handleUserActivity = useCallback(() => {
        setShowControls(true); // show immediately
    }, []);

    // Event handlers
    // Play/Pause functionality
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    };

    // Mute/Unmute functionality
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Seek functionality
    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    // Volume control
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };

    // Metadata loaded
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setIsLoading(false);
        }
    };

    // Time update
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    // Video event handlers
    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    const handleWaiting = () => {
        setIsLoading(true);
    };

    const handleCanPlay = () => {
        setIsLoading(false);
    };

    // Time formatting
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    // Fullscreen toggle
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Handle loading state from useVideo
    useEffect(() => {
        setIsLoading(loading);
    }, [loading]);

    if (error) {
        return (
            <div className="video-player">
                <div className="error-message">
                    Failed to load video: {error}
                </div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="video-player">
                <div className="loading-spinner">
                    <div className="spinner">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="video-player"
            onMouseMove={handleUserActivity}
            onTouchStart={handleUserActivity}
        >
            {/**Video player element  */}
            <div className='video-container'>
                <video
                    ref={videoRef}
                    className="video-element"
                    poster={video.thumbnailUrl}
                    preload="metadata"
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleEnded}
                    onWaiting={handleWaiting}
                    onCanPlay={handleCanPlay}
                >
                    <source src={video.videoUrl} type='video/mp4' />
                    <source src={video.videoUrl} type='video/webm' />
                    Your browser does not support the video tag.
                </video>
                {/*Loading indicator*/}
                {isLoading && (
                    <div className="loading-spinner">
                        <div className="spinner">Loading...</div>
                    </div>
                )}
            </div>
            {/*Custom controls instead of native video controls*/}
            <div className={`controls ${showControls ? 'visible' : 'hidden'}`}>
                {/* Progress Bar */}
                <div className="progress-bar">
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                        className="progress-slider"
                    />
                    <div 
                        className="progress-filled"
                        style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                    />
                </div>

                {/* Control Buttons */}
                <div className="controls-row">
                    <div className="controls-left">
                        <button onClick={togglePlay} className="control-btn">
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>

                        <div className="volume-control">
                            <button onClick={toggleMute} className="control-btn">
                                {isMuted || volume === 0 ? '🔇' : '🔊'}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="volume-slider"
                            />
                        </div>

                        <span className="time-display">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>
                    <div className="controls-right">
                        <button onClick={toggleFullscreen} className="control-btn">
                            {isFullscreen ? '🗗' : '🗖'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
