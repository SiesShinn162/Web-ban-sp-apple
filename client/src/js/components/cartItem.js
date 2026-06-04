import { formatCurrency } from '../utils/formatCurrency.js';

export function createCartItemHtml(item) {
  const itemTotal = item.price * item.quantity;

  return `
    <div class="flex flex-col sm:flex-row items-center justify-between gap-md bg-white rounded-lg p-md border border-neutral-200" data-product-id="${item.productId}">

      <!-- Left: Image & Info -->
      <div class="flex items-center gap-md w-full sm:w-auto">
        <a href="product-detail.html?slug=${item.slug}" class="block w-20 h-20 bg-canvas-parchment rounded-sm p-xs shrink-0 flex items-center justify-center">
          <img src="${item.image}" alt="${item.name}" width="80" height="80" class="w-full h-full object-contain drop-shadow-product">
        </a>
        <div class="min-w-0">
          <a href="product-detail.html?slug=${item.slug}" class="block text-body-strong text-ink hover:text-primary transition-colors font-semibold truncate max-w-[200px] sm:max-w-xs">
            ${item.name}
          </a>
          <span class="block text-caption-apple text-primary mt-xxs font-medium">${formatCurrency(item.price)}</span>
        </div>
      </div>

      <!-- Right: Quantity & Actions -->
      <div class="flex items-center justify-between sm:justify-end gap-lg w-full sm:w-auto border-t sm:border-t-0 pt-sm sm:pt-0">
        <!-- Quantity Selector -->
        <div class="flex items-center border border-neutral-200 rounded-pill h-8 px-xxs bg-canvas-parchment">
          <button class="cart-qty-dec w-6 h-6 rounded-full flex justify-center items-center text-ink hover:bg-neutral-200 font-semibold btn-press-effect" data-product-id="${item.productId}">-</button>
          <input type="number" class="cart-qty-input w-8 text-center bg-transparent text-caption-apple font-semibold focus:outline-none" value="${item.quantity}" readonly>
          <button class="cart-qty-inc w-6 h-6 rounded-full flex justify-center items-center text-ink hover:bg-neutral-200 font-semibold btn-press-effect" data-product-id="${item.productId}">+</button>
        </div>

        <!-- Subtotal price -->
        <div class="text-right min-w-[100px]">
          <span class="block text-body-strong text-ink font-semibold">${formatCurrency(itemTotal)}</span>
        </div>

        <!-- Delete button -->
        <button aria-label="Xóa ${item.name} khỏi giỏ hàng" class="cart-remove-btn text-neutral-400 hover:text-red-500 transition-colors btn-press-effect" data-product-id="${item.productId}" title="Xóa khỏi giỏ hàng">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>

    </div>
  `;
}
