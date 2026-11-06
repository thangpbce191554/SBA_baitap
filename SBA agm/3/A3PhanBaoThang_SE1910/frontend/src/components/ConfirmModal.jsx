/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Generic Confirmation Modal
 */

import React from 'react';

export default function ConfirmModal({ isOpen, title, message, warning, confirmText = 'Xác nhận', onConfirm, onClose, isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title || 'Xác nhận thao tác'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ color: '#374151', fontSize: '0.925rem', marginBottom: '0.75rem' }}>{message}</p>
          {warning && (
            <div className="alert alert-info" style={{ fontSize: '0.825rem', marginTop: '0.5rem' }}>
              💡 {warning}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Hủy bỏ
          </button>
          <button
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

