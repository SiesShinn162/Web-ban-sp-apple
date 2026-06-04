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
    const dsSanPhamDaTru = [];
    let tamTinh = 0;

    try {
      for (const mucSanPham of items) {
        const sanPhamDb = await Product.findById(mucSanPham.productId);

        if (!sanPhamDb) {
          throw new Error(`Sản phẩm với ID ${mucSanPham.productId} không tồn tại.`);
        }

        let giaDuKien = sanPhamDb.price;
        if (sanPhamDb.slug === 'iphone-15-pro-max-256gb') {
          if (mucSanPham.name.endsWith('(128 GB)')) {
            giaDuKien = sanPhamDb.price - 4000000;
          } else if (mucSanPham.name.endsWith('(512 GB)')) {
            giaDuKien = sanPhamDb.price + 6000000;
          }
        } else if (sanPhamDb.slug === 'iphone-15-128gb') {
          if (mucSanPham.name.endsWith('(256 GB)')) {
            giaDuKien = sanPhamDb.price + 3000000;
          }
        }

        if (mucSanPham.price !== giaDuKien) {
          throw new Error(`Giá của sản phẩm "${mucSanPham.name}" đã thay đổi. Vui lòng cập nhật lại giỏ hàng.`);
        }

        const sanPhamCapNhat = await Product.findOneAndUpdate(
          { _id: mucSanPham.productId, stock: { $gte: mucSanPham.quantity } },
          { $inc: { stock: -mucSanPham.quantity } },
          { new: true }
        );

        if (!sanPhamCapNhat) {
          throw new Error(`Sản phẩm "${sanPhamDb.name}" không đủ hàng trong kho (Còn lại: ${sanPhamDb.stock}).`);
        }

        dsSanPhamDaTru.push({
          productId: mucSanPham.productId,
          quantity: mucSanPham.quantity
        });

        tamTinh += giaDuKien * mucSanPham.quantity;

        dsSanPhamKiemTra.push({
          productId: sanPhamDb._id,
          name: mucSanPham.name,
          price: giaDuKien,
          quantity: mucSanPham.quantity
        });
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

    } catch (loi) {
      for (const sanPhamDaTru of dsSanPhamDaTru) {
        await Product.findByIdAndUpdate(sanPhamDaTru.productId, {
          $inc: { stock: sanPhamDaTru.quantity }
        });
      }
      throw loi;
    }
  },

  async getOrderByCode(maDonHang) {
    const donHang = await orderRepository.findByCode(maDonHang);
    if (!donHang) {
      throw new Error(`Không tìm thấy đơn hàng với mã: ${maDonHang}`);
    }
    return donHang;
  }
};
