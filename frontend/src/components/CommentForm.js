import React, { useState } from 'react';

function CommentForm({ postId, onCommentAdded }) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost/backend/api/add_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ post_id: postId, comment_text: comment }),
      });
      const data = await res.json();
      if (data.success) {
        setComment('');
        if (onCommentAdded) onCommentAdded();
      } else {
        setError(data.error || 'Failed to add comment');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{marginTop: 10}}>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Add a comment..."
        required
        rows={2}
        style={{width: '100%'}}
      />
      <br />
      <button type="submit">Post Comment</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </form>
  );
}

export default CommentForm;