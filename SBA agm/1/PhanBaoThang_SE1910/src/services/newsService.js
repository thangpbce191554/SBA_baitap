/**
 * Phan Bảo Thắng
 * SE1910
 */
import { storageService, STORAGE_KEYS } from "./storageService";
import { INITIAL_NEWS, INITIAL_CATEGORIES } from "./mockData";

// Hàm sinh ID tự tăng ngắn gọn, dễ nhớ (news-1, news-2, news-3 -> news-4, news-5)
const getNextNewsId = (list) => {
  let maxNum = 0;
  list.forEach((item) => {
    if (item.id && typeof item.id === "string") {
      const match = item.id.match(/^news-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num < 1000000 && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });
  return `news-${maxNum + 1}`;
};

export const newsService = {
  // Lấy toàn bộ danh sách tin tức (hydrate từ localStorage nếu có)
  getAll: () => {
    let list = storageService.get(STORAGE_KEYS.NEWS, null);
    if (!list) {
      list = [...INITIAL_NEWS];
      storageService.set(STORAGE_KEYS.NEWS, list);
    }
    return list;
  },

  // Tìm bài viết theo ID
  getById: (id) => {
    const list = newsService.getAll();
    return list.find((item) => item.id === id) || null;
  },

  // Thêm mới bài viết (Tạo ID ngắn dạng news-4, news-5)
  create: (data, currentUsername = "Admin") => {
    const list = newsService.getAll();
    const categories = storageService.get(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);

    // Kiểm tra categoryId có hợp lệ và tồn tại không
    const categoryExists = categories.some((c) => c.id === data.categoryId);
    const validCategoryId = categoryExists
      ? data.categoryId
      : categories[0]?.id || "cat-1";

    const newArticle = {
      id: getNextNewsId(list),
      title: (data.title || "").trim(),
      content: (data.content || "").trim(),
      categoryId: validCategoryId,
      createdBy: data.createdBy || currentUsername,
      status: Number(data.status ?? 1),
      tags: (data.tags || "").trim(),
    };

    const updatedList = [newArticle, ...list];
    storageService.set(STORAGE_KEYS.NEWS, updatedList);
    return { success: true, data: newArticle, list: updatedList };
  },

  // Cập nhật bài viết theo ID (Immutable Update)
  update: (id, data) => {
    const list = newsService.getAll();
    let updatedItem = null;

    const updatedList = list.map((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          title: (data.title || "").trim(),
          content: (data.content || "").trim(),
          categoryId: data.categoryId || item.categoryId,
          status: Number(data.status ?? item.status),
          tags: (data.tags || "").trim(),
        };
        return updatedItem;
      }
      return item;
    });

    if (!updatedItem) {
      return { success: false, message: "Không tìm thấy bài viết để cập nhật!" };
    }

    storageService.set(STORAGE_KEYS.NEWS, updatedList);
    return { success: true, data: updatedItem, list: updatedList };
  },

  // Xóa bài viết theo ID (Immutable Remove)
  delete: (id) => {
    const list = newsService.getAll();
    const updatedList = list.filter((item) => item.id !== id);
    storageService.set(STORAGE_KEYS.NEWS, updatedList);

    return {
      success: true,
      message: "Đã xóa bài viết thành công!",
      list: updatedList,
    };
  },
};
