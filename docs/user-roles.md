# V. Nhiệm vụ 5 – Xác định vai trò người dùng và chức năng

## 5.1. Bảng vai trò người dùng

| Vai trò | Nhiệm vụ chính | Quyền hạn dự kiến |
|---|---|---|
| **Khách chưa đăng nhập (Guest)** | Xem, tìm kiếm và lọc sản phẩm; chọn hộp quà mẫu; tự phối hộp quà (bao bì, sản phẩm, thiệp); nhập ngân sách và xem trước hộp quà; đặt hàng không cần tài khoản; tra cứu đơn hàng. | Xem thông tin công khai; đặt hàng; chỉ tra cứu đơn của mình bằng mã đơn và số điện thoại xác minh. |
| **Khách hàng (Customer)** | Đăng ký, đăng nhập, xem lịch sử mua hàng, lưu mẫu quà. | Quản lý thông tin và đơn hàng của chính mình. MVP chưa triển khai nếu giảng viên không yêu cầu. |
| **Quản trị viên (Admin)** | Quản lý sản phẩm, bao bì, mẫu thiệp, hộp quà mẫu, tồn kho; xử lý và cập nhật trạng thái đơn hàng. | Đăng nhập trang quản trị; thực hiện nghiệp vụ quản trị; quyền được kiểm tra tại backend. |
| **Khách hàng doanh nghiệp** | Đặt quà số lượng lớn, yêu cầu báo giá. | Ngoài phạm vi MVP; MVP chỉ có thông tin liên hệ báo giá đơn giản. |

## 5.2. Danh sách chức năng

| Mã | Chức năng | Người sử dụng | Mức độ ưu tiên |
|---|---|---|---|
| F01 | Xem danh mục và danh sách sản phẩm (bánh kẹo, trà, cà phê, hạt dinh dưỡng, đặc sản Tết). | Khách | Bắt buộc |
| F02 | Xem chi tiết sản phẩm (hình ảnh, giá, mô tả, xuất xứ, hạn sử dụng, tình trạng còn hàng). | Khách | Bắt buộc |
| F03 | Tìm kiếm theo tên không phân biệt hoa/thường và lọc theo danh mục. | Khách | Bắt buộc |
| F04 | Chọn hộp quà mẫu theo đối tượng và ngân sách (3–6 mẫu), nạp vào trình phối để tiếp tục chỉnh sửa. | Khách | Bắt buộc |
| F05 | Lựa chọn bao bì (kiểu hộp, giá, sức chứa). | Khách | Bắt buộc |
| F06 | Tùy chỉnh sản phẩm trong hộp: thêm, xóa, đổi số lượng; kiểm tra sức chứa và tình trạng còn hàng. | Khách | Bắt buộc |
| F07 | Nhập ngân sách; tự động cập nhật tổng tiền và số dư theo thời gian thực. | Khách | Bắt buộc |
| F08 | Cảnh báo vượt ngân sách; không cho xác nhận hộp quà khi vượt, cho phép đổi hạn mức. | Khách | Bắt buộc |
| F09 | Gợi ý sản phẩm theo số dư, chỉ hiển thị sản phẩm còn hàng và có giá không vượt số dư. | Khách | Bắt buộc |
| F10 | Cá nhân hóa thiệp: chọn 3–5 mẫu, nhập lời chúc tối đa khoảng 200 ký tự, thêm tên người nhận. | Khách | Bắt buộc |
| F11 | Xem trước hộp quà 2D bằng hình hộp và lưới ảnh sản phẩm, không kéo thả; hiển thị màn hình tóm tắt hộp quà. | Khách | Bắt buộc |
| F12 | Quản lý giỏ hàng: xem, đổi số lượng hộp, xóa hộp. | Khách / Khách hàng | Bắt buộc |
| F13 | Đặt hàng với thông tin người đặt, người nhận, địa chỉ, ngày nhận mong muốn; thanh toán COD, có thể thêm QR tĩnh và admin xác nhận thủ công. | Khách / Khách hàng | Bắt buộc |
| F14 | Theo dõi đơn hàng bằng mã đơn khó đoán kết hợp số điện thoại. | Khách / Khách hàng | Bắt buộc |
| F15 | Đăng nhập quản trị và phân quyền. | Quản trị viên | Bắt buộc |
| F16 | Quản lý sản phẩm, danh mục, bao bì, mẫu thiệp và hộp quà mẫu: thêm, sửa, ẩn, quản lý giá và tồn kho. | Quản trị viên | Bắt buộc |
| F17 | Quản lý đơn hàng: xem thông tin khách và thành phần hộp, cập nhật trạng thái, hủy đơn theo quy định, hoàn kho khi hủy. | Quản trị viên | Bắt buộc |
| F18 | Đăng ký, đăng nhập và xem lịch sử mua hàng. | Khách hàng | Bắt buộc |
| F19 | Lưu mẫu quà cá nhân để chỉnh sửa hoặc đặt lại. | Khách hàng | Phát triển sau |
| F20 | Báo cáo doanh thu, sản phẩm và mẫu hộp được chọn nhiều. | Quản trị viên | Phát triển sau |
| F21 | Đặt quà doanh nghiệp: số lượng lớn, báo giá, chiết khấu. | Khách hàng doanh nghiệp | Phát triển sau |
| F22 | Tích hợp thanh toán trực tuyến, tự động đối soát; gợi ý quà bằng AI; mô phỏng 3D. | Tùy chức năng | Nâng cao (ngoài MVP) |


