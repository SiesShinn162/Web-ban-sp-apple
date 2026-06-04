import { cartStore } from '../store/cartStore.js';
import { createCartItemHtml } from '../components/cartItem.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { $ } from '../utils/dom.js';

export const cartPage = {
  init() {
    console.log('Khởi tạo Trang giỏ hàng...');
    this.renderCart();
    this.registerEventListeners();
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
