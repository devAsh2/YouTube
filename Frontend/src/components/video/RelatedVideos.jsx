import React from 'react';

const RelatedVideos = ({ videoId }) => {
  const relatedVideos = [
    { id: '1', title: 'Related Video 1', channel: 'Tech Channel', views: '10K views' },
    { id: '2', title: 'Related Video 2', channel: 'Gaming Hub', views: '25K views' },
    { id: '3', title: 'Related Video 3', channel: 'Music World', views: '5K views' },
    { id: '4', title: 'Related Video 4', channel: 'News Today', views: '50K views' },
  ];

  return (
    <div className="related-videos">
      <h3>Related Videos</h3>
      <div className="related-videos-list">
        {relatedVideos.map((video) => (
          <div key={video.id} className="related-video-card">
            <div className="related-video-thumbnail">
              <div className="thumbnail-placeholder">📹</div>
            </div>
            <div className="related-video-info">
              <h4 className="related-video-title">{video.title}</h4>
              <p className="related-video-channel">{video.channel}</p>
              <p className="related-video-views">{video.views}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedVideos;
