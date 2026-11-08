// BƯỚC 2 - Dữ liệu dùng chung của website Sắp Tết.
// Nguồn: index.html (4 combo), products.html và product-detail.html (8 món lẻ) trên GitHub main.
// Giá là giá đang hiển thị trong mã nguồn nhóm, chưa được xác minh để kinh doanh thực tế.
// isCombo: true = hộp quà phối sẵn; false = món lẻ tại trang Customize.
// File dùng như classic script và PHẢI tải trước JavaScript của từng trang.
const products = [
  {
    id: "combo-001",
    name: "Hộp Quà Phúc Lộc",
    price: 599000,
    category: "HỘP QUÀ CAO CẤP",
    image: "images/product-1.png",
    description: "Hòa quyện hương vị truyền thống trong thiết kế sang trọng.",
    isCombo: true
  },
  {
    id: "combo-002",
    name: "Hộp Quà An Khang",
    price: 799000,
    category: "QUÀ TẶNG GIA ĐÌNH",
    image: "images/product-2.png",
    description: "Lời chúc sức khỏe và bình an dành tặng những người thân yêu.",
    isCombo: true
  },
  {
    id: "combo-003",
    name: "Hộp Quà Thịnh Vượng",
    price: 999000,
    category: "QUÀ TẶNG ĐỐI TÁC",
    image: "images/product-3.png",
    description: "Thiết kế tinh tế, phù hợp trao gửi lời tri ân và hợp tác.",
    isCombo: true
  },
  {
    id: "combo-004",
    name: "Hộp Quà Tài Lộc",
    price: 1299000,
    category: "PHIÊN BẢN ĐẶC BIỆT",
    image: "images/product-4.png",
    description: "Món quà nổi bật gửi gắm lời chúc sung túc cho năm mới.",
    isCombo: true
  },
  {
    id: "item-001",
    name: "Bộ ấm chén trà gốm sứ Ru Kiln",
    price: 289000,
    category: "Trà & cà phê",
    image: "images/bo-am-chen-tra-gom-su-ru-kiln-9-chi-tiet-am-230ml.png",
    description: "Bộ ấm chén theo phong cách thưởng trà Gongfu, đường nét mềm mại, men trang nhã. Thích hợp làm quà biếu ông bà, cha mẹ dịp đầu năm.",
    isCombo: false
  },
  {
    id: "item-002",
    name: "Bánh quy bơ Danisa hộp thiếc 454g",
    price: 385000,
    category: "Bánh kẹo",
    image: "images/banh-quy-bo-danisa-hop-thiec-454g.png",
    description: "Bánh quy bơ kiểu Đan Mạch, thơm béo, giòn xốp với nhiều hình dáng. Hộp thiếc sang trọng, hợp dùng với trà, tiếp khách ngày Tết hoặc làm quà cho gia đình, thầy cô, đồng nghiệp.",
    isCombo: false
  },
  {
    id: "item-003",
    name: "Mứt gừng mật ong Bảo Minh",
    price: 79000,
    category: "Bánh kẹo",
    image: "images/mut-gung-mat-ong-bao-minh-hop-180g.png",
    description: "Lát gừng cay ấm đặc trưng hòa quyện vị ngọt dịu, dùng với trà nóng hoặc bày khay bánh mứt ngày Tết. Hộp 180g nhỏ gọn, hợp hộp quà truyền thống.",
    isCombo: false
  },
  {
    id: "item-004",
    name: "Rượu vang đỏ Chevalier Delaude Languedoc",
    price: 3450000,
    category: "Đồ uống",
    image: "images/ruou-vang-do-chevalier-delaude-languedoc-750ml.png",
    description: "Vang đỏ vùng Languedoc, Pháp, sắc đỏ ruby đậm, hương anh đào đen, mâm xôi và gia vị. Vị đậm đà, cân bằng, hợp tiệc sum họp hoặc làm quà biếu Tết.",
    isCombo: false
  },
  {
    id: "item-005",
    name: "Bạch trà Tiên Mây Trà Shan",
    price: 199000,
    category: "Trà & cà phê",
    image: "images/bach-tra-tien-may-tra-shan-100g.png",
    description: "Tuyển từ mầm trà non cây Shan Tuyết cổ thụ vùng núi cao Đông Bắc, búp phủ lông tơ trắng bạc, hương vị thanh nhẹ. Hợp kết hợp cùng bộ ấm chén làm quà Tết.",
    isCombo: false
  },
  {
    id: "item-006",
    name: "Trầm nụ Thiên Lộc Việt",
    price: 180000,
    category: "Khác",
    image: "images/tram-nu-thien-loc-viet-dang-vi.png",
    description: "Trầm nụ dạng nhỏ, dùng cùng lư xông trầm, tạo không gian ấm cúng cho dịp sum họp và tiếp khách đầu năm.",
    isCombo: false
  },
  {
    id: "item-007",
    name: "Tranh gạo thư pháp Thái Hoàng",
    price: 2000000,
    category: "Khác",
    image: "images/tranh-gao-thu-phap-thai-hoang-30x40cm.png",
    description: "Kết hợp nghệ thuật tạo hình từ hạt gạo với thư pháp truyền thống, mộc mạc mà trang nhã. Dùng trang trí phòng khách, phòng làm việc hoặc làm quà Tết.",
    isCombo: false
  },
  {
    id: "item-008",
    name: "Vòng tay trầm hương Kim Như Nguyện",
    price: 1000000,
    category: "Khác",
    image: "images/vong-tay-tram-huong-kim-nhu-nguyen-thien-moc-huong-hat-6mm.png",
    description: "Chế tác từ trầm hương Việt Nam, điểm nhấn khảm vàng sang trọng. “Kim Như Nguyện” gửi gắm lời chúc mọi điều thuận ý, hợp làm quà Tết.",
    isCombo: false
  }
];

// BƯỚC 4 - Giá 3 mẫu hộp của trang Customize (giá mẫu do nhóm tự đặt, chưa xác minh để kinh doanh).
// Để riêng khỏi mảng products để KHÔNG lẫn vào danh sách combo (isCombo true) và món lẻ (isCombo false).
const giftBoxes = [
  {
    id: "box-001",
    name: "Mẫu hộp 01",
    price: 59000,
    image: "images/hop-qua-mau-01.png"
  },
  {
    id: "box-002",
    name: "Mẫu hộp 02",
    price: 129000,
    image: "images/hop-qua-mau-02.png"
  },
  {
    id: "box-003",
    name: "Mẫu hộp 03",
    price: 89000,
    image: "images/hop-qua-mau-03.png"
  }
];
