import React, { useState, useEffect } from 'react';

function PostCreateForm({ onPostCreated, refreshCategories, refreshTags }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('http://localhost/backend/api/categories.php')
      .then(res => res.json())
      .then(data => setCategories(data));
    fetch('http://localhost/backend/api/tags.php')
      .then(res => res.json())
      .then(data => setTags(data));
  }, [refreshCategories, refreshTags]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost/backend/api/create_post.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content,
          status,
          category_id: categoryId,
          tags: selectedTags
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Post created!');
        setTitle('');
        setContent('');
        setStatus('draft');
        setCategoryId('');
        setSelectedTags([]);
        if (onPostCreated) onPostCreated();
      } else {
        setError(data.error || 'Failed to create post');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{marginBottom: 20}}>
      <h2>Create New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        style={{width: '100%', marginBottom: 8}}
      /><br />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        rows={5}
        style={{width: '100%', marginBottom: 8}}
      /><br />
      <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select><br />
      {/* Tag multi-select */}
      <select
        multiple
        value={selectedTags}
        onChange={e => setSelectedTags(Array.from(e.target.selectedOptions, option => option.value))}
        style={{width: '100%', marginBottom: 8}}
      >
        {tags.map(tag => (
          <option key={tag.id} value={tag.id}>{tag.name}</option>
        ))}
      </select><br />
      <select value={status} onChange={e => setStatus(e.target.value)} style={{marginBottom: 8}}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select><br />
      <button type="submit">Create Post</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {success && <div style={{color: 'green'}}>{success}</div>}
    </form>
  );
}

export default PostCreateForm;