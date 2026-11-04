/**
 * Phan Bảo Thắng
 * SE1910
 */
import api from './api';

export const authService = {
  // Đăng nhập bằng Email và Password
  async login(accountEmail, accountPassword) {
    const res = await api.post('/auth/login', { accountEmail, accountPassword });
    if (res.success && res.data) {
      // Lưu thông tin người dùng vào localStorage để quản lý phiên
      localStorage.setItem('funews_user', JSON.stringify({
        accountId: res.data.accountId,
        accountName: res.data.accountName,
        accountEmail: res.data.accountEmail,
        accountRole: res.data.accountRole // 1: Admin, 2: Staff
      }));
    }
    return res.data;
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem('funews_user');
  },

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('funews_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated() {
    return !!localStorage.getItem('funews_user');
  }
};
