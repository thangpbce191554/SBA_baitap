/**
 * Phan Bảo Thắng
 * SE1910
 */
import React from "react";

export default function ConfirmModal({
  isOpen,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa mục này? Thao tác này không thể hoàn tác.",
  confirmText = "Xác nhận xóa",
  cancelText = "Hủy bỏ",
  onConfirm,
  onCancel,
  isDanger = true,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-dialog"
        style={{ maxWidth: "420px" }}
        onClick={(e) => e.stopPropagation()} // Chặn sự kiện nổi bọt
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            title="Đóng"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: "13px", color: "var(--text-main)", lineHeight: "1.6" }}>
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${isDanger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
