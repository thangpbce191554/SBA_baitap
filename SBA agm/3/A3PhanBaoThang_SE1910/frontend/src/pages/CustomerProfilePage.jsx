/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Customer Profile Management Page (with Password Change)
 */

import React, { useState, useEffect } from 'react';
import customerService from '../services/customerService';

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: ''
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await customerService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setFormData({
          customerFullName: res.data.customerFullName || '',
          telephone: res.data.telephone || '',
          emailAddress: res.data.emailAddress || '',
          customerBirthday: res.data.customerBirthday || ''
        });
      } else {
        setError('Không thể tải thông tin hồ sơ');
      }
    } catch (err) {
      setError(err.message || 'Lỗi tải hồ sơ cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.customerFullName.trim()) {
      setError('Họ và tên không được để trống');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 3) {
        setError('Mật khẩu mới phải có ít nhất 3 ký tự');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp với mật khẩu mới!');
        return;
      }
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        ...(newPassword ? { password: newPassword } : {})
      };

      const res = await customerService.updateProfile(payload);
      if (res.success) {
        setSuccessMsg('Cập nhật thông tin hồ sơ cá nhân thành công!');
        setProfile(res.data);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(res.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      setError(err.message || 'Lỗi xử lý yêu cầu cập nhật');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '30px' }}>Đang tải thông tin cá nhân...</div>;
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Hồ sơ cá nhân</h2>
          <p className="page-subtitle">Quản lý thông tin cá nhân và thay đổi mật khẩu</p>
        </div>
      </div>

      <div className="card">
        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mã khách hàng (ID)</label>
            <input
              type="text"
              className="form-input"
              value={profile?.customerId || ''}
              disabled
              style={{ backgroundColor: '#f8f9fa' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input
              type="text"
              name="customerFullName"
              className="form-input"
              value={formData.customerFullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Email đăng nhập</label>
              <input
                type="email"
                name="emailAddress"
                className="form-input"
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
                value={formData.telephone}
                onChange={handleChange}
              />
            </div>
          </div>

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

          {/* Phần đổi mật khẩu */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #dee2e6' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
              Đổi mật khẩu (Bỏ trống nếu không đổi)
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thông tin cá nhân'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
