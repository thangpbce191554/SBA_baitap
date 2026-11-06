/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Staff Booking Reservation Management Page
 */

import React, { useState, useEffect } from 'react';
import staffService from '../services/staffService';
import ConfirmModal from '../components/ConfirmModal';

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  // Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Status modal
  const [targetBooking, setTargetBooking] = useState(null);
  const [newStatus, setNewStatus] = useState(1);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await staffService.getBookings();
      if (res.success) {
        setBookings(res.data || []);
      } else {
        setError(res.message || 'Lỗi tải danh sách đặt phòng');
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối tới máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusChange = (booking, statusToChange) => {
    setTargetBooking(booking);
    setNewStatus(statusToChange);
  };

  const handleConfirmStatusChange = async () => {
    if (!targetBooking) return;
    try {
      setError('');
      setFeedback('');
      const res = await staffService.updateBookingStatus(targetBooking.bookingReservationId, newStatus);
      if (res.success) {
        setFeedback(`Đã chuyển trạng thái đơn #${targetBooking.bookingReservationId} thành công.`);
        loadBookings();
      } else {
        setError(res.message || 'Cập nhật trạng thái thất bại');
      }
    } catch (err) {
      setError(err.message || 'Lỗi xử lý yêu cầu');
    } finally {
      setTargetBooking(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredBookings = bookings.filter(b => {
    const matchSearch = !search ||
      b.bookingReservationId?.toString().includes(search) ||
      b.customerFullName?.toLowerCase().includes(search.toLowerCase()) ||
      b.customerEmail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || b.bookingStatus === parseInt(statusFilter, 10);
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý đơn đặt phòng</h2>
          <p className="page-subtitle">Theo dõi toàn bộ đơn đặt phòng của khách hàng và cập nhật trạng thái</p>
        </div>
      </div>

      {feedback && <div className="alert alert-success">{feedback}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter */}
      <div className="card" style={{ padding: '1rem' }}>
        <div className="form-grid">
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Tìm theo mã đơn, tên khách hoặc email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            className="form-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="1">1 - Đang hoạt động / Xác nhận</option>
            <option value="2">2 - Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Phòng & Thời gian lưu trú</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  Đang tải danh sách đặt phòng...
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  Không tìm thấy đơn đặt phòng nào.
                </td>
              </tr>
            ) : (
              filteredBookings.map(b => (
                <tr key={b.bookingReservationId}>
                  <td style={{ fontWeight: 700, color: '#1e40af' }}>#{b.bookingReservationId}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.customerFullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{b.customerEmail}</div>
                  </td>
                  <td>{b.bookingDate}</td>
                  <td style={{ fontWeight: 700, color: '#047857' }}>{formatPrice(b.totalPrice)}</td>
                  <td>
                    {b.bookingDetails?.map((d, i) => (
                      <div key={i} style={{ fontSize: '0.825rem', marginBottom: '0.2rem' }}>
                        🏨 <strong>Phòng {d.roomNumber}</strong>: {d.startDate} &rarr; {d.endDate} ({formatPrice(d.actualPrice)})
                      </div>
                    ))}
                  </td>
                  <td>
                    <span className={`badge ${b.bookingStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                      {b.bookingStatus === 1 ? 'Hoạt động' : 'Đã hủy'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {b.bookingStatus === 1 ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenStatusChange(b, 2)}
                      >
                        Hủy đơn
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleOpenStatusChange(b, 1)}
                      >
                        Kích hoạt lại
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(targetBooking)}
        title={newStatus === 2 ? 'Xác nhận hủy đơn đặt phòng' : 'Xác nhận kích hoạt lại đơn'}
        message={`Bạn có chắc muốn chuyển trạng thái đơn #${targetBooking?.bookingReservationId} của khách ${targetBooking?.customerFullName} sang "${newStatus === 2 ? 'Đã hủy' : 'Hoạt động'}" không?`}
        confirmText={newStatus === 2 ? 'Hủy đơn' : 'Kích hoạt'}
        isDanger={newStatus === 2}
        onConfirm={handleConfirmStatusChange}
        onClose={() => setTargetBooking(null)}
      />
    </div>
  );
}

