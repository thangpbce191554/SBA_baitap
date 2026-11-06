/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Public Rooms Page (Search, Filter, View Details, Book Room)
 */

import React, { useState, useEffect } from 'react';
import publicService from '../services/publicService';
import RoomDetailModal from '../components/RoomDetailModal';
import BookingModal from '../components/BookingModal';

export default function PublicRoomsPage({ currentUser, onNavigateToLogin, onNavigateToBookings }) {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('DEFAULT');

  // Modals state
  const [detailRoom, setDetailRoom] = useState(null);
  const [bookingRoom, setBookingRoom] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsRes, typesRes] = await Promise.all([
        publicService.getRooms(),
        publicService.getRoomTypes()
      ]);

      if (roomsRes.success) setRooms(roomsRes.data || []);
      if (typesRes.success) setRoomTypes(typesRes.data || []);
    } catch (err) {
      setError('Không thể tải danh sách phòng: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (room) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập bằng tài khoản Khách hàng để tiến hành đặt phòng!');
      onNavigateToLogin();
      return;
    }
    if (currentUser.role === 'ROLE_STAFF') {
      alert('Tài khoản Quản trị viên (Staff) không sử dụng tính năng đặt phòng cá nhân. Hãy dùng tài khoản Khách hàng.');
      return;
    }
    setBookingRoom(room);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Filter & Search logic
  const filteredRooms = rooms
    .filter(r => {
      const matchKeyword = !searchKeyword ||
        r.roomNumber?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        r.roomDetailDescription?.toLowerCase().includes(searchKeyword.toLowerCase());
      
      const matchType = selectedType === 'ALL' || r.roomTypeId === parseInt(selectedType, 10);
      return matchKeyword && matchType;
    })
    .sort((a, b) => {
      if (sortOrder === 'PRICE_ASC') return a.roomPricePerDay - b.roomPricePerDay;
      if (sortOrder === 'PRICE_DESC') return b.roomPricePerDay - a.roomPricePerDay;
      return 0;
    });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Danh sách phòng</h2>
          <p className="page-subtitle">Xem thông tin phòng và đặt phòng trực tuyến</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '12px' }}>
        <div className="form-grid" style={{ alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Tìm kiếm phòng</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nhập số phòng hoặc mô tả..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Loại phòng</label>
            <select
              className="form-select"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option value="ALL">Tất cả các loại phòng</option>
              {roomTypes.map(t => (
                <option key={t.roomTypeId} value={t.roomTypeId}>
                  {t.roomTypeName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sắp xếp theo giá</label>
            <select
              className="form-select"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="DEFAULT">Mặc định</option>
              <option value="PRICE_ASC">Giá tăng dần</option>
              <option value="PRICE_DESC">Giá giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Room Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          Đang tải danh sách phòng...
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          Không tìm thấy phòng nào phù hợp với tiêu chí tìm kiếm.
        </div>
      ) : (
        <div className="room-grid">
          {filteredRooms.map(room => (
            <div key={room.roomId} className="room-card">
              <div className="room-card-header">
                <span className="room-card-number">Phòng {room.roomNumber}</span>
                <span className="badge badge-room-type">{room.roomTypeName || 'Tiêu chuẩn'}</span>
              </div>

              <div className="room-card-body">
                <p className="room-card-desc">{room.roomDetailDescription || 'Phòng đầy đủ tiện nghi tiêu chuẩn quốc tế.'}</p>
                <div className="room-card-meta">
                  <span>👥 Sức chứa: <strong>{room.roomMaxCapacity} người</strong></span>
                  <span className="room-card-price">{formatPrice(room.roomPricePerDay)}</span>
                </div>
              </div>

              <div className="room-card-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => setDetailRoom(room)}
                >
                  Xem chi tiết
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => handleBookClick(room)}
                >
                  Đặt phòng
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <RoomDetailModal
        isOpen={Boolean(detailRoom)}
        room={detailRoom}
        onClose={() => setDetailRoom(null)}
        onBookRoom={handleBookClick}
      />

      <BookingModal
        isOpen={Boolean(bookingRoom)}
        room={bookingRoom}
        onClose={() => setBookingRoom(null)}
        onSuccess={() => {
          if (onNavigateToBookings) onNavigateToBookings();
        }}
      />
    </div>
  );
}

