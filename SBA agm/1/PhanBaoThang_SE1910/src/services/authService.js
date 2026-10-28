/**
 * Phan Bảo Thắng
 * SE1910
 */
import { storageService, STORAGE_KEYS } from "./storageService";
import { INITIAL_USERS } from "./mockData";

export const authService = {
  // Lấy thông tin user đang đăng nhập hiện tại
  getCurrentUser: () => {
    return storageService.get(STORAGE_KEYS.AUTH_USER, null);
  },

  // Kiểm tra xem đã đăng nhập hay chưa
  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!user;
  },

  // Xử lý đăng nhập: Kiểm tra theo tài khoản trong danh sách Users (cho phép đổi mật khẩu)
  login: (username, password) => {
    const trimmedUsername = (username || "").trim();
    const trimmedPassword = (password || "").trim();

    // Lấy danh sách tài khoản hiện tại từ localStorage (đồng bộ với User Management)
    const users = storageService.get(STORAGE_KEYS.USERS, INITIAL_USERS);

    // Tìm tài khoản theo username (không phân biệt chữ hoa / thường)
    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (matchedUser) {
      // Kiểm tra mật khẩu (khớp chính xác mật khẩu hiện tại trong dữ liệu User)
      if (matchedUser.password !== trimmedPassword) {
        return {
          success: false,
          message: "Tên đăng nhập hoặc mật khẩu không chính xác!",
        };
      }

      // Kiểm tra trạng thái tài khoản
      if (matchedUser.status === 0) {
        return {
          success: false,
          message: "Tài khoản của bạn đã bị vô hiệu hóa (Inactive)!",
        };
      }

      // Đăng nhập thành công, lưu session vào localStorage
      const sessionUser = {
        id: matchedUser.id,
        username: matchedUser.username,
        role: matchedUser.role,
        roleName: matchedUser.role === 1 ? "Admin" : "Staff",
        status: matchedUser.status,
      };
      storageService.set(STORAGE_KEYS.AUTH_USER, sessionUser);
      return { success: true, user: sessionUser };
    }

    return {
      success: false,
      message: "Tên đăng nhập hoặc mật khẩu không chính xác!",
    };
  },

  // Đăng xuất và dọn sạch session trong localStorage
  logout: () => {
    storageService.remove(STORAGE_KEYS.AUTH_USER);
  },
};
