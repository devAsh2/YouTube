import React from 'react';

const VideoInfo = ({ videoId }) => {
  return (
    <div className="video-info">
      <h2>Video Info Component</h2>
      <p>Video ID: {videoId}</p>
      <div className="video-actions">
        <button className="like-btn">👍 Like</button>
        <button className="dislike-btn">👎 Dislike</button>
        <button className="share-btn">🔗 Share</button>
      </div>
      <div className="video-description">
        <h3>Description</h3>
        <p>This is a placeholder for video description, views, likes, and channel info.</p>
      </div>
    </div>
  );
};

export default VideoInfo;
