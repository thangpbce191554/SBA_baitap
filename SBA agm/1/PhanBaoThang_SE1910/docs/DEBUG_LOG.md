# NHẬT KÝ SỬA LỖI KỸ THUẬT (DEBUG_LOG.MD)

> **Dự án:** FUNewsManagementSystem  
> **Sinh viên:** Phan Bảo Thắng - Lớp: SE1910 - Môn: SBA301  
> **Căn cứ:** Mục 6 và Rubric tiêu chí 5 (Debugging & Problem Solving - 1.5 điểm)  
> **Quy trình áp dụng:** 5 bước chuẩn mực (*Triệu chứng → Giả thuyết → Kiểm tra → Root cause → Fix → Retest*)  

---

## Lỗi 1: Form Thêm mới bị dính dữ liệu cũ của bản ghi vừa Sửa (Stale Form State)

- **1. Triệu chứng (Symptom):**  
  Người dùng bấm nút "✏️ Sửa" một danh mục (ví dụ: *Công nghệ*), xem dữ liệu trong popup rồi đóng lại. Sau đó người dùng bấm "➕ Thêm mới Danh mục", hộp thoại popup mở ra nhưng ô nhập liệu vẫn hiện chữ *"Công nghệ"* thay vì form trắng rỗng.
- **2. Giả thuyết (Hypothesis):**  
  Component `CategoryModal` chỉ khởi tạo state ban đầu một lần duy nhất (`initial state`). Khi đóng và mở lại, component không bị unmount hoàn toàn nên `useState("")` không được chạy lại.
- **3. Cách kiểm tra (Inspection):**  
  Mở React DevTools kiểm tra state nội bộ của `CategoryModal` khi chuyển đổi prop `mode` từ `"update"` sang `"create"`. Nhận thấy state `name` không tự động reset về chuỗi rỗng.
- **4. Nguyên nhân gốc rễ (Root Cause):**  
  Trong React, `useState(initialValue)` chỉ dùng giá trị khởi tạo trong lần render đầu tiên (Mounting phase). Khi props `isOpen` hoặc `mode` thay đổi ở các lần render sau, React sẽ giữ nguyên state hiện tại của component trừ khi có sự can thiệp chủ động.
- **5. Cách sửa (Fix):**  
  Sử dụng Hook `useEffect` để theo dõi các phụ thuộc `[isOpen, mode, initialData]`. Mỗi khi mở modal ở chế độ `create`, chủ động gọi hàm reset:
  ```javascript
  useEffect(() => {
    if (isOpen) {
      if (mode === "update" && initialData) {
        setName(initialData.name || "");
        setStatus(initialData.status ?? 1);
      } else {
        // Reset sạch sẽ form khi mở Create
        setName("");
        setStatus(1);
      }
      setError("");
    }
  }, [isOpen, mode, initialData]);
  ```
- **6. Kiểm tra lại (Retest):**  
  Mở Sửa danh mục "Kinh doanh" → Đóng modal → Bấm Thêm mới danh mục → Kết quả: Form hoàn toàn trắng rỗng, sẵn sàng nhập liệu mới. **(Đạt - Resolved)**

---

## Lỗi 2: Trắng màn hình khi tìm kiếm trên bản ghi có trường null (Null Pointer / Type Error)

- **1. Triệu chứng (Symptom):**  
  Khi gõ từ khóa vào thanh tìm kiếm trên trang Quản lý Tin tức (News Management), ứng dụng đột ngột sập (Crash / White Screen of Death), trên console trình duyệt báo lỗi đỏ:  
  `TypeError: Cannot read properties of undefined (reading 'toLowerCase')`
- **2. Giả thuyết (Hypothesis):**  
  Có một số bài viết mới tạo mà người dùng không nhập thẻ phân loại (Tags) hoặc nội dung bị null, dẫn đến việc gọi hàm `.toLowerCase()` trên một biến `undefined`.
- **3. Cách kiểm tra (Inspection):**  
  Kiểm tra dữ liệu trong `localStorage` tại key `funews_news`, phát hiện bản ghi mới có thuộc tính `tags: undefined`. Tra cứu lại code hàm filter trong `NewsPage.jsx` thấy dòng gọi trực tiếp: `item.tags.toLowerCase()`.
- **4. Nguyên nhân gốc rễ (Root Cause):**  
  Thiếu bước phòng thủ (Defensive Programming) và kiểm tra null-safety trước khi gọi các phương thức xử lý chuỗi trên các thuộc tính tùy chọn (Optional Fields).
- **5. Cách sửa (Fix):**  
  Bọc giá trị bằng toán tử fallback chuỗi rỗng `(item.tags || "")` trước khi gọi `.toLowerCase()`:
  ```javascript
  const titleMatch = (item.title || "").toLowerCase().includes(normalizedKeyword);
  const contentMatch = (item.content || "").toLowerCase().includes(normalizedKeyword);
  const tagsMatch = (item.tags || "").toLowerCase().includes(normalizedKeyword);
  ```
- **6. Kiểm tra lại (Retest):**  
  Tạo bài viết mới bỏ trống ô Tags. Thử gõ các từ khóa khác nhau vào ô tìm kiếm → Kết quả: Ứng dụng lọc bình thường, không xảy ra lỗi, không bị văng ứng dụng. **(Đạt - Resolved)**

---

## Lỗi 3: Xóa Danh mục làm hỏng dữ liệu liên kết của Bài viết Tin tức (Data Integrity Bug)

- **1. Triệu chứng (Symptom):**  
  Khi người dùng xóa danh mục "Công nghệ" (đang có bài viết tin tức trỏ tới), sau đó chuyển sang trang News, cột Danh mục của bài viết bị biến thành *"Không xác định"*, làm mất tính liên kết thông tin của hệ thống.
- **2. Giả thuyết (Hypothesis):**  
  Hàm `delete` trong `categoryService.js` chỉ thực hiện lọc mảng categories mà không kiểm tra mối quan hệ ràng buộc với mảng tin tức (News).
- **3. Cách kiểm tra (Inspection):**  
  Kiểm tra logic trong `categoryService.js`. Phát hiện hàm xóa chỉ có dòng `list.filter(item => item.id !== id)`, hoàn toàn không có bước xác thực khóa ngoại (Foreign Key Validation).
- **4. Nguyên nhân gốc rễ (Root Cause):**  
  Thiếu quy tắc ràng buộc toàn vẹn dữ liệu (Integrity Constraint Policy) giữa hai thực thể có quan hệ một-nhiều (One-to-Many).
- **5. Cách sửa (Fix):**  
  Cài đặt **Chính sách Restrict Policy**: Đọc danh sách News từ storage, kiểm tra nếu có bất kỳ bài viết nào có `categoryId === id` thì chặn xóa và trả về thông báo lỗi chi tiết:
  ```javascript
  // Kiểm tra ràng buộc quan hệ với News trước khi xóa
  const newsList = storageService.get(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  const isCategoryUsedInNews = newsList.some((n) => n.categoryId === id);

  if (isCategoryUsedInNews) {
    return {
      success: false,
      message: "Không thể xóa danh mục này vì đang có bài viết tin tức liên kết! Hãy chuyển danh mục bài viết trước khi xóa.",
    };
  }
  ```
- **6. Kiểm tra lại (Retest):**  
  Bấm xóa danh mục "Công nghệ" → Xuất hiện thông báo đỏ từ chối xóa và giữ nguyên danh mục. Thử tạo một danh mục mới chưa có bài viết nào và bấm xóa → Xóa thành công. **(Đạt - Resolved)**
