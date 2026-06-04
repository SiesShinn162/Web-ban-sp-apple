import { formatCurrency } from '../utils/formatCurrency.js';
import { renderStars } from '../utils/renderStars.js';

export function createProductCardHtml(product) {
  const imageUrl = product.images && product.images[0] ? product.images[0] : 'img/macbook-air.png';
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;

  return `
    <div class="group bg-white rounded-lg border border-neutral-200 p-lg flex flex-col justify-between transition-[box-shadow,transform] duration-300 hover:shadow-xl hover:-translate-y-1 snap-start" data-product-id="${product._id || product.id}">

      <!-- Image Container -->
      <a href="product-detail.html?slug=${product.slug}" class="block relative w-full pt-[100%] bg-canvas-parchment rounded-sm mb-md overflow-hidden">
        <img
          src="${imageUrl}"
          alt="${product.name}"
          width="200"
          height="200"
          loading="lazy"
          class="absolute inset-0 w-full h-full p-md object-contain drop-shadow-product transition-transform duration-500 group-hover:scale-105"
        >
        ${hasDiscount ? `
          <span class="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-sm py-0.5 rounded-pill">
            GIẢM GIÁ
          </span>
        ` : ''}
      </a>

      <!-- Product Meta Details -->
      <div class="flex-grow flex flex-col justify-between">
        <div>
          <span class="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-[2px]">${product.brand || 'HoangPhanStore'}</span>
          <a href="product-detail.html?slug=${product.slug}" class="block text-body-strong text-ink hover:text-primary transition-colors line-clamp-2 min-h-[44px]">
            ${product.name}
          </a>
          <!-- Rating Stars -->
          <div class="flex items-center gap-xxs mt-xxs mb-sm">
            <div class="flex text-amber-400">
              ${renderStars(product.rating || 5)}
            </div>
            <span class="text-[11px] text-neutral-400">(4)</span>
          </div>
        </div>

        <div>
          <!-- Prices -->
          <div class="flex items-baseline gap-xs mb-md">
            <span class="text-body-strong text-primary font-semibold">${formatCurrency(product.price)}</span>
            ${hasDiscount ? `
              <span class="text-[13px] text-neutral-400 line-through">${formatCurrency(product.oldPrice)}</span>
            ` : ''}
          </div>

          <!-- CTA Actions -->
          <div class="flex justify-between items-center pt-xs border-t border-neutral-100">
            <a href="product-detail.html?slug=${product.slug}" class="text-primary hover:underline text-caption-apple font-medium">
              Chi tiết
            </a>
            <button
              aria-label="Thêm ${product.name} vào giỏ hàng"
              class="add-to-cart-btn-card bg-primary text-white text-caption-apple rounded-pill px-sm py-1 font-semibold hover:bg-primary-focus btn-press-effect"
              data-product-id="${product._id || product.id}"
              data-product-name="${product.name}"
              data-product-price="${product.price}"
              data-product-image="${imageUrl}"
              data-product-slug="${product.slug}"
            >
              + Thêm
            </button>
          </div>
        </div>
      </div>

    </div>
  `;
}
