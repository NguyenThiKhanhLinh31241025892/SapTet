# Project Instructions for AI – Sắp Tết

## 1. Project context

Sắp Tết là dự án website thương mại điện tử do nhóm 6 sinh viên thực hiện trong thời gian dự kiến 37 ngày.

Website hỗ trợ khách hàng tự phối hộp quà Tết thông qua lựa chọn bao bì, sản phẩm, thiệp chúc và ngân sách, đồng thời hỗ trợ đặt hàng và quản trị đơn hàng.

Mục tiêu ưu tiên là hoàn thiện quy trình mua hàng cốt lõi, bảo đảm mã nguồn dễ đọc, có thể kiểm thử và phù hợp năng lực triển khai của nhóm.

## 2. Scope

AI chỉ được hỗ trợ phân tích, đề xuất hoặc lập trình những chức năng đã được nhóm thống nhất trong `REQUIREMENTS.md`.

**Các chức năng ưu tiên:**

- Xem, tìm kiếm và lọc sản phẩm.
- Tự phối hộp quà Tết.
- Theo dõi và tính toán ngân sách.
- Cá nhân hóa thiệp chúc.
- Xem trước hộp quà 2D đơn giản.
- Giỏ hàng và đặt hàng.
- Quản lý sản phẩm, tồn kho và đơn hàng.

**Các chức năng chưa được phép tự ý bổ sung:**

- Chatbot AI hoặc thuật toán gợi ý nâng cao.
- Thiết kế hộp quà 3D phức tạp.
- Thanh toán tự động hoặc đối soát ngân hàng.
- Quản lý đa kho.
- Hệ thống đặt quà doanh nghiệp phức tạp.

Các yêu cầu chưa được xác nhận phải được hỏi lại trước khi triển khai. AI không được tự ý mở rộng phạm vi dự án.

## 3. Coding principles

- Viết mã nguồn rõ ràng, dễ đọc, dễ bảo trì.
- Sử dụng tên biến, hàm và cấu trúc file nhất quán.
- Không tự ý thay đổi kiến trúc hoặc công nghệ khi chưa được nhóm đồng ý.
- Không tự ý xóa hoặc sửa các chức năng đang hoạt động nếu không liên quan đến yêu cầu.
- Ưu tiên những thay đổi nhỏ, có thể kiểm tra và hoàn tác.
- Kiểm tra dữ liệu đầu vào và xử lý lỗi phù hợp.
- Logic tính giá, đơn hàng, tồn kho và quyền truy cập phải được kiểm tra tại backend.
- Không khẳng định chức năng đã chạy thành công nếu chưa được kiểm thử thực tế.

## 4. Workflow

### Trước khi chỉnh sửa mã nguồn

1. Đọc các tài liệu liên quan, đặc biệt là `README.md`, `REQUIREMENTS.md` và `PROJECT_PLAN.md`.
2. Phân tích cấu trúc, chức năng và trạng thái hiện tại của dự án.
3. Xác định mục tiêu, các file cần sửa và rủi ro có thể phát sinh.
4. Đề xuất phương án thực hiện và chờ nhóm xác nhận đối với thay đổi phạm vi hoặc nghiệp vụ.

### Sau khi chỉnh sửa mã nguồn

1. Giải thích nội dung đã thay đổi.
2. Liệt kê các file được tạo mới hoặc chỉnh sửa.
3. Hướng dẫn cách chạy và kiểm thử chức năng.
4. Báo cáo lỗi, giới hạn và những phần chưa hoàn thành.
5. Đề xuất nội dung commit hoặc Pull Request phù hợp với GitHub Issue.

### Quy trình sử dụng AI

- AI thứ nhất hỗ trợ phân tích yêu cầu.
- AI thứ hai phản biện độc lập.
- Nhóm kiểm tra, thảo luận và thống nhất phương án.
- Chỉ cập nhật `REQUIREMENTS.md` sau khi nhóm đồng ý.
- Ghi lại việc sử dụng AI trong `AI_USAGE_LOG.md`.

## 5. Security

- Không đưa mật khẩu, API key, token và thông tin đăng nhập vào mã nguồn.
- Không công khai dữ liệu khách hàng hoặc người nhận quà khi chưa được phép.
- Sử dụng dữ liệu giả trong môi trường demo nếu có thể.
- Không vô hiệu hóa xác thực, phân quyền hoặc kiểm tra dữ liệu để bỏ qua lỗi.
- Sử dụng `.gitignore` để tránh đưa file cấu hình bí mật lên repository.
- Kiểm tra an toàn nội dung người dùng nhập, đặc biệt là lời chúc Tết.
- Không sử dụng thông tin thanh toán hoặc tài khoản ngân hàng thật của cá nhân khi chưa có sự đồng ý.

## 6. Communication

- Nếu yêu cầu chưa rõ ràng, AI phải hỏi lại trước khi thực hiện.
- Phân biệt thông tin đã được nhóm xác nhận với nội dung AI tự đề xuất.
- Giải thích phương án bằng ngôn ngữ dễ hiểu, phù hợp với sinh viên.
- Chủ động thông báo khi chức năng vượt quá năng lực, thời gian hoặc phạm vi dự án.
- Không tự ý quyết định thay nhóm về yêu cầu chức năng, công nghệ và kiến trúc hệ thống.

Mọi thay đổi quan trọng cần được nhóm xem xét trước khi áp dụng vào phiên bản chính thức.
