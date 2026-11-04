/**
 * Phan Bảo Thắng
 * SE1910
 */
import api from './api';

export const tagService = {
  // Lấy toàn bộ danh sách tags
  async getAll() {
    const res = await api.get('/common/tags');
    return res.data || [];
  },

  // Tạo nhanh tag nếu chưa tồn tại
  async create(name) {
    const res = await api.post('/common/tags', null, {
      params: { name }
    });
    return res.data;
  }
};

