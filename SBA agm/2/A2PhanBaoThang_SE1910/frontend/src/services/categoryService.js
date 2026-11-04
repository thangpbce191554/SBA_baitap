/**
 * Phan Bảo Thắng
 * SE1910
 */
import api from './api';

export const categoryService = {
  // Lấy danh sách toàn bộ chuyên mục (Staff)
  async getAll() {
    const res = await api.get('/staff/categories');
    return res.data || [];
  },

  // Lấy danh sách chuyên mục Active (Public)
  async getPublicCategories() {
    const res = await api.get('/public/categories');
    return res.data || [];
  },

  // Tìm kiếm chuyên mục
  async search(keyword) {
    const res = await api.get('/staff/categories/search', {
      params: { keyword }
    });
    return res.data || [];
  },

  // Lấy chi tiết chuyên mục
  async getById(id) {
    const res = await api.get(`/staff/categories/${id}`);
    return res.data;
  },

  // Tạo mới chuyên mục
  async create(data) {
    const res = await api.post('/staff/categories', data);
    return res.data;
  },

  // Cập nhật chuyên mục
  async update(id, data) {
    const res = await api.put(`/staff/categories/${id}`, data);
    return res.data;
  },

  // Xóa chuyên mục (chặn xóa nếu có bài viết sử dụng)
  async delete(id) {
    const res = await api.delete(`/staff/categories/${id}`);
    return res;
  }
};

