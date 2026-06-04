import { productApi } from '../services/productApi.js';
import { createProductCardHtml } from '../components/productCard.js';
import { $, $$ } from '../utils/dom.js';

const ALL_MOCK = [
  { id: 'p1', name: 'iPhone 15 Pro Max 256GB', slug: 'iphone-15-pro-max-256gb', brand: 'Apple', category: 'phones', price: 29990000, oldPrice: 34990000, rating: 5, stock: 15, images: ['img/apple-watch-6.png'] },
  { id: 'p2', name: 'iPhone 15 128GB', slug: 'iphone-15-128gb', brand: 'Apple', category: 'phones', price: 19990000, oldPrice: 22990000, rating: 4, stock: 20, images: ['img/apple-watch-6.png'] },
  { id: 'p3', name: 'MacBook Air 13-inch M2', slug: 'macbook-air-13-inch-m2', brand: 'Apple', category: 'laptops', price: 26990000, oldPrice: 29990000, rating: 5, stock: 10, images: ['img/macbook-air.png'] },
  { id: 'p4', name: 'iPad Air 5 M1 64GB', slug: 'ipad-air-5-m1-64gb', brand: 'Apple', category: 'laptops', price: 14990000, oldPrice: 16990000, rating: 4, stock: 12, images: ['img/ipad-air.png'] },
  { id: 'a1', name: 'Apple Watch Series 6 LTE', slug: 'apple-watch-series-6-lte', brand: 'Apple', category: 'accessories', price: 8990000, oldPrice: 10990000, rating: 4, stock: 25, images: ['img/apple-watch-6.png'] },
  { id: 'a2', name: 'Ốp lưng iPhone MagSafe', slug: 'op-lung-iphone-magsafe', brand: 'Apple', category: 'accessories', price: 1490000, oldPrice: 1690000, rating: 5, stock: 50, images: ['img/apple-card.png'] },
];

export const productsPage = {
  filters: {
    category: 'all',
    search: '',
    sort: 'featured'
  },

  async init() {
    console.log('Khởi tạo Trang danh sách sản phẩm...');
    this.parseUrlParameters();
    this.setupFiltersUi();
    await this.loadCatalog();
    this.registerEventListeners();
  },

  parseUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    this.filters.category = params.get('category') || 'all';
    this.filters.search = params.get('search') || '';
    this.filters.sort = params.get('sort') || 'featured';

    const oNhapTimKiem = $('#products-search-input');
    if (oNhapTimKiem) oNhapTimKiem.value = this.filters.search;

    const chonSapXep = $('#sort-select');
    if (chonSapXep) chonSapXep.value = this.filters.sort;
  },

  setupFiltersUi() {
    const dsNutPhanLoai = $$('#category-filter-chips button');
    dsNutPhanLoai.forEach(nut => {
      const cat = nut.dataset.category;
      if (cat === this.filters.category) {
        nut.className = 'px-md py-xxs rounded-pill bg-primary text-white text-caption-apple btn-press-effect font-medium';
      } else {
        nut.className = 'px-md py-xxs rounded-pill bg-canvas-parchment hover:bg-neutral-200 text-ink text-caption-apple btn-press-effect';
      }
    });

    const thanhHuongDan = $('#category-title-breadcrumb');
    if (thanhHuongDan) {
      const titles = { all: 'Tất cả sản phẩm', phones: 'Điện thoại', laptops: 'Laptops', accessories: 'Phụ kiện' };
      thanhHuongDan.textContent = titles[this.filters.category] || 'Sản phẩm';
    }
  },

  async loadCatalog() {
    const khungChua = $('#products-catalog-grid');
    const khungTrong = $('#products-empty-state');
    const tongSoLuong = $('#products-count');
    if (!khungChua) return;

    khungChua.innerHTML = '<div class="col-span-full text-center text-neutral-400 py-md">Đang tải sản phẩm…</div>';
    if (khungTrong) khungTrong.classList.add('hidden');

    try {
      const data = await productApi.getProducts(this.filters);
      let dsSanPham = data.data || data;

      if (!dsSanPham || dsSanPham.length === 0) {
        this.renderOfflineFallback(khungChua, khungTrong, tongSoLuong);
      } else {
        khungChua.innerHTML = dsSanPham.map(p => createProductCardHtml(p)).join('');
        if (tongSoLuong) tongSoLuong.textContent = dsSanPham.length;
      }
    } catch (e) {
      console.warn('Không thể kết nối API Server, sử dụng dữ liệu mẫu cho danh mục:', e);
      this.renderOfflineFallback(khungChua, khungTrong, tongSoLuong);
    }
  },

  renderOfflineFallback(khungChua, khungTrong, tongSoLuong) {
    let dsSanPham = [...ALL_MOCK];

    if (this.filters.category !== 'all') {
      dsSanPham = dsSanPham.filter(p => p.category === this.filters.category);
    }

    if (this.filters.search) {
      const query = this.filters.search.toLowerCase();
      dsSanPham = dsSanPham.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));
    }

    if (this.filters.sort === 'price-asc') {
      dsSanPham.sort((a, b) => a.price - b.price);
    } else if (this.filters.sort === 'price-desc') {
      dsSanPham.sort((a, b) => b.price - a.price);
    } else if (this.filters.sort === 'rating') {
      dsSanPham.sort((a, b) => b.rating - a.rating);
    }

    if (dsSanPham.length === 0) {
      khungChua.innerHTML = '';
      if (khungTrong) khungTrong.classList.remove('hidden');
      if (tongSoLuong) tongSoLuong.textContent = 0;
    } else {
      khungChua.innerHTML = dsSanPham.map(p => createProductCardHtml(p)).join('');
      if (tongSoLuong) tongSoLuong.textContent = dsSanPham.length;
    }
  },

  registerEventListeners() {
    const filterChips = $('#category-filter-chips');
    if (filterChips) {
      filterChips.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        this.filters.category = btn.dataset.category;
        this.updateUrl();
        this.setupFiltersUi();
        this.loadCatalog();
      });
    }

    const oNhapTimKiem = $('#products-search-input');
    if (oNhapTimKiem) {
      oNhapTimKiem.addEventListener('input', (e) => {
        this.filters.search = e.target.value.trim();
        this.updateUrl();
        this.loadCatalog();
      });
    }

    const chonSapXep = $('#sort-select');
    if (chonSapXep) {
      chonSapXep.addEventListener('change', (e) => {
        this.filters.sort = e.target.value;
        this.updateUrl();
        this.loadCatalog();
      });
    }

    const resetBtn = $('#reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.filters.category = 'all';
        this.filters.search = '';
        this.filters.sort = 'featured';
        if (oNhapTimKiem) oNhapTimKiem.value = '';
        if (chonSapXep) chonSapXep.value = 'featured';
        this.updateUrl();
        this.setupFiltersUi();
        this.loadCatalog();
      });
    }
  },

  updateUrl() {
    const params = new URLSearchParams();
    if (this.filters.category !== 'all') params.set('category', this.filters.category);
    if (this.filters.search) params.set('search', this.filters.search);
    if (this.filters.sort !== 'featured') params.set('sort', this.filters.sort);

    const newPath = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newPath);
  }
};
