# FUNewsManagementSystem - Frontend Quản trị ReactJS (Vite)

> **Môn học:** SBA301 - Integrate Single Page Application with Spring Boot  
> **Bài tập:** Assignment 01 – Working with ReactJS Application  
> **Sinh viên thực hiện:** Phan Bảo Thắng  
> **Lớp:** SE1910  
> **Thư mục bài nộp:** `PhanBaoThang_SE1910`  

---

## 1. Giới thiệu tổng quan hệ thống
**FUNewsManagementSystem** là ứng dụng Single Page Application (SPA) xây dựng bằng **ReactJS 19** và công cụ build **Vite 8**. Ứng dụng cung cấp bảng điều khiển quản trị tin tức toàn diện cho các ban biên tập, bao gồm:
- **Xác thực người dùng:** Đăng nhập phân quyền (Admin / Staff), phiên làm việc tự lưu trữ qua `localStorage`.
- **Quản lý Danh mục (Category Management):** Thao tác CRUD, tìm kiếm, ràng buộc toàn vẹn khóa ngoại (Foreign Key Restrict Policy).
- **Quản lý Bài viết Tin tức (News Management):** Thao tác CRUD, liên kết danh mục hợp lệ, gắn nhãn tags, xuất bản bài viết.
- **Quản lý Tài khoản (User Management):** Thao tác CRUD, phân quyền vai trò (Admin / Staff), bảo vệ không cho tự xóa tài khoản đang đăng nhập.
- **Bảng điều khiển (Dashboard):** Tổng hợp số liệu thống kê thời gian thực của các thực thể trong hệ thống.
- **Cài đặt & Hồ sơ (Settings):** Xem thông tin phiên làm việc và cấu hình ứng dụng.

---

## 2. Hướng dẫn cài đặt và chạy ứng dụng

### Yêu cầu môi trường
- **Node.js:** Phiên bản `>= 18.0.0` (Khuyến nghị Node.js v20+ hoặc v24)
- **Trình duyệt web:** Google Chrome, Microsoft Edge, Firefox bản mới nhất

### Các bước thực thi từ dòng lệnh
1. Mở Terminal / PowerShell tại thư mục gốc của dự án (`PhanBaoThang_SE1910`):
   ```bash
   # Di chuyển vào đúng thư mục dự án nếu chưa ở sẵn
   cd PhanBaoThang_SE1910
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy Development Server:
   ```bash
   npm run dev
   ```
4. Mở trình duyệt và truy cập đường dẫn xuất hiện trên terminal (mặc định: `http://localhost:5173/`).

---

## 3. Tài khoản kiểm thử (Test Credentials)

| Tên đăng nhập (Username) | Mật khẩu (Password) | Vai trò (Role) | Mô tả quyền hạn |
|:---|:---|:---|:---|
| **`Admin`** | **`Admin`** | Quản trị viên (Role 1) | Tài khoản mặc định theo đề bài, toàn quyền quản trị |
| **`Staff`** | **`123`** | Nhân viên (Role 2) | Tài khoản nhân viên biên tập |
| **`john_reporter`** | **`123`** | Nhân viên (Role 2) | Phóng viên hoạt động |
| **`inactive_user`** | **`123`** | Nhân viên (Role 2) | Tài khoản đã bị khóa (Inactive) - Dùng test đăng nhập lỗi |

---

## 4. Các tính năng chính đã hoàn thiện
1. **Login Page (R02, R03):** Form controlled inputs, validate trường rỗng tức thì, bắt lỗi sai thông tin đăng nhập, tài khoản Admin/Admin vào thẳng Admin Dashboard.
2. **Master Admin Layout (R04, R05):** Header dùng chung tích hợp Logo vector AI sắc nét, hiển thị avatar và tên người dùng, nút Đăng xuất an toàn.
3. **Sidebar Menu & SPA Navigation (R06):** Menu đủ 5 mục (Dashboard, Category, News, Users, Settings), chuyển trang mượt mà không bị full-page reload, tô màu active menu rõ ràng.
4. **CRUD qua Popup Dialog (R07, R08, R09, R10):**
   - Tái sử dụng một Modal Component duy nhất cho Create & Update.
   - Thêm mới (Create): Reset form trắng sạch sẽ.
   - Chỉnh sửa (Update): Prefill chính xác dữ liệu của bản ghi được chọn qua `useEffect`.
   - Validate form bắt buộc trước khi lưu; cập nhật state hoàn toàn bất biến (`map`, `spread`).
5. **Delete Confirmation & Data Integrity Policy (R11, R12):**
   - Hộp thoại xác nhận trước khi xóa, bấm Hủy bỏ dữ liệu nguyên vẹn 100%.
   - **Chính sách Restrict Policy:** Danh mục Category đang được bài viết News sử dụng sẽ bị chặn xóa và có thông báo giải thích cụ thể.
   - Chặn tài khoản tự xóa chính mình.
6. **Search & Filter độc lập (M10):**
   - Tìm kiếm theo từ khóa độc lập, không bao giờ ghi đè lên dữ liệu nguồn (`sourceList` giữ nguyên, lọc ra `displayedList`).
   - Chuẩn hóa từ khóa (`trim()`, `toLowerCase()`, null-check).
   - Hỗ trợ giao diện No-result State và nút Xóa bộ lọc khi không tìm thấy kết quả.
