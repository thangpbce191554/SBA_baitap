/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Customer Booking Modal
 */

import React, { useState, useEffect } from 'react';
import customerService from '../services/customerService';

export default function BookingModal({ isOpen, room, onClose, onSuccess }) {
  if (!isOpen || !room) return null;

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();
  const totalPrice = days * (room.roomPricePerDay || 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (days <= 0) {
      setError('Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày!');
      return;
    }

    try {
      setLoading(true);
      const bookingPayload = {
        startDate: startDate,
        endDate: endDate,
        roomIds: [room.roomId]
      };

      const res = await customerService.createBooking(bookingPayload);
      if (res.success) {
        alert('🎉 Đặt phòng thành công!');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(res.message || 'Đặt phòng thất bại');
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối tới máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Xác nhận đặt phòng: {room.roomNumber}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
            <p><strong>Loại phòng:</strong> {room.roomTypeName}</p>
            <p><strong>Đơn giá:</strong> {formatPrice(room.roomPricePerDay)} / ngày</p>
            <p><strong>Sức chứa:</strong> {room.roomMaxCapacity} người</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Ngày nhận phòng (Check-in)</label>
              <input
                type="date"
                className="form-input"
                min={today}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ngày trả phòng (Check-out)</label>
              <input
                type="date"
                className="form-input"
                min={startDate || today}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{
            margin: '1.25rem 0',
            padding: '1rem',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Thời gian lưu trú:</span>
              <strong>{days} ngày / đêm</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
              <span>Tổng tiền dự kiến:</span>
              <strong style={{ color: '#1e40af' }}>{formatPrice(totalPrice)}</strong>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || days <= 0}>
              {loading ? 'Đang xử lý...' : 'Xác nhận Đặt phòng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
