/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import { profileService } from './services/profileService';

import PublicNewsPage from './pages/PublicNewsPage';
import LoginPage from './pages/LoginPage';
import AdminAccountsPage from './pages/AdminAccountsPage';
import StaffCategoriesPage from './pages/StaffCategoriesPage';
import StaffNewsPage from './pages/StaffNewsPage';
import StaffHistoryPage from './pages/StaffHistoryPage';
import StaffProfilePage from './pages/StaffProfilePage';

function App() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      if (user.accountRole === 1) {
        setActiveTab('accounts');
      } else {
        setActiveTab('news');
      }
      // Đồng bộ thông tin mới nhất từ database (nếu có đổi tên)
      profileService.getProfile(user.accountId).then(profile => {
        if (profile && profile.accountName && profile.accountName !== user.accountName) {
          const updated = { ...user, accountName: profile.accountName };
          setCurrentUser(updated);
          localStorage.setItem('funews_user', JSON.stringify(updated));
        }
      }).catch(() => {});
    } else {
      setActiveTab('public');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowLogin(false);
    if (user.accountRole === 1) {
      setActiveTab('accounts');
    } else {
      setActiveTab('news');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTab('public');
    setShowLogin(false);
  };

  const handleProfileUpdated = (updatedUser) => {
    const newUser = {
      ...currentUser,
      accountName: updatedUser.accountName
    };
    setCurrentUser(newUser);
    localStorage.setItem('funews_user', JSON.stringify(newUser));
  };

  // Nếu chưa đăng nhập và người dùng bấm nút Đăng nhập
  if (showLogin && !currentUser) {
    return (
      <div className="app-wrapper">
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setShowLogin(false)}
        />
      </div>
    );
  }

  // Nếu chưa đăng nhập -> Hiển thị trang tin tức công khai
  if (!currentUser) {
    return (
      <div className="app-wrapper">
        <header className="app-header">
          <a href="#" className="app-brand">FUNews Management System</a>
          <button className="btn btn-primary btn-sm" onClick={() => setShowLogin(true)}>
            Đăng nhập hệ thống
          </button>
        </header>
        <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <PublicNewsPage />
        </main>
      </div>
    );
  }

  // ĐÃ ĐĂNG NHẬP: Hiển thị giao diện Quản trị viên hoặc Nhân viên
  return (
    <div className="app-wrapper">
      {/* Header chung */}
      <header className="app-header">
        <a href="#" className="app-brand" onClick={() => setActiveTab(currentUser.accountRole === 1 ? 'accounts' : 'news')}>
          FUNews Management System
        </a>
        <div className="user-info">
          <span className="user-badge">
            {currentUser.accountRole === 1 ? 'Quản trị viên (Admin)' : 'Nhân viên (Staff)'}
          </span>
          <span style={{ fontWeight: '500' }}>{currentUser.accountName}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Thân ứng dụng: Sidebar + Main Content */}
      <div className="app-container">
        <aside className="sidebar">
          <ul className="sidebar-nav">
            {/* Menu cho Admin (Role 1) */}
            {currentUser.accountRole === 1 && (
              <li>
                <a
                  className={`sidebar-link ${activeTab === 'accounts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('accounts')}
                >
                  Quản lý Tài khoản
                </a>
              </li>
            )}

            {/* Menu cho Staff (Role 2) */}
            {currentUser.accountRole === 2 && (
              <>
                <li>
                  <a
                    className={`sidebar-link ${activeTab === 'news' ? 'active' : ''}`}
                    onClick={() => setActiveTab('news')}
                  >
                    Quản lý Tin tức
                  </a>
                </li>
                <li>
                  <a
                    className={`sidebar-link ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                  >
                    Quản lý Chuyên mục
                  </a>
                </li>
                <li>
                  <a
                    className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                  >
                    Lịch sử bài viết
                  </a>
                </li>
              </>
            )}

            {/* Menu chung: Hồ sơ cá nhân */}
            <li>
              <a
                className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Thông tin cá nhân
              </a>
            </li>

            {/* Xem trang tin tức công khai */}
            <li>
              <a
                className={`sidebar-link ${activeTab === 'public' ? 'active' : ''}`}
                onClick={() => setActiveTab('public')}
              >
                Trang tin công khai &rarr;
              </a>
            </li>
          </ul>
        </aside>

        <main className="main-content">
          {currentUser.accountRole === 1 && activeTab === 'accounts' && (
            <AdminAccountsPage currentUser={currentUser} />
          )}

          {currentUser.accountRole === 2 && activeTab === 'news' && (
            <StaffNewsPage currentUser={currentUser} />
          )}

          {currentUser.accountRole === 2 && activeTab === 'categories' && (
            <StaffCategoriesPage />
          )}

          {currentUser.accountRole === 2 && activeTab === 'history' && (
            <StaffHistoryPage currentUser={currentUser} />
          )}

          {activeTab === 'profile' && (
            <StaffProfilePage
              currentUser={currentUser}
              onProfileUpdated={handleProfileUpdated}
            />
          )}

          {activeTab === 'public' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab(currentUser.accountRole === 1 ? 'accounts' : 'news')}
                >
                  &larr; Quay lại trang quản trị của bạn
                </button>
              </div>
              <PublicNewsPage />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
