/**
 * Phan Bảo Thắng
 * SE1910
 */
import React from "react";

export default function Header({ activeTab, currentUser, onLogout }) {
  // Bản đồ tiêu đề theo tab điều hướng hiện tại
  const TAB_TITLES = {
    dashboard: "Bảng điều khiển (Dashboard)",
    categories: "Quản lý Danh mục Tin tức (Category)",
    news: "Quản lý Bài viết Tin tức (News)",
    users: "Quản lý Tài khoản & Phân quyền (Users)",
    settings: "Cài đặt & Thông tin tài khoản (Settings)",
  };

  const currentTitle = TAB_TITLES[activeTab] || "Hệ thống quản trị";

  return (
    <header className="app-header">
      <div className="header-title-box">
        <h1>{currentTitle}</h1>
      </div>

      <div className="header-user-nav">
        {currentUser && (
          <div className="user-badge">
            <div className="user-avatar" title={currentUser.username}>
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info-text">
              <span className="user-name">{currentUser.username}</span>
              <span className="user-role-label">
                {currentUser.role === 1 ? "Quản trị viên" : "Nhân viên"}
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onLogout}
          title="Đăng xuất khỏi hệ thống"
        >
          🚪 Đăng xuất
        </button>
      </div>
    </header>
  );
}
