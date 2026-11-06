/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Room Detail Modal (Public / Customer view)
 */

import React from 'react';

export default function RoomDetailModal({ isOpen, room, onClose, onBookRoom }) {
  if (!isOpen || !room) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Chi tiết phòng: {room.roomNumber}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-room-type" style={{ fontSize: '0.85rem' }}>
              {room.roomTypeName || 'Loại phòng chuẩn'}
            </span>
            <span className="room-card-price" style={{ fontSize: '1.25rem' }}>
              {formatPrice(room.roomPricePerDay)} / ngày
            </span>
          </div>

          <div className="form-grid">
            <div>
              <label className="form-label">Sức chứa tối đa</label>
              <p style={{ fontWeight: 600 }}>{room.roomMaxCapacity} người</p>
            </div>
            <div>
              <label className="form-label">Trạng thái hiện tại</label>
              <span className={`badge ${room.roomStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                {room.roomStatus === 1 ? 'Hoạt động (Active)' : 'Ngừng hoạt động (Inactive)'}
              </span>
            </div>
          </div>

          <div>
            <label className="form-label">Mô tả phòng</label>
            <div style={{
              padding: '0.85rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.9rem',
              color: '#334155',
              lineHeight: 1.6
            }}>
              {room.roomDetailDescription || 'Không có mô tả chi tiết.'}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
          {room.roomStatus === 1 && (
            <button
              className="btn btn-success"
              onClick={() => {
                onClose();
                onBookRoom(room);
              }}
            >
              📅 Đặt phòng này
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

