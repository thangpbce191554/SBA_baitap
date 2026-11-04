/**
 * Phan Bảo Thắng
 * SE1910
 */
import api from './api';

export const profileService = {
  // Lấy thông tin cá nhân theo ID
  async getProfile(accountId) {
    const res = await api.get(`/common/profile/${accountId}`);
    return res.data;
  },

  // Cập nhật thông tin cá nhân / đổi mật khẩu theo ID
  async updateProfile(accountId, data) {
    const res = await api.put(`/common/profile/${accountId}`, data);
    return res.data;
  }
};
