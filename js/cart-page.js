// BƯỚC 5 - Vẽ trang giỏ hàng (chỉ dùng trong cart.html).
// Dữ liệu và thao tác giỏ nằm ở js/cart.js; file này chỉ vẽ giao diện
// và chuyển thao tác của người dùng sang cart.js.
// Thứ tự nạp: data/products.js -> js/cart.js -> js/cart-page.js
"use strict";

const cartHeading = document.querySelector("#cart-heading");
const cartLayout = document.querySelector("#cart-layout");
const cartList = document.querySelector("#cart-list");
const cartEmpty = document.querySelector("#cart-empty");
const summaryCount = document.querySelector("#summary-count");
const summaryTotal = document.querySelector("#summary-total");

// 1997000 -> "1.997.000đ" (cùng kiểu hiển thị với trang chủ, trang chi tiết và Customize).
function formatPrice(amount) {
  return `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
}

// Bảo vệ nội dung khi chèn tên/ảnh từ dữ liệu vào HTML.
function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Một dòng sản phẩm trong giỏ: ảnh, tên, đơn giá, số lượng, thành tiền, nút xóa.
function renderCartItem({ product, quantity, lineTotal }) {
  const id = escapeHTML(product.id);
  const name = escapeHTML(product.name);
  const detailURL = `product-detail.html?id=${encodeURIComponent(product.id)}`;
  // Theo data-contract chỉ combo có trang chi tiết (?id=combo-xxx); món lẻ chưa có link.
  const title = product.isCombo ? `<a href="${detailURL}">${name}</a>` : name;

  return `
    <li class="cart-item">
      <div class="cart-item__image">
        <img src="${escapeHTML(product.image)}" alt="${name}" loading="lazy">
      </div>
      <div class="cart-item__info">
        <p class="cart-item__tag">${escapeHTML(product.category)}</p>
        <h2 class="cart-item__name">${title}</h2>
        <p class="cart-item__price">Đơn giá: ${formatPrice(product.price)}</p>
      </div>
      <div class="cart-item__actions">
        <div class="cart-qty" role="group" aria-label="Số lượng ${name}">
          <button type="button" class="qty-btn" data-action="decrease" data-id="${id}" aria-label="Giảm số lượng ${name}"${quantity <= 1 ? " disabled" : ""}>−</button>
          <span class="qty-value">${quantity}</span>
          <button type="button" class="qty-btn" data-action="increase" data-id="${id}" aria-label="Tăng số lượng ${name}">+</button>
        </div>
        <p class="cart-item__total">
          <span class="cart-item__total-label">Thành tiền</span>
          <strong>${formatPrice(lineTotal)}</strong>
        </p>
        <button type="button" class="cart-item__remove" data-action="remove" data-id="${id}" aria-label="Xóa ${name} khỏi giỏ hàng">Xóa</button>
      </div>
    </li>`;
}

// Vẽ lại toàn bộ trang từ dữ liệu giỏ hiện tại.
function renderCart() {
  const items = getCartItems();
  const isEmpty = items.length === 0;

  cartLayout.hidden = isEmpty;
  cartEmpty.hidden = !isEmpty;
  cartList.innerHTML = items.map(renderCartItem).join("");
  summaryCount.textContent = getCartCount();
  summaryTotal.textContent = formatPrice(getCartTotal());
}

// Sau khi vẽ lại, nút vừa bấm bị thay bằng nút mới nên focus bàn phím sẽ mất.
// Đưa focus về nút tương ứng; nếu dòng đã bị xóa thì về tiêu đề trang.
function restoreFocus(action, id) {
  for (const name of [action, "increase", "remove"]) {
    const target = cartList.querySelector(`[data-action="${name}"][data-id="${CSS.escape(id)}"]`);
    if (target && !target.disabled) {
      target.focus();
      return;
    }
  }
  cartHeading.focus();
}

// Một bộ lắng nghe cho cả danh sách (không gắn riêng cho từng nút).
cartList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button || button.disabled) return;

  const { action, id } = button.dataset;
  if (action === "increase") increaseQuantity(id);
  else if (action === "decrease") decreaseQuantity(id);
  else if (action === "remove") removeFromCart(id);

  renderCart();
  restoreFocus(action, id);
});

// cart.js phát sự kiện này sau mỗi thay đổi (kể cả thay đổi từ tab khác).
document.addEventListener("sapTetCartChanged", renderCart);
window.addEventListener("storage", renderCart);   

if (typeof products === "undefined" || !Array.isArray(products) || typeof getCartItems !== "function") {
  console.error("Thiếu data/products.js hoặc js/cart.js: kiểm tra thứ tự thẻ <script> trong cart.html");
  cartLayout.hidden = true;
  cartEmpty.hidden = false;
} else {
  renderCart();
}
