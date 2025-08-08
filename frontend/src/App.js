import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PostList from './components/PostList';
import TabbedDashboard from './components/TabbedDashboard'; // Import the tabbed dashboard
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [refreshCategories, setRefreshCategories] = useState(false);
  const [refreshTags, setRefreshTags] = useState(false);

  const handleLogout = async () => {
    await fetch('http://localhost/backend/api/logout.php', {
      method: 'POST',
      credentials: 'include',
    });
    setUserRole(null);
    setShowLogin(true);
  };

  const handlePostCreated = () => {
    setRefreshPosts(!refreshPosts);
  };

  const handleCategoryCreated = () => {
    setRefreshCategories(!refreshCategories);
  };

  const handleTagCreated = () => {
    setRefreshTags(!refreshTags);
  };

  if (userRole) {
    return (
      <div style={{
        maxWidth: 900,
        margin: '40px auto',
        padding: 20,
        border: '1px solid #ccc',
        borderRadius: 8,
        background: '#fff'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <h1>Welcome! You are logged in as <b>{userRole}</b></h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
        {(userRole === 'admin' || userRole === 'author') && (
          <TabbedDashboard
            onPostCreated={handlePostCreated}
            onCategoryCreated={handleCategoryCreated}
            onTagCreated={handleTagCreated}
            refreshCategories={refreshCategories}
            refreshTags={refreshTags}
          />
        )}
        {/* Pass userRole to PostList for edit/delete buttons */}
        <PostList key={refreshPosts} userRole={userRole} />
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 400,
      margin: '40px auto',
      padding: 20,
      border: '1px solid #ccc',
      borderRadius: 8,
      background: '#fff'
    }}>
      {showLogin ? (
        <>
          <LoginForm onLogin={setUserRole} />
          <p>
            Don't have an account?{' '}
            <button onClick={() => setShowLogin(false)}>Register</button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm onRegister={() => setShowLogin(true)} />
          <p>
            Already have an account?{' '}
            <button onClick={() => setShowLogin(true)}>Login</button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;