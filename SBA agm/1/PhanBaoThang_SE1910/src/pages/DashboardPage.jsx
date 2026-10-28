/**
 * Phan Bảo Thắng
 * SE1910
 */
import React from "react";

export default function DashboardPage({ categories = [], news = [], users = [], onNavigate }) {
  // Tính toán số liệu thống kê tổng hợp
  const totalNews = news.length;
  const activeNews = news.filter((n) => n.status === 1).length;

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === 1).length;

  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === 1).length;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Tổng quan hệ thống tin tức</h2>
          <p className="page-description">Báo cáo tóm tắt số liệu các thực thể trong hệ thống</p>
        </div>
      </div>

      {/* Grid thống kê tổng hợp */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📰</div>
          <div className="stat-content">
            <span className="stat-value">{totalNews}</span>
            <span className="stat-label">Tổng bài viết ({activeNews} đang hiển thị)</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">📂</div>
          <div className="stat-content">
            <span className="stat-value">{totalCategories}</span>
            <span className="stat-label">Danh mục ({activeCategories} hoạt động)</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">👥</div>
          <div className="stat-content">
            <span className="stat-value">{totalUsers}</span>
            <span className="stat-label">Tài khoản ({adminUsers} Admin)</span>
          </div>
        </div>
      </div>

      {/* Bảng tóm tắt bài viết gần nhất */}
      <div className="card">
        <div className="page-header" style={{ marginBottom: "14px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "bold" }}>Bài viết mới nhất trong hệ thống</h3>
          {onNavigate && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate("news")}
            >
              Xem tất cả bài viết →
            </button>
          )}
        </div>

        {news.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">Chưa có bài viết nào</div>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tiêu đề bài viết</th>
                  <th>Danh mục</th>
                  <th>Tác giả</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {news.slice(0, 5).map((item) => {
                  const cat = categories.find((c) => c.id === item.categoryId);
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: "bold" }}>{item.title}</td>
                      <td>{cat ? cat.name : "—"}</td>
                      <td>{item.createdBy}</td>
                      <td>
                        <span className={`badge ${item.status === 1 ? "badge-active" : "badge-inactive"}`}>
                          {item.status === 1 ? "Hoạt động" : "Tạm ẩn"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
