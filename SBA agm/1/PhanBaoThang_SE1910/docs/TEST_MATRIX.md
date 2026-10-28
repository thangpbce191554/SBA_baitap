# MA TRẬN KIỂM THỬ THỰC TẾ (TEST_MATRIX.MD)

> **Dự án:** FUNewsManagementSystem  
> **Sinh viên:** Phan Bảo Thắng - Lớp: SE1910 - Môn: SBA301  
> **Căn cứ:** Mục 5.1 Bảng Test Matrix bắt buộc từ tài liệu SBA301 Assignment 01 Student Guide  
> **Trạng thái thực tế:** Đã kiểm thử đầy đủ 35/35 Test Cases  

---

## Bảng Kết Quả Kiểm Thử Chi Tiết (35 Test Cases)

| # | Nhóm | Tên Test Case | Thao tác thực hiện | Kết quả mong đợi (Expected) | Kết quả thực tế (Actual) | Đánh giá |
|:---|:---|:---|:---|:---|:---|:---:|
| **1** | Login | Empty | Bỏ trống username hoặc password và bấm nút "Đăng nhập hệ thống". | Không chuyển trang, hiển thị thông báo lỗi yêu cầu nhập đầy đủ thông tin. | Hiển thị alert đỏ: *"Vui lòng nhập đầy đủ cả tên đăng nhập và mật khẩu!"*, form giữ nguyên tại trang đăng nhập. | **PASS** |
| **2** | Login | Wrong credential | Nhập username hoặc password không hợp lệ (ví dụ: `Admin` / `123456`). | Không cho phép vào trang admin, hiển thị thông báo lỗi sai tài khoản. | Hiển thị alert đỏ: *"Tên đăng nhập hoặc mật khẩu không chính xác!"*, không vào trang quản trị. | **PASS** |
| **3** | Login | Valid Admin | Nhập `Admin` và `Admin`, bấm Đăng nhập. | Đăng nhập thành công, chuyển hướng vào Master Admin Layout. | Ứng dụng chuyển ngay vào Admin Layout, Header hiển thị `Admin (Quản trị viên)`, tab mặc định là Dashboard. | **PASS** |
| **4** | Auth | Logout | Bấm nút "🚪 Đăng xuất" trên thanh Header. | Hủy phiên đăng nhập, quay lại màn hình Login, không thể xem trang admin. | State `currentUser` trở về `null`, xóa session `funews_auth_user` khỏi `localStorage`, UI hiển thị lại LoginPage. | **PASS** |
| **5** | Layout | Menu completeness | Quan sát thanh Sidebar bên trái. | Có đầy đủ 5 menu bắt buộc: Dashboard, Category, News, Users, Settings. | Sidebar hiển thị chuẩn xác 5 mục với biểu tượng trực quan, logo FUNews ở trên cùng và thông tin sinh viên ở chân trang. | **PASS** |
| **6** | Navigation | All menus | Bấm lần lượt từng mục trong 5 menu của Sidebar. | Chuyển đúng nội dung từng trang tương ứng, không bị full-page reload (SPA). | Chuyển đổi tức thì giữa các view, tiêu đề trên Header cập nhật tương ứng, menu đang chọn được tô màu xanh active nổi bật. | **PASS** |
| **7** | Category | Read | Chọn menu "Category" trên Sidebar. | Hiển thị bảng danh mục với đầy đủ các bản ghi hiện có và các trường quy định. | Bảng Category hiển thị danh sách gồm ID (`cat-1..4`), Tên danh mục, Badge trạng thái và các nút Sửa / Xóa. | **PASS** |
| **8** | Category | Create valid | Bấm "➕ Thêm mới Danh mục", nhập tên *"Du lịch"*, chọn Active, bấm Tạo. | Bản ghi mới xuất hiện trên đầu bảng, popup đóng lại, có thông báo thành công. | Category mới `cat-...` xuất hiện ở đầu bảng, modal tự động đóng, hiển thị alert xanh *"Đã thêm danh mục mới thành công!"*. | **PASS** |
| **9** | Category | Create invalid | Bấm "➕ Thêm mới Danh mục", để trống ô tên danh mục và bấm Tạo danh mục. | Không thêm bản ghi, không đóng modal, hiển thị thông báo lỗi bắt buộc. | Viền ô input chuyển màu đỏ, hiển thị thông báo *"Vui lòng nhập tên danh mục!"*, modal không bị đóng. | **PASS** |
| **10** | Category | Update | Bấm nút "✏️ Sửa" tại danh mục *"Du lịch"*, đổi tên thành *"Du lịch & Khám phá"*, bấm Lưu. | Dữ liệu danh mục được cập nhật chính xác, không tạo thêm bản ghi mới. | Dòng dữ liệu đổi tên thành *"Du lịch & Khám phá"*, ID giữ nguyên, modal đóng và hiển thị alert cập nhật thành công. | **PASS** |
| **11** | Category | Delete cancel | Bấm nút "🗑️ Xóa" trên một danh mục, khi hộp thoại hiện lên chọn "Hủy bỏ". | Danh mục không bị xóa, dữ liệu giữ nguyên 100%. | Modal xác nhận đóng lại, danh mục vẫn tồn tại nguyên vẹn trên bảng dữ liệu. | **PASS** |
| **12** | Category | Delete confirm | Bấm nút "🗑️ Xóa" trên danh mục *"Du lịch & Khám phá"* (chưa có News nào dùng), bấm Xác nhận xóa. | Bản ghi bị xóa khỏi danh sách, biến mất khỏi bảng, có thông báo thành công. | Bản ghi biến mất khỏi bảng và `localStorage`, hiển thị alert xanh: *"Đã xóa danh mục thành công!"*. | **PASS** |
| **13** | Category | Search hit | Nhập từ khóa *"công nghệ"* vào ô tìm kiếm danh mục. | Danh sách tự động lọc ra đúng danh mục "Công nghệ". | Bảng thu gọn chỉ còn đúng 1 dòng danh mục *"Công nghệ"*, các dòng khác ẩn đi. | **PASS** |
| **14** | Category | Search miss | Nhập từ khóa không tồn tại như *"xyz123"*. | Hiển thị giao diện thông báo không có kết quả (No-result state). | Bảng ẩn đi, hiển thị hộp No-result *"Không tìm thấy kết quả"* kèm nút *"Xóa bộ lọc tìm kiếm"*. | **PASS** |
| **15** | News | Read | Chọn menu "News" trên Sidebar. | Hiển thị danh sách các bài viết tin tức đầy đủ thông tin. | Bảng News hiển thị các bài viết với Tiêu đề, Tags, Tên danh mục (được ánh xạ từ `categoryId`), Tác giả và Trạng thái. | **PASS** |
| **16** | News | Create valid | Bấm "➕ Viết bài mới", nhập đầy đủ tiêu đề, nội dung, chọn danh mục, bấm Tạo bài viết. | Bài viết mới xuất hiện trên bảng, modal đóng, có thông báo thành công. | Bài viết mới xuất hiện ngay trên đầu bảng News, modal đóng, alert thông báo thành công hiển thị. | **PASS** |
| **17** | News | Create invalid | Bấm "➕ Viết bài mới", bỏ trống ô tiêu đề hoặc nội dung và bấm Tạo bài viết. | Không cho tạo bài, hiển thị lỗi màu đỏ tại trường còn thiếu. | Ô thiếu dữ liệu chuyển viền đỏ kèm dòng chữ lỗi chi tiết (ví dụ: *"Vui lòng nhập tiêu đề bài viết!"*), modal giữ nguyên. | **PASS** |
| **18** | News | Update | Bấm "✏️ Sửa" một bài viết, sửa tiêu đề, bấm Lưu thay đổi. | Bài viết được cập nhật đúng nội dung, giữ nguyên ID và ngày tạo. | Dòng bài viết hiển thị tiêu đề mới cập nhật, modal đóng, có alert xanh báo thành công. | **PASS** |
| **19** | News | Delete cancel | Bấm "🗑️ Xóa" một bài viết, chọn "Hủy bỏ" trên hộp thoại xác nhận. | Bài viết không bị xóa, giữ nguyên trên bảng. | Modal đóng, bài viết vẫn còn nguyên trong danh sách. | **PASS** |
| **20** | News | Delete confirm | Bấm "🗑️ Xóa" bài viết, bấm "Xác nhận xóa". | Bài viết bị xóa khỏi danh sách, bảng cập nhật ngay lập tức. | Bài viết biến mất khỏi bảng và dữ liệu `localStorage`, hiển thị alert xanh báo xóa thành công. | **PASS** |
| **21** | News | Search hit | Nhập từ khóa *"React"* vào ô tìm kiếm tin tức. | Bảng lọc ra đúng các bài viết có chứa từ "React" trong tiêu đề/tags/nội dung. | Bảng hiển thị bài viết về React 19, các bài viết không liên quan bị ẩn. | **PASS** |
| **22** | News | Search miss | Nhập từ khóa không tồn tại *"khongtimthay999"*. | Hiển thị giao diện No-result state. | Hiển thị màn hình No-result thông báo không có bài viết nào khớp, có nút *"Đặt lại bộ lọc"*. | **PASS** |
| **23** | Users | Read | Chọn menu "Users" trên Sidebar. | Hiển thị danh sách người dùng kèm phân quyền và trạng thái. | Bảng hiển thị danh sách người dùng, cột Vai trò có badge Quản trị viên/Nhân viên, tài khoản hiện tại có nhãn `(Đang đăng nhập)`. | **PASS** |
| **24** | Users | Create valid | Bấm "➕ Thêm mới Tài khoản", nhập username *"editor2"*, password *"123"*, bấm Tạo tài khoản. | Người dùng mới xuất hiện trên bảng với vai trò Staff. | Dòng tài khoản `editor2` xuất hiện trên bảng Users, modal đóng, alert thành công hiển thị. | **PASS** |
| **25** | Users | Create invalid | Bấm "➕ Thêm mới Tài khoản", để trống username hoặc trùng username đã có. | Báo lỗi không cho tạo tài khoản. | Nếu để trống báo *"Vui lòng nhập tên đăng nhập!"*; nếu trùng báo *"Tên đăng nhập này đã tồn tại trong hệ thống!"*. | **PASS** |
| **26** | Users | Update | Bấm "✏️ Sửa" tài khoản `editor2`, đổi vai trò thành Admin, bấm Lưu. | Vai trò người dùng đổi thành Quản trị viên (Admin). | Cột vai trò chuyển thành badge xanh `Quản trị viên (Admin)`, modal đóng, alert thành công hiển thị. | **PASS** |
| **27** | Users | Delete cancel | Bấm "🗑️ Xóa" một tài khoản, chọn "Hủy bỏ". | Tài khoản không bị xóa. | Modal đóng, tài khoản giữ nguyên. | **PASS** |
| **28** | Users | Delete confirm | Bấm "🗑️ Xóa" tài khoản `editor2`, chọn "Xác nhận xóa". | Tài khoản bị xóa khỏi hệ thống. | Bản ghi `editor2` biến mất khỏi bảng và `localStorage`, có alert xanh thành công. | **PASS** |
| **29** | Users | Search hit | Nhập từ khóa *"admin"* vào ô tìm kiếm người dùng. | Bảng lọc ra tài khoản `Admin`. | Chỉ hiển thị đúng dòng tài khoản `Admin`, không phân biệt hoa thường. | **PASS** |
| **30** | Users | Search miss | Nhập từ khóa người dùng không tồn tại. | Hiển thị giao diện No-result state. | Hiển thị thông báo không tìm thấy kết quả và nút xóa bộ lọc. | **PASS** |
| **31** | News | Relation | Mở form tạo/sửa News, kiểm tra dropdown Danh mục. | Dropdown chỉ cho chọn các Category hợp lệ đang tồn tại trong hệ thống. | Dropdown hiển thị đúng danh sách Category hiện có (`Công nghệ`, `Kinh doanh`, `Đời sống`, `Giải trí`), không bị trỏ sai ID. | **PASS** |
| **32** | User | Role | Kiểm tra hiển thị cột Role tại User Management và Profile Header. | Role 1 hiển thị "Admin / Quản trị viên", Role 2 hiển thị "Staff / Nhân viên". | Role 1 hiển thị badge màu xanh dương `Quản trị viên (Admin)`, Role 2 hiển thị badge tím `Nhân viên (Staff)`. | **PASS** |
| **33** | Status | Display | Kiểm tra hiển thị cột Status trên tất cả các bảng. | Status 1 hiển thị "Hoạt động / Công khai", Status 0 hiển thị "Tạm ẩn / Đã khóa". | Status 1 hiển thị badge xanh lá `Hoạt động (Active)`, Status 0 hiển thị badge xám `Tạm ẩn (Inactive)`, không để lộ số 0/1. | **PASS** |
| **34** | Data | Empty state | Thử xóa hoặc tìm kiếm trong danh sách rỗng. | UI không bị crash/vỡ khung, hiển thị thông báo Empty State thân thiện. | Hiển thị icon trống, tiêu đề rõ ràng và nút bấm kêu gọi tạo bản ghi mới mà không có lỗi console. | **PASS** |
| **35** | Persistence | Reload | Thêm mới 1 Category và 1 News, sau đó nhấn F5 (Reload trang trên trình duyệt). | Dữ liệu mới và phiên đăng nhập vẫn còn nguyên vẹn sau khi reload. | Trình duyệt giữ nguyên trạng thái đăng nhập của `Admin`, Category và News vừa tạo vẫn hiển thị đầy đủ trên bảng. | **PASS** |

---

## Kết luận chất lượng kiểm thử
- **Tỷ lệ kiểm thử đạt chuẩn:** 35/35 Test Cases đạt **100% PASS**.
- **Không xảy ra lỗi màn hình trắng (White Screen of Death)** hay lỗi không bắt được ngoại lệ (Unhandled Exceptions).
- **Tính toàn vẹn dữ liệu** được bảo vệ nghiêm ngặt: Khi thử xóa Category đang có News liên kết, hệ thống chặn xóa và đưa ra thông báo rõ ràng theo đúng chính sách **Foreign Key Restrict**.
