# NHẬT KÝ SỬ DỤNG AI CÓ KIỂM SOÁT (AI_USAGE_LOG.MD)

> **Dự án:** FUNewsManagementSystem  
> **Sinh viên:** Phan Bảo Thắng - Lớp: SE1910 - Môn: SBA301  
> **Căn cứ:** Mục 0.3, Mục 9 và Rubric tiêu chí 8 (AI Usage & Engineering Practice - 0.5 điểm)  
> **Quy trình áp dụng:** 6 bước chuẩn mực (*Ask → Inspect → Adapt → Run → Explain → Record*)  

---

## Tuyên bố minh bạch về việc sử dụng AI
Sinh viên cam kết sử dụng Trợ lý AI (Google Antigravity / Gemini) như một công cụ hỗ trợ tư vấn kiến trúc, gợi ý giải pháp và đồng hành kiểm thử (Pair Programming). Toàn bộ mã nguồn, cấu trúc dữ liệu và các luồng xử lý đều do sinh viên trực tiếp kiểm duyệt, hiểu rõ từng dòng lệnh và có khả năng độc lập giải thích, sửa đổi trực tiếp khi giảng viên yêu cầu trong buổi đánh giá.

---

## Bảng Nhật Ký Tương Tác và Kiểm Chứng (AI Usage Matrix)

| # | Prompt (Câu lệnh yêu cầu gửi cho AI) | Mục đích (Goal) | Gợi ý của AI (AI Suggestion) | Tôi đã kiểm chứng thế nào? (Verification Method) | Tôi đã sửa/tinh chỉnh gì? (Adaptation / Customization) |
|:---|:---|:---|:---|:---|:---|
| **1** | *"Đọc toàn bộ file SBA301_Assignment01_Student_Guide.pdf, tóm tắt các yêu cầu bắt buộc R01-R12 và lập kế hoạch theo 11 milestone."* | Nắm vững toàn bộ bài toán, phạm vi bài tập và thang điểm rubric trước khi viết bất kỳ dòng code nào. | Liệt kê chi tiết bảng R01–R12, chỉ ra các phạm vi không bắt buộc (không cần backend Spring Boot thật, không cần DB thật) và lộ trình 11 milestone. | Đối chiếu từng mục trong bản tóm tắt với 20 trang file PDF đề bài để đảm bảo không sót bất kỳ ràng buộc nào. | Thêm ràng buộc về việc không sử dụng thư viện UI ngoài (Tailwind/Bootstrap/AntD), giữ nguyên mã nguồn JavaScript thuần và React Hooks cơ bản. |
| **2** | *"Tư vấn cấu trúc Design System bằng Vanilla CSS cho giao diện quản trị Admin hiện đại, sạch sẽ và chuyên nghiệp."* | Xây dựng giao diện đồng nhất cho toàn hệ thống mà không cần cài thêm thư viện CSS nặng nề. | Cung cấp bảng màu CSS Variables (`--primary`, `--bg-sidebar`,...), cấu trúc layout 2 cột (Sidebar cố định 250px và ContentArea co giãn), các class `.data-table`, `.badge-active`, `.modal-backdrop`. | Tạo file `index.css`, chạy thử `npm run dev` trên trình duyệt Chrome, quan sát độ tương phản màu sắc và khả năng responsive khi co giãn cửa sổ. | Thêm style bo góc mềm mại hơn, bổ sung style cho các thẻ phân loại `#tag-badge`, tinh chỉnh độ cao sticky của Header thành 64px để không bị che khuất nội dung. |
| **3** | *"Gợi ý kiến trúc Service Layer và cơ chế lưu trữ bền vững (Persistence) an toàn trên LocalStorage."* | Tách biệt hoàn toàn tầng dữ liệu khỏi giao diện UI, chuẩn bị sẵn đường tích hợp API Spring Boot sau này. | Tạo `storageService.js` bọc `localStorage.getItem/setItem` trong khối `try/catch` để tránh lỗi khi JSON parse bị null hoặc lỗi trình duyệt. | Thử xóa trắng `localStorage` trên trình duyệt (Application tab) rồi tải lại trang để kiểm tra cơ chế nạp dữ liệu mặc định (Hydration). | Đặt tiền tố `funews_` cho tất cả các storage keys (`funews_categories`, `funews_news`, `funews_users`, `funews_auth_user`) để tránh xung đột với các ứng dụng khác trên localhost. |
| **4** | *"Làm thế nào để xử lý chính sách xóa Danh mục Category khi đang có bài viết News tham chiếu tới?"* | Giải quyết bài toán toàn vẹn dữ liệu (Data Integrity) giữa hai thực thể quan hệ một-nhiều. | Đề xuất 3 chính sách: 1. Restrict (Chặn xóa); 2. Cascade (Xóa luôn tin tức liên quan); 3. Set Null (Đưa categoryId về null). Khuyến nghị chọn Restrict. | Kiểm thử thực tế bằng cách bấm xóa danh mục "Công nghệ" (đang có bài viết React 19). | Chọn chính sách **RESTRICT**, viết thêm hàm kiểm tra `newsList.some(n => n.categoryId === id)` trong `categoryService.js`, hiển thị Alert đỏ cảnh báo rõ ràng cho người dùng. |
| **5** | *"Thiết kế logic tìm kiếm (Search) tối ưu cho bảng dữ liệu mà không làm mất hoặc ghi đè mảng dữ liệu gốc."* | Đảm bảo tính năng tìm kiếm hoạt động độc lập, không gây lỗi mất dữ liệu khi người dùng vừa search vừa CRUD. | Gợi ý sử dụng **Derived State** (danh sách hiển thị tính toán động từ mảng gốc) thay vì tạo thêm state `filteredList` riêng biệt. | Kiểm tra bằng cách gõ từ khóa tìm kiếm, sau đó xóa từ khóa → quan sát xem toàn bộ danh sách ban đầu có quay lại đầy đủ không. | Thêm chuẩn hóa từ khóa `.trim().toLowerCase()` và bọc fallback `(item.field || "")` để chống lỗi crash khi gặp giá trị null/undefined. |
| **6** | *"Tạo ma trận kiểm thử 35 test cases theo đúng bảng mục 5.1 trong PDF và hỗ trợ chuẩn bị câu hỏi vấn đáp."* | Hoàn thiện bộ hồ sơ đánh giá và tự luyện tập trả lời phỏng vấn trước buổi đánh giá rubric. | Liệt kê chi tiết 35 ca kiểm thử bao gồm đầy đủ normal cases, negative cases và edge cases; gợi ý các câu hỏi chuyên sâu của rubric mục 12. | Trực tiếp thao tác thực tế từng bước trên giao diện ứng dụng và ghi nhận kết quả thực tế (Actual Result) chuẩn xác. | Bổ sung phần phân tích tác động (Impact Analysis) cho 3 bài tập chuyển giao (Transfer Tasks) vào sổ tay phỏng vấn. |

---

## Tự đánh giá năng lực làm chủ mã nguồn
- Sinh viên có thể mở bất kỳ file nào trong dự án trong vòng dưới **15 giây**.
- Sinh viên nắm vững 100% luồng dữ liệu một chiều (One-way Data Flow) từ state cha xuống props con và từ callback event con ngược lên state cha.
- Sẵn sàng thực hiện trực tiếp mọi yêu cầu sửa đổi nhỏ từ giảng viên mà không cần sự trợ giúp của AI.
