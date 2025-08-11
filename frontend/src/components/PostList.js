import React, { useEffect, useState } from 'react';
import CommentList from './CommentList';

function PostList({ userRole }) {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editStatus, setEditStatus] = useState('draft');

  useEffect(() => {
    fetch('http://localhost/backend/api/posts.php')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await fetch('http://localhost/backend/api/delete_post.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });
    setPosts(posts.filter(post => post.id !== id));
  };

  const startEdit = (post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditStatus(post.status);
  };

  const handleEdit = async (id) => {
    await fetch('http://localhost/backend/api/edit_post.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        id,
        title: editTitle,
        content: editContent,
        status: editStatus,
      }),
    });
    setEditingPostId(null);
    setPosts(posts.map(post =>
      post.id === id
        ? { ...post, title: editTitle, content: editContent, status: editStatus }
        : post
    ));
  };

  // Separate published and draft posts
  const publishedPosts = posts.filter(post => post.status === 'published');
  const draftPosts = posts.filter(post => post.status === 'draft');

  return (
    <div>
      <h2 style={{marginTop: 32, marginBottom: 24}}>Blog Posts</h2>
      {publishedPosts.length === 0 && <div>No published posts found.</div>}
      {publishedPosts.map(post => (
        <div key={post.id} style={{
          border: '1px solid #ccc',
          margin: '16px 0',
          padding: 24,
          borderRadius: 12,
          background: '#fafbfc'
        }}>
          {editingPostId === post.id ? (
            <div>
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                style={{width: '100%', marginBottom: 8}}
              />
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                style={{width: '100%', marginBottom: 8}}
              />
              <select
                value={editStatus}
                onChange={e => setEditStatus(e.target.value)}
                style={{marginBottom: 8}}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <br />
              <button onClick={() => handleEdit(post.id)} style={{marginRight: 8}}>Save</button>
              <button onClick={() => setEditingPostId(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <h3 style={{marginBottom: 8}}>{post.title}</h3>
              <div style={{marginBottom: 8}}>
                <small>
                  By <b>{post.author}</b> | Category: <b>{post.category || 'Uncategorized'}</b> | {new Date(post.created_at).toLocaleString()}
                </small>
              </div>
              <p style={{marginBottom: 12}}>
                {post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}
              </p>
              {(userRole === 'admin' || userRole === 'author') && (
                <div>
                  <button onClick={() => startEdit(post)} style={{marginRight: 8}}>Edit</button>
                  <button onClick={() => handleDelete(post.id)} style={{color: '#fff', background: '#ff4d4f', border: 'none', padding: '6px 16px', borderRadius: 4}}>Delete</button>
                </div>
              )}
              {/* Show comments under each post */}
              <CommentList postId={post.id} />
            </>
          )}
        </div>
      ))}

      {/* DRAFTS SECTION */}
      {(userRole === 'admin' || userRole === 'author') && (
        <>
          <h2 style={{marginTop: 40, marginBottom: 24}}>Drafts</h2>
          {draftPosts.length === 0 && <div>No drafts found.</div>}
          {draftPosts.map(post => (
            <div key={post.id} style={{
              border: '1px dashed #ffb300',
              margin: '16px 0',
              padding: 24,
              borderRadius: 12,
              background: '#fffbe6'
            }}>
              {editingPostId === post.id ? (
                <div>
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    style={{width: '100%', marginBottom: 8}}
                  />
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    style={{width: '100%', marginBottom: 8}}
                  />
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    style={{marginBottom: 8}}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <br />
                  <button onClick={() => handleEdit(post.id)} style={{marginRight: 8}}>Save</button>
                  <button onClick={() => setEditingPostId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <h3 style={{marginBottom: 8}}>{post.title} <span style={{color: '#ffb300', fontWeight: 'bold'}}>(Draft)</span></h3>
                  <div style={{marginBottom: 8}}>
                    <small>
                      By <b>{post.author}</b> | Category: <b>{post.category || 'Uncategorized'}</b> | {new Date(post.created_at).toLocaleString()}
                    </small>
                  </div>
                  <p style={{marginBottom: 12}}>
                    {post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}
                  </p>
                  <div>
                    <button onClick={() => startEdit(post)} style={{marginRight: 8}}>Edit</button>
                    <button onClick={() => handleDelete(post.id)} style={{color: '#fff', background: '#ff4d4f', border: 'none', padding: '6px 16px', borderRadius: 4}}>Delete</button>
                  </div>
                  {/* Show comments under each draft post */}
                  <CommentList postId={post.id} />
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default PostList;