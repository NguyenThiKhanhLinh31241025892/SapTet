// BƯỚC 4 - Trang Customize: chọn sản phẩm đơn lẻ, chọn mẫu hộp, tính tổng tiền, cảnh báo ngân sách.
// Dữ liệu chỉ đọc từ data/products.js:
//   - products có isCombo === false  -> các món quà đơn lẻ
//   - giftBoxes                      -> giá của 3 mẫu hộp
// Thứ tự nạp: data/products.js -> js/customize.js
// Trạng thái chọn nằm hoàn toàn trong JS (số lượng từng món, mẫu hộp, ngân sách).
// Không còn bộ đếm CSS (counter-reset / counter-increment) nào tham gia tính tổng.
(function () {
  "use strict";

  const MAX_QTY = 99; // tối đa 99 cái cho mỗi sản phẩm

  // Class lọc danh mục đang dùng trong customize.css (bộ lọc vẫn là CSS thuần).
  const CATEGORY_CLASS = {
    "Bánh kẹo": "cat-banh",
    "Trà & cà phê": "cat-tra",
    "Đồ uống": "cat-uong",
    "Khác": "cat-khac"
  };

  const grid = document.querySelector("#product-grid");
  const pickedCountEl = document.querySelector("#picked-count");
  const boxLabelEl = document.querySelector("#box-label");
  const itemsTotalEl = document.querySelector("#items-total");
  const pickedTotalEl = document.querySelector("#picked-total");
  const budgetInput = document.querySelector("#budget-input");
  const budgetStatus = document.querySelector("#budget-status");

  const modal = document.querySelector("#product-modal");
  const modalImage = document.querySelector("#modal-image");
  const modalTitle = document.querySelector("#modal-title");
  const modalPrice = document.querySelector("#modal-price");
  const modalDesc = document.querySelector("#modal-desc");
  const modalAdd = document.querySelector("#modal-add");
  const modalQty = document.querySelector("#modal-qty");
  const modalQtyValue = document.querySelector("#modal-qty-value");

  const hasProducts = typeof products !== "undefined" && Array.isArray(products);
  const hasBoxes = typeof giftBoxes !== "undefined" && Array.isArray(giftBoxes);

  const items = hasProducts ? products.filter((product) => product.isCombo === false) : [];
  const quantities = new Map(); // id sản phẩm -> số lượng (> 0)
  const cards = new Map(); // id sản phẩm -> thẻ <article>

  let budget = 0; // 0 = chưa nhập ngân sách
  let modalId = null; // sản phẩm đang xem trong popup
  let lastOpener = null; // phần tử đã mở popup, để trả focus khi đóng

  /* ===== Tiện ích ===== */

  function formatVND(amount) {
    return `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function findItem(id) {
    return items.find((product) => product.id === id) || null;
  }

  function getQuantity(id) {
    return quantities.get(id) || 0;
  }

  /* ===== Vẽ danh sách sản phẩm (chỉ vẽ một lần) ===== */

  function renderCard(product, index) {
    const id = escapeHTML(product.id);
    const name = escapeHTML(product.name);
    const catClass = CATEGORY_CLASS[product.category] || "";

    return `
        <article class="product-card ${catClass}" style="--i:${index + 1}" data-id="${id}">
          <a href="#" class="card-media" data-action="detail" data-id="${id}" aria-label="Xem chi tiết ${name}">
            <img src="${escapeHTML(product.image)}" alt="${name}" loading="lazy">
            <span class="card-tag">${escapeHTML(product.category)}</span>
          </a>
          <div class="card-body">
            <h3 class="card-title"><a href="#" data-action="detail" data-id="${id}">${name}</a></h3>
            <p class="card-price">${formatVND(product.price)}</p>
          </div>
          <div class="card-actions">
            <button type="button" class="btn btn-outline" data-action="detail" data-id="${id}" aria-label="Xem chi tiết ${name}">Xem chi tiết</button>
            <div class="pick-cell">
              <button type="button" class="btn btn-pick" data-action="add" data-id="${id}" aria-label="Chọn ${name}">+ Chọn sản phẩm</button>
              <div class="qty-control" role="group" aria-label="Số lượng ${name}" hidden>
                <button type="button" data-action="dec" data-id="${id}" aria-label="Giảm số lượng ${name}">−</button>
                <span class="qty-value" aria-live="polite">1</span>
                <button type="button" data-action="inc" data-id="${id}" aria-label="Tăng số lượng ${name}">+</button>
              </div>
            </div>
          </div>
        </article>`;
  }

  function renderProducts() {
    if (!grid) {
      console.error("Không tìm thấy #product-grid trong customize.html");
      return;
    }
    if (!hasProducts) {
      console.error("Chưa tải được dữ liệu từ data/products.js");
      grid.innerHTML = '<p class="catalog-empty" role="status">Chưa tải được danh sách sản phẩm.</p>';
      return;
    }
    if (items.length === 0) {
      grid.innerHTML = '<p class="catalog-empty" role="status">Hiện chưa có sản phẩm để chọn.</p>';
      return;
    }

    grid.innerHTML = items.map(renderCard).join("");
    grid.querySelectorAll(".product-card").forEach((card) => cards.set(card.dataset.id, card));
  }

  /* ===== Mẫu hộp ===== */

  function getBoxInputs() {
    return Array.from(document.querySelectorAll('input[name="box"]'));
  }

  function findBox(id) {
    return hasBoxes ? giftBoxes.find((box) => box.id === id) || null : null;
  }

  // Lấy mẫu hộp đang được chọn từ chính nút radio (nguồn sự thật duy nhất).
  function getSelectedBox() {
    const checked = document.querySelector('input[name="box"]:checked');
    return checked ? findBox(checked.value) : null;
  }

  // Ghi tên và giá lấy từ giftBoxes lên các nhãn mẫu hộp.
  function renderBoxLabels() {
    getBoxInputs().forEach((input) => {
      const box = findBox(input.value);
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!box) {
        console.error(`Không tìm thấy mẫu hộp "${input.value}" trong giftBoxes của data/products.js`);
        return;
      }
      if (!label) return;
      const nameEl = label.querySelector(".box-name");
      const priceEl = label.querySelector(".box-price");
      if (nameEl) nameEl.textContent = box.name;
      if (priceEl) priceEl.textContent = formatVND(box.price);
    });
  }

  /* ===== Tính tổng ===== */

  function getTotals() {
    let count = 0;
    let itemsTotal = 0;

    quantities.forEach((quantity, id) => {
      const product = findItem(id);
      if (!product) return;
      count += quantity;
      itemsTotal += product.price * quantity;
    });

    const box = getSelectedBox();
    const boxPrice = box ? box.price : 0;
    return { count, itemsTotal, box, boxPrice, grandTotal: itemsTotal + boxPrice };
  }

  /* ===== Cập nhật giao diện ===== */

  function updateCard(id) {
    const card = cards.get(id);
    if (!card) return;
    const quantity = getQuantity(id);

    card.classList.toggle("is-selected", quantity > 0);
    card.querySelector('[data-action="add"]').hidden = quantity > 0;
    card.querySelector(".qty-control").hidden = quantity === 0;
    card.querySelector(".qty-value").textContent = quantity;
    card.querySelector('[data-action="inc"]').disabled = quantity >= MAX_QTY;
  }

  function updateModal() {
    if (!modalId) return;
    const quantity = getQuantity(modalId);
    modalAdd.hidden = quantity > 0;
    modalQty.hidden = quantity === 0;
    modalQtyValue.textContent = quantity;
    modalQty.querySelector('[data-action="inc"]').disabled = quantity >= MAX_QTY;
  }

  function updateBudgetStatus(grandTotal) {
    budgetStatus.classList.remove("is-ok", "is-over");

    if (budget <= 0) {
      budgetInput.setAttribute("aria-invalid", "false");
      budgetStatus.textContent = "Nhập ngân sách để biết hộp quà còn hay vượt bao nhiêu.";
      return;
    }

    const difference = budget - grandTotal;
    if (difference < 0) {
      budgetInput.setAttribute("aria-invalid", "true");
      budgetStatus.classList.add("is-over");
      budgetStatus.textContent = `Vượt ngân sách ${formatVND(-difference)}. Hãy bỏ bớt sản phẩm hoặc đổi mẫu hộp.`;
    } else if (difference === 0) {
      budgetInput.setAttribute("aria-invalid", "false");
      budgetStatus.classList.add("is-ok");
      budgetStatus.textContent = "Tổng giá trị đúng bằng ngân sách.";
    } else {
      budgetInput.setAttribute("aria-invalid", "false");
      budgetStatus.classList.add("is-ok");
      budgetStatus.textContent = `Còn lại ${formatVND(difference)} trong ngân sách.`;
    }
  }

  function updateSummary() {
    const totals = getTotals();
    pickedCountEl.textContent = totals.count;
    boxLabelEl.textContent = totals.box ? `${totals.box.name} (${formatVND(totals.boxPrice)})` : "Chưa chọn";
    itemsTotalEl.textContent = formatVND(totals.itemsTotal);
    pickedTotalEl.textContent = formatVND(totals.grandTotal);
    updateBudgetStatus(totals.grandTotal);
  }

  /* ===== Thao tác chọn ===== */

  // Đặt số lượng (0 = bỏ chọn) rồi cập nhật thẻ, popup và tổng tiền.
  function setQuantity(id, quantity) {
    if (!findItem(id)) return;
    const safe = Math.max(0, Math.min(MAX_QTY, Math.floor(quantity)));

    if (safe === 0) quantities.delete(id);
    else quantities.set(id, safe);

    updateCard(id);
    updateModal();
    updateSummary();
  }

  // Các nút tự bị thay đổi trạng thái sau khi bấm, nên trả focus về nút hợp lý.
  function keepFocus(scope, action, id) {
    const quantity = getQuantity(id);
    let target = action;
    if (quantity === 0) target = "add";
    else if (action === "add") target = "inc";
    else if (quantity >= MAX_QTY) target = "dec";

    const button = scope.querySelector(`[data-action="${target}"]`);
    if (button && !button.disabled && button.offsetParent !== null) button.focus();
  }

  /* ===== Popup chi tiết ===== */

  function openModal(id, opener) {
    const product = findItem(id);
    if (!product || !modal) return;

    modalId = id;
    lastOpener = opener || null;

    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalTitle.textContent = product.name;
    modalPrice.textContent = `Giá bán: ${formatVND(product.price)}`;
    modalDesc.textContent = product.description;
    updateModal();

    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    modalId = null;

    if (lastOpener && document.contains(lastOpener) && lastOpener.offsetParent !== null) {
      lastOpener.focus();
    }
    lastOpener = null;
  }

  // Giữ phím Tab xoay vòng trong popup khi đang mở.
  function trapFocus(event) {
    const focusable = Array.from(modal.querySelectorAll("button")).filter(
      (button) => !button.disabled && button.offsetParent !== null && button.tabIndex !== -1
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ===== Ngân sách ===== */

  function handleBudgetInput() {
    const digits = budgetInput.value.replace(/\D/g, "").slice(0, 12);
    budget = digits ? Number(digits) : 0;
    budgetInput.value = budget > 0 ? new Intl.NumberFormat("vi-VN").format(budget) : "";
    updateSummary();
  }

  /* ===== Sự kiện ===== */

  function handleClick(event) {
    const control = event.target.closest("[data-action]");
    if (!control) return;

    const action = control.dataset.action;
    if (action === "close") {
      closeModal();
      return;
    }

    const id = control.dataset.id || modalId;
    if (!id || !findItem(id)) return;

    if (action === "detail") {
      event.preventDefault();
      openModal(id, control);
      return;
    }

    if (action === "add" || action === "inc") setQuantity(id, getQuantity(id) + 1);
    else if (action === "dec") setQuantity(id, getQuantity(id) - 1);
    else return;

    keepFocus(control.closest(".product-card") || modal, action, id);
  }

  function init() {
    renderProducts();
    renderBoxLabels();

    items.forEach((product) => updateCard(product.id));

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", (event) => {
      if (!modal || !modal.classList.contains("is-open")) return;
      if (event.key === "Escape") closeModal();
      else if (event.key === "Tab") trapFocus(event);
    });
    getBoxInputs().forEach((input) => input.addEventListener("change", updateSummary));
    budgetInput.addEventListener("input", handleBudgetInput);

    // Trình duyệt có thể khôi phục ô nhập và mẫu hộp khi tải lại trang: đọc lại cho khớp.
    handleBudgetInput();
  }

  // Để trang giỏ hàng / bước sau lấy được lựa chọn hiện tại (hiện chưa liên kết với giỏ hàng).
  window.getCustomSelection = function () {
    const totals = getTotals();
    return {
      box: totals.box ? { id: totals.box.id, name: totals.box.name, price: totals.box.price } : null,
      items: Array.from(quantities, ([id, quantity]) => ({ id, quantity })),
      itemsTotal: totals.itemsTotal,
      total: totals.grandTotal,
      budget
    };
  };

  init();
})();
