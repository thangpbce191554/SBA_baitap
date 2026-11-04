/**
 * Phan Bảo Thắng
 * SE1910
 */
import api from './api';

export const accountService = {
  // Lấy danh sách toàn bộ tài khoản (Admin)
  async getAll() {
    const res = await api.get('/admin/accounts');
    return res.data || [];
  },

  // Tìm kiếm tài khoản
  async search(keyword) {
    const res = await api.get('/admin/accounts/search', {
      params: { keyword }
    });
    return res.data || [];
  },

  // Lấy chi tiết tài khoản
  async getById(id) {
    const res = await api.get(`/admin/accounts/${id}`);
    return res.data;
  },

  // Tạo mới tài khoản
  async create(data) {
    const res = await api.post('/admin/accounts', data);
    return res.data;
  },

  // Cập nhật tài khoản
  async update(id, data) {
    const res = await api.put(`/admin/accounts/${id}`, data);
    return res.data;
  },

  // Xóa tài khoản (chặn xóa nếu đã từng tạo bài viết)
  async delete(id) {
    const res = await api.delete(`/admin/accounts/${id}`);
    return res;
  }
};

