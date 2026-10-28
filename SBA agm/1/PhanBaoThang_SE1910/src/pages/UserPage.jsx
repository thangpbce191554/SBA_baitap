/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState } from "react";
import UserModal from "../components/UserModal";
import ConfirmModal from "../components/ConfirmModal";
import { userService } from "../services/userService";

export default function UserPage({
  users = [],
  currentUser = null,
  onUpdateUsers,
}) {
  // 1. Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");

  // 2. Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);

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
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setModalMode("update");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (modalMode === "create") {
      const result = userService.create(formData);
      if (result.success) {
        onUpdateUsers(result.list);
        showAlert("success", "Đã tạo tài khoản người dùng mới thành công!");
      } else {
        showAlert("danger", result.message);
      }
    } else if (modalMode === "update" && selectedUser) {
      const result = userService.update(selectedUser.id, formData);
      if (result.success) {
        onUpdateUsers(result.list);
        showAlert("success", "Đã cập nhật thông tin tài khoản thành công!");
      } else {
        showAlert("danger", result.message);
      }
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteItem) return;

    const result = userService.delete(deleteItem.id, currentUser?.id);
    if (result.success) {
      onUpdateUsers(result.list);
      showAlert("success", "Đã xóa người dùng thành công!");
    } else {
      showAlert("danger", result.message);
    }
    setDeleteItem(null);
  };

  // Search & Filter Logic
  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const displayedUsers = users.filter((u) => {
    // Lọc theo Role
    if (selectedRoleFilter !== "all" && String(u.role) !== selectedRoleFilter) {
      return false;
    }

    // Lọc theo Username
    if (!normalizedKeyword) return true;
    return (u.username || "").toLowerCase().includes(normalizedKeyword);
  });

  return (
    <div className="user-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Tài khoản & Phân quyền</h2>
          <p className="page-description">
            Quản lý tài khoản đăng nhập, cấp quyền Quản trị viên (Admin) / Nhân viên (Staff)
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreate}
        >
          ➕ Thêm mới Tài khoản
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          <span>{alert.type === "success" ? "✅" : "⚠️"} {alert.message}</span>
        </div>
      )}

      {/* Thanh tìm kiếm & Lọc vai trò */}
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Tìm kiếm theo tên tài khoản..."
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
            Vai trò:
          </label>
          <select
            className="form-select"
            style={{ width: "160px", padding: "6px 10px" }}
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="1">Quản trị viên (Admin)</option>
            <option value="2">Nhân viên (Staff)</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách người dùng */}
      {users.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <div className="empty-title">Chưa có tài khoản nào</div>
            <p className="empty-desc">Hệ thống chưa có người dùng nào được tạo.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleOpenCreate}
            >
              Tạo tài khoản đầu tiên
            </button>
          </div>
        </div>
      ) : displayedUsers.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Không tìm thấy người dùng</div>
            <p className="empty-desc">
              Không có tài khoản nào khớp với từ khóa "{searchKeyword}".
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchKeyword("");
                setSelectedRoleFilter("all");
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
                <th>Tên tài khoản</th>
                <th style={{ width: "170px" }}>Vai trò (Role)</th>
                <th style={{ width: "150px" }}>Trạng thái</th>
                <th style={{ width: "150px", textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((u) => {
                const isCurrentSelf = currentUser && u.id === currentUser.id;
                return (
                  <tr key={u.id}>
                    <td><code>{u.id}</code></td>
                    <td>
                      <strong>{u.username}</strong>
                      {isCurrentSelf && (
                        <span style={{ fontSize: "11px", color: "var(--primary)", marginLeft: "6px" }}>
                          (Đang đăng nhập)
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${u.role === 1 ? "badge-admin" : "badge-staff"}`}>
                        {u.role === 1 ? "Quản trị viên (Admin)" : "Nhân viên (Staff)"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.status === 1 ? "badge-active" : "badge-inactive"
                        }`}
                      >
                        {u.status === 1 ? "Hoạt động (Active)" : "Đã khóa (Inactive)"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(u)}
                          title="Chỉnh sửa tài khoản"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteItem(u)}
                          disabled={isCurrentSelf}
                          title={isCurrentSelf ? "Không thể xóa chính tài khoản đang đăng nhập" : "Xóa tài khoản"}
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

      {/* Modal Create / Update User */}
      <UserModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedUser}
        onSubmit={handleModalSubmit}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
      />

      {/* Modal xác nhận xóa User */}
      <ConfirmModal
        isOpen={!!deleteItem}
        title="Xác nhận xóa Người dùng"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${deleteItem?.username}" không?`}
        confirmText="Xóa tài khoản"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
