/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Login & Customer Registration Page
 */

import React, { useState } from 'react';
import authService from '../services/authService';

export default function LoginPage({ onLoginSuccess, onNavigateToRooms }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [regFullName, setRegFullName] = useState('');
  const [regTelephone, setRegTelephone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regBirthday, setRegBirthday] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      setLoading(true);
      const res = await authService.login(email, password);
      if (res.success) {
        onLoginSuccess(authService.getCurrentUser());
      } else {
        setError(res.message || 'Đăng nhập không thành công');
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối tới máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regFullName.trim() || !regEmail.trim() || !regPassword) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.register({
        customerFullName: regFullName,
        telephone: regTelephone,
        emailAddress: regEmail,
        customerBirthday: regBirthday,
        password: regPassword
      });

      if (res.success) {
        setSuccessMsg('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
        setEmail(regEmail);
        setPassword(regPassword);
        setIsRegisterMode(false);
      } else {
        setError(res.message || 'Đăng ký không thành công');
      }
    } catch (err) {
      setError(err.message || 'Lỗi đăng ký tài khoản');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ maxWidth: '420px', margin: '20px auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>🏨</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {isRegisterMode ? 'Đăng ký tài khoản' : 'Đăng nhập hệ thống'}
          </h2>
          <p style={{ color: '#6c757d', fontSize: '12px' }}>
            FU Mini Hotel Management System
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid #dee2e6', marginBottom: '16px' }}>
          <button
            type="button"
            className="nav-item"
            style={{
              flex: 1,
              borderRadius: 0,
              borderBottom: !isRegisterMode ? '2px solid #0d6efd' : 'none',
              fontWeight: !isRegisterMode ? 'bold' : 'normal',
              color: !isRegisterMode ? '#0d6efd' : '#6c757d'
            }}
            onClick={() => { setIsRegisterMode(false); setError(''); }}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className="nav-item"
            style={{
              flex: 1,
              borderRadius: 0,
              borderBottom: isRegisterMode ? '2px solid #0d6efd' : 'none',
              fontWeight: isRegisterMode ? 'bold' : 'normal',
              color: isRegisterMode ? '#0d6efd' : '#6c757d'
            }}
            onClick={() => { setIsRegisterMode(true); setError(''); }}
          >
            Đăng ký Khách hàng
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {!isRegisterMode ? (
          /* Login Form */
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email tài khoản</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Họ và tên *</label>
              <input
                type="text"
                className="form-input"
                placeholder="VD: Trần Bảo An"
                value={regFullName}
                onChange={e => setRegFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@gmail.com"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="0901234567"
                  value={regTelephone}
                  onChange={e => setRegTelephone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ngày sinh</label>
                <input
                  type="date"
                  className="form-input"
                  value={regBirthday}
                  onChange={e => setRegBirthday(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Tối thiểu 3 ký tự"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

