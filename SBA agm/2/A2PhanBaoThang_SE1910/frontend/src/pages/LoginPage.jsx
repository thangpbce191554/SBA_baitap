/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState } from 'react';
import { authService } from '../services/authService';

function LoginPage({ onLoginSuccess, onCancel }) {
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountEmail.trim()) {
      setError('Vui lòng nhập Email đăng nhập!');
      return;
    }
    if (!accountPassword) {
      setError('Vui lòng nhập Mật khẩu!');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = await authService.login(accountEmail.trim(), accountPassword);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '1rem' }}>
        <div className="card-header" style={{ background: 'transparent', borderBottom: 'none', textAlign: 'center', display: 'block' }}>
          <h3 style={{ color: '#0d6efd', marginBottom: '0.25rem' }}>FUNews Management</h3>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Đăng nhập hệ thống quản trị</p>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email tài khoản *</label>
              <input
                type="email"
                className="form-control"
                placeholder="Nhập email (ví dụ: SteveParis@FUNewsManagement.org)"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu *</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu (mặc định: @1)"
                value={accountPassword}
                onChange={(e) => setAccountPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
              </button>

              <button type="button" className="btn btn-secondary" onClick={onCancel} style={{ width: '100%' }}>
                &larr; Quay lại trang tin tức
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

