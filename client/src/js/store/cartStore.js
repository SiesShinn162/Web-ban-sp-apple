

import { toast } from '../components/toast.js';

const LOCAL_STORAGE_KEY = 'istore_shopping_cart';

export const cartStore = {
  getCart() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Lỗi khi đọc giỏ hàng từ localStorage:', e);
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));

      window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
    } catch (e) {
      console.error('Lỗi khi lưu giỏ hàng vào localStorage:', e);
    }
  },

  addToCart(sanPham, soLuong = 1) {
    const gioHang = this.getCart();
    const mucDaCo = gioHang.find(muc => muc.productId === sanPham._id || muc.productId === sanPham.id);
    const tonKhoToiDa = sanPham.stock !== undefined ? sanPham.stock : 0;

    if (tonKhoToiDa <= 0) {
      toast.show(`Sản phẩm "${sanPham.name}" đã hết hàng!`, 'error');
      return;
    }

    if (mucDaCo) {
      if (mucDaCo.quantity >= tonKhoToiDa) {
        toast.show(`Sản phẩm "${sanPham.name}" đã đạt giới hạn tồn kho trong giỏ hàng (Tối đa: ${tonKhoToiDa})!`, 'error');
        mucDaCo.quantity = tonKhoToiDa;
      } else if (mucDaCo.quantity + soLuong > tonKhoToiDa) {
        const soLuongThem = tonKhoToiDa - mucDaCo.quantity;
        mucDaCo.quantity = tonKhoToiDa;
        toast.show(`Đã thêm tối đa ${soLuongThem} sản phẩm "${sanPham.name}" vào giỏ (Đạt giới hạn tồn kho: ${tonKhoToiDa})!`, 'error');
      } else {
        mucDaCo.quantity += soLuong;
        toast.show(`Đã thêm ${soLuong} sản phẩm "${sanPham.name}" vào giỏ hàng thành công!`);
      }
    } else {
      let soLuongCuoi = soLuong;
      if (soLuongCuoi > tonKhoToiDa) {
        soLuongCuoi = tonKhoToiDa;
        toast.show(`Đã thêm tối đa ${soLuongCuoi} sản phẩm "${sanPham.name}" vào giỏ (Đạt giới hạn tồn kho: ${tonKhoToiDa})!`, 'error');
      } else {
        toast.show(`Đã thêm ${soLuongCuoi} sản phẩm "${sanPham.name}" vào giỏ hàng thành công!`);
      }
      gioHang.push({
        productId: sanPham._id || sanPham.id,
        name: sanPham.name,
        slug: sanPham.slug,
        price: sanPham.price,
        image: sanPham.images && sanPham.images[0] ? sanPham.images[0] : 'img/apple-logo.png',
        quantity: soLuongCuoi,
        stock: tonKhoToiDa
      });
    }

    this.saveCart(gioHang);
  },

  removeFromCart(maSanPham) {
    let gioHang = this.getCart();
    gioHang = gioHang.filter(muc => muc.productId !== maSanPham);
    this.saveCart(gioHang);
  },

  updateQuantity(maSanPham, soLuong) {
    const gioHang = this.getCart();
    const mucGioHang = gioHang.find(muc => muc.productId === maSanPham);

    if (mucGioHang) {
      const tonKhoToiDa = mucGioHang.stock !== undefined ? mucGioHang.stock : 0;
      if (soLuong > tonKhoToiDa) {
        soLuong = tonKhoToiDa;
        toast.show(`Chỉ còn tối đa ${tonKhoToiDa} sản phẩm trong kho!`, 'error');
      }

      if (soLuong > 0) {
        mucGioHang.quantity = soLuong;
        this.saveCart(gioHang);
      } else {
        this.removeFromCart(maSanPham);
      }
    }
  },

  clearCart() {
    this.saveCart([]);
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
};
