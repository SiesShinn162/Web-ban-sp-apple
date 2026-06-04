import { productApi } from '../services/productApi.js';
import { createProductCardHtml } from '../components/productCard.js';
import { $, $$ } from '../utils/dom.js';


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
      const ketQua = await productApi.getProducts(this.filters);
      let dsSanPham = ketQua.data || ketQua;

      if (!dsSanPham || dsSanPham.length === 0) {
        khungChua.innerHTML = '';
        if (khungTrong) khungTrong.classList.remove('hidden');
        if (tongSoLuong) tongSoLuong.textContent = 0;
      } else {
        khungChua.innerHTML = dsSanPham.map(p => createProductCardHtml(p)).join('');
        if (tongSoLuong) tongSoLuong.textContent = dsSanPham.length;
      }
    } catch (loi) {
      console.error('Lỗi khi tải danh mục sản phẩm:', loi);
      khungChua.innerHTML = '<div class="col-span-full text-center text-red-500 font-medium py-md">Không thể kết nối máy chủ để tải sản phẩm. Vui lòng thử lại sau.</div>';
      if (tongSoLuong) tongSoLuong.textContent = 0;
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
