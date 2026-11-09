// BƯỚC 5 - Lưu / khôi phục giỏ hàng bằng localStorage (js/cart-storage.js).
// Tuân theo docs/data-contract.md:
//   - Khóa localStorage duy nhất cho cả website: "sapTetCart".
//   - Giỏ hàng là MẢNG các dòng. Dòng combo: { id, quantity }.
//     Dòng hộp tự phối: { id, type: "custom", quantity, boxId, items: [{ id, quantity }] }.
//   - KHÔNG lưu giá, tên, tổng tiền: tất cả được tính lại từ mảng `products` (xem cart.js).
// File này CHỈ đọc/ghi localStorage. Mọi logic thêm/xóa/tăng/giảm nằm trong js/cart.js
// và gọi lại loadCart()/saveCart() ở đây, nên chỉ có MỘT giỏ hàng duy nhất.
// Thứ tự nạp: data/products.js -> js/cart-storage.js -> js/cart.js -> js/cart-page.js
"use strict";

(function () {
  const CART_KEY = "sapTetCart";

  // Bản sao trong bộ nhớ, CHỈ dùng khi trình duyệt chặn localStorage
  // (chế độ riêng tư, bị tắt lưu trữ...) để giỏ vẫn chạy trong lúc đang mở trang.
  let memoryCart = [];

  // Một dòng hợp lệ tối thiểu phải là object có id dạng chuỗi.
  // Việc kiểm tra quantity, type, items... do sanitizeCart() trong cart.js đảm nhiệm,
  // nên ở đây giữ nguyên mọi trường để không làm mất dữ liệu của hộp tự phối.
  function isValidLine(line) {
    return line !== null && typeof line === "object" &&
      typeof line.id === "string" && line.id !== "";
  }

  // Đọc giỏ hàng. Luôn trả về một MẢNG (chưa có dữ liệu, JSON hỏng... đều trả về []).
  function loadCart() {
    let raw;
    try {
      raw = localStorage.getItem(CART_KEY);
    } catch (error) {
      console.warn("Không truy cập được localStorage, dùng giỏ tạm trong bộ nhớ:", error);
      return JSON.parse(JSON.stringify(memoryCart));
    }

    // Lần đầu truy cập: chưa có khóa -> giỏ trống.
    if (raw === null || raw === "") return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        console.warn("Dữ liệu giỏ hàng không phải mảng, dùng giỏ trống.");
        return [];
      }
      return parsed.filter(isValidLine);
    } catch (error) {
      console.warn("Dữ liệu giỏ hàng bị hỏng (JSON lỗi), dùng giỏ trống:", error);
      return [];
    }
  }

  // Ghi giỏ hàng. Trả về true nếu lưu được vào localStorage, false nếu không.
  function saveCart(cart) {
    if (!Array.isArray(cart)) {
      console.warn("saveCart: giỏ hàng phải là một mảng.");
      return false;
    }
    let json;
    try {
      json = JSON.stringify(cart);
      memoryCart = JSON.parse(json); // bản sao dự phòng
    } catch (error) {
      console.error("saveCart: không chuyển được giỏ hàng sang JSON:", error);
      return false;
    }
    try {
      localStorage.setItem(CART_KEY, json);
      return true;
    } catch (error) {
      // Đầy dung lượng hoặc bị chặn lưu trữ.
      console.error("Không lưu được giỏ hàng vào localStorage:", error);
      return false;
    }
  }

  Object.assign(window, {
    loadCart,
    saveCart,
    SAP_TET_CART_KEY: CART_KEY // để cart.js dùng chung đúng một khóa
  });
})();