import { useState, useEffect } from 'react';
import { videoAPI } from '../services/api';

export const useVideo = (videoId) => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await videoAPI.getVideo(videoId);
        setVideo(response.data.fetchedVideo);
        
        // Increment view count
        await videoAPI.incrementView(videoId);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch video');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const likeVideo = async () => {
    try {
      const response = await videoAPI.likeVideo(videoId);
      setVideo(prev => ({ ...prev, likes: response.data.video.likes }));
    } catch (err) {
      console.error('Failed to like video:', err);
    }
  };

  const dislikeVideo = async () => {
    try {
      const response = await videoAPI.dislikeVideo(videoId);
      setVideo(prev => ({ ...prev, dislikes: response.data.video.dislikes }));
    } catch (err) {
      console.error('Failed to dislike video:', err);
    }
  };

  return { video, loading, error, likeVideo, dislikeVideo };
};
