/**
 * Phan Bảo Thắng
 * SE1910
 */
import { storageService, STORAGE_KEYS } from "./storageService";
import { INITIAL_USERS } from "./mockData";

// Hàm sinh ID tự tăng ngắn gọn, dễ nhớ (usr-1, usr-2 -> usr-5, usr-6)
const getNextUserId = (list) => {
  let maxNum = 0;
  list.forEach((item) => {
    if (item.id && typeof item.id === "string") {
      const match = item.id.match(/^usr-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num < 1000000 && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });
  return `usr-${maxNum + 1}`;
};

export const userService = {
  // Lấy toàn bộ danh sách tài khoản (hydrate từ localStorage nếu có)
  getAll: () => {
    let list = storageService.get(STORAGE_KEYS.USERS, null);
    if (!list) {
      list = [...INITIAL_USERS];
      storageService.set(STORAGE_KEYS.USERS, list);
    }
    return list;
  },

  // Tìm tài khoản theo ID
  getById: (id) => {
    const list = userService.getAll();
    return list.find((item) => item.id === id) || null;
  },

  // Thêm mới tài khoản (Tạo ID ngắn dạng usr-5, usr-6)
  create: (data) => {
    const list = userService.getAll();
    const trimmedUsername = (data.username || "").trim();

    // Kiểm tra tên đăng nhập không được trùng
    const isExisted = list.some(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );
    if (isExisted) {
      return { success: false, message: "Tên đăng nhập này đã tồn tại trong hệ thống!" };
    }

    const newUser = {
      id: getNextUserId(list),
      username: trimmedUsername,
      password: (data.password || "123").trim(),
      role: Number(data.role ?? 2), // Mặc định role = 2 (Staff)
      status: Number(data.status ?? 1), // Mặc định 1 (Active)
    };

    const updatedList = [newUser, ...list];
    storageService.set(STORAGE_KEYS.USERS, updatedList);
    return { success: true, data: newUser, list: updatedList };
  },

  // Cập nhật tài khoản theo ID (Immutable Update, cho phép đổi mật khẩu)
  update: (id, data) => {
    const list = userService.getAll();
    const trimmedUsername = (data.username || "").trim();

    // Kiểm tra xem đổi tên có bị trùng với user khác không
    const isConflict = list.some(
      (u) =>
        u.id !== id &&
        u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );
    if (isConflict) {
      return { success: false, message: "Tên đăng nhập đã được sử dụng bởi tài khoản khác!" };
    }

    let updatedItem = null;
    const updatedList = list.map((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          username: trimmedUsername,
          // Nếu có nhập mật khẩu mới thì cập nhật, nếu để trống thì giữ mật khẩu cũ
          password: data.password && data.password.trim() ? data.password.trim() : item.password,
          role: Number(data.role ?? item.role),
          status: Number(data.status ?? item.status),
        };
        return updatedItem;
      }
      return item;
    });

    if (!updatedItem) {
      return { success: false, message: "Không tìm thấy người dùng để cập nhật!" };
    }

    storageService.set(STORAGE_KEYS.USERS, updatedList);

    // Đồng bộ session đăng nhập nếu đổi tài khoản đang đăng nhập
    const currentAuth = storageService.get(STORAGE_KEYS.AUTH_USER, null);
    if (currentAuth && currentAuth.id === id) {
      storageService.set(STORAGE_KEYS.AUTH_USER, {
        ...currentAuth,
        username: updatedItem.username,
        role: updatedItem.role,
        roleName: updatedItem.role === 1 ? "Admin" : "Staff",
        status: updatedItem.status,
      });
    }

    return { success: true, data: updatedItem, list: updatedList };
  },

  // Xóa tài khoản theo ID (Immutable Remove)
  delete: (id, currentUserId = null) => {
    // Không cho phép tự xóa chính mình để tránh mất phiên làm việc
    if (id === currentUserId) {
      return {
        success: false,
        message: "Bạn không thể xóa tài khoản hiện đang đăng nhập của chính mình!",
      };
    }

    const list = userService.getAll();
    const updatedList = list.filter((item) => item.id !== id);
    storageService.set(STORAGE_KEYS.USERS, updatedList);

    return {
      success: true,
      message: "Đã xóa người dùng thành công!",
      list: updatedList,
    };
  },
};
