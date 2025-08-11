import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PostList from './components/PostList';
import TabbedDashboard from './components/TabbedDashboard';
import PostCreateForm from './components/PostCreateForm';
import CategoryCreateForm from './components/CategoryCreateForm';
import TagCreateForm from './components/TagCreateForm';
import './App.css';

import { FaTachometerAlt, FaPlus, FaFileAlt, FaFolderOpen, FaTags } from 'react-icons/fa';
import { BiColor } from 'react-icons/bi';
import { GiWhiteBook } from 'react-icons/gi';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const handlePostCreated = () => setRefreshPosts(!refreshPosts);
  const handleCategoryCreated = () => setRefreshCategories(!refreshCategories);
  const handleTagCreated = () => setRefreshTags(!refreshTags);

  // --- Reader View: Only show posts ---
  if (userRole === 'reader') {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1 style={{margin: 0}}>Blogify CMS <b>reader</b></h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </header>
        <main className="main-content" style={{marginLeft: 0}}>
          <PostList userRole={userRole} />
        </main>
      </div>
    );
  }

  // --- Admin/Author View: Full dashboard and sidebar ---
  if (userRole === 'admin' || userRole === 'author') {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1 style={{margin: 0}} >Blogify CMS <b>{userRole}</b></h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </header>
        <nav className="sidebar">
          <ul>
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
              <FaTachometerAlt style={{marginRight: 8}} /> Dashboard
            </li>
            <li className={activeTab === 'createpost' ? 'active' : ''} onClick={() => setActiveTab('createpost')}>
              <FaPlus style={{marginRight: 8}} /> Create Post
            </li>
            <li className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>
              <FaFolderOpen style={{marginRight: 8}} /> Categories
            </li>
            <li className={activeTab === 'tags' ? 'active' : ''} onClick={() => setActiveTab('tags')}>
              <FaTags style={{marginRight: 8}} /> Tags
            </li>
            <li className={activeTab === 'posts' ? 'active' : ''} onClick={() => setActiveTab('posts')}>
              <FaFileAlt style={{marginRight: 8}} /> Posts
            </li>
          </ul>
        </nav>
        <main className="main-content">
          {activeTab === 'dashboard' && (
            <TabbedDashboard
              onPostCreated={handlePostCreated}
              onCategoryCreated={handleCategoryCreated}
              onTagCreated={handleTagCreated}
              refreshCategories={refreshCategories}
              refreshTags={refreshTags}
            />
          )}
          {activeTab === 'createpost' && (
            <PostCreateForm
              onPostCreated={handlePostCreated}
              refreshCategories={refreshCategories}
              refreshTags={refreshTags}
            />
          )}
          {activeTab === 'categories' && (
            <CategoryCreateForm onCategoryCreated={handleCategoryCreated} />
          )}
          {activeTab === 'tags' && (
            <TagCreateForm onTagCreated={handleTagCreated} />
          )}
          {activeTab === 'posts' && (
            <PostList key={refreshPosts} userRole={userRole} />
          )}
        </main>
      </div>
    );
  }

  // --- Login/Register View ---
  return (
    <div className="auth-container">
      {showLogin ? (
        <>
          <LoginForm onLogin={setUserRole} />
          <p className="auth-switch">
            Don't have an account?{' '}
            <button onClick={() => setShowLogin(false)}>Register</button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm onRegister={() => setShowLogin(true)} />
          <p className="auth-switch">
            Already have an account?{' '}
            <button onClick={() => setShowLogin(true)}>Login</button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;