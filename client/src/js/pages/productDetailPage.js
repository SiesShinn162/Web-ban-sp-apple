import { productApi } from '../services/productApi.js';
import { cartStore } from '../store/cartStore.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { renderStars } from '../utils/renderStars.js';
import { toast } from '../components/toast.js';
import { $, $$ } from '../utils/dom.js';

const MOCK_DETAILS = {
  'iphone-15-pro-max-256gb': { _id: 'p1', id: 'p1', name: 'iPhone 15 Pro Max 256GB', slug: 'iphone-15-pro-max-256gb', brand: 'Apple', category: 'phones', price: 29990000, oldPrice: 34990000, rating: 5, stock: 15, images: ['img/apple-watch-6.png'], description: 'Siêu phẩm mới nhất của Apple với khung Titanium siêu bền và chip A17 Pro mạnh mẽ.', specs: { 'Màn hình': '6.7 inch, Super Retina XDR OLED', 'Hệ điều hành': 'iOS 17', 'Camera sau': 'Chính 48 MP & Phụ 12 MP, 12 MP', 'Camera trước': '12 MP', 'Chipset': 'Apple A17 Pro 6 nhân', 'Dung lượng RAM': '8 GB', 'Bộ nhớ trong': '256 GB', 'Dung lượng pin': '4441 mAh' }, variants: [{ label: '128 GB', delta: -4000000 }, { label: '256 GB', delta: 0, selected: true }, { label: '512 GB', delta: 6000000 }] },
  'iphone-15-128gb': { _id: 'p2', id: 'p2', name: 'iPhone 15 128GB', slug: 'iphone-15-128gb', brand: 'Apple', category: 'phones', price: 19990000, oldPrice: 22990000, rating: 4, stock: 20, images: ['img/apple-watch-6.png'], description: 'Thiết kế đẹp với Dynamic Island và camera 48MP cực sắc nét.', specs: { 'Màn hình': '6.1 inch, Super Retina XDR OLED', 'Hệ điều hành': 'iOS 17', 'Camera': '48 MP & 12 MP', 'Chipset': 'Apple A16 Bionic', 'RAM': '6 GB', 'Bộ nhớ trong': '128 GB' }, variants: [{ label: '128 GB', delta: 0, selected: true }, { label: '256 GB', delta: 3000000 }] },
  'macbook-air-13-inch-m2': { _id: 'p3', id: 'p3', name: 'MacBook Air 13-inch M2', slug: 'macbook-air-13-inch-m2', brand: 'Apple', category: 'laptops', price: 26990000, oldPrice: 29990000, rating: 5, stock: 10, images: ['img/macbook-air.png'], description: 'Mỏng nhẹ phi thường, hiệu năng vượt trội với chip M2 thế hệ mới.', specs: { 'Kích thước màn hình': '13.6 inch Liquid Retina', 'Chipset': 'Apple M2 8 nhân', 'RAM': '8 GB', 'SSD': '256 GB', 'Pin': 'Lên tới 18 giờ' } },
  'ipad-air-5-m1-64gb': { _id: 'p4', id: 'p4', name: 'iPad Air 5 M1 64GB', slug: 'ipad-air-5-m1-64gb', brand: 'Apple', category: 'laptops', price: 14990000, oldPrice: 16990000, rating: 4, stock: 12, images: ['img/ipad-air.png'], description: 'Lựa chọn tuyệt vời cho công việc và giải trí với chip M1 đỉnh cao.', specs: { 'Màn hình': '10.9 inch Liquid Retina', 'Chipset': 'Apple M1 8 nhân', 'RAM': '8 GB', 'Bộ nhớ trong': '64 GB' } },
  'apple-watch-series-6-lte': { _id: 'a1', id: 'a1', name: 'Apple Watch Series 6 LTE', slug: 'apple-watch-series-6-lte', brand: 'Apple', category: 'accessories', price: 8990000, oldPrice: 10990000, rating: 4, stock: 25, images: ['img/apple-watch-6.png'], description: 'Đo nồng độ oxy trong máu, nhịp tim điện tâm đồ ECG.', specs: { 'Màn hình': 'OLED Always-On', 'Kết nối': 'LTE (eSIM) + GPS', 'Thời lượng pin': 'Đến 18 giờ' } },
  'op-lung-iphone-magsafe': { _id: 'a2', id: 'a2', name: 'Ốp lưng iPhone MagSafe', slug: 'op-lung-iphone-magsafe', brand: 'Apple', category: 'accessories', price: 1490000, oldPrice: 1690000, rating: 5, stock: 50, images: ['img/apple-card.png'], description: 'Ốp silicone trong suốt chống sốc hỗ trợ sạc hít nam nam châm MagSafe siêu nhạy.', specs: { 'Chất liệu': 'Silicone cao cấp', 'Hỗ trợ': 'MagSafe Wireless Charging' } },
};