7. **Mock Service Layer & Storage Persistence:**
   - Tách riêng tầng Service (`authService`, `categoryService`, `newsService`, `userService`) sẵn sàng thay thế bằng API Spring Boot.
   - Tự động lưu và phục hồi dữ liệu qua `localStorage`, không mất dữ liệu khi F5/reload trang.

---

## 5. Cấu trúc thư mục mã nguồn

```text
PhanBaoThang_SE1910/
├── docs/                               # Bộ hồ sơ đánh giá và tài liệu kỹ thuật
│   ├── NOTES.md                        # Ghi chú chi tiết 11 Milestone theo khung 5 tầng
│   ├── TEST_MATRIX.md                  # 35 test cases thực tế theo mục 5.1 đề bài
│   ├── DESIGN_DECISIONS.md             # 6 quyết định thiết kế then chốt
│   ├── DEBUG_LOG.md                    # Nhật ký xử lý lỗi thực tế trong quá trình làm
│   ├── AI_USAGE_LOG.md                 # Nhật ký cộng tác với AI trợ lý
│   └── INTERVIEW_PREP.md               # Sổ tay vấn đáp & bài tập chuyển giao (Transfer)
├── public/                             # Tài nguyên tĩnh
├── src/
│   ├── assets/
│   │   └── logo.svg                    # Logo vector AI cho FUNews
│   ├── components/                     # Các components tái sử dụng
│   │   ├── AdminLayout.jsx             # Master layout bao bọc Header/Sidebar/Content
│   │   ├── Header.jsx                  # Header hiển thị thông tin user & Logout
│   │   ├── Sidebar.jsx                 # Thanh điều hướng 5 menu
│   │   ├── ConfirmModal.jsx            # Hộp thoại xác nhận xóa dùng chung
│   │   ├── CategoryModal.jsx           # Popup form Thêm/Sửa danh mục
│   │   ├── NewsModal.jsx               # Popup form Thêm/Sửa bài viết tin tức
│   │   └── UserModal.jsx               # Popup form Thêm/Sửa người dùng
│   ├── pages/                          # Các màn hình chính của ứng dụng
│   │   ├── LoginPage.jsx               # Màn hình đăng nhập
│   │   ├── DashboardPage.jsx           # Bảng điều khiển thống kê tổng quan
│   │   ├── CategoryPage.jsx            # Màn hình quản lý Danh mục
│   │   ├── NewsPage.jsx                # Màn hình quản lý Bài viết tin tức
│   │   ├── UserPage.jsx                # Màn hình quản lý Tài khoản
│   │   └── SettingsPage.jsx            # Màn hình Cài đặt & Thông tin tài khoản
│   ├── services/                       # Tầng Mock Data Service
│   │   ├── mockData.js                 # Dữ liệu mẫu khởi tạo ban đầu
│   │   ├── storageService.js           # Xử lý lưu trữ LocalStorage an toàn
│   │   ├── authService.js              # Nghiệp vụ đăng nhập / đăng xuất
│   │   ├── categoryService.js          # Nghiệp vụ CRUD & Delete Policy Category
│   │   ├── newsService.js              # Nghiệp vụ CRUD News
│   │   └── userService.js              # Nghiệp vụ CRUD User
│   ├── App.jsx                         # Root Component (Quản lý Auth State & Navigation)
│   ├── main.jsx                        # Entry point của ứng dụng React
│   └── index.css                       # Toàn bộ Admin Design System (Vanilla CSS)
├── index.html                          # Trang HTML gốc
├── package.json                        # Cấu hình scripts và dependencies
└── vite.config.js                      # Cấu hình Vite React
```

---

## 6. Giới hạn hiện tại của dự án
1. **Mock Data:** Dữ liệu đang được lưu cục bộ trên trình duyệt qua `localStorage` (chưa có backend Spring Boot và CSDL MySQL/PostgreSQL thật kết nối mạng).
2. **Logo AI:** Sử dụng file vector [src/assets/logo.svg](file:///d:/SBA_baitap/SBA%20agm/1/PhanBaoThang_SE1910/src/assets/logo.svg) chuẩn, sinh viên có thể tự thay thế bằng logo AI của riêng mình nếu có hình ảnh PNG/SVG khác.
3. **Phạm vi bảo mật:** Quá trình đăng nhập lưu thông tin phiên dạng JSON object đơn giản trong `localStorage` cho mục đích mô phỏng (chưa dùng JWT token mã hóa).

---

## 7. Tuyên bố sử dụng AI có trách nhiệm (AI Usage)
Dự án được thực hiện với sự hỗ trợ của Trợ lý AI (Google Antigravity / Gemini) theo đúng quy định mục 0.3 và mục 9 của tài liệu Hướng dẫn Sinh viên SBA301. Toàn bộ logic, cấu trúc state, xử lý bất biến và các test case đã được sinh viên tự tay rà soát, kiểm chứng thực tế và sẵn sàng giải thích chi tiết trong buổi phỏng vấn vấn đáp.
Chi tiết xem tại: [docs/AI_USAGE_LOG.md](file:///d:/SBA_baitap/SBA%20agm/1/PhanBaoThang_SE1910/docs/AI_USAGE_LOG.md).
