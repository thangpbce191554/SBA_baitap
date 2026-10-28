/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from "react";

export default function CategoryModal({
  isOpen,
  mode = "create", // "create" | "update"
  initialData = null,
  onSubmit,
  onClose,
}) {
  // State quản lý giá trị trường form
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const [error, setError] = useState("");

  // Đồng bộ state form khi modal mở hoặc thay đổi selected item
  useEffect(() => {
    if (isOpen) {
      if (mode === "update" && initialData) {
        setName(initialData.name || "");
        setStatus(initialData.status ?? 1);
      } else {
        // Mode create: reset form trắng
        setName("");
        setStatus(1);
      }
      setError("");
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    // Validate trường bắt buộc: Tên danh mục không được để trống
    if (!cleanName) {
      setError("Vui lòng nhập tên danh mục!");
      return;
    }

    // Gửi dữ liệu hợp lệ về trang quản lý
    onSubmit({
      name: cleanName,
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
            {mode === "create" ? "Thêm mới Danh mục" : "Cập nhật Danh mục"}
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
              <label className="form-label" htmlFor="category-name">
                Tên danh mục <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                id="category-name"
                type="text"
                className={`form-control ${error ? "input-error" : ""}`}
                placeholder="Ví dụ: Công nghệ, Kinh doanh..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
              />
              {error && <span className="form-error">{error}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category-status">
                Trạng thái hoạt động
              </label>
              <select
                id="category-status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
              >
                <option value={1}>Hoạt động (Active)</option>
                <option value={0}>Tạm ẩn (Inactive)</option>
              </select>
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
              {mode === "create" ? "Tạo danh mục" : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
