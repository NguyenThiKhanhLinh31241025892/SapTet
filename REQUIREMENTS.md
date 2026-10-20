# Requirements – Sắp Tết

## 1. Mục tiêu dự án

Xây dựng website thương mại điện tử **Sắp Tết**, hỗ trợ khách hàng tự phối hộp quà Tết theo sở thích và ngân sách.

Website cho phép lựa chọn bao bì, sản phẩm và thiệp chúc; theo dõi tổng tiền, xem trước hộp quà và đặt hàng trực tuyến. Hệ thống đồng thời hỗ trợ quản trị viên quản lý sản phẩm, tồn kho và đơn hàng.

**Giá trị mang lại:** Tăng tính linh hoạt khi mua quà, hỗ trợ kiểm soát chi tiêu, cá nhân hóa quà tặng và giúp khách hàng hình dung thành phần hộp quà trước khi mua.

## 2. Phạm vi

### Trong phạm vi

- Trang chủ, danh mục, chi tiết, tìm kiếm và lọc sản phẩm.
- Tùy chỉnh bao bì, sản phẩm, số lượng và thiệp chúc Tết.
- Nhập ngân sách, tính tổng tiền, cập nhật số dư và cảnh báo vượt ngân sách.
- Xem trước hộp quà 2D đơn giản.
- Giỏ hàng, đặt hàng và tra cứu trạng thái đơn.
- Trang quản trị sản phẩm, bao bì, thiệp, giá, tồn kho và đơn hàng.

### Ngoài phạm vi

- Mô phỏng hộp quà 3D hoặc kéo thả sắp xếp chính xác.
- Gợi ý bằng AI hoặc Machine Learning phức tạp.
- Tích hợp cổng thanh toán và đối soát tự động.
- Quản lý nhiều kho hàng hoặc nhiều nhà bán.
- Đặt hàng doanh nghiệp số lượng lớn với báo giá và chiết khấu tự động.
- Hệ thống phân tích kinh doanh nâng cao.

## 3. Người dùng

| Vai trò | Quyền hạn |
|---|---|
| Khách truy cập / khách đặt hàng (Guest) | Xem sản phẩm, tự phối hộp quà, kiểm tra ngân sách, đặt hàng và tra cứu đơn bằng thông tin xác minh phù hợp. |
| Quản trị viên (Admin) | Đăng nhập, quản lý sản phẩm, bao bì, thiệp, tồn kho và đơn hàng. |
| Khách hàng có tài khoản (Customer) | Quản lý thông tin và lịch sử mua hàng nếu nhóm triển khai chức năng đăng nhập. Cần xác minh với giảng viên. |
| Khách hàng doanh nghiệp | Nhóm người dùng dự kiến phục vụ ở giai đoạn phát triển sau. |

## 4. Yêu cầu chức năng

Mức độ ưu tiên:

- **P0 – Bắt buộc:** Chức năng cốt lõi cần hoàn thành.
- **P1 – Ưu tiên bổ sung:** Thực hiện nếu đủ thời gian hoặc được nhóm thống nhất.
- **P2 – Phát triển sau:** Không thuộc cam kết MVP.

| Mã | Chức năng | Người dùng | Mức độ | Tiêu chí nghiệm thu |
|---|---|---|---|---|
| F01 | Xem danh mục sản phẩm | Guest | P0 | Hiển thị tên, giá, ảnh và danh mục sản phẩm. |
| F02 | Xem chi tiết sản phẩm | Guest | P0 | Hiển thị ảnh, giá, mô tả, xuất xứ, hạn sử dụng đối với thực phẩm và tình trạng còn hàng. |
| F03 | Tìm kiếm và lọc | Guest | P0 | Tìm theo tên, lọc theo danh mục và hiển thị kết quả phù hợp. |
| F04 | Lựa chọn bao bì | Guest | P0 | Khách chọn được kiểu hộp; giá bao bì được cộng vào tổng tiền. |
| F05 | Tùy chỉnh sản phẩm | Guest | P0 | Thêm, xóa và điều chỉnh số lượng sản phẩm; kiểm tra giới hạn tồn kho. |
| F06 | Quản lý ngân sách | Guest | P0 | Nhập ngân sách hợp lệ; tổng tiền và số dư cập nhật khi thay đổi lựa chọn. |
| F07 | Cảnh báo vượt ngân sách | Guest | P0 | Hiển thị mức vượt ngân sách khi tổng tiền lớn hơn hạn mức đã nhập. |
| F08 | Cá nhân hóa thiệp | Guest | P0 | Chọn mẫu thiệp, nhập và lưu lời chúc hợp lệ. |
| F09 | Xem trước hộp quà 2D | Guest | P0, bản đơn giản | Hiển thị hình hộp cùng ảnh minh họa các sản phẩm đã chọn. |
| F10 | Giỏ hàng | Guest | P0 | Xem, chỉnh sửa và xác nhận hộp quà trước khi đặt. |
| F11 | Đặt hàng | Guest | P0 | Kiểm tra thông tin giao nhận, giá và tồn kho; lưu đơn thành công và tạo mã đơn. |
| F12 | Theo dõi đơn hàng | Guest | P0 | Khách tra cứu được trạng thái bằng mã đơn và thông tin xác minh. |
| F13 | Đăng nhập quản trị | Admin | P0 | Chỉ tài khoản được cấp quyền mới truy cập trang quản trị và API quản trị. |
| F14 | Quản lý sản phẩm | Admin | P0 | Thêm, sửa, ẩn sản phẩm; cập nhật danh mục, bao bì, thiệp, giá và tồn kho. |
| F15 | Quản lý đơn hàng | Admin | P0 | Xem chi tiết đơn và cập nhật trạng thái xử lý hợp lệ. |
| F16 | Gợi ý sản phẩm theo ngân sách | Guest | P1 | Hiển thị sản phẩm còn hàng, có giá không vượt ngân sách còn lại. |
| F17 | Tài khoản khách hàng | Customer | Cần xác minh | Đăng ký, đăng nhập và xem đơn hàng của chính mình nếu được triển khai. |
| F18 | Báo cáo doanh thu | Admin | P2 | Thống kê doanh thu, số lượng đơn và các sản phẩm phổ biến. |
| F19 | Hộp quà mẫu theo đối tượng | Guest | P1 | Chọn hộp quà gợi ý và tiếp tục điều chỉnh thành phần trong trình phối. |

