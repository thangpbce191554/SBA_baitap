/**
 * Phan Bảo Thắng
 * SE1910
 */
import React from "react";
import logoSvg from "../assets/logo.svg";

export default function Sidebar({ activeTab, onSelectTab, currentUser }) {
  // Cấu hình 5 mục menu bắt buộc theo rubric R06
  const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "categories", label: "Category", icon: "📂" },
    { id: "news", label: "News", icon: "📰" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="sidebar">
      {/* Brand & Logo */}
      <div className="sidebar-brand">
        <img src={logoSvg} alt="FUNews Logo" className="sidebar-logo" />
        <span className="sidebar-brand-name">FUNews Admin</span>
      </div>

      {/* Danh sách 5 mục điều hướng */}
      <nav className="sidebar-menu">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`menu-item-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectTab(item.id)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Thông tin sinh viên & đề tài */}
      <div className="sidebar-footer">
        <div><strong>Phan Bảo Thắng</strong></div>
        <div>Lớp SE1910 • SBA301</div>
      </div>
    </aside>
  );
}
