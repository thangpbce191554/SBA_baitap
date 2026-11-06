/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Staff Room Modal (Create / Update Room)
 */

import React, { useState, useEffect } from 'react';
import staffService from '../services/staffService';

export default function RoomModal({ isOpen, room, roomTypes, onClose, onSuccess }) {
  if (!isOpen) return null;

  const isEdit = Boolean(room && room.roomId);

  const [formData, setFormData] = useState({
    roomNumber: '',
    roomDetailDescription: '',
    roomMaxCapacity: 2,
    roomTypeId: roomTypes && roomTypes.length > 0 ? roomTypes[0].roomTypeId : 1,
    roomPricePerDay: 500000,
    roomStatus: 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber || '',
        roomDetailDescription: room.roomDetailDescription || '',
        roomMaxCapacity: room.roomMaxCapacity || 2,
        roomTypeId: room.roomTypeId || (roomTypes[0]?.roomTypeId || 1),
        roomPricePerDay: room.roomPricePerDay || 500000,
        roomStatus: room.roomStatus !== undefined ? room.roomStatus : 1
      });
    } else {
      setFormData({
        roomNumber: '',
        roomDetailDescription: '',
        roomMaxCapacity: 2,
        roomTypeId: roomTypes && roomTypes.length > 0 ? roomTypes[0].roomTypeId : 1,
        roomPricePerDay: 500000,
        roomStatus: 1
      });
    }
    setError('');
  }, [room, roomTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roomMaxCapacity' || name === 'roomTypeId' || name === 'roomStatus'
        ? parseInt(value, 10)
        : name === 'roomPricePerDay'
        ? parseFloat(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.roomNumber.trim()) {
      setError('Số phòng không được để trống');
      return;
    }
    if (formData.roomMaxCapacity <= 0) {
      setError('Sức chứa tối đa phải lớn hơn 0');
      return;
    }
    if (formData.roomPricePerDay <= 0) {
      setError('Đơn giá theo ngày phải lớn hơn 0');
      return;
    }

    try {
      setLoading(true);
      let res;
      if (isEdit) {
        res = await staffService.updateRoom(room.roomId, formData);
      } else {
        res = await staffService.createRoom(formData);
      }

      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(res.message || 'Thao tác không thành công');
      }
    } catch (err) {
      setError(err.message || 'Lỗi xử lý yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isEdit ? `Cập nhật phòng: ${room.roomNumber}` : 'Thêm phòng mới'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Số phòng *</label>
              <input
                type="text"
                name="roomNumber"
                className="form-input"
                placeholder="VD: 101, 202, 301..."
                value={formData.roomNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Loại phòng *</label>
              <select
                name="roomTypeId"
                className="form-select"
                value={formData.roomTypeId}
                onChange={handleChange}
                required
              >
                {roomTypes.map(rt => (
                  <option key={rt.roomTypeId} value={rt.roomTypeId}>
                    {rt.roomTypeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Sức chứa tối đa (người) *</label>
              <input
                type="number"
                name="roomMaxCapacity"
                className="form-input"
                min="1"
                max="20"
                value={formData.roomMaxCapacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Giá thuê mỗi ngày (VNĐ) *</label>
              <input
                type="number"
                name="roomPricePerDay"
                className="form-input"
                min="10000"
                step="50000"
                value={formData.roomPricePerDay}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Trạng thái phòng</label>
            <select
              name="roomStatus"
              className="form-select"
              value={formData.roomStatus}
              onChange={handleChange}
            >
              <option value={1}>1 - Hoạt động (Active)</option>
              <option value={2}>2 - Ngừng hoạt động (Inactive)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả chi tiết phòng</label>
            <textarea
              name="roomDetailDescription"
              className="form-textarea"
              rows="3"
              placeholder="Tiện nghi, view ban công, nội thất..."
              value={formData.roomDetailDescription}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo mới phòng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

