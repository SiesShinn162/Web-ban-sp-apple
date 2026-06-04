import { cartStore } from '../store/cartStore.js';
import { createCartItemHtml } from '../components/cartItem.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { $ } from '../utils/dom.js';
import { productApi } from '../services/productApi.js';

export const cartPage = {
  async init() {
    console.log('Khởi tạo Trang giỏ hàng...');
    try {
      await this.syncCartWithServer();
      this.renderCart();
      this.registerEventListeners();
    } catch (e) {
      console.error('Không khởi chạy được trang giỏ hàng do lỗi hệ thống:', e);
    }
  },

  async syncCartWithServer() {
    const gioHang = cartStore.getCart();
    if (gioHang.length === 0) return;

    try {
      const ketQua = await productApi.getProducts();
      const dsSanPhamDb = ketQua.data || ketQua;

      let daThayDoi = false;
      const gioHangMoi = [];

      for (const mucGioHang of gioHang) {
        const sanPhamDb = dsSanPhamDb.find(p => p._id === mucGioHang.productId || p.id === mucGioHang.productId);
        if (sanPhamDb) {
          let giaDuKien = sanPhamDb.price;
          const khopBianthe = mucGioHang.name.match(/\(([^)]+)\)$/);
          const nhanBianthe = khopBianthe ? khopBianthe[1] : null;

          if (sanPhamDb.slug === 'iphone-15-pro-max-256gb' && nhanBianthe) {
            if (nhanBianthe === '128 GB') giaDuKien = sanPhamDb.price - 4000000;
            else if (nhanBianthe === '512 GB') giaDuKien = sanPhamDb.price + 6000000;
          } else if (sanPhamDb.slug === 'iphone-15-128gb' && nhanBianthe) {
            if (nhanBianthe === '256 GB') giaDuKien = sanPhamDb.price + 3000000;
          }

          let soLuongMoi = mucGioHang.quantity;
          if (soLuongMoi > sanPhamDb.stock) {
            soLuongMoi = sanPhamDb.stock;
            daThayDoi = true;
          }

          if (giaDuKien !== mucGioHang.price) {
            mucGioHang.price = giaDuKien;
            daThayDoi = true;
          }

          if (mucGioHang.stock !== sanPhamDb.stock) {
            mucGioHang.stock = sanPhamDb.stock;
            daThayDoi = true;
          }

          if (soLuongMoi > 0) {
            mucGioHang.quantity = soLuongMoi;
            gioHangMoi.push(mucGioHang);
          } else {
            daThayDoi = true;
          }
        } else {
          daThayDoi = true;
        }
      }

      if (daThayDoi) {
        cartStore.saveCart(gioHangMoi);
        const { toast } = await import('../components/toast.js');
        toast.show('Giỏ hàng đã được tự động cập nhật theo giá/tồn kho mới nhất.', 'info');
      }
    } catch (loi) {
      console.error('Không thể kết nối máy chủ để xác thực giỏ hàng:', loi);
      this.showErrorState('Không thể kết nối máy chủ để xác thực giỏ hàng. Vui lòng thử lại sau.');
      throw loi;
    }
  },

  showErrorState(msg) {
    const khungGioHang = $('#cart-container');
    const khungTrong = $('#cart-empty-state');
    if (khungGioHang) khungGioHang.classList.add('hidden');
    if (khungTrong) {
      khungTrong.innerHTML = `
        <div class="text-xxl mb-sm">⚠️</div>
        <h3 class="text-tagline mb-xxs text-ink">Lỗi kết nối máy chủ</h3>
        <p class="text-caption-apple text-neutral-500 mb-lg">${msg}</p>
        <a href="index.html" class="bg-primary text-white rounded-pill px-lg py-xs text-button-utility hover:bg-primary-focus btn-press-effect inline-block">
          Quay lại trang chủ
        </a>
      `;
      khungTrong.classList.remove('hidden');
    }
  },

  renderCart() {
    const gioHang = cartStore.getCart();
    const khungGioHang = $('#cart-container');
    const khungTrong = $('#cart-empty-state');

    if (gioHang.length === 0) {
      if (khungGioHang) khungGioHang.classList.add('hidden');
      if (khungTrong) khungTrong.classList.remove('hidden');
      return;
    }

    if (khungTrong) khungTrong.classList.add('hidden');
    if (khungGioHang) khungGioHang.classList.remove('hidden');

    const danhSachMuc = $('#cart-items-list');
    if (danhSachMuc) {
      danhSachMuc.innerHTML = gioHang.map(item => createCartItemHtml(item)).join('');
    }

    this.updateTotalsSummary();
  },

  updateTotalsSummary() {
    const tamTinh = cartStore.getCartTotal();
    const phiVanChuyen = 0;
    const tongTien = tamTinh + phiVanChuyen;

    const oTamTinh = $('#cart-subtotal');
    const oTongTien = $('#cart-total');

    if (oTamTinh) oTamTinh.textContent = formatCurrency(tamTinh);
    if (oTongTien) oTongTien.textContent = formatCurrency(tongTien);
  },

  registerEventListeners() {

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.cart-qty-inc');
      if (!btn) return;

      const productId = btn.dataset.productId;
      const gioHang = cartStore.getCart();
      const item = gioHang.find(item => item.productId === productId);

      if (item) {
        cartStore.updateQuantity(productId, item.quantity + 1);
        this.renderCart();
      }
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.cart-qty-dec');
      if (!btn) return;

      const productId = btn.dataset.productId;
      const gioHang = cartStore.getCart();
      const item = gioHang.find(item => item.productId === productId);

      if (item) {
        cartStore.updateQuantity(productId, item.quantity - 1);
        this.renderCart();
      }
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.cart-remove-btn');
      if (!btn) return;

      const productId = btn.dataset.productId;
      cartStore.removeFromCart(productId);
      this.renderCart();
    });
  }
};
export default cartPage;
