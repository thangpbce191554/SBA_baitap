/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Staff Customer Modal (Create / Update Customer)
 */

import React, { useState, useEffect } from 'react';
import staffService from '../services/staffService';

export default function CustomerModal({ isOpen, customer, onClose, onSuccess }) {
  if (!isOpen) return null;

  const isEdit = Boolean(customer && customer.customerId);

  const [formData, setFormData] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    customerStatus: 1,
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        customerFullName: customer.customerFullName || '',
        telephone: customer.telephone || '',
        emailAddress: customer.emailAddress || '',
        customerBirthday: customer.customerBirthday || '',
        customerStatus: customer.customerStatus !== undefined ? customer.customerStatus : 1,
        password: '' // empty when editing to keep unchanged
      });
    } else {
      setFormData({
        customerFullName: '',
        telephone: '',
        emailAddress: '',
        customerBirthday: '',
        customerStatus: 1,
        password: ''
      });
    }
    setError('');
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'customerStatus' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customerFullName.trim()) {
      setError('Họ và tên không được để trống');
      return;
    }
    if (!formData.emailAddress.trim()) {
      setError('Email không được để trống');
      return;
    }
    if (!isEdit && !formData.password) {
      setError('Mật khẩu là bắt buộc khi tạo khách hàng mới');
      return;
    }

    try {
      setLoading(true);
      let res;
      if (isEdit) {
        res = await staffService.updateCustomer(customer.customerId, formData);
      } else {
        res = await staffService.createCustomer(formData);
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
          <h3 className="modal-title">{isEdit ? `Cập nhật khách hàng: ${customer.customerFullName}` : 'Thêm khách hàng mới'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input
              type="text"
              name="customerFullName"
              className="form-input"
              placeholder="VD: Nguyễn Văn A"
              value={formData.customerFullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Email đăng nhập *</label>
              <input
                type="email"
                name="emailAddress"
                className="form-input"
                placeholder="VD: nguyenvana@gmail.com"
                value={formData.emailAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                type="tel"
                name="telephone"
                className="form-input"
                placeholder="VD: 0912345678"
                value={formData.telephone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Ngày sinh</label>
              <input
                type="date"
                name="customerBirthday"
                className="form-input"
                value={formData.customerBirthday}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Trạng thái tài khoản</label>
              <select
                name="customerStatus"
                className="form-select"
                value={formData.customerStatus}
                onChange={handleChange}
              >
                <option value={1}>1 - Hoạt động (Active)</option>
                <option value={2}>2 - Bị khóa (Disabled)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{isEdit ? 'Mật khẩu mới (Để trống nếu giữ nguyên)' : 'Mật khẩu *'}</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder={isEdit ? 'Bỏ trống nếu không đổi mật khẩu' : 'Nhập mật khẩu khởi tạo'}
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo mới tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

