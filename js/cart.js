// BƯỚC 5 - Logic giỏ hàng dùng chung (Yến Vy: feature/cart-functions).
// Quy ước theo docs/data-contract.md:
//   - Một dòng giỏ hàng: { id, quantity }  (quantity là số nguyên >= 1)
//   - Khóa localStorage duy nhất: "sapTetCart"
//   - Giá luôn lấy từ mảng `products` (data/products.js), KHÔNG lưu giá/tổng tiền trong giỏ
//   - addToCart(productId): Quý gọi khi bấm "Thêm vào giỏ hàng"
//   - saveCart(cart) / loadCart(): Phương Vy viết trong js/cart-storage.js; file này chỉ GỌI lại.
//     Nếu cart-storage.js chưa được merge, file này tự dùng cùng khóa/cùng định dạng để vẫn chạy.
// File này KHÔNG khai báo danh sách sản phẩm. Chỉ đọc mảng `products` có sẵn.
// Thứ tự nạp: data/products.js -> (js/cart-storage.js) -> js/cart.js -> js/cart-page.js
//
// Toàn bộ code nằm trong IIFE để không trùng tên biến toàn cục với cart-storage.js / cart-page.js.
"use strict";

(function () {
  var CART_KEY = "sapTetCart";
  var CART_EVENT = "sapTetCartChanged";
  var MAX_QUANTITY = 99;

  // ---------- Đọc / ghi giỏ (ưu tiên hàm của Phương Vy) ----------

  function readStoredCart() {
    var raw;
    if (typeof window.loadCart === "function") {
      raw = window.loadCart();
    } else {
      try {
        raw = JSON.parse(localStorage.getItem(CART_KEY));
      } catch (error) {
        raw = [];
      }
    }
    return Array.isArray(raw) ? raw : [];
  }

  function writeStoredCart(cart) {
    if (typeof window.saveCart === "function") {
      window.saveCart(cart);
      return;
    }
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Không thể lưu giỏ hàng vào localStorage:", error);
    }
  }

  // ---------- Dữ liệu sản phẩm ----------

  function findProduct(productId) {
    if (typeof products === "undefined" || !Array.isArray(products)) return undefined;
    return products.find(function (product) {
      return product.id === productId;
    });
  }

  // Giỏ sạch: bỏ dòng sai cấu trúc, id không còn trong products, số lượng không hợp lệ; gộp dòng trùng id.
  function getCart() {
    var merged = [];
    readStoredCart().forEach(function (line) {
      if (!line || typeof line.id !== "string" || !findProduct(line.id)) return;
      var quantity = Math.floor(Number(line.quantity));
      if (!Number.isFinite(quantity) || quantity < 1) return;

      var existing = merged.find(function (item) {
        return item.id === line.id;
      });
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
      } else {
        merged.push({ id: line.id, quantity: Math.min(quantity, MAX_QUANTITY) });
      }
    });
    return merged;
  }

  // ---------- Thông báo cho giao diện ----------

  function updateCartBadges() {
    var count = window.getCartCount();
    document.querySelectorAll("[data-cart-count]").forEach(function (badge) {
      badge.textContent = count;
      badge.hidden = count === 0;
    });
  }

  function commit(cart) {
    writeStoredCart(cart);
    updateCartBadges();
    document.dispatchEvent(new CustomEvent(CART_EVENT, { detail: { cart: cart } }));
  }

  // ---------- Thao tác giỏ hàng ----------

  // Thêm 1 sản phẩm. Đã có trong giỏ -> tăng số lượng, không tạo dòng trùng.
  window.addToCart = function (productId) {
    if (!findProduct(productId)) {
      console.warn("addToCart: không tìm thấy sản phẩm có id =", productId);
      return false;
    }
    var cart = getCart();
    var line = cart.find(function (item) {
      return item.id === productId;
    });
    if (line) {
      line.quantity = Math.min(line.quantity + 1, MAX_QUANTITY);
    } else {
      cart.push({ id: productId, quantity: 1 });
    }
    commit(cart);
    return true;
  };

  window.increaseQuantity = function (productId) {
    var cart = getCart();
    var line = cart.find(function (item) {
      return item.id === productId;
    });
    if (!line || line.quantity >= MAX_QUANTITY) return;
    line.quantity += 1;
    commit(cart);
  };

  // Giảm nhưng không xuống dưới 1; muốn bỏ sản phẩm thì dùng removeFromCart.
  window.decreaseQuantity = function (productId) {
    var cart = getCart();
    var line = cart.find(function (item) {
      return item.id === productId;
    });
    if (!line || line.quantity <= 1) return;
    line.quantity -= 1;
    commit(cart);
  };

  window.removeFromCart = function (productId) {
    var cart = getCart();
    var next = cart.filter(function (item) {
      return item.id !== productId;
    });
    if (next.length === cart.length) return;
    commit(next);
  };

  // ---------- Truy vấn (cart-page.js dùng để vẽ giao diện) ----------

  // [{ product, quantity, lineTotal }] - thành tiền = đơn giá (từ products) x số lượng
  window.getCartItems = function () {
    return getCart().map(function (line) {
      var product = findProduct(line.id);
      return {
        product: product,
        quantity: line.quantity,
        lineTotal: product.price * line.quantity
      };
    });
  };

  // Tổng số lượng (cộng quantity của mọi dòng, không phải số dòng)
  window.getCartCount = function () {
    return getCart().reduce(function (sum, line) {
      return sum + line.quantity;
    }, 0);
  };

  // Tổng tiền luôn được tính lại từ giá trong products
  window.getCartTotal = function () {
    return window.getCartItems().reduce(function (sum, item) {
      return sum + item.lineTotal;
    }, 0);
  };

  // ---------- Đồng bộ biểu tượng giỏ hàng ----------

  document.addEventListener("DOMContentLoaded", updateCartBadges);
  // Tab khác thay đổi giỏ -> cập nhật số lượng trên thanh điều hướng
  window.addEventListener("storage", function (event) {
    if (event.key === null || event.key === CART_KEY) updateCartBadges();
  });
  // Quay lại trang bằng nút Back (bfcache) vẫn hiển thị số lượng đúng
  window.addEventListener("pageshow", updateCartBadges);
})();