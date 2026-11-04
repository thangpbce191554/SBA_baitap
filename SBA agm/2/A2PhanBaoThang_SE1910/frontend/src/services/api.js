/**
 * Phan Bảo Thắng
 * SE1910
 */
import axios from 'axios';

// Cấu hình axios instance gọi tới Backend Spring Boot port 8080
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Xử lý dữ liệu và thông báo lỗi tập trung
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Trích xuất thông báo lỗi rõ ràng từ backend (ApiResponse hoặc ResponseStatusException)
    const message = error.response?.data?.message || 'Có lỗi xảy ra khi kết nối máy chủ!';
    return Promise.reject(new Error(message));
  }
);

export default api;
