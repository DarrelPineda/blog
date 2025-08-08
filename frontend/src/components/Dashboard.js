import React, { useEffect, useState } from 'react';

function Dashboard({ setActiveTab }) {
  const [stats, setStats] = useState({ users: 0, posts: 0, categories: 0, comments: 0 });
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('http://localhost/backend/api/dashboard_stats.php', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setUsername(data.username);
      });
  }, []);

  return (
    <div className="dashboard">
      <h2 style={{ fontSize: '2.2em', marginBottom: 8 }}>Dashboard</h2>
      <div className="dashboard-welcome" style={{ marginBottom: 24 }}>
        Welcome, <b>{username}</b>!
      </div>
      <div className="dashboard-cards">
        <div className="dashboard-card users">
          <div className="dashboard-card-number">{stats.users}</div>
          <div>Users</div>
        </div>
        <div className="dashboard-card posts">
          <div className="dashboard-card-number">{stats.posts}</div>
          <div>Posts</div>
        </div>
        <div className="dashboard-card categories">
          <div className="dashboard-card-number">{stats.categories}</div>
          <div>Categories</div>
        </div>
        <div className="dashboard-card comments">
          <div className="dashboard-card-number">{stats.comments}</div>
          <div>Comments</div>
        </div>
      </div>
      <div className="dashboard-links" style={{ marginTop: 18 }}>
        <a href="#" onClick={e => { e.preventDefault(); setActiveTab('createpost'); }}>+ Create Post</a>
        <a href="#" onClick={e => { e.preventDefault(); setActiveTab('categories'); }}>Manage Categories</a>
        <a href="#" onClick={e => { e.preventDefault(); setActiveTab('tags'); }}>Manage Tags</a>
      </div>
    </div>
  );
}

export default Dashboard;