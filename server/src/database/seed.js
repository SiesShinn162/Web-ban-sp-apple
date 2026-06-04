import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { Product } from '../modules/products/product.model.js';
import { Category } from '../modules/categories/category.model.js';

const SEED_CATEGORIES = [
  { name: 'Điện thoại', slug: 'phones', description: 'Các mẫu smartphone cao cấp mới nhất' },
  { name: 'Laptops', slug: 'laptops', description: 'Máy tính xách tay mỏng nhẹ, mạnh mẽ' },
  { name: 'Phụ kiện', slug: 'accessories', description: 'Bao da, ốp lưng, tai nghe và cáp sạc' }
];

const SEED_PRODUCTS = [
  {
    name: 'iPhone 15 Pro Max 256GB',
    slug: 'iphone-15-pro-max-256gb',
    brand: 'Apple',
    category: 'phones',
    price: 29990000,
    oldPrice: 34990000,
    images: ['img/apple-watch-6.png'],
    rating: 5,
    stock: 15,
    isFeatured: true,
    description: 'Siêu phẩm mới nhất của Apple với khung Titanium siêu bền và chip A17 Pro mạnh mẽ.',
    specs: {
      'Màn hình': '6.7 inch, Super Retina XDR OLED',
      'Hệ điều hành': 'iOS 17',
      'Chipset': 'Apple A17 Pro 6 nhân',
      'RAM': '8 GB',
      'Bộ nhớ trong': '256 GB'
    }
  },
  {
    name: 'iPhone 15 128GB',
    slug: 'iphone-15-128gb',
    brand: 'Apple',
    category: 'phones',
    price: 19990000,
    oldPrice: 22990000,
    images: ['img/apple-watch-6.png'],
    rating: 4,
    stock: 20,
    isFeatured: true,
    description: 'Thiết kế đẹp với Dynamic Island và camera 48MP cực sắc nét.',
    specs: {
      'Màn hình': '6.1 inch, Super Retina XDR OLED',
      'Hệ điều hành': 'iOS 17',
      'Chipset': 'Apple A16 Bionic 6 nhân',
      'RAM': '6 GB',
      'Bộ nhớ trong': '128 GB'
    }
  },
  {
    name: 'MacBook Air 13-inch M2',
    slug: 'macbook-air-13-inch-m2',
    brand: 'Apple',
    category: 'laptops',
    price: 26990000,
    oldPrice: 29990000,
    images: ['img/macbook-air.png'],
    rating: 5,
    stock: 10,
    isFeatured: true,
    description: 'Mỏng nhẹ phi thường, hiệu năng vượt trội với chip M2 thế hệ mới.',
    specs: {
      'Kích thước màn hình': '13.6 inch Liquid Retina',
      'Chipset': 'Apple M2 8 nhân',
      'RAM': '8 GB',
      'SSD': '256 GB'
    }
  },
  {
    name: 'iPad Air 5 M1 64GB',
    slug: 'ipad-air-5-m1-64gb',
    brand: 'Apple',
    category: 'laptops',
    price: 14990000,
    oldPrice: 16990000,
    images: ['img/ipad-air.png'],
    rating: 4,
    stock: 12,
    isFeatured: true,
    description: 'Lựa chọn tuyệt vời cho công việc và giải trí với chip M1 đỉnh cao.',
    specs: {
      'Màn hình': '10.9 inch Liquid Retina',
      'Chipset': 'Apple M1 8 nhân',
      'RAM': '8 GB',
      'Bộ nhớ trong': '64 GB'
    }
  },
  {
    name: 'Apple Watch Series 6 LTE',
    slug: 'apple-watch-series-6-lte',
    brand: 'Apple',
    category: 'accessories',
    price: 8990000,
    oldPrice: 10990000,
    images: ['img/apple-watch-6.png'],
    rating: 4,
    stock: 25,
    isFeatured: false,
    description: 'Đo nồng độ oxy trong máu, nhịp tim điện tâm đồ ECG.',
    specs: {
      'Màn hình': 'OLED Always-On',
      'Kết nối': 'LTE (eSIM) + GPS'
    }
  },
  {
    name: 'Ốp lưng iPhone MagSafe',
    slug: 'op-lung-iphone-magsafe',
    brand: 'Apple',
    category: 'accessories',
    price: 1490000,
    oldPrice: 1690000,
    images: ['img/apple-card.png'],
    rating: 5,
    stock: 50,
    isFeatured: false,
    description: 'Ốp silicone trong suốt chống sốc hỗ trợ sạc hít nam châm MagSafe siêu nhạy.',
    specs: {
      'Chất liệu': 'Silicone cao cấp',
      'Hỗ trợ': 'MagSafe Wireless Charging'
    }
  }
];

async function seed() {
  try {
    console.log('Đang kết nối MongoDB...');
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('Kết nối thành công. Bắt đầu dọn dẹp dữ liệu cũ...');

    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Đã dọn dẹp các collection cũ.');

    const categories = await Category.insertMany(SEED_CATEGORIES);
    console.log(`Đã nạp thành công ${categories.length} danh mục.`);

    const products = await Product.insertMany(SEED_PRODUCTS);
    console.log(`Đã nạp thành công ${products.length} sản phẩm.`);

    console.log('Hoàn thành quá trình nạp dữ liệu mẫu!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi nạp dữ liệu mẫu:', error);
    process.exit(1);
  }
}

seed();
