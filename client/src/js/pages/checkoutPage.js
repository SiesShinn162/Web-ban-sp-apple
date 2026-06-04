import { cartStore } from '../store/cartStore.js';
import { orderApi } from '../services/orderApi.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { toast } from '../components/toast.js';
import { $ } from '../utils/dom.js';
import { productApi } from '../services/productApi.js';

export const checkoutPage = {
  async init() {
    console.log('Khởi tạo Trang thanh toán...');
    try {
      await this.syncCartWithServer();
      this.renderSummary();
      this.registerEventListeners();
    } catch (e) {
      console.error('Không khởi chạy được trang thanh toán do lỗi hệ thống:', e);
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
        toast.show('Giỏ hàng đã được tự động cập nhật theo giá/tồn kho mới nhất.', 'info');
      }
    } catch (loi) {
      console.error('Không thể kết nối máy chủ để xác thực giỏ hàng:', loi);
      this.showErrorState('Không thể kết nối máy chủ để xác thực thông tin thanh toán. Vui lòng thử lại sau.');
      throw loi;
    }
  },

  showErrorState(msg) {
    const khungThanhToan = $('#checkout-container');
    const khungTrong = $('#checkout-empty-state');
    if (khungThanhToan) khungThanhToan.classList.add('hidden');
    if (khungTrong) {
      khungTrong.innerHTML = `
        <div class="text-xxl mb-sm">⚠️</div>
        <h3 class="text-tagline mb-xxs text-ink">Lỗi kết nối máy chủ</h3>
        <p class="text-caption-apple text-neutral-500 mb-lg">${msg}</p>
        <a href="cart.html" class="bg-primary text-white rounded-pill px-lg py-xs text-button-utility hover:bg-primary-focus btn-press-effect inline-block">
          Quay lại giỏ hàng
        </a>
      `;
      khungTrong.classList.remove('hidden');
    }
  },

  renderSummary() {
    const gioHang = cartStore.getCart();
    const khungThanhToan = $('#checkout-container');
    const khungTrong = $('#checkout-empty-state');

    if (gioHang.length === 0) {
      if (khungThanhToan) khungThanhToan.classList.add('hidden');
      if (khungTrong) khungTrong.classList.remove('hidden');
      return;
    }

    if (khungTrong) khungTrong.classList.add('hidden');
    if (khungThanhToan) khungThanhToan.classList.remove('hidden');

    const danhSachMuc = $('#checkout-items-list');
    if (danhSachMuc) {
      danhSachMuc.innerHTML = gioHang.map(item => `
        <div class="flex items-center justify-between py-sm text-caption-apple gap-sm">
          <div class="flex items-center gap-sm">
            <span class="text-neutral-500 font-semibold">${item.quantity}x</span>
            <span class="text-ink truncate max-w-[200px]">${item.name}</span>
          </div>
          <span class="text-ink font-semibold">${formatCurrency(item.price * item.quantity)}</span>
        </div>
      `).join('');
    }

    const tamTinh = cartStore.getCartTotal();
    const tongTien = tamTinh;

    const oTamTinh = $('#checkout-subtotal');
    const oTongTien = $('#checkout-total');

    if (oTamTinh) oTamTinh.textContent = formatCurrency(tamTinh);
    if (oTongTien) oTongTien.textContent = formatCurrency(tongTien);
  },

  registerEventListeners() {
    const form = $('#checkout-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const gioHang = cartStore.getCart();
      if (gioHang.length === 0) {
        toast.show('Giỏ hàng của bạn đang trống!', 'error');
        return;
      }

      const nutDatHang = $('#place-order-btn');
      if (nutDatHang) {
        nutDatHang.disabled = true;
        nutDatHang.textContent = 'Đang đặt hàng…';
      }

      const hoTen = $('#fullName').value.trim();
      const soDienThoai = $('#phone').value.trim();
      const thuDienTu = $('#email').value.trim();
      const diaChi = $('#address').value.trim();
      const phuongThucThanhToan = $('input[name="paymentMethod"]:checked').value;

      const duLieuDonHang = {
        customer: { fullName: hoTen, phone: soDienThoai, email: thuDienTu, address: diaChi },
        items: gioHang.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        paymentMethod: phuongThucThanhToan
      };

      try {
        if (phuongThucThanhToan === 'card_failed_demo') {
          throw new Error('Thanh toán thất bại: Giao dịch bị từ chối bởi ngân hàng phát hành thẻ (Mô phỏng).');
        }

        const ketQuaPhanHoi = await orderApi.createOrder(duLieuDonHang);

        const donHang = ketQuaPhanHoi.data || ketQuaPhanHoi;

        cartStore.clearCart();

        toast.show('Đặt hàng thành công!');
        setTimeout(() => {
          window.location.href = `order-success.html?orderCode=${donHang.orderCode}&name=${encodeURIComponent(donHang.customer.fullName)}&phone=${donHang.customer.phone}&total=${donHang.total}`;
        }, 1000);

      } catch (loi) {
        console.error('Lỗi đặt hàng:', loi);
        toast.show(loi.message || 'Lỗi khi tiến hành đặt hàng.', 'error');

        if (nutDatHang) {
          nutDatHang.disabled = false;
          nutDatHang.textContent = 'Đặt hàng ngay';
        }
      }
    });
  }
};
export default checkoutPage;
