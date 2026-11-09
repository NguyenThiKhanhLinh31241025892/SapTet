// BƯỚC 4 - Hiển thị chi tiết combo hộp quà Tết phối sẵn.
// Nguồn dữ liệu duy nhất: data/products.js
"use strict";

(function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const detailView = document.querySelector("#detail-view");
  const notFoundView = document.querySelector("#detail-not-found");
  const errorMessage = document.querySelector("#detail-error-message");
  const breadcrumbName = document.querySelector("#detail-breadcrumb-name");
  const imageElement = document.querySelector("#detail-image");
  const idElement = document.querySelector("#detail-id");
  const nameElement = document.querySelector("#detail-name");
  const categoryElement = document.querySelector("#detail-category");
  const priceElement = document.querySelector("#detail-price");
  const descriptionElement = document.querySelector("#detail-description");
  const addButton = document.querySelector("#detail-add-button");
  const statusElement = document.querySelector("#detail-status");

  function formatVND(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(price);
  }

  function showNotFound(message) {
    if (detailView) detailView.hidden = true;
    if (notFoundView) notFoundView.hidden = false;
    if (errorMessage) errorMessage.textContent = message;
    document.title = "Không tìm thấy hộp quà | Sắp Tết";
  }

  function showStatus(message, type) {
    if (!statusElement) return;
    statusElement.textContent = message;
    statusElement.dataset.state = type || "info";
  }

  // Kiểm tra dữ liệu trước khi tìm combo theo ID nhận từ URL.
  if (!Array.isArray(products)) {
    showNotFound("Không tải được dữ liệu sản phẩm. Bà vui lòng quay lại danh sách hộp quà.");
    console.error("Không tìm thấy mảng products từ data/products.js.");
    return;
  }

  if (!productId) {
    showNotFound("Đường dẫn chưa có mã combo. Vui lòng chọn một hộp quà từ trang danh sách.");
    return;
  }

  // Chỉ tìm những sản phẩm là combo phối sẵn theo data-contract.md.
  const combo = products.find((product) =>
    product.id === productId && product.isCombo === true
  );

  if (!combo) {
    showNotFound(`Không tìm thấy combo có mã "${productId}". Vui lòng chọn lại hộp quà trong danh sách.`);
    return;
  }

  // Đổ dữ liệu vào các vị trí trên giao diện.
  imageElement.src = combo.image;
  imageElement.alt = combo.name;
  idElement.textContent = combo.id;
  nameElement.textContent = combo.name;
  categoryElement.textContent = combo.category;
  priceElement.textContent = formatVND(combo.price);
  descriptionElement.textContent = combo.description;
  breadcrumbName.textContent = combo.name;

  document.title = `${combo.name} | Sắp Tết`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", `${combo.name} - ${combo.description}`);
  }

  detailView.hidden = false;

  // Gọi hàm giỏ hàng dùng chung theo data-contract.md.
  // Hàm addToCart(productId) do thành viên phụ trách giỏ hàng tích hợp.
  addButton.addEventListener("click", function () {
    if (typeof addToCart !== "function") {
      showStatus(
        "Nút đã sẵn sàng kết nối. Chức năng giỏ hàng chưa được tích hợp trong project hiện tại.",
        "warning"
      );
      console.warn("addToCart(productId) chưa được nạp. Vui lòng tích hợp hàm giỏ hàng dùng chung.");
      return;
    }

    try {
      const added = addToCart(combo.id);
      if (added) {
        showStatus(`Đã thêm ${combo.name} vào giỏ hàng. Nhấn biểu tượng giỏ hàng trên thanh điều hướng để xem.`, "success");
      } else {
        showStatus("Không thể thêm combo vào giỏ hàng. Vui lòng thử lại.", "error");
      }
    } catch (error) {
      showStatus("Chưa thể thêm hộp quà vào giỏ. Vui lòng thử lại.", "error");
      console.error("Lỗi khi gọi addToCart:", error);
    }
  });
})();
