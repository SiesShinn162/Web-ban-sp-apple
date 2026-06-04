import { orderRepository } from './order.repository.js';
import { Product } from '../products/product.model.js';
import { generateOrderCode } from '../../shared/utils/generateOrderCode.js';

export const orderService = {
  async createOrder(duLieuDonHang) {
    const { customer, items, paymentMethod } = duLieuDonHang;

    if (!items || items.length === 0) {
      throw new Error('Đơn hàng phải chứa ít nhất một sản phẩm.');
    }

    const dsSanPhamKiemTra = [];
    let tamTinh = 0;

    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);

      if (!dbProduct) {
        throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại.`);
      }

      if (dbProduct.stock < item.quantity) {
        throw new Error(`Sản phẩm "${dbProduct.name}" không đủ hàng trong kho (Còn lại: ${dbProduct.stock}).`);
      }

      const actualPrice = dbProduct.price;
      tamTinh += actualPrice * item.quantity;

      dsSanPhamKiemTra.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        price: actualPrice,
        quantity: item.quantity
      });

      dbProduct.stock -= item.quantity;
      await dbProduct.save();
    }

    const phiVanChuyen = 0;
    const tongTien = tamTinh + phiVanChuyen;

    const maDonHang = generateOrderCode();

    const duLieuDonHangMoi = {
      orderCode: maDonHang,
      customer,
      items: dsSanPhamKiemTra,
      subtotal: tamTinh,
      shippingFee: phiVanChuyen,
      total: tongTien,
      paymentMethod,
      status: 'pending'
    };

    return await orderRepository.create(duLieuDonHangMoi);
  },

  async getOrderByCode(maDonHang) {
    const donHang = await orderRepository.findByCode(maDonHang);
    if (!donHang) {
      throw new Error(`Không tìm thấy đơn hàng với mã: ${maDonHang}`);
    }
    return donHang;
  }
};
