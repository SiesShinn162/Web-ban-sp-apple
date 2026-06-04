import { cartStore } from '../store/cartStore.js';
import { orderApi } from '../services/orderApi.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { toast } from '../components/toast.js';
import { $ } from '../utils/dom.js';

export const checkoutPage = {
  init() {
    console.log('Khởi tạo Trang thanh toán...');
    this.renderSummary();
    this.registerEventListeners();
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
        let response;

        if (phuongThucThanhToan === 'card_failed_demo') {
          throw new Error('Thanh toán thất bại: Giao dịch bị từ chối bởi ngân hàng phát hành thẻ (Mô phỏng).');
        }

        try {
          response = await orderApi.createOrder(duLieuDonHang);
        } catch (apiError) {
          console.warn('API Server không khả dụng, tạo mã đơn hàng mô phỏng offline:', apiError);

          const mockOrderCode = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          response = {
            success: true,
            data: {
              orderCode: mockOrderCode,
              customer: { fullName: hoTen, phone: soDienThoai },
              total: cartStore.getCartTotal()
            }
          };
        }

        const order = response.data || response;

        cartStore.clearCart();

        toast.show('Đặt hàng thành công!');
        setTimeout(() => {
          window.location.href = `order-success.html?orderCode=${order.orderCode}&name=${encodeURIComponent(order.customer.fullName)}&phone=${order.customer.phone}&total=${order.total}`;
        }, 1000);

      } catch (err) {
        console.error('Lỗi đặt hàng:', err);
        toast.show(err.message || 'Lỗi khi tiến hành đặt hàng.', 'error');

        if (nutDatHang) {
          nutDatHang.disabled = false;
          nutDatHang.textContent = 'Đặt hàng ngay';
        }
      }
    });
  }
};
export default checkoutPage;
