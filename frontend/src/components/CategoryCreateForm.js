import React, { useState } from 'react';

function CategoryCreateForm({ onCategoryCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost/backend/api/create_category.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Category created!');
        setName('');
        setDescription('');
        if (onCategoryCreated) onCategoryCreated();
      } else {
        setError(data.error || 'Failed to create category');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{marginBottom: 20}}>
      <h2>Create Category</h2>
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{width: '100%', marginBottom: 8}}
      /><br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={2}
        style={{width: '100%', marginBottom: 8}}
      /><br />
      <button type="submit">Create Category</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {success && <div style={{color: 'green'}}>{success}</div>}
    </form>
  );
}

export default CategoryCreateForm;