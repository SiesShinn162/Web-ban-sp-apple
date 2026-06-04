

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

  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.productId === product._id || item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product._id || product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images && product.images[0] ? product.images[0] : 'img/apple-logo.png',
        quantity: quantity,
        stock: product.stock
      });
    }

    this.saveCart(cart);
  },

  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.productId !== productId);
    this.saveCart(cart);
  },

  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.productId === productId);

    if (item && quantity > 0) {
      item.quantity = quantity;
      this.saveCart(cart);
    } else if (item && quantity <= 0) {
      this.removeFromCart(productId);
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
