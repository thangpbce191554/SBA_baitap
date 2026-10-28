/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState } from "react";
import CategoryModal from "../components/CategoryModal";
import ConfirmModal from "../components/ConfirmModal";
import { categoryService } from "../services/categoryService";

export default function CategoryPage({ categories = [], onUpdateCategories }) {
  // 1. Search State
  const [searchKeyword, setSearchKeyword] = useState("");

  // 2. Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "update"
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 3. Delete Confirmation State
  const [deleteItem, setDeleteItem] = useState(null);

  // 4. Alert Feedback State
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Mở modal Create: reset form
  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  // Mở modal Update: prefill dữ liệu
  const handleOpenEdit = (category) => {
    setModalMode("update");
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Xử lý submit form Create / Update
  const handleModalSubmit = (formData) => {
    if (modalMode === "create") {
      const result = categoryService.create(formData);
      if (result.success) {
        onUpdateCategories(result.list);
        showAlert("success", "Đã thêm danh mục mới thành công!");
      }
    } else if (modalMode === "update" && selectedCategory) {
      const result = categoryService.update(selectedCategory.id, formData);
      if (result.success) {
        onUpdateCategories(result.list);
        showAlert("success", "Đã cập nhật danh mục thành công!");
      } else {
        showAlert("danger", result.message);
      }
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  // Xử lý xóa danh mục (Có kiểm tra chính sách Restrict)
  const handleConfirmDelete = () => {
    if (!deleteItem) return;

    const result = categoryService.delete(deleteItem.id);
    if (result.success) {
      onUpdateCategories(result.list);
      showAlert("success", result.message || "Đã xóa danh mục thành công!");
    } else {
      // Bị chặn do có News đang sử dụng
      showAlert("danger", result.message);
    }

    setDeleteItem(null);
  };

  // Logic Search: Chuẩn hóa trim/lowercase, kiểm tra null an toàn
  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const displayedCategories = categories.filter((cat) => {
    if (!normalizedKeyword) return true;
    const catName = (cat.name || "").toLowerCase();
    return catName.includes(normalizedKeyword);
  });

  return (
    <div className="category-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Danh mục Tin tức</h2>
          <p className="page-description">
            Quản lý cấu trúc chuyên mục bài viết của hệ thống FUNews
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreate}
        >
          ➕ Thêm mới Danh mục
        </button>
      </div>

      {/* Thông báo Alert */}
      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          <span>{alert.type === "success" ? "✅" : "⚠️"} {alert.message}</span>
        </div>
      )}

      {/* Thanh tìm kiếm */}
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Tìm kiếm theo tên danh mục..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          {searchKeyword && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchKeyword("")}
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Render bảng dữ liệu */}
      {categories.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <div className="empty-title">Chưa có danh mục nào</div>
            <p className="empty-desc">Hệ thống hiện tại chưa có danh mục tin tức nào được tạo.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleOpenCreate}
            >
              Thêm danh mục đầu tiên
            </button>
          </div>
        </div>
      ) : displayedCategories.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Không tìm thấy kết quả</div>
            <p className="empty-desc">
              Không có danh mục nào khớp với từ khóa "{searchKeyword}".
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSearchKeyword("")}
            >
              Xóa bộ lọc tìm kiếm
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "120px" }}>Mã ID</th>
                <th>Tên danh mục</th>
                <th style={{ width: "160px" }}>Trạng thái</th>
                <th style={{ width: "180px", textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {displayedCategories.map((cat) => (
                <tr key={cat.id}>
                  <td><code>{cat.id}</code></td>
                  <td><strong>{cat.name}</strong></td>
                  <td>
                    <span
                      className={`badge ${
                        cat.status === 1 ? "badge-active" : "badge-inactive"
                      }`}
                    >
                      {cat.status === 1 ? "Hoạt động (Active)" : "Tạm ẩn (Inactive)"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEdit(cat)}
                        title="Chỉnh sửa danh mục"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteItem(cat)}
                        title="Xóa danh mục"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup Dialog Thêm mới / Cập nhật */}
      <CategoryModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedCategory}
        onSubmit={handleModalSubmit}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
      />

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={!!deleteItem}
        title="Xác nhận xóa Danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${deleteItem?.name}" không? Lưu ý: Nếu danh mục đang chứa bài viết, hệ thống sẽ từ chối xóa.`}
        confirmText="Xóa danh mục"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
