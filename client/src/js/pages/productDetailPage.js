import { productApi } from '../services/productApi.js';
import { cartStore } from '../store/cartStore.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { renderStars } from '../utils/renderStars.js';
import { toast } from '../components/toast.js';
import { $, $$ } from '../utils/dom.js';

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
      const ketQua = await productApi.getProductBySlug(slug);
      this.currentProduct = ketQua.data || ketQua;
    } catch (loi) {
      console.error('Lỗi khi tải chi tiết sản phẩm:', loi);
      this.showError('Không thể tải thông tin sản phẩm từ máy chủ. Vui lòng kiểm tra kết nối.');
      return;
    }

    if (khungTai) khungTai.classList.add('hidden');

    if (!this.currentProduct || Object.keys(this.currentProduct).length === 0) {
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
    const daHetHang = p.stock === undefined || p.stock <= 0;
    const nutThemGio = $('#add-to-cart-btn');
    const nutMuaSticky = $('#sticky-bar-buy-btn');
    const oNhapSoLuong = $('#qty-input');

    if (daHetHang) {
      if (stock) stock.innerHTML = `<span class="text-red-500 font-bold">Hết hàng</span>`;
      if (oNhapSoLuong) oNhapSoLuong.value = 0;
      if (nutThemGio) {
        nutThemGio.disabled = true;
        nutThemGio.textContent = 'Hết hàng';
        nutThemGio.className = 'w-full bg-neutral-300 text-neutral-500 rounded-pill py-sm text-body-apple font-semibold cursor-not-allowed flex justify-center items-center gap-sm';
      }
      if (nutMuaSticky) {
        nutMuaSticky.disabled = true;
        nutMuaSticky.textContent = 'Hết hàng';
        nutMuaSticky.className = 'bg-neutral-300 text-neutral-500 rounded-pill px-xl py-xxs text-caption-apple font-semibold cursor-not-allowed';
      }
    } else {
      if (stock) stock.textContent = `Còn lại: ${p.stock} sản phẩm`;
      if (nutThemGio) {
        nutThemGio.disabled = false;
        nutThemGio.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          Thêm vào giỏ hàng
        `;
        nutThemGio.className = 'w-full bg-primary text-white rounded-pill py-sm text-body-apple font-semibold hover:bg-primary-focus btn-press-effect flex justify-center items-center gap-sm';
      }
      if (nutMuaSticky) {
        nutMuaSticky.disabled = false;
        nutMuaSticky.textContent = 'Thêm vào giỏ';
        nutMuaSticky.className = 'bg-primary text-white rounded-pill px-xl py-xxs text-caption-apple font-semibold hover:bg-primary-focus btn-press-effect';
      }
    }

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
        let soLuongHienTai = parseInt(oNhapSoLuong.value, 10);
        if (soLuongHienTai > 1) {
          oNhapSoLuong.value = --soLuongHienTai;
          this.quantity = soLuongHienTai;
        }
      });
    }

    if (nutTang && oNhapSoLuong) {
      nutTang.addEventListener('click', () => {
        let soLuongHienTai = parseInt(oNhapSoLuong.value, 10);
        const tonKhoToiDa = this.currentProduct ? (this.currentProduct.stock !== undefined ? this.currentProduct.stock : 0) : 0;
        if (soLuongHienTai < tonKhoToiDa) {
          oNhapSoLuong.value = ++soLuongHienTai;
          this.quantity = soLuongHienTai;
        } else {
          toast.show(`Chỉ còn tối đa ${tonKhoToiDa} sản phẩm trong kho!`, 'error');
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
