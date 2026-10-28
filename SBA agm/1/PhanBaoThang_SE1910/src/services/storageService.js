/**
 * Phan Bảo Thắng
 * SE1910
 */

export const STORAGE_KEYS = {
  AUTH_USER: "funews_auth_user",
  CATEGORIES: "funews_categories",
  NEWS: "funews_news",
  USERS: "funews_users",
};

export const storageService = {
  // Đọc dữ liệu từ localStorage kèm fallback default
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Lỗi đọc localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  // Lưu dữ liệu vào localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Lỗi ghi localStorage key "${key}":`, error);
      return false;
    }
  },

  // Xóa một key khỏi localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Lỗi xóa localStorage key "${key}":`, error);
      return false;
    }
  },
};