export const productDetailPage = {
  currentProduct: null,
  currentPrice: 0,
  quantity: 1,

  async init() {
    console.log('Khởi tạo Trang chi tiết sản phẩm...');
    const thamSo = new URLSearchParams(window.location.search);
    const duongDanSanPham = thamSo.get('slug');

    if (!duongDanSanPham) {
      this.showError('Không tìm thấy mã sản phẩm hợp lệ.');
      return;
    }

    await this.loadProductDetails(duongDanSanPham);
    this.registerEventListeners();
  },

  async loadProductDetails(slug) {
    const khungTai = $('#detail-loading');
    const khungNoiDung = $('#detail-content');

    try {
      const data = await productApi.getProductBySlug(slug);
      this.currentProduct = data.data || data;

      if (!this.currentProduct || Object.keys(this.currentProduct).length === 0) {
        this.currentProduct = MOCK_DETAILS[slug];
      }
    } catch (e) {
      console.warn('Không thể kết nối API Server, sử dụng dữ liệu mẫu cho chi tiết sản phẩm:', e);
      this.currentProduct = MOCK_DETAILS[slug];
    }

    if (khungTai) khungTai.classList.add('hidden');

    if (!this.currentProduct) {
      this.showError('Sản phẩm yêu cầu không tồn tại hoặc đã bị xóa.');
      return;
    }

    this.currentPrice = this.currentProduct.price;
    this.renderUi();
    if (khungNoiDung) khungNoiDung.classList.remove('hidden');
  },

  renderUi() {
    const p = this.currentProduct;

    const nameBreadcrumb = $('#detail-product-name-breadcrumb');
    if (nameBreadcrumb) nameBreadcrumb.textContent = p.name;

    const catLink = $('#detail-category-link');
    if (catLink) {
      catLink.textContent = p.category === 'phones' ? 'Điện thoại' : (p.category === 'laptops' ? 'Laptops' : 'Phụ kiện');
      catLink.href = `products.html?category=${p.category}`;
    }

    const mainImg = $('#detail-main-img');
    if (mainImg) {
      mainImg.src = p.images && p.images[0] ? p.images[0] : 'img/macbook-air.png';
      mainImg.alt = p.name;
    }

    const khungAnhNho = $('#detail-thumbs-container');
    if (khungAnhNho && p.images) {
      khungAnhNho.innerHTML = p.images.map((img, i) => `
        <button class="w-14 h-14 p-1 border rounded-sm ${i === 0 ? 'border-primary' : 'border-neutral-200'} bg-canvas-parchment flex justify-center items-center detail-thumb-btn">
          <img src="${img}" class="w-full h-full object-contain">
        </button>
      `).join('');
    }

    const brand = $('#detail-brand');
    if (brand) brand.textContent = p.brand || 'HoangPhanStore';

    const title = $('#detail-title');
    if (title) title.textContent = p.name;

    const stars = $('#detail-stars');
    if (stars) stars.innerHTML = renderStars(p.rating || 5);

    const price = $('#detail-price');
    if (price) price.textContent = formatCurrency(p.price);

    const oldPrice = $('#detail-old-price');
    if (oldPrice && p.oldPrice > p.price) {
      oldPrice.textContent = formatCurrency(p.oldPrice);
    } else if (oldPrice) {
      oldPrice.textContent = '';
    }

    const tomTatMoTa = $('#detail-desc-summary');
    if (tomTatMoTa) tomTatMoTa.textContent = p.description;

    const chiTietMoTa = $('#detail-desc-full');
    if (chiTietMoTa) {
      chiTietMoTa.innerHTML = `<p>${p.description}</p><p>Sản phẩm này sở hữu nhiều tính năng đột phá, tối ưu hóa công nghệ cao cùng độ hoàn thiện vượt bậc. Được đóng gói chỉn chu trong hộp giấy tự nhiên giảm tải ô nhiễm môi trường.</p>`;
    }

    const stock = $('#detail-stock-count');
    if (stock) stock.textContent = `Còn lại: ${p.stock || 10} sản phẩm`;

    const bangThongSo = $('#detail-specs-table');
    if (bangThongSo && p.specs) {
      bangThongSo.innerHTML = Object.entries(p.specs).map(([key, val]) => `
        <tr class="h-10">
          <td class="text-neutral-400 font-medium py-xs pr-lg w-1/3">${key}</td>
          <td class="text-ink py-xs font-semibold">${val}</td>
        </tr>
      `).join('');
    }

    const khungBianthe = $('#detail-variants-container');
    const luoiBianthe = $('#detail-variants-grid');
    if (khungBianthe && luoiBianthe) {
      if (p.variants && p.variants.length > 0) {
        khungBianthe.classList.remove('hidden');
        luoiBianthe.innerHTML = p.variants.map((v, i) => {
          return `
            <button
              class="variant-option-chip flex flex-col items-center justify-center p-sm border rounded-pill transition-[border-color,box-shadow,color,background-color] text-center min-h-[50px] btn-press-effect
              ${v.selected ? 'border-primary bg-white text-primary ring-2 ring-primary-focus' : 'border-neutral-200 bg-white text-ink hover:border-neutral-300'}"
              data-delta="${v.delta}"
              data-label="${v.label}"
            >
              <span class="block text-caption-strong">${v.label}</span>
              <span class="block text-micro-legal text-neutral-400">${v.delta === 0 ? 'Giá chuẩn' : (v.delta > 0 ? `+${formatCurrency(v.delta)}` : `-${formatCurrency(Math.abs(v.delta))}`)}</span>
            </button>
          `;
        }).join('');
      } else {
        khungBianthe.classList.add('hidden');
      }
    }

    const stickyImg = $('#sticky-bar-img');
    const stickyTitle = $('#sticky-bar-title');
    const stickyPrice = $('#sticky-bar-price');
    if (stickyImg) stickyImg.src = p.images && p.images[0] ? p.images[0] : 'img/macbook-air.png';
    if (stickyTitle) stickyTitle.textContent = p.name;
    if (stickyPrice) stickyPrice.textContent = formatCurrency(this.currentPrice);
  },

  registerEventListeners() {
    const mainImg = $('#detail-main-img');

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.detail-thumb-btn');
      if (!btn || !mainImg) return;

      $$('.detail-thumb-btn').forEach(b => b.classList.replace('border-primary', 'border-neutral-200'));
      btn.classList.replace('border-neutral-200', 'border-primary');
      mainImg.src = btn.querySelector('img').src;
    });

    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.variant-option-chip');
      if (!chip || !this.currentProduct) return;

      $$('.variant-option-chip').forEach(c => {
        c.className = 'variant-option-chip flex flex-col items-center justify-center p-sm border border-neutral-200 rounded-pill bg-white text-ink hover:border-neutral-300 transition-[border-color,box-shadow,color,background-color] text-center min-h-[50px] btn-press-effect';
      });

      chip.className = 'variant-option-chip flex flex-col items-center justify-center p-sm border border-primary bg-white text-primary ring-2 ring-primary-focus rounded-pill transition-[border-color,box-shadow,color,background-color] text-center min-h-[50px] btn-press-effect';

      const delta = parseInt(chip.dataset.delta, 10);
      const label = chip.dataset.label;

      this.currentPrice = this.currentProduct.price + delta;

      const priceText = $('#detail-price');
      if (priceText) priceText.textContent = formatCurrency(this.currentPrice);

      const stickyPrice = $('#sticky-bar-price');
      if (stickyPrice) stickyPrice.textContent = formatCurrency(this.currentPrice);

      this.selectedVariant = label;
    });

    const oNhapSoLuong = $('#qty-input');
    const nutGiam = $('#qty-dec-btn');
    const nutTang = $('#qty-inc-btn');

    if (nutGiam && oNhapSoLuong) {
      nutGiam.addEventListener('click', () => {
        let val = parseInt(oNhapSoLuong.value, 10);
        if (val > 1) {
          oNhapSoLuong.value = --val;
          this.quantity = val;
        }
      });
    }

    if (nutTang && oNhapSoLuong) {
      nutTang.addEventListener('click', () => {
        let val = parseInt(oNhapSoLuong.value, 10);
        const maxStock = this.currentProduct ? (this.currentProduct.stock || 10) : 10;
        if (val < maxStock) {
          oNhapSoLuong.value = ++val;
          this.quantity = val;
        } else {
          toast.show(`Chỉ còn tối đa ${maxStock} sản phẩm trong kho!`, 'error');
        }
      });
    }

    const nutThemGio = $('#add-to-cart-btn');
    const nutMuaSticky = $('#sticky-bar-buy-btn');

    const handleAddToCart = () => {
      if (!this.currentProduct) return;

      const configuredProduct = {
        ...this.currentProduct,
        price: this.currentPrice,
        name: this.selectedVariant ? `${this.currentProduct.name} (${this.selectedVariant})` : this.currentProduct.name
      };

      cartStore.addToCart(configuredProduct, this.quantity);
      toast.show(`Đã thêm ${this.quantity} sản phẩm "${configuredProduct.name}" vào giỏ!`);
    };

    if (nutThemGio) nutThemGio.addEventListener('click', handleAddToCart);
    if (nutMuaSticky) nutMuaSticky.addEventListener('click', handleAddToCart);

    const thanhMuaSticky = $('#sticky-purchase-bar');
    if (thanhMuaSticky) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 450) {
          thanhMuaSticky.classList.remove('translate-y-full');
        } else {
          thanhMuaSticky.classList.add('translate-y-full');
        }
      });
    }
  },

  showError(msg) {
    const errorEl = $('#detail-error');
    const errorMsg = $('#detail-error-message');
    const loading = $('#detail-loading');

    if (loading) loading.classList.add('hidden');
    if (errorMsg) errorMsg.textContent = msg;
    if (errorEl) errorEl.classList.remove('hidden');
  }
};
export default productDetailPage;
