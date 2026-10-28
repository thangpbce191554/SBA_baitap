/**
 * Phan Bảo Thắng
 * SE1910
 */
import { storageService, STORAGE_KEYS } from "./storageService";
import { INITIAL_CATEGORIES, INITIAL_NEWS } from "./mockData";

// Hàm sinh ID tự tăng ngắn gọn, dễ nhớ (cat-1, cat-2 -> cat-5, cat-6)
const getNextCategoryId = (list) => {
  let maxNum = 0;
  list.forEach((item) => {
    if (item.id && typeof item.id === "string") {
      const match = item.id.match(/^cat-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        // Bỏ qua timestamp dài nếu có từ trước, giữ số thứ tự nhỏ
        if (num < 1000000 && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });
  return `cat-${maxNum + 1}`;
};

export const categoryService = {
  // Lấy toàn bộ danh sách danh mục (hydrate từ localStorage nếu có)
  getAll: () => {
    let list = storageService.get(STORAGE_KEYS.CATEGORIES, null);
    if (!list) {
      list = [...INITIAL_CATEGORIES];
      storageService.set(STORAGE_KEYS.CATEGORIES, list);
    }
    return list;
  },

  // Tìm danh mục theo ID
  getById: (id) => {
    const list = categoryService.getAll();
    return list.find((item) => item.id === id) || null;
  },

  // Thêm mới danh mục (Tạo ID ngắn dạng cat-5, cat-6)
  create: (data) => {
    const list = categoryService.getAll();
    const newCategory = {
      id: getNextCategoryId(list),
      name: (data.name || "").trim(),
      status: Number(data.status ?? 1),
    };
    const updatedList = [newCategory, ...list];
    storageService.set(STORAGE_KEYS.CATEGORIES, updatedList);
    return { success: true, data: newCategory, list: updatedList };
  },

  // Cập nhật danh mục theo ID (Immutable Update)
  update: (id, data) => {
    const list = categoryService.getAll();
    let updatedItem = null;
    const updatedList = list.map((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          name: (data.name || "").trim(),
          status: Number(data.status ?? item.status),
        };
        return updatedItem;
      }
      return item;
    });

    if (!updatedItem) {
      return { success: false, message: "Không tìm thấy danh mục để cập nhật!" };
    }

    storageService.set(STORAGE_KEYS.CATEGORIES, updatedList);
    return { success: true, data: updatedItem, list: updatedList };
  },

  // Xóa danh mục theo ID (Áp dụng chính sách RESTRICT: Chặn xóa nếu có News liên kết)
  delete: (id) => {
    // 1. Kiểm tra ràng buộc quan hệ với News (Foreign Key Check)
    const newsList = storageService.get(STORAGE_KEYS.NEWS, INITIAL_NEWS);
    const isCategoryUsedInNews = newsList.some((n) => n.categoryId === id);

    if (isCategoryUsedInNews) {
      return {
        success: false,
        message:
          "Không thể xóa danh mục này vì đang có bài viết tin tức thuộc về danh mục này! Hãy chuyển danh mục bài viết trước khi xóa.",
      };
    }

    // 2. Nếu không có News liên kết, thực hiện xóa bất biến
    const list = categoryService.getAll();
    const updatedList = list.filter((item) => item.id !== id);
    storageService.set(STORAGE_KEYS.CATEGORIES, updatedList);

    return {
      success: true,
      message: "Đã xóa danh mục thành công!",
      list: updatedList,
    };
  },
};
