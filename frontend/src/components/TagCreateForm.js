import React, { useState, useEffect } from 'react';

function TagCreateForm({ onTagCreated }) {
  const [name, setName] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refresh, setRefresh] = useState(false);

  // Fetch tags
  useEffect(() => {
    fetch('http://localhost/backend/api/tags.php')
      .then(res => res.json())
      .then(data => setTags(data));
  }, [success, refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost/backend/api/create_tag.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Tag created!');
        setName('');
        if (onTagCreated) onTagCreated();
      } else {
        setError(data.error || 'Failed to create tag');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  // Delete tag
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tag?')) return;
    await fetch('http://localhost/backend/api/delete_tag.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });
    setSuccess('Tag deleted!');
    setRefresh(r => !r); // Refresh the list
  };

  return (
    <div className="card">
      <h2>Tags</h2>
      <form onSubmit={handleSubmit} style={{marginBottom: 20}}>
        <input
          type="text"
          placeholder="Tag Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button type="submit">Create Tag</button>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
      </form>
      <ul style={{padding: 0, listStyle: 'none'}}>
        {tags.map(tag => (
          <li key={tag.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, background: '#f7faff', borderRadius: 6, padding: '8px 12px'}}>
            <span><b>{tag.name}</b></span>
            <button
              className="logout-btn"
              style={{padding: '6px 14px', fontSize: '0.95em'}}
              onClick={() => handleDelete(tag.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TagCreateForm;