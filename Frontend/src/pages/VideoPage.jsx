import React from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/video/VideoPlayer';
import VideoInfo from '../components/video/VideoInfo';
import CommentsSection from '../components/video/CommentsSection';
import RelatedVideos from '../components/video/RelatedVideos';

const VideoPage = () => {
  const { videoId } = useParams();

  return (
    <div className="video-page">
      <div className="video-page-content">
        <div className="video-main">
          <VideoPlayer videoId={videoId} />
          <VideoInfo videoId={videoId} />
          <CommentsSection videoId={videoId} />
        </div>
        <div className="video-sidebar">
          <RelatedVideos videoId={videoId} />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
