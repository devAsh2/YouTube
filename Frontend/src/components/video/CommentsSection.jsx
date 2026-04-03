import React from 'react';

const CommentsSection = ({ videoId }) => {
  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <div className="comment-form">
        <input 
          type="text" 
          placeholder="Add a comment..." 
          className="comment-input"
        />
        <button className="comment-submit">Post</button>
      </div>
      <div className="comments-list">
        <div className="comment">
          <div className="comment-author">User123</div>
          <div className="comment-text">This is a placeholder comment!</div>
        </div>
        <div className="comment">
          <div className="comment-author">User456</div>
          <div className="comment-text">Great video! 👍</div>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
