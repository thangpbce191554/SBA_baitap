/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from 'react';

function AccountModal({ isOpen, mode, initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    accountName: '',
    accountEmail: '',
    accountRole: 2, // 1: Admin, 2: Staff
    accountPassword: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        accountName: initialData.accountName || '',
        accountEmail: initialData.accountEmail || '',
        accountRole: initialData.accountRole || 2,
        accountPassword: '' // Để trống nếu không muốn đổi mật khẩu
      });
    } else {
      setFormData({
        accountName: '',
        accountEmail: '',
        accountRole: 2,
        accountPassword: ''
      });
    }
    setError('');
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'accountRole' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.accountName.trim()) {
      setError('Vui lòng nhập tên tài khoản!');
      return;
    }
    if (!formData.accountEmail.trim() || !formData.accountEmail.includes('@')) {
      setError('Vui lòng nhập định dạng email hợp lệ!');
      return;
    }
    if (mode === 'create' && !formData.accountPassword.trim()) {
      setError('Vui lòng nhập mật khẩu khởi tạo cho tài khoản!');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h4 className="modal-title">
              {mode === 'edit' ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
            </h4>
            <button type="button" className="modal-close" onClick={onClose}>&times;</button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group">
              <label className="form-label">Họ và tên *</label>
              <input
                type="text"
                name="accountName"
                className="form-control"
                placeholder="Nhập họ và tên..."
                value={formData.accountName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email tài khoản *</label>
              <input
                type="email"
                name="accountEmail"
                className="form-control"
                placeholder="ví dụ: user@funews.org"
                value={formData.accountEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Vai trò (Role) *</label>
              <select
                name="accountRole"
                className="form-control"
                value={formData.accountRole}
                onChange={handleChange}
              >
                <option value={1}>Quản trị viên (Admin - 1)</option>
                <option value={2}>Nhân viên (Staff - 2)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Mật khẩu {mode === 'edit' ? '(Để trống nếu không muốn đổi)' : '*'}
              </label>
              <input
                type="password"
                name="accountPassword"
                className="form-control"
                placeholder={mode === 'edit' ? 'Nhập mật khẩu mới nếu muốn đổi...' : 'Nhập mật khẩu...'}
                value={formData.accountPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === 'edit' ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountModal;

