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
      const safeQuantity = Math.min(quantity, MAX_QUANTITY);

      if (line.type === "custom") {
        // Một hộp tự phối có ID riêng, mẫu hộp và danh sách món quà bên trong.
        if (typeof line.boxId !== "string" || !Array.isArray(line.items) || !line.items.length) return;
        const itemQuantities = new Map();
        line.items.forEach((item) => {
          if (!item || typeof item.id !== "string") return;
          const qty = Math.floor(Number(item.quantity));
          if (Number.isFinite(qty) && qty > 0) {
            itemQuantities.set(item.id, Math.min((itemQuantities.get(item.id) || 0) + qty, MAX_QUANTITY));
          }
        });
        if (!itemQuantities.size) return;
        merged.set(line.id, {
          id: line.id,
          type: "custom",
          quantity: safeQuantity,
          boxId: line.boxId,
          items: Array.from(itemQuantities, ([id, quantity]) => ({ id, quantity }))
        });
        return;
      }
      // Giữ nguyên định dạng combo cũ: { id, quantity }.
      if (line.type && line.type !== "combo") return;
      const existing = merged.get(line.id);
      const count = existing ? existing.quantity : 0;
      merged.set(line.id, { id: line.id, quantity: Math.min(count + safeQuantity, MAX_QUANTITY) });
    });
    return Array.from(merged.values());
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

  // Thêm MỘT HỘP TỰ PHỐI (không tạo 8 dòng món lẻ trong giỏ).
  // Mỗi lần hoàn tất một thiết kế sẽ có một ID riêng, giữ được mẫu hộp và số lượng món.
  function addCustomToCart(selection) {
    if (!selection || !selection.box || !Array.isArray(selection.items)) return false;
    if (typeof giftBoxes === "undefined" || !Array.isArray(giftBoxes)) return false;
    const box = giftBoxes.find((entry) => entry.id === selection.box.id);
    if (!box) return false;

    const items = selection.items.map((line) => ({
      id: line.id,
      quantity: Math.floor(Number(line.quantity))
    }));
    if (!items.length || items.some((item) =>
      !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY ||
      !findProduct(item.id) || findProduct(item.id).isCombo !== false)) return false;

    const uniqueID = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const cart = readCart();
    cart.push({ id: uniqueID, type: "custom", quantity: 1, boxId: box.id, items });
    writeCart(cart);
    return uniqueID;
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
    return readCart().map((line) => {
      if (line.type === "custom") {
        const box = typeof giftBoxes !== "undefined" && Array.isArray(giftBoxes)
          ? giftBoxes.find((entry) => entry.id === line.boxId) : null;
        if (!box) return null;
        const parts = line.items.map((item) => {
          const itemProduct = findProduct(item.id);
          if (!itemProduct || itemProduct.isCombo !== false) return null;
          return { name: itemProduct.name, id: item.id, quantity: item.quantity,
            price: itemProduct.price };
        });
        if (parts.some((part) => !part)) return null;
        const boxUnitPrice = box.price + parts.reduce((sum, item) =>
          sum + item.price * item.quantity, 0);
        const product = {
          id: line.id,
          name: `Hộp quà tự thiết kế – ${box.name}`,
          category: "Hộp quà tự phối",
          image: box.image,
          price: boxUnitPrice,
          isCombo: false,
          customItems: parts
        };
        return { product, quantity: line.quantity, lineTotal: boxUnitPrice * line.quantity };
      }
      const product = findProduct(line.id);
      if (!product) return null;
      return { product, quantity: line.quantity, lineTotal: product.price * line.quantity };
    }).filter(Boolean);
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
    addCustomToCart,
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