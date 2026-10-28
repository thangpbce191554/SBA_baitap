/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState } from "react";
import NewsModal from "../components/NewsModal";
import ConfirmModal from "../components/ConfirmModal";
import { newsService } from "../services/newsService";

export default function NewsPage({
  news = [],
  categories = [],
  currentUser = null,
  onUpdateNews,
}) {
  // 1. Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // 2. Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedNews, setSelectedNews] = useState(null);

  // 3. Delete Confirmation State
  const [deleteItem, setDeleteItem] = useState(null);

  // 4. Alert Feedback
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedNews(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article) => {
    setModalMode("update");
    setSelectedNews(article);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (modalMode === "create") {
      const creator = currentUser?.username || "Admin";
      const result = newsService.create(formData, creator);
      if (result.success) {
        onUpdateNews(result.list);
        showAlert("success", "Đã đăng bài viết tin tức mới thành công!");
      }
    } else if (modalMode === "update" && selectedNews) {
      const result = newsService.update(selectedNews.id, formData);
      if (result.success) {
        onUpdateNews(result.list);
        showAlert("success", "Đã cập nhật bài viết thành công!");
      } else {
        showAlert("danger", result.message);
      }
    }
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteItem) return;

    const result = newsService.delete(deleteItem.id);
    if (result.success) {
      onUpdateNews(result.list);
      showAlert("success", "Đã xóa bài viết thành công!");
    } else {
      showAlert("danger", result.message);
    }
    setDeleteItem(null);
  };

  // Search & Filter Logic
  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const displayedNews = news.filter((item) => {
    // Lọc theo Category
    if (selectedCategoryFilter !== "all" && item.categoryId !== selectedCategoryFilter) {
      return false;
    }

    // Lọc theo Từ khóa
    if (!normalizedKeyword) return true;
    const titleMatch = (item.title || "").toLowerCase().includes(normalizedKeyword);
    const contentMatch = (item.content || "").toLowerCase().includes(normalizedKeyword);
    const tagsMatch = (item.tags || "").toLowerCase().includes(normalizedKeyword);

    return titleMatch || contentMatch || tagsMatch;
  });

  return (
    <div className="news-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Bài viết Tin tức</h2>
          <p className="page-description">
            Tạo mới, chỉnh sửa, liên kết chuyên mục và quản lý xuất bản tin tức
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreate}
          disabled={categories.length === 0}
          title={categories.length === 0 ? "Cần tạo danh mục trước khi viết bài" : "Thêm bài viết mới"}
        >
          ➕ Viết bài mới
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          <span>{alert.type === "success" ? "✅" : "⚠️"} {alert.message}</span>
        </div>
      )}

      {/* Thanh tìm kiếm & Lọc theo Danh mục */}
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Tìm kiếm bài viết theo tiêu đề, tags..."
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

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-muted)" }}>
            Danh mục:
          </label>
          <select
            className="form-select"
            style={{ width: "180px", padding: "6px 10px" }}
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render danh sách bài viết */}
      {news.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📰</div>
            <div className="empty-title">Chưa có bài viết nào</div>
            <p className="empty-desc">Hãy bắt đầu tạo bài viết tin tức đầu tiên cho hệ thống.</p>
            {categories.length > 0 && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleOpenCreate}
              >
                Viết bài ngay
              </button>
            )}
          </div>
        </div>
      ) : displayedNews.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Không tìm thấy bài viết</div>
            <p className="empty-desc">
              Không có bài viết nào phù hợp với điều kiện tìm kiếm hiện tại.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchKeyword("");
                setSelectedCategoryFilter("all");
              }}
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "100px" }}>Mã ID</th>
                <th>Tiêu đề & Phân loại</th>
                <th style={{ width: "150px" }}>Danh mục</th>
                <th style={{ width: "110px" }}>Tác giả</th>
                <th style={{ width: "130px" }}>Trạng thái</th>
                <th style={{ width: "150px", textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {displayedNews.map((item) => {
                const category = categories.find((c) => c.id === item.categoryId);
                return (
                  <tr key={item.id}>
                    <td><code>{item.id}</code></td>
                    <td>
                      <div style={{ fontWeight: "bold", marginBottom: "3px" }}>{item.title}</div>
                      {item.tags && (
                        <div>
                          {item.tags.split(",").map((tag, idx) => (
                            <span key={idx} className="tag-badge">
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-inactive">
                        {category ? category.name : "Không xác định"}
                      </span>
                    </td>
                    <td>{item.createdBy || "Admin"}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.status === 1 ? "badge-active" : "badge-inactive"
                        }`}
                      >
                        {item.status === 1 ? "Công khai" : "Bản nháp"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(item)}
                          title="Chỉnh sửa bài viết"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteItem(item)}
                          title="Xóa bài viết"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Create / Update News */}
      <NewsModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedNews}
        categories={categories}
        onSubmit={handleModalSubmit}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNews(null);
        }}
      />

      {/* Modal xác nhận xóa News */}
      <ConfirmModal
        isOpen={!!deleteItem}
        title="Xác nhận xóa Bài viết"
        message={`Bạn có chắc chắn muốn xóa bài viết "${deleteItem?.title}"?`}
        confirmText="Xóa bài viết"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
