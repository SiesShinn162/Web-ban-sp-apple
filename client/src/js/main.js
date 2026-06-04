import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { homePage } from './pages/homePage.js';
import { productsPage } from './pages/productsPage.js';
import { productDetailPage } from './pages/productDetailPage.js';
import { cartPage } from './pages/cartPage.js';
import { checkoutPage } from './pages/checkoutPage.js';
import { formatCurrency } from './utils/formatCurrency.js';
import { cartStore } from './store/cartStore.js';
import { toast } from './components/toast.js';
import { $ } from './utils/dom.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Khởi chạy ứng dụng HoangPhanStore Client...');

  const path = window.location.pathname;
  let activeMenu = 'home';

  if (path.includes('products.html')) activeMenu = 'products';
  else if (path.includes('product-detail.html')) activeMenu = 'detail';
  else if (path.includes('cart.html')) activeMenu = 'cart';
  else if (path.includes('checkout.html')) activeMenu = 'checkout';
  else if (path.includes('order-success.html')) activeMenu = 'success';

  renderHeader(activeMenu);
  renderFooter();

  if (path.includes('products.html')) {
    productsPage.init();
  } else if (path.includes('product-detail.html')) {
    productDetailPage.init();
  } else if (path.includes('cart.html')) {
    cartPage.init();
  } else if (path.includes('checkout.html')) {
    checkoutPage.init();
  } else if (path.includes('order-success.html')) {
    renderOrderSuccessDetails();
  } else {

    homePage.init();
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn-card');
    if (!btn) return;

    e.preventDefault();

    try {
      const productId = btn.dataset.productId;
      const name = btn.dataset.productName;
      const price = parseInt(btn.dataset.productPrice, 10);
      const img = btn.dataset.productImage;
      const slug = btn.dataset.productSlug || '';

      if (!productId || !name || isNaN(price)) {
        console.error('Thông tin sản phẩm trên nút Thêm không hợp lệ:', btn.dataset);
        return;
      }

      const productData = {
        id: productId,
        _id: productId,
        name,
        price,
        images: [img],
        slug,
        stock: 99
      };

      cartStore.addToCart(productData, 1);
      toast.show(`Đã thêm "${name}" vào giỏ hàng thành công!`);
    } catch (err) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng từ nút Card:', err);
    }
  });
});

function renderOrderSuccessDetails() {
  const params = new URLSearchParams(window.location.search);
  const orderCode = params.get('orderCode') || 'N/A';
  const name = params.get('name') || 'Khách hàng';
  const phone = params.get('phone') || 'N/A';
  const total = parseInt(params.get('total') || '0', 10);

  const codeEl = $('#success-order-code');
  const nameEl = $('#success-customer-name');
  const phoneEl = $('#success-customer-phone');
  const totalEl = $('#success-order-total');

  if (codeEl) codeEl.textContent = orderCode;
  if (nameEl) nameEl.textContent = name;
  if (phoneEl) phoneEl.textContent = phone;
  if (totalEl) totalEl.textContent = formatCurrency(total);
}
