// BƯỚC 5 - Logic giỏ hàng dùng chung của website Sắp Tết (Yến Vy).
// Tuân theo docs/data-contract.md:
//   - Một dòng giỏ hàng: { id, quantity } (id tham chiếu products, quantity là số nguyên >= 1).
//   - Giá và tên LẤY TỪ mảng `products` (data/products.js), KHÔNG lưu giá/tổng tiền trong giỏ.
//   - Khóa localStorage dùng chung: "sapTetCart".
//   - saveCart(cart) / loadCart() do Phương Vy viết trong js/cart-storage.js; file này dùng lại nếu có.
// File này KHÔNG khai báo danh sách sản phẩm nào khác.
// Thứ tự nạp: data/products.js -> (js/cart-storage.js nếu có) -> js/cart.js -> js/cart-page.js
"use strict";

(function () {
  const CART_KEY = "sapTetCart";   // phải trùng khóa trong data-contract
  const MAX_QUANTITY = 99;         // giới hạn số lượng mỗi dòng
  const CART_CHANGED_EVENT = "sapTetCartChanged";

  // ---------- 1. Đọc / ghi giỏ (ưu tiên hàm của Phương Vy) ----------

  // Chuẩn hóa dữ liệu đọc ra: bỏ dòng hỏng, ép quantity về số nguyên 1..MAX.
  function sanitizeCart(raw) {
    if (!Array.isArray(raw)) return [];
    const merged = new Map();
    raw.forEach((line) => {
      if (!line || typeof line.id !== "string") return;
      const quantity = Math.floor(Number(line.quantity));
      if (!Number.isFinite(quantity) || quantity < 1) return;
      const current = merged.get(line.id) || 0;
      merged.set(line.id, Math.min(current + quantity, MAX_QUANTITY));
    });
    return Array.from(merged, ([id, quantity]) => ({ id, quantity }));
  }

  function readCart() {
    // Dùng loadCart() của cart-storage.js nếu đã được nạp (một giỏ duy nhất).
    if (typeof window.loadCart === "function") {
      return sanitizeCart(window.loadCart());
    }
    // Dự phòng khi chưa có cart-storage.js: cùng khóa, cùng cấu trúc.
    try {
      return sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY)));
    } catch (error) {
      console.warn("Không đọc được giỏ hàng, dùng giỏ trống:", error);
      return [];
    }
  }

  function writeCart(cart) {
    if (typeof window.saveCart === "function") {
      window.saveCart(cart);
    } else {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Không lưu được giỏ hàng:", error);
      }
    }
    notifyCartChanged();
  }

  // ---------- 2. Tra cứu sản phẩm (chỉ từ mảng products dùng chung) ----------

  function findProduct(productId) {
    if (typeof products === "undefined" || !Array.isArray(products)) return undefined;
    return products.find((product) => product.id === productId);
  }

  // ---------- 3. Thao tác giỏ hàng ----------

  // Thêm sản phẩm. Đã có trong giỏ thì tăng số lượng, không tạo dòng trùng.
  function addToCart(productId) {
    if (!findProduct(productId)) {
      console.warn(`addToCart: không có sản phẩm "${productId}" trong data/products.js`);
      return false;
    }
    const cart = readCart();
    const line = cart.find((item) => item.id === productId);
    if (line) {
      line.quantity = Math.min(line.quantity + 1, MAX_QUANTITY);
    } else {
      cart.push({ id: productId, quantity: 1 });
    }
    writeCart(cart);
    return true;
  }

  function increaseQuantity(productId) {
    const cart = readCart();
    const line = cart.find((item) => item.id === productId);
    if (!line) return false;
    line.quantity = Math.min(line.quantity + 1, MAX_QUANTITY);
    writeCart(cart);
    return true;
  }

  // Giảm 1 đơn vị, tối thiểu là 1 (muốn bỏ hẳn thì dùng removeFromCart).
  function decreaseQuantity(productId) {
    const cart = readCart();
    const line = cart.find((item) => item.id === productId);
    if (!line || line.quantity <= 1) return false;
    line.quantity -= 1;
    writeCart(cart);
    return true;
  }

  function removeFromCart(productId) {
    const cart = readCart();
    const next = cart.filter((item) => item.id !== productId);
    if (next.length === cart.length) return false;
    writeCart(next);
    return true;
  }

  // ---------- 4. Tính toán (luôn tính lại từ products + quantity) ----------

  // Trả về [{ product, quantity, lineTotal }]; bỏ qua dòng có id không còn trong products.
  function getCartItems() {
    return readCart()
      .map((line) => {
        const product = findProduct(line.id);
        if (!product) return null;
        return {
          product,
          quantity: line.quantity,
          lineTotal: product.price * line.quantity
        };
      })
      .filter(Boolean);
  }

  function getCartCount() {
    return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartTotal() {
    return getCartItems().reduce((sum, item) => sum + item.lineTotal, 0);
  }

  // ---------- 5. Đồng bộ biểu tượng giỏ hàng trên thanh điều hướng ----------

  function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll("[data-cart-count]").forEach((badge) => {
      badge.textContent = count;
      badge.hidden = count === 0;
    });
    document.querySelectorAll("[data-cart-link]").forEach((link) => {
      link.setAttribute("aria-label", count > 0 ? `Giỏ hàng, ${count} sản phẩm` : "Giỏ hàng");
    });
  }

  // Phát sự kiện để cart-page.js vẽ lại và cập nhật biểu tượng.
  function notifyCartChanged() {
    updateCartBadge();
    document.dispatchEvent(new CustomEvent(CART_CHANGED_EVENT));
  }

  // ---------- 6. Công khai các hàm cho các trang khác dùng ----------
  // (cart-page.js, detail.js... gọi trực tiếp theo tên)
  Object.assign(window, {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getCartItems,
    getCartCount,
    getCartTotal,
    updateCartBadge
  });

  // Cập nhật số trên biểu tượng khi mở trang và khi giỏ đổi ở tab khác.
  document.addEventListener("DOMContentLoaded", updateCartBadge);
  window.addEventListener("storage", (event) => {
    if (event.key === null || event.key === CART_KEY) updateCartBadge();
  });
})();