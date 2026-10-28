/**
 * Phan Bảo Thắng
 * SE1910
 */
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ activeTab, onSelectTab, currentUser, onLogout, children }) {
  return (
    <div className="admin-layout">
      {/* Sidebar thanh điều hướng bên trái */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        currentUser={currentUser}
      />

      {/* Vùng nội dung chính bên phải */}
      <div className="main-wrapper">
        <Header
          activeTab={activeTab}
          currentUser={currentUser}
          onLogout={onLogout}
        />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
