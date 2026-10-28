/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./components/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import CategoryPage from "./pages/CategoryPage";
import NewsPage from "./pages/NewsPage";
import UserPage from "./pages/UserPage";
import SettingsPage from "./pages/SettingsPage";

import { authService } from "./services/authService";
import { categoryService } from "./services/categoryService";
import { newsService } from "./services/newsService";
import { userService } from "./services/userService";

export default function App() {
  // 1. Quản lý trạng thái đăng nhập (Auth State)
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  // 2. Quản lý tab điều hướng hiện tại (Navigation State: dashboard, categories, news, users, settings)
  const [activeTab, setActiveTab] = useState("dashboard");

  // 3. Quản lý dữ liệu dùng chung (Shared Data State) từ Mock Service
  const [categories, setCategories] = useState([]);
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);

  // Nạp dữ liệu ban đầu từ Service Layer khi ứng dụng khởi chạy
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setCategories(categoryService.getAll());
    setNews(newsService.getAll());
    setUsers(userService.getAll());
  };

  // Xử lý khi đăng nhập thành công
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab("dashboard");
    loadAllData();
  };

  // Xử lý khi đăng xuất
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTab("dashboard");
  };

  // 4. Auth Guard / Conditional Rendering:
  // Nếu chưa đăng nhập -> Hiển thị trang Login
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Nếu đã đăng nhập -> Hiển thị Master Admin Layout chứa nội dung theo từng tab
  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {activeTab === "dashboard" && (
        <DashboardPage
          categories={categories}
          news={news}
          users={users}
          onNavigate={setActiveTab}
        />
      )}

      {activeTab === "categories" && (
        <CategoryPage
          categories={categories}
          onUpdateCategories={setCategories}
        />
      )}

      {activeTab === "news" && (
        <NewsPage
          news={news}
          categories={categories}
          currentUser={currentUser}
          onUpdateNews={setNews}
        />
      )}

      {activeTab === "users" && (
        <UserPage
          users={users}
          currentUser={currentUser}
          onUpdateUsers={setUsers}
        />
      )}

      {activeTab === "settings" && (
        <SettingsPage currentUser={currentUser} />
      )}
    </AdminLayout>
  );
}
