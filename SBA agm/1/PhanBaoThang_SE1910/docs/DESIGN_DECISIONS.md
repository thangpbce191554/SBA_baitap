# BẢN GHI CÁC QUYẾT ĐỊNH THIẾT KẾ (DESIGN_DECISIONS.MD)

> **Dự án:** FUNewsManagementSystem  
> **Sinh viên:** Phan Bảo Thắng - Lớp: SE1910 - Môn: SBA301  
> **Căn cứ:** Mục 3.6 và Rubric tiêu chí 2 (Solution Design & Reasoning - 1.5 điểm)  

---

## Bảng Tổng Hợp 7 Quyết Định Thiết Kế Then Chốt

| # | Quyết định | Lựa chọn kỹ thuật | Lý do lựa chọn (Reasoning) | Ảnh hưởng nếu thay đổi yêu cầu (Trade-off & Impact) |
|:---|:---|:---|:---|:---|
| **1** | **Cơ chế điều hướng (Navigation)** | **State Navigation (Conditional Rendering)** thông qua state `activeTab` tại `App.jsx`. | Đơn giản, không phụ thuộc thư viện ngoài (`react-router-dom`), đảm bảo 100% không bị lỗi 404 khi người dùng refresh hoặc khi chạy trên server tĩnh chấm điểm tự động. | Nếu yêu cầu hỗ trợ **Deep Linking** (URL chia sẻ trực tiếp như `/admin/news/123`) hoặc nút Back/Forward của trình duyệt, sẽ cần tích hợp `react-router-dom` và cấu hình server rewrite fallback về `index.html`. |
| **2** | **Phân quyền sở hữu State (State Ownership)** | **3 tầng phân cấp rõ ràng:**<br>- *Shared State:* `currentUser`, `categories`, `news`, `users` đặt tại `App.jsx`.<br>- *Local UI State:* `searchKeyword`, `isModalOpen`, `deleteItem` đặt tại Page tương ứng.<br>- *Form State:* `name`, `title`, `content` đặt tại Modal component. | Giữ nguyên tắc **Single Source of Truth** cho dữ liệu dùng chung (ví dụ: Dashboard và CategoryPage cùng truy cập `categories`), đồng thời tránh làm re-render toàn bộ ứng dụng khi người dùng chỉ đang gõ phím vào ô tìm kiếm hoặc form input. | Nếu ứng dụng mở rộng thêm nhiều cấp component con lồng nhau sâu (Prop Drilling), có thể cần nâng cấp lên `React Context API` hoặc `Zustand` để truyền dữ liệu mà không cần thông qua props. |
| **3** | **Lưu trữ dữ liệu (Persistence Strategy)** | **LocalStorage Hydration** kết hợp tầng tiện ích bọc an toàn (`storageService.js`) có try/catch và kiểm tra null. | Giúp dữ liệu CRUD và phiên đăng nhập không bị mất đi khi F5/reload trang mà không cần cài đặt database hay Spring Boot backend phức tạp ở Assignment 01. | `localStorage` bị giới hạn dung lượng ~5MB và chỉ lưu được kiểu chuỗi (String). Nếu dữ liệu lớn hơn hoặc có ảnh đính kèm base64, sẽ cần chuyển sang `IndexedDB` hoặc kết nối REST API thực tế với cơ sở dữ liệu MySQL/PostgreSQL. |
| **4** | **Tái sử dụng hộp thoại CRUD (Dialog Reuse)** | **Một Modal duy nhất cho mỗi thực thể** xử lý cả hai chế độ `create` và `update` dựa trên prop `mode`. | Giảm 50% số lượng file component, đảm bảo các trường nhập liệu và phong cách giao diện của Create và Update luôn đồng nhất, bảo trì mã nguồn nhanh gấp đôi. | Phải dùng `useEffect` trong Modal để đồng bộ lại dữ liệu khi đổi giữa hai chế độ; nếu form Thêm mới và Sửa có sự phân nhánh quá khác biệt về quyền hạn (ví dụ: Update không được đổi ID hoặc đổi Category), cần thêm điều kiện `disabled` cho các trường đó. |
| **5** | **Chiến lược Tìm kiếm (Search Strategy)** | **Tính toán động (Derived State)**: Giữ nguyên `sourceList`, tính `displayedList` bằng phương thức `.filter()` chuẩn hóa `trim()` và `toLowerCase()`. | Tuyệt đối **không bao giờ ghi đè** lên mảng dữ liệu gốc. Không cần tạo thêm một state `filteredNews`, tránh hoàn toàn nguy cơ lệch dữ liệu (State De-sync) khi người dùng vừa search vừa thực hiện CRUD. | Khi dữ liệu tăng lên hàng chục nghìn bản ghi, việc filter trực tiếp trên client sẽ làm chậm luồng chính (Main Thread). Khi đó cần chuyển sang tìm kiếm phía máy chủ (Server-side Search với API phân trang `Pageable` trong Spring Boot). |
| **6** | **Cấu trúc thư mục (Folder Structure)** | **Tách lớp chức năng (Layered by Feature & Concern):**<br>- `src/assets`: Logo, hình ảnh.<br>- `src/components`: UI tái sử dụng (Layout, Header, Sidebar, Modal).<br>- `src/pages`: Màn hình nghiệp vụ.<br>- `src/services`: Mock API & Storage. | Mã nguồn ngăn nắp, rành mạch, dễ đọc hiểu cho người mới học React, phân tách độc lập giữa tầng giao diện hiển thị (View) và tầng xử lý dữ liệu (Service Layer). | Giúp việc chuyển giao sau này sang đồ án tích hợp Spring Boot cực kỳ nhanh chóng: Chỉ cần thay đổi code bên trong thư mục `src/services/` thành các lệnh gọi `fetch()` hoặc `axios` mà giữ nguyên 100% giao diện trong `src/pages/`. |
| **7** | **Chính sách xóa danh mục (Category Delete Policy)** | **Chính sách Chặn xóa (RESTRICT Policy)**: Kiểm tra `newsList.some(n => n.categoryId === id)`. Nếu có bài viết tin tức liên kết thì từ chối xóa và hiển thị cảnh báo đỏ. | Đảm bảo tính toàn vẹn dữ liệu (Data Integrity). Không bao giờ sinh ra bài viết tin tức "mồ côi" (Orphan Records) trỏ vào danh mục không tồn tại. Đây là chuẩn mực bắt buộc trong các CSDL quan hệ như SQL Server / MySQL. | Người dùng bắt buộc phải chuyển các bài viết sang danh mục khác hoặc xóa các bài viết đó trước khi muốn xóa danh mục. Nếu muốn xóa nhanh, có thể nâng cấp thành chính sách **CASCADE** (xóa luôn cả tin tức liên quan) hoặc **SET NULL** (đặt categoryId về null). |

---

## Đánh giá mức độ sẵn sàng cho buổi phỏng vấn vấn đáp
Toàn bộ 7 quyết định thiết kế trên được lập luận dựa trên sự cân bằng giữa:
1. **Tính đơn giản, dễ đọc hiểu:** Phù hợp với sinh viên bắt đầu học ReactJS.
2. **Tính bền vững của kiến trúc:** Đã chuẩn bị sẵn Service Layer để sẵn sàng cắm API Spring Boot ở Assignment 02/03.
3. **Tính toàn vẹn của dữ liệu:** Không bị lỗi giao diện, không mất dữ liệu, không vỡ liên kết khóa ngoại.
