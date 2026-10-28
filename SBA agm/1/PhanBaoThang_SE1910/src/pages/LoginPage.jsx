/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState } from "react";
import { authService } from "../services/authService";
import logoSvg from "../assets/logo.svg";

export default function LoginPage({ onLoginSuccess }) {
  // State quản lý giá trị controlled inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State quản lý lỗi hiển thị
  const [errorMessage, setErrorMessage] = useState("");

  // Xử lý sự kiện gửi form đăng nhập
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // 1. Validate trường rỗng
    if (!cleanUsername || !cleanPassword) {
      setErrorMessage("Vui lòng nhập đầy đủ cả tên đăng nhập và mật khẩu!");
      return;
    }

    // 2. Gọi service kiểm tra thông tin đăng nhập
    const result = authService.login(cleanUsername, cleanPassword);

    if (result.success) {
      setErrorMessage("");
      // Cập nhật auth state ở cấp ứng dụng cha (App.jsx)
      onLoginSuccess(result.user);
    } else {
      setErrorMessage(result.message || "Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logoSvg} alt="FUNews Logo" className="login-logo" />
          <h1 className="login-title">FUNews Management</h1>
          <p className="login-subtitle">Đăng nhập hệ thống quản trị tin tức</p>
        </div>

        {/* Thông báo lỗi khi thông tin không hợp lệ */}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">
              Tên đăng nhập
            </label>
            <input
              id="login-username"
              type="text"
              className={`form-control ${errorMessage && !username ? "input-error" : ""}`}
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Mật khẩu
            </label>
            <input
              id="login-password"
              type="password"
              className={`form-control ${errorMessage && !password ? "input-error" : ""}`}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Đăng nhập hệ thống
          </button>
        </form>
      </div>
    </div>
  );
}
