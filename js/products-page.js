// SẮP TẾT - Bước 2 + Bước 3: Combo phối sẵn, tìm kiếm / lọc / sắp xếp và thêm giỏ.
"use strict";

(function () {
  const comboList = document.querySelector("#combo-list");
  const searchInput = document.querySelector("#combo-search");
  const categoryInput = document.querySelector("#combo-category");
  const sortInput = document.querySelector("#combo-sort");
  const results = document.querySelector("#combo-results");
  const notice = document.querySelector("#combo-notice");
  const combos = typeof products !== "undefined" && Array.isArray(products)
    ? products.filter((product) => product.isCombo === true)
    : [];

  function formatVND(amount) {
    return `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
  }
  function escapeHTML(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // Hỗ trợ gõ "phuc loc" để tìm "Phúc Lộc".
  function normalizeText(value) {
    return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D").toLocaleLowerCase("vi-VN").trim();
  }

  // Hàm renderProducts(list) theo Prompt 2 của thầy.
  function renderProducts(list) {
    if (!comboList) return;
    if (!Array.isArray(list) || list.length === 0) {
      comboList.innerHTML = '<p class="catalog-empty">Không tìm thấy hộp quà phù hợp với điều kiện đã chọn.</p>';
      return;
    }
    comboList.innerHTML = list.map((product) => {
      const id = escapeHTML(product.id);
      const name = escapeHTML(product.name);
      const detailURL = `product-detail.html?id=${encodeURIComponent(product.id)}`;
      return `
        <article class="catalog-card">
          <a class="catalog-card__image" href="${detailURL}" aria-label="Xem chi tiết ${name}">
            <img src="${escapeHTML(product.image)}" alt="${name}" loading="lazy">
          </a>
          <div class="catalog-card__body">
            <p class="catalog-card__tag">${escapeHTML(product.category)}</p>
            <h3>${name}</h3>
            <p class="catalog-card__price">${formatVND(product.price)}</p>
            <a class="catalog-card__link" href="${detailURL}">Xem chi tiết →</a>
            <button type="button" class="catalog-card__add" data-add-cart="${id}">Thêm vào giỏ hàng</button>
          </div>
        </article>`;
    }).join("");
  }

  function applyFilters() {
    const search = normalizeText(searchInput.value);
    const category = categoryInput.value;
    const sorted = combos.filter((product) =>
      normalizeText(product.name).includes(search) && (!category || product.category === category)
    );
    if (sortInput.value === "asc") sorted.sort((a, b) => a.price - b.price);
    if (sortInput.value === "desc") sorted.sort((a, b) => b.price - a.price);
    renderProducts(sorted);
    results.textContent = `Hiển thị ${sorted.length}/${combos.length} hộp quà`;
    notice.textContent = "";
  }

  if (!comboList || !searchInput || !categoryInput || !sortInput) {
    console.error("Thiếu vùng danh sách hoặc bộ lọc trên products.html");
    return;
  }
  if (typeof products === "undefined" || !Array.isArray(products)) {
    console.error("Không tải được data/products.js");
  }

  Array.from(new Set(combos.map((product) => product.category))).forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryInput.appendChild(option);
  });

  searchInput.addEventListener("input", applyFilters);
  categoryInput.addEventListener("change", applyFilters);
  sortInput.addEventListener("change", applyFilters);
  comboList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-add-cart]");
    if (!button) return;
    const id = button.dataset.addCart;
    if (typeof window.addToCart !== "function") {
      notice.textContent = "Chưa nạp được chức năng giỏ hàng. Vui lòng thử lại.";
      console.error("Thiếu js/cart.js trên products.html");
      return;
    }
    const ok = window.addToCart(id);
    const chosen = combos.find((product) => product.id === id);
    notice.textContent = ok && chosen
      ? `Đã thêm ${chosen.name} vào giỏ. Nhấn biểu tượng giỏ hàng để xem.`
      : "Không thể thêm sản phẩm vào giỏ hàng.";
  });
  applyFilters();
})();
