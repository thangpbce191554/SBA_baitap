/**
 * Phan Bảo Thắng
 * SE1910
 */
import React from "react";

export default function SettingsPage({ currentUser }) {
  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Cài đặt hệ thống & Thông tin tài khoản</h2>
          <p className="page-description">Quản lý phiên làm việc và cấu hình ứng dụng</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: "560px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "14px" }}>
          Thông tin tài khoản đăng nhập
        </h3>

        <div className="table-container">
          <table className="data-table">
            <tbody>
              <tr>
                <td style={{ width: "160px", fontWeight: "bold", color: "var(--text-muted)" }}>
                  Mã tài khoản (User ID)
                </td>
                <td><code>{currentUser?.id || "N/A"}</code></td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", color: "var(--text-muted)" }}>
                  Tên đăng nhập (Username)
                </td>
                <td><strong>{currentUser?.username || "N/A"}</strong></td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", color: "var(--text-muted)" }}>
                  Vai trò (Role)
                </td>
                <td>
                  <span className={`badge ${currentUser?.role === 1 ? "badge-admin" : "badge-staff"}`}>
                    {currentUser?.role === 1 ? "Quản trị viên (Admin)" : "Nhân viên (Staff)"}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", color: "var(--text-muted)" }}>
                  Trạng thái
                </td>
                <td>
                  <span className="badge badge-active">Đang hoạt động (Active)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ maxWidth: "560px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "10px" }}>
          Thông tin ứng dụng
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>
          <strong>Hệ thống:</strong> FUNewsManagementSystem (SBA301 - Assignment 01)
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>
          <strong>Sinh viên:</strong> Phan Bảo Thắng - Lớp SE1910
        </p>
      </div>
    </div>
  );
}
