import React, { useState, useEffect } from 'react';

function CategoryCreateForm({ onCategoryCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refresh, setRefresh] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetch('http://localhost/backend/api/categories.php')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, [success, refresh]);

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

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await fetch('http://localhost/backend/api/delete_category.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });
    setSuccess('Category deleted!');
    setRefresh(r => !r); // Refresh the list
  };

  return (
    <div className="card">
      <h2>Categories</h2>
      <form onSubmit={handleSubmit} style={{marginBottom: 20}}>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit">Create Category</button>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
      </form>
      <ul style={{padding: 0, listStyle: 'none'}}>
        {categories.map(cat => (
          <li key={cat.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, background: '#f7faff', borderRadius: 6, padding: '8px 12px'}}>
            <span>
              <b>{cat.name}</b> {cat.description && <span style={{color: '#888'}}>({cat.description})</span>}
            </span>
            <button
              className="logout-btn"
              style={{padding: '6px 14px', fontSize: '0.95em'}}
              onClick={() => handleDelete(cat.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryCreateForm;