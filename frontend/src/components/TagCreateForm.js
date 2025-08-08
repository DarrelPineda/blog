import React, { useState } from 'react';

function TagCreateForm({ onTagCreated }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  return (
    <form onSubmit={handleSubmit} style={{marginBottom: 20}}>
      <h2>Create Tag</h2>
      <input
        type="text"
        placeholder="Tag Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{width: '100%', marginBottom: 8}}
      /><br />
      <button type="submit">Create Tag</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {success && <div style={{color: 'green'}}>{success}</div>}
    </form>
  );
}

export default TagCreateForm;