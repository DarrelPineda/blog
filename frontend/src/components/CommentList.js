import React, { useEffect, useState } from 'react';

function CommentList({ postId, refresh }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/backend/api/get_comments.php?post_id=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data));
  }, [postId, refresh]);

  if (!comments.length) return <div>No comments yet.</div>;

  return (
    <div style={{marginTop: 10}}>
      <h4>Comments</h4>
      {comments.map(c => (
        <div key={c.id} style={{borderBottom: '1px solid #eee', marginBottom: 5, paddingBottom: 5}}>
          <b>{c.username}</b> <small>{new Date(c.created_at).toLocaleString()}</small>
          <div>{c.comment_text}</div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;