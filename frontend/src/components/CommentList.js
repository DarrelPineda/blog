import React, { useEffect, useState } from 'react';

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch(`http://localhost/backend/api/get_comments.php?post_id=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data));
  }, [postId, refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost/backend/api/add_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ post_id: postId, comment_text: commentText }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentText('');
        setRefresh(r => !r); // Refresh comments
      } else {
        setError(data.error || 'Failed to add comment');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{marginTop: 16}}>
      <b>Comments:</b>
      <ul style={{paddingLeft: 20}}>
        {comments.map(c => (
          <li key={c.id}>
            <b>{c.username}</b>: {c.comment_text}
            <br />
            <small style={{color:'#888'}}>{new Date(c.created_at).toLocaleString()}</small>
          </li>
        ))}
        {comments.length === 0 && <li style={{color:'#888'}}>No comments yet.</li>}
      </ul>
      <form onSubmit={handleSubmit} style={{marginTop: 8, display: 'flex', alignItems: 'center'}}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          required
          style={{width: '70%', marginRight: 8}}
        />
        <button type="submit">Post</button>
        {error && <div className="auth-error" style={{marginLeft: 8}}>{error}</div>}
      </form>
    </div>
  );
}

export default CommentList;