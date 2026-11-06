// BƯỚC 2 - Chỉ hiển thị combo hộp quà Tết phối sẵn.
// Tìm kiếm, lọc và sắp xếp sẽ được bổ sung trong Bước 3.
"use strict";

const comboList = document.querySelector("#combo-list");

// Đổi số nguyên thành số tiền VND hiển thị trên website.
function formatVND(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(price);
}

// Bảo vệ nội dung khi chèn tên/mô tả từ dữ liệu vào HTML.
function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Hàm được yêu cầu trong Prompt 2: nhận một mảng và vẽ thẻ sản phẩm.
function renderProducts(list) {
  if (!comboList) {
    console.error("Không tìm thấy #combo-list trong products.html");
    return;
  }

  if (!Array.isArray(list) || list.length === 0) {
    comboList.innerHTML = '<p class="catalog-empty" role="status">Hiện chưa có hộp quà phù hợp để hiển thị.</p>';
    return;
  }

  comboList.innerHTML = list.map((product) => {
    const detailURL = `product-detail.html?id=${encodeURIComponent(product.id)}`;

    return `
      <article class="catalog-card">
        <a class="catalog-card__image" href="${detailURL}" aria-label="Xem chi tiết ${escapeHTML(product.name)}">
          <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
        </a>
        <div class="catalog-card__body">
          <p class="catalog-card__tag">${escapeHTML(product.category)}</p>
          <h3>${escapeHTML(product.name)}</h3>
          <p class="catalog-card__price">${formatVND(product.price)}</p>
          <a class="catalog-card__link" href="${detailURL}">Xem chi tiết →</a>
        </div>
      </article>`;
  }).join("");
}

// 'products' phải được khai báo trước trong data/products.js.
if (typeof products === "undefined" || !Array.isArray(products)) {
  console.error("Chưa tải được dữ liệu từ data/products.js");
  renderProducts([]);
} else {
  const combos = products.filter((product) => product.isCombo === true);
  renderProducts(combos);
}
