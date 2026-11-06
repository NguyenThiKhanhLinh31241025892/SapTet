# Bảng Quy ước cấu trúc dữ liệu và tích hợp JavaScript của nhóm Sắp Tết

| Nội dung | Quy ước thống nhất | Giải thích |
| :--- | :--- | :--- |
| Nguồn dữ liệu | `data/products.js` | Chỉ có một nguồn dữ liệu sản phẩm cho cả website. |
| Tên mảng | `products` | Dùng chung cho danh sách combo, chi tiết, Customize và giỏ hàng. |
| `id` | `string`, không trùng | Combo: `combo-001`, `combo-002` ...; món lẻ: `item-001`, `item-002` ... |
| `name` | `string` | Tên sản phẩm hoặc tên hộp quà. |
| `price` | `number`, số nguyên VND | Ví dụ giá 599.000đ lưu bằng số `599000`, không chứa dấu chấm hoặc ký hiệu đồng. |
| `category` | `string` | Danh mục nhất quán; dùng để lọc sản phẩm. |
| `image` | `string` | Đường dẫn từ thư mục gốc, dạng `images/ten-anh.png`. |
| `description` | `string` | Mô tả theo nội dung đã có hoặc được nhóm xác nhận. |
| `isCombo` | `boolean` | `true`: combo phối sẵn; `false`: món lẻ để tự phối. |
| Danh sách combo | `products.html` | Chỉ lấy các sản phẩm `isCombo === true`. |
| Danh sách món lẻ | `customize.html` | Chỉ lấy các sản phẩm `isCombo === false`. |
| Chi tiết combo | `product-detail.html?id=combo-001` | ID được đọc từ URL; không dùng anchor `#sp-01` của trang cũ. |
| Một dòng giỏ hàng | `{ id, quantity }` | `id` tham chiếu sản phẩm; `quantity` là số nguyên từ 1 trở lên. |
| Dữ liệu lưu | `sapTetCart` | Một khóa localStorage dùng chung, chứa danh sách các dòng giỏ hàng. |
| Giá giỏ hàng | Lấy từ `products` | Tổng tiền được tính lại từ giá sản phẩm và số lượng, không lưu một tổng tiền cố định. |
| Hàm thêm vào giỏ | `addToCart(productId)` | Yến Vy triển khai; Quý gọi hàm khi người dùng bấm nút. |
| Hàm lưu/đọc giỏ | `saveCart(cart)`, `loadCart()` | Phương Vy triển khai, Yến Vy sử dụng lại. |
| Chia sẻ JS | Các file script thông thường, không dùng framework | Nạp file dữ liệu trước file xử lý trang; giữ cùng một quy ước giữa các trang. |
| CSS dùng chung | `css/style.css` | Thành viên không tự ý sửa; mọi thay đổi chung cần Linh kiểm tra. |
