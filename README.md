# [Sắp Tết](https://nguyenthikhanhlinh31241025892.github.io/SapTet/) – Website hộp quà Tết

## 1. Giới thiệu

**Sắp Tết** là website giao diện được xây dựng cho bài tập nhóm bằng **HTML5 và CSS3**. Website giới thiệu các hộp quà Tết mẫu, cung cấp danh sách **8 sản phẩm đơn lẻ** và cho phép người dùng thử chọn mẫu hộp cùng sản phẩm bên trong ở trang **Customize**. Các thao tác tự phối chỉ được mô phỏng bằng CSS, chưa phải chức năng đặt hàng thực tế.

## 2. Cấu trúc thư mục

```text
SapTet/
├── index.html                 # Trang chủ
├── products.html              # Danh sách 8 sản phẩm đơn lẻ
├── product-detail.html        # Thông tin chi tiết 8 sản phẩm
├── about.html                 # Giới thiệu Sắp Tết
├── customize.html             # Mô phỏng tự phối hộp quà
├── css/
│   ├── style.css              # CSS chu
ng
│   ├── home.css
│   ├── products.css
│   ├── detail.css
│   ├── about.css
│   └── customize.css
├── images/                    # Hình ảnh website
├── docs/                      # Tài liệu dự án
└── README.md
```

## 3. Các trang của website

| Trang | Nội dung |
|---|---|
| `index.html` | Trang chủ, giới thiệu thương hiệu và các hộp quà Tết mẫu. |
| `products.html` | Danh sách **8 sản phẩm đơn lẻ** dùng để tự phối hộp quà. |
| `product-detail.html` | Hình ảnh, giá và thông tin chi tiết của 8 sản phẩm. |
| `about.html` | Câu chuyện và thông tin giới thiệu Sắp Tết. |
| `customize.html` | Mô phỏng chọn mẫu hộp, chọn sản phẩm và xem popup chi tiết bằng CSS. |

## 4. Công nghệ sử dụng

- **HTML5:** cấu trúc trang, nội dung và liên kết điều hướng.
- **CSS3:** màu sắc, font chữ, Grid, Flexbox, media query, hover/focus.
- **Tương tác CSS:** sử dụng `:checked`, `:target`, `:has()` và CSS counter để mô phỏng chọn sản phẩm, đổi mẫu hộp, hiển thị popup và tổng giá trị.

Phiên bản hiện tại **không sử dụng JavaScript, CSS framework, backend hoặc cơ sở dữ liệu**.

## 5. Cách mở website bằng Live Server

1. Clone hoặc tải repository về máy, mở thư mục **SapTet** trong **Visual Studio Code**.
2. Cài tiện ích **Live Server** trong Extensions nếu chưa có.
3. Nhấp chuột phải vào `index.html`, chọn **Open with Live Server**.
4. Sử dụng menu website để xem các trang còn lại.

Không cần chạy `npm install` hoặc thiết lập máy chủ backend.

## 6. Kiểm tra responsive

1. Mở website trên **Google Chrome**.
2. Mở **Developer Tools** bằng F12 (Windows) hoặc `Cmd + Option + I` (Mac).
3. Bật **Toggle device toolbar**.
4. Lần lượt nhập chiều rộng **1366px**, **768px** và **390px**.
5. Kiểm tra menu, hình ảnh, lưới sản phẩm, chữ, footer và popup Customize; ghi nhận lỗi nếu có.

Các kích thước trên là mốc kiểm thử, không phải kết luận website đã vượt qua kiểm thử.

## 7. Hạn chế hiện tại

- Đây là **website giao diện minh họa**, chưa có backend, database hoặc lưu dữ liệu lựa chọn lâu dài.
- Chưa triển khai **đăng nhập, tìm kiếm và sắp xếp thực tế**.
- Chưa có **giỏ hàng, tạo đơn hàng hoặc thanh toán thực tế**.
- Trang Customize chỉ mô phỏng chọn hộp và sản phẩm bằng CSS. Bộ đếm và tổng giá trị hiển thị là minh họa, không phải hệ thống tính tiền hoặc kiểm soát ngân sách hoàn chỉnh.
- Thông tin sản phẩm và giá phục vụ bài tập, cần xác minh nếu kinh doanh thực tế.
