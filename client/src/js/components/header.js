import { cartStore } from '../store/cartStore.js';
import { $ } from '../utils/dom.js';

export function renderHeader(activePage = '') {
  const headerContainer = $('#header-container');
  if (!headerContainer) return;

  const cartCount = cartStore.getCartCount();

  let subNavTitle = 'HoangPhanStore';
  let subNavCta = `<a href="products.html" class="bg-primary text-white rounded-pill px-md py-1 text-button-utility hover:bg-primary-focus btn-press-effect">Mua sắm</a>`;

  if (window.location.pathname.includes('products.html')) {
    subNavTitle = 'Sản phẩm';
    subNavCta = '';
  } else if (window.location.pathname.includes('product-detail.html')) {
    subNavTitle = 'Chi tiết thiết bị';
    subNavCta = `<button id="sub-nav-buy-btn" class="bg-primary text-white rounded-pill px-md py-1 text-button-utility hover:bg-primary-focus btn-press-effect">Mua</button>`;
  } else if (window.location.pathname.includes('cart.html')) {
    subNavTitle = 'Giỏ hàng';
    subNavCta = `<a href="checkout.html" class="bg-primary text-white rounded-pill px-md py-1 text-button-utility hover:bg-primary-focus btn-press-effect">Thanh toán</a>`;
  } else if (window.location.pathname.includes('checkout.html')) {
    subNavTitle = 'Thanh toán';
    subNavCta = '';
  }

  headerContainer.innerHTML = `
    <!-- Global Nav (Top Thin Black Bar) -->
    <nav class="bg-surface-black text-white h-11 relative z-50">
      <div class="max-w-[1440px] mx-auto px-4 md:px-8 h-full flex justify-between items-center text-nav-link">

        <!-- Logo -->
        <a href="index.html" class="hover:opacity-80 transition-opacity flex items-center gap-xxs font-bold text-sm tracking-wider">
          <img src="img/apple-logo.png" alt="HoangPhanStore" width="16" height="16" class="w-4 h-4 invert filter brightness-200">
          <span>HoangPhanStore</span>
        </a>

        <!-- Desktop Menu links -->
        <div class="hidden md:flex items-center gap-xl">
          <a href="index.html" class="hover:text-neutral-300 transition-colors ${activePage === 'home' ? 'text-neutral-300 font-semibold' : 'text-neutral-400'}">Trang chủ</a>
          <a href="products.html" class="hover:text-neutral-300 transition-colors ${activePage === 'products' ? 'text-neutral-300 font-semibold' : 'text-neutral-400'}">Điện thoại</a>
          <a href="products.html?category=laptops" class="hover:text-neutral-300 transition-colors">Laptops</a>
          <a href="products.html?category=accessories" class="hover:text-neutral-300 transition-colors">Phụ kiện</a>
        </div>

        <!-- Right utility cluster -->
        <div class="flex items-center gap-lg">
          <!-- Cart Icon -->
          <a href="cart.html" aria-label="Giỏ hàng" class="relative hover:opacity-80 transition-opacity flex items-center">
            <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span id="header-cart-badge" aria-live="polite" class="absolute -top-1 -right-2 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${cartCount === 0 ? 'hidden' : ''}">
              ${cartCount}
            </span>
          </a>

          <!-- Hamburger menu trigger (mobile only) -->
          <button id="mobile-menu-btn" aria-label="Mở thực đơn di động" class="md:hidden text-neutral-400 hover:text-white focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Tray (hidden by default) -->
      <div id="mobile-menu" class="hidden absolute top-11 left-0 right-0 bg-surface-black/95 backdrop-blur-xl border-t border-neutral-800 flex flex-col p-lg gap-md text-caption-apple z-50">
        <a href="index.html" class="text-neutral-300 hover:text-white py-xxs border-b border-neutral-900">Trang chủ</a>
        <a href="products.html" class="text-neutral-300 hover:text-white py-xxs border-b border-neutral-900">Điện thoại</a>
        <a href="products.html?category=laptops" class="text-neutral-300 hover:text-white py-xxs border-b border-neutral-900">Laptops</a>
        <a href="products.html?category=accessories" class="text-neutral-300 hover:text-white py-xxs border-b border-neutral-900">Phụ kiện</a>
      </div>
    </nav>

    <!-- Sub Nav (Bottom Thin Frosted Bar) -->
    <div class="h-[52px] bg-canvas-parchment/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-40">
      <div class="max-w-[1440px] mx-auto px-4 md:px-8 h-full flex justify-between items-center">
        <span class="text-tagline font-semibold text-ink">${subNavTitle}</span>
        <div class="flex items-center gap-md">
          <div class="hidden sm:flex items-center gap-md text-button-utility text-neutral-500">
            <a href="index.html" class="hover:text-primary">Tổng quan</a>
            <a href="#brand-values" class="hover:text-primary">Đặc quyền</a>
          </div>
          ${subNavCta}
        </div>
      </div>
    </div>
  `;

  const mobileMenuBtn = $('#mobile-menu-btn', headerContainer);
  const mobileMenu = $('#mobile-menu', headerContainer);

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  window.addEventListener('cart-updated', (event) => {
    const newCount = cartStore.getCartCount();
    const badge = $('#header-cart-badge');
    if (badge) {
      badge.textContent = newCount;
      if (newCount === 0) {
        badge.classList.add('hidden');
      } else {
        badge.classList.remove('hidden');
      }
    }
  });
}
