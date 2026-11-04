/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';

function StaffProfilePage({ currentUser, onProfileUpdated }) {
  const [profile, setProfile] = useState(null);
  const [accountName, setAccountName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser?.accountId) {
      loadProfile(currentUser.accountId);
    }
  }, [currentUser]);

  const loadProfile = async (id) => {
    setLoading(true);
    try {
      const data = await profileService.getProfile(id);
      setProfile(data);
      setAccountName(data.accountName || '');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên!');
      return;
    }

    if (newPassword || oldPassword) {
      if (!oldPassword) {
        setErrorMsg('Vui lòng nhập mật khẩu cũ để xác thực!');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('Mật khẩu mới và xác nhận mật khẩu không khớp!');
        return;
      }
    }

    setErrorMsg('');
    try {
      const updated = await profileService.updateProfile(currentUser.accountId, {
        accountName: accountName.trim(),
        oldPassword: oldPassword || null,
        newPassword: newPassword || null
      });

      setSuccessMsg('Cập nhật thông tin cá nhân thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Cập nhật lại thông tin ở session
      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Không thể cập nhật hồ sơ');
    }
  };

  if (loading) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Đang nạp thông tin cá nhân...</p>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Thông tin cá nhân (My Profile)</h2>
        <p className="text-muted" style={{ color: '#6c757d' }}>
          Quản lý và cập nhật thông tin tài khoản của chính bạn trong hệ thống FUNews
        </p>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="card" style={{ maxWidth: '600px' }}>
        <div className="card-header">
          <h4 className="card-title">Cập nhật hồ sơ</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Mã tài khoản (Account ID)</label>
              <input
                type="text"
                className="form-control"
                value={`#${profile?.accountId || ''}`}
                disabled
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email tài khoản</label>
              <input
                type="text"
                className="form-control"
                value={profile?.accountEmail || ''}
                disabled
                style={{ backgroundColor: '#e9ecef' }}
              />
              <small style={{ color: '#6c757d' }}>Email dùng để đăng nhập và không thể thay đổi</small>
            </div>

            <div className="form-group">
              <label className="form-label">Vai trò hiện tại</label>
              <input
                type="text"
                className="form-control"
                value={profile?.accountRole === 1 ? 'Quản trị viên (Admin)' : 'Nhân viên (Staff)'}
                disabled
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Họ và tên *</label>
              <input
                type="text"
                className="form-control"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
              />
            </div>

            <hr style={{ margin: '1.5rem 0', borderColor: '#dee2e6' }} />

            <h5 style={{ marginBottom: '1rem', color: '#0d6efd' }}>Đổi mật khẩu (Tùy chọn)</h5>

            <div className="form-group">
              <label className="form-label">Mật khẩu hiện tại</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu cũ nếu muốn đổi mật khẩu..."
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu mới</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu mới..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập lại mật khẩu mới..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary">
                Lưu thông tin cá nhân
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StaffProfilePage;
