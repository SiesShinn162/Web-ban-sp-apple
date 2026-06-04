import { productApi } from '../services/productApi.js';
import { createProductCardHtml } from '../components/productCard.js';
import { $ } from '../utils/dom.js';

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'iPhone 15 Pro Max 256GB', slug: 'iphone-15-pro-max-256gb', brand: 'Apple', category: 'phones', price: 29990000, oldPrice: 34990000, rating: 5, stock: 15, images: ['img/apple-watch-6.png'], description: 'Siêu phẩm mới nhất của Apple với khung Titanium siêu bền và chip A17 Pro mạnh mẽ.' },
  { id: 'p2', name: 'iPhone 15 128GB', slug: 'iphone-15-128gb', brand: 'Apple', category: 'phones', price: 19990000, oldPrice: 22990000, rating: 4, stock: 20, images: ['img/apple-watch-6.png'], description: 'Thiết kế đẹp với Dynamic Island và camera 48MP cực sắc nét.' },
  { id: 'p3', name: 'MacBook Air 13-inch M2', slug: 'macbook-air-13-inch-m2', brand: 'Apple', category: 'laptops', price: 26990000, oldPrice: 29990000, rating: 5, stock: 10, images: ['img/macbook-air.png'], description: 'Mỏng nhẹ phi thường, hiệu năng vượt trội với chip M2 thế hệ mới.' },
  { id: 'p4', name: 'iPad Air 5 M1 64GB', slug: 'ipad-air-5-m1-64gb', brand: 'Apple', category: 'laptops', price: 14990000, oldPrice: 16990000, rating: 4, stock: 12, images: ['img/ipad-air.png'], description: 'Lựa chọn tuyệt vời cho công việc và giải trí với chip M1 đỉnh cao.' },
];

const MOCK_ACCESSORIES = [
  { id: 'a1', name: 'Apple Watch Series 6 LTE', slug: 'apple-watch-series-6-lte', brand: 'Apple', category: 'accessories', price: 8990000, oldPrice: 10990000, rating: 4, stock: 25, images: ['img/apple-watch-6.png'] },
  { id: 'a2', name: 'Ốp lưng iPhone MagSafe', slug: 'op-lung-iphone-magsafe', brand: 'Apple', category: 'accessories', price: 1490000, oldPrice: 1690000, rating: 5, stock: 50, images: ['img/apple-card.png'] },
];

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
      const data = await productApi.getProducts({ sort: 'featured' });
      const dsSanPham = data.data || data;

      if (dsSanPham && dsSanPham.length > 0) {
        khungChua.innerHTML = dsSanPham.map(p => createProductCardHtml(p)).join('');
      } else {
        khungChua.innerHTML = MOCK_PRODUCTS.map(p => createProductCardHtml(p)).join('');
      }
    } catch (e) {
      console.warn('Không thể kết nối API Server, sử dụng dữ liệu mẫu cho Trang chủ:', e);
      khungChua.innerHTML = MOCK_PRODUCTS.map(p => createProductCardHtml(p)).join('');
    }
  },

  async loadAccessories() {
    const khungChua = $('#accessories-grid');
    if (!khungChua) return;

    try {
      const data = await productApi.getProducts({ category: 'accessories' });
      const dsPhuKien = data.data || data;

      if (dsPhuKien && dsPhuKien.length > 0) {
        khungChua.innerHTML = dsPhuKien.map(p => createProductCardHtml(p)).join('');
      } else {
        khungChua.innerHTML = MOCK_ACCESSORIES.map(p => createProductCardHtml(p)).join('');
      }
    } catch (e) {
      khungChua.innerHTML = MOCK_ACCESSORIES.map(p => createProductCardHtml(p)).join('');
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
