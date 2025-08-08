import React, { useState } from 'react';
import Dashboard from './Dashboard';
import PostCreateForm from './PostCreateForm';
import CategoryCreateForm from './CategoryCreateForm';
import TagCreateForm from './TagCreateForm';

function TabbedDashboard({
  onPostCreated,
  onCategoryCreated,
  onTagCreated,
  refreshCategories,
  refreshTags
}) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div>
      <div className="tabbed-dashboard-tabs">
        <div
          className={`tabbed-dashboard-tab${activeTab === 'dashboard' ? ' active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </div>
        <div
          className={`tabbed-dashboard-tab${activeTab === 'createpost' ? ' active' : ''}`}
          onClick={() => setActiveTab('createpost')}
        >
          Create Post
        </div>
        <div
          className={`tabbed-dashboard-tab${activeTab === 'categories' ? ' active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </div>
        <div
          className={`tabbed-dashboard-tab${activeTab === 'tags' ? ' active' : ''}`}
          onClick={() => setActiveTab('tags')}
        >
          Tags
        </div>
      </div>
      <div>
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'createpost' && (
          <PostCreateForm
            onPostCreated={onPostCreated}
            refreshCategories={refreshCategories}
            refreshTags={refreshTags}
          />
        )}
        {activeTab === 'categories' && (
          <CategoryCreateForm onCategoryCreated={onCategoryCreated} />
        )}
        {activeTab === 'tags' && (
          <TagCreateForm onTagCreated={onTagCreated} />
        )}
      </div>
    </div>
  );
}

export default TabbedDashboard;