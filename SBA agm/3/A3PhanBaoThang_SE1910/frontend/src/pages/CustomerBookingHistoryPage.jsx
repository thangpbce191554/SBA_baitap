/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Customer Booking History Page
 */

import React, { useState, useEffect } from 'react';
import customerService from '../services/customerService';

export default function CustomerBookingHistoryPage({ onNavigateToRooms }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await customerService.getBookingHistory();
      if (res.success) {
        setBookings(res.data || []);
      } else {
        setError('Không thể tải lịch sử đặt phòng');
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối tới máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Lịch sử đặt phòng</h2>
          <p className="page-subtitle">Theo dõi các đơn đặt phòng của bạn tại FU Mini Hotel</p>
        </div>
        <button className="btn btn-primary" onClick={onNavigateToRooms}>
          ➕ Đặt thêm phòng mới
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Đang tải lịch sử đặt phòng...</div>
      ) : bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Bạn chưa có đơn đặt phòng nào.</p>
          <button className="btn btn-primary" onClick={onNavigateToRooms}>
            Khám phá danh sách phòng ngay
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {bookings.map(booking => (
            <div key={booking.bookingReservationId} className="card" style={{ marginBottom: 0 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '0.75rem',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e3a8a' }}>
                    Mã đơn: #{booking.bookingReservationId}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '0.85rem', marginLeft: '1rem' }}>
                    Ngày đặt: {booking.bookingDate}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge ${booking.bookingStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                    {booking.bookingStatus === 1 ? '✓ Đang hoạt động / Xác nhận' : '✗ Đã hủy'}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#047857' }}>
                    Tổng: {formatPrice(booking.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Sub-table for Booking Details */}
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Số phòng</th>
                      <th>Loại phòng</th>
                      <th>Ngày nhận phòng</th>
                      <th>Ngày trả phòng</th>
                      <th>Đơn giá thực tế</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.bookingDetails?.map((detail, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: '#1e40af' }}>Phòng {detail.roomNumber}</td>
                        <td>{detail.roomTypeName || 'Tiêu chuẩn'}</td>
                        <td>{detail.startDate}</td>
                        <td>{detail.endDate}</td>
                        <td style={{ fontWeight: 600, color: '#0f766e' }}>{formatPrice(detail.actualPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

