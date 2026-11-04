/**
 * Phan Bảo Thắng
 * SE1910
 */
import api from './api';

export const newsService = {
  // Lấy tin tức công khai cho khách vãng lai (không cần login)
  async getPublicNews() {
    const res = await api.get('/public/news');
    return res.data || [];
  },

  // Chi tiết bài viết công khai
  async getPublicNewsDetail(id) {
    const res = await api.get(`/public/news/${id}`);
    return res.data;
  },

  // Lấy toàn bộ danh sách bài viết (Staff)
  async getAll() {
    const res = await api.get('/staff/news');
    return res.data || [];
  },

  // Lấy lịch sử bài viết do chính Staff đang đăng nhập tạo ra
  async getStaffHistory(staffId) {
    const res = await api.get(`/staff/news/history/${staffId}`);
    return res.data || [];
  },

  // Tìm kiếm bài viết
  async search(keyword) {
    const res = await api.get('/staff/news/search', {
      params: { keyword }
    });
    return res.data || [];
  },

  // Lấy chi tiết bài viết
  async getById(id) {
    const res = await api.get(`/staff/news/${id}`);
    return res.data;
  },

  // Tạo mới bài viết
  async create(data) {
    const res = await api.post('/staff/news', data);
    return res.data;
  },

  // Cập nhật bài viết
  async update(id, data) {
    const res = await api.put(`/staff/news/${id}`, data);
    return res.data;
  },

  // Xóa bài viết
  async delete(id) {
    const res = await api.delete(`/staff/news/${id}`);
    return res;
  }
};