### Quy tắc nghiệp vụ cần thống nhất

**Tính ngân sách:**

Tổng giá trị hộp quà = Giá bao bì + Tổng (Đơn giá sản phẩm × Số lượng) + Phí thiệp/phụ kiện (nếu có).

Ngân sách còn lại = Ngân sách khách hàng nhập − Tổng giá trị hộp quà.

Phí vận chuyển được đề xuất hiển thị riêng.

**Xử lý vượt ngân sách:** Đề xuất cảnh báo và không cho xác nhận đơn nếu vượt mức ngân sách. Nhóm cần thống nhất quy tắc cuối cùng trước khi lập trình.

**Sức chứa hộp quà:** Đề xuất quy định giới hạn sức chứa theo loại bao bì, không cho thêm sản phẩm nếu vượt giới hạn.

**Tồn kho:** Hệ thống hiển thị tình trạng sản phẩm khi lựa chọn. Backend kiểm tra tồn kho trước khi lưu đơn và xử lý hoàn kho khi hủy theo quy tắc được nhóm duyệt.

**Thanh toán:** Ưu tiên COD. Có thể bổ sung chuyển khoản QR tĩnh với xác nhận thủ công; không tự động đối soát giao dịch.

## 5. Yêu cầu phi chức năng

| Mã | Nhóm yêu cầu | Nội dung |
|---|---|---|
| NF01 | Giao diện | Responsive, hiển thị phù hợp trên máy tính và điện thoại. |
| NF02 | Hiệu năng | Tính ngân sách phản hồi ngay khi thao tác; đặt mục tiêu tải trang nhanh trên môi trường thử nghiệm. |
| NF03 | Kiểm tra dữ liệu | Kiểm tra ngân sách, số lượng, giá, thông tin giao nhận và các dữ liệu nhập. |
| NF04 | Tính chính xác | Backend tính lại tổng tiền và kiểm tra tồn kho trước khi tạo đơn. |
| NF05 | Bảo mật | Mật khẩu quản trị được băm; API quản trị được phân quyền; không công khai dữ liệu nhạy cảm. |
| NF06 | Dễ sử dụng | Các bước phối quà và đặt hàng rõ ràng, dễ thao tác. |
| NF07 | Tính ổn định | Có thông báo phù hợp khi hết hàng, mất kết nối hoặc đặt hàng thất bại. |
| NF08 | Khả năng bảo trì | Mã nguồn có cấu trúc rõ ràng và được quản lý bằng GitHub. |

## 6. Giới hạn và giả định

- Thời gian triển khai dự kiến: 37 ngày.
- Nhân sự: 6 thành viên.
- Phạm vi MVP: Một cửa hàng, sử dụng dữ liệu sản phẩm và đơn hàng mẫu phục vụ phát triển, kiểm thử.
- Số lượng dữ liệu đề xuất: 20–40 sản phẩm, một số loại bao bì và mẫu thiệp.
- Công nghệ triển khai chưa được xác nhận chính thức.
- Những vấn đề cần nhóm chốt gồm: đăng nhập khách hàng, quy tắc vượt ngân sách, phương thức thanh toán, số hộp quà trong một đơn, giới hạn sức chứa và phạm vi gợi ý sản phẩm.
