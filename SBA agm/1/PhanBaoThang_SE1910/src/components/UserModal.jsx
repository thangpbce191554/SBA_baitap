/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from "react";

export default function UserModal({
  isOpen,
  mode = "create",
  initialData = null,
  onSubmit,
  onClose,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(2); // Mặc định Staff (2)
  const [status, setStatus] = useState(1);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === "update" && initialData) {
        setUsername(initialData.username || "");
        setPassword(""); // Để trống khi mở form sửa, người dùng chỉ nhập khi muốn đổi mật khẩu
        setRole(initialData.role ?? 2);
        setStatus(initialData.status ?? 1);
      } else {
        setUsername("");
        setPassword("");
        setRole(2);
        setStatus(1);
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      newErrors.username = "Vui lòng nhập tên đăng nhập!";
    }

    if (mode === "create" && !password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu cho tài khoản mới!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      username: cleanUsername,
      password: password.trim(),
      role: Number(role),
      status: Number(status),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            {mode === "create" ? "Thêm mới Tài khoản" : "Cập nhật Tài khoản"}
          </h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title="Đóng"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="user-username">
                Tên đăng nhập <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                id="user-username"
                type="text"
                className={`form-control ${errors.username ? "input-error" : ""}`}
                placeholder="Nhập username..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
                }}
                autoFocus
              />
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="user-password">
                Mật khẩu {mode === "create" && <span style={{ color: "var(--danger)" }}>*</span>}
              </label>
              <input
                id="user-password"
                type="password"
                className={`form-control ${errors.password ? "input-error" : ""}`}
                placeholder={mode === "update" ? "Để trống nếu không muốn đổi mật khẩu" : "Nhập mật khẩu..."}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                }}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
              {mode === "update" && (
                <small style={{ color: "var(--text-muted)", fontSize: "11px", display: "block", marginTop: "3px" }}>
                  💡 Gõ mật khẩu mới vào ô trên để đổi mật khẩu (ví dụ: 123)
                </small>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="user-role">
                  Vai trò (Role)
                </label>
                <select
                  id="user-role"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(Number(e.target.value))}
                >
                  <option value={1}>Quản trị viên (Admin)</option>
                  <option value={2}>Nhân viên (Staff)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-status">
                  Trạng thái
                </label>
                <select
                  id="user-status"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value))}
                >
                  <option value={1}>Hoạt động (Active)</option>
                  <option value={0}>Khóa (Inactive)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === "create" ? "Tạo tài khoản" : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
