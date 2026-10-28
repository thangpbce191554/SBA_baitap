/**
 * Phan Bảo Thắng
 * SE1910
 */

export const INITIAL_CATEGORIES = [
  { id: "cat-1", name: "Công nghệ", status: 1 },
  { id: "cat-2", name: "Kinh doanh", status: 1 },
  { id: "cat-3", name: "Đời sống", status: 1 },
  { id: "cat-4", name: "Giải trí", status: 0 },
];

export const INITIAL_USERS = [
  { id: "usr-1", username: "Admin", password: "Admin", role: 1, status: 1 }, // Admin / Admin mặc định ban đầu
  { id: "usr-2", username: "Staff", password: "123", role: 2, status: 1 },    // Staff / 123
  { id: "usr-3", username: "john_reporter", password: "123", role: 2, status: 1 },
  { id: "usr-4", username: "inactive_user", password: "123", role: 2, status: 0 },
];

export const INITIAL_NEWS = [
  {
    id: "news-1",
    title: "React 19 chính thức ra mắt với nhiều cải tiến đột phá",
    content: "Phiên bản React 19 mang đến Actions, use Hook tối ưu và khả năng tối ưu hóa render cho Single Page Application.",
    categoryId: "cat-1",
    createdBy: "Admin",
    status: 1, // 1 = Active, 0 = Inactive
    tags: "React, Frontend, Web Dev",
  },
  {
    id: "news-2",
    title: "Thị trường chuyển đổi số tăng trưởng 25% trong quý vừa qua",
    content: "Các doanh nghiệp công nghệ tại Việt Nam ghi nhận doanh thu tăng ấn tượng nhờ áp dụng các giải pháp điện toán đám mây và AI.",
    categoryId: "cat-2",
    createdBy: "Admin",
    status: 1,
    tags: "Kinh tế, AI, Cloud",
  },
  {
    id: "news-3",
    title: "Xu hướng làm việc Hybrid Work trở thành tiêu chuẩn mới",
    content: "Nhiều tập đoàn lớn áp dụng chính sách làm việc từ xa kết hợp văn phòng giúp tăng năng suất và giữ chân nhân tài.",
    categoryId: "cat-3",
    createdBy: "Staff",
    status: 1,
    tags: "Đời sống, Việc làm, Công sở",
  },
];
