import { productApi } from '../services/productApi.js';
import { createProductCardHtml } from '../components/productCard.js';
import { $ } from '../utils/dom.js';

export const homePage = {
  async init() {
    console.log('Khởi tạo Trang chủ...');
    await this.loadFeaturedProducts();
    await this.loadAccessories();
    this.registerEventListeners();
  },

  async loadFeaturedProducts() {
    const khungChua = $('#featured-products-grid');
    if (!khungChua) return;

    try {
      const ketQua = await productApi.getProducts({ sort: 'featured' });
      const dsSanPham = ketQua.data || ketQua;

      if (dsSanPham && dsSanPham.length > 0) {
        khungChua.innerHTML = dsSanPham.map(p => createProductCardHtml(p)).join('');
      } else {
        khungChua.innerHTML = '<div class="col-span-full text-center text-neutral-400 py-md">Không có sản phẩm nổi bật nào.</div>';
      }
    } catch (loi) {
      console.error('Lỗi khi tải sản phẩm nổi bật:', loi);
      khungChua.innerHTML = '<div class="col-span-full text-center text-red-500 font-medium py-md">Không thể kết nối máy chủ để tải sản phẩm nổi bật.</div>';
    }
  },

  async loadAccessories() {
    const khungChua = $('#accessories-grid');
    if (!khungChua) return;

    try {
      const ketQua = await productApi.getProducts({ category: 'accessories' });
      const dsPhuKien = ketQua.data || ketQua;

      if (dsPhuKien && dsPhuKien.length > 0) {
        khungChua.innerHTML = dsPhuKien.map(p => createProductCardHtml(p)).join('');
      } else {
        khungChua.innerHTML = '<div class="col-span-full text-center text-neutral-400 py-md">Không có phụ kiện nào.</div>';
      }
    } catch (loi) {
      console.error('Lỗi khi tải phụ kiện:', loi);
      khungChua.innerHTML = '<div class="col-span-full text-center text-red-500 font-medium py-md">Không thể kết nối máy chủ để tải phụ kiện.</div>';
    }
  },

  registerEventListeners() {
    const oTimKiem = $('#global-search-input');
    if (oTimKiem) {
      oTimKiem.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const value = oTimKiem.value.trim();
          if (value) {
            window.location.href = `products.html?search=${encodeURIComponent(value)}`;
          }
        }
      });
    }
  }
};
