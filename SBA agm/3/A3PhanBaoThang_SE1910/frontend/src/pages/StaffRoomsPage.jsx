/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Staff Room Management Page (CRUD Rooms with Delete Rule)
 */

import React, { useState, useEffect } from 'react';
import staffService from '../services/staffService';
import publicService from '../services/publicService';
import RoomModal from '../components/RoomModal';
import ConfirmModal from '../components/ConfirmModal';

export default function StaffRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsRes, typesRes] = await Promise.all([
        staffService.getRooms(),
        publicService.getRoomTypes()
      ]);

      if (roomsRes.success) setRooms(roomsRes.data || []);
      if (typesRes.success) setRoomTypes(typesRes.data || []);
    } catch (err) {
      setError(err.message || 'Lỗi tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRoom) return;
    try {
      setError('');
      setFeedback('');
      const res = await staffService.deleteRoom(deletingRoom.roomId);
      if (res.success) {
        setFeedback(res.message || 'Xóa phòng thành công');
        loadData();
      } else {
        setError(res.message || 'Xóa phòng thất bại');
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi xóa phòng');
    } finally {
      setDeletingRoom(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredRooms = rooms.filter(r => {
    const matchSearch = !search ||
      r.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
      r.roomDetailDescription?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || r.roomTypeId === parseInt(typeFilter, 10);
    return matchSearch && matchType;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý phòng khách sạn</h2>
          <p className="page-subtitle">Thêm, sửa, xóa và quản lý trạng thái các phòng trong hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          ➕ Thêm phòng mới
        </button>
      </div>

      {feedback && <div className="alert alert-success">{feedback}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter card */}
      <div className="card" style={{ padding: '1rem' }}>
        <div className="form-grid">
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Tìm theo số phòng hoặc mô tả..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            className="form-select"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="ALL">Tất cả loại phòng</option>
            {roomTypes.map(rt => (
              <option key={rt.roomTypeId} value={rt.roomTypeId}>
                {rt.roomTypeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Số phòng</th>
              <th>Loại phòng</th>
              <th>Sức chứa</th>
              <th>Giá thuê / ngày</th>
              <th>Trạng thái</th>
              <th>Mô tả</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredRooms.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  Không tìm thấy phòng nào.
                </td>
              </tr>
            ) : (
              filteredRooms.map(room => (
                <tr key={room.roomId}>
                  <td>{room.roomId}</td>
                  <td style={{ fontWeight: 700, color: '#1e40af' }}>{room.roomNumber}</td>
                  <td>
                    <span className="badge badge-room-type">{room.roomTypeName || 'Tiêu chuẩn'}</span>
                  </td>
                  <td>{room.roomMaxCapacity} người</td>
                  <td style={{ fontWeight: 600, color: '#047857' }}>{formatPrice(room.roomPricePerDay)}</td>
                  <td>
                    <span className={`badge ${room.roomStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                      {room.roomStatus === 1 ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </td>
                  <td style={{ maxWidth: '250px', fontSize: '0.825rem', color: '#6b7280' }}>
                    {room.roomDetailDescription || '-'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => handleOpenEdit(room)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeletingRoom(room)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <RoomModal
        isOpen={isModalOpen}
        room={editingRoom}
        roomTypes={roomTypes}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setFeedback(editingRoom ? 'Cập nhật thông tin phòng thành công!' : 'Thêm phòng mới thành công!');
          loadData();
        }}
      />

      {/* Delete Confirmation Modal with Assignment Rule Explained */}
      <ConfirmModal
        isOpen={Boolean(deletingRoom)}
        title={`Xác nhận xóa phòng ${deletingRoom?.roomNumber}`}
        message={`Bạn có chắc chắn muốn xóa phòng số ${deletingRoom?.roomNumber} không?`}
        warning="Quy định Assignment 03: Nếu phòng đã có khách đặt trước đó, hệ thống sẽ tự động Soft-delete (chuyển trạng thái sang Ngừng hoạt động). Nếu chưa có đơn đặt nào, phòng sẽ được xóa vĩnh viễn (Hard-delete)."
        confirmText="Đồng ý xóa"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingRoom(null)}
      />
    </div>
  );
}

