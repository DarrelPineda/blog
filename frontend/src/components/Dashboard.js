import React, { useEffect, useState } from 'react';
import { FaUser, FaFileAlt, FaFolderOpen, FaComments } from 'react-icons/fa';

function Dashboard() {
  // Always initialize with all needed keys
  const [stats, setStats] = useState({ users: 0, posts: 0, categories: 0, comments: 0 });
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('http://localhost/backend/api/dashboard_stats.php', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        // Defensive: if data.stats is missing, use default
        setStats(data && data.stats ? data.stats : { users: 0, posts: 0, categories: 0, comments: 0 });
        setUsername(data && data.username ? data.username : '');
      })
      .catch(() => {
        setStats({ users: 0, posts: 0, categories: 0, comments: 0 });
        setUsername('');
      });
  }, []);

  // Defensive rendering
  if (!stats || typeof stats.users === 'undefined') {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-welcome">
        Welcome, <b>{username}</b>!
      </div>
      <div className="dashboard-cards">
        <div className="dashboard-card users">
          <div className="dashboard-card-icon"><FaUser /></div>
          <div className="dashboard-card-number">{stats.users}</div>
          <div>Users</div>
        </div>
        <div className="dashboard-card posts">
          <div className="dashboard-card-icon"><FaFileAlt /></div>
          <div className="dashboard-card-number">{stats.posts}</div>
          <div>Posts</div>
        </div>
        <div className="dashboard-card categories">
          <div className="dashboard-card-icon"><FaFolderOpen /></div>
          <div className="dashboard-card-number">{stats.categories}</div>
          <div>Categories</div>
        </div>
        <div className="dashboard-card comments">
          <div className="dashboard-card-icon"><FaComments /></div>
          <div className="dashboard-card-number">{stats.comments}</div>
          <div>Comments</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;