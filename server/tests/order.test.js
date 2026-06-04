import test from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import { Product } from '../src/modules/products/product.model.js';
import { Order } from '../src/modules/orders/order.model.js';
import { orderService } from '../src/modules/orders/order.service.js';

const MONGODB_TEST_URI = 'mongodb://127.0.0.1:27017/istore_db_test';

test.describe('Order Service Pure MongoDB Integration Tests', () => {
  let testProduct1;
  let testProduct2;

  test.before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_TEST_URI);
    }
    await Product.deleteMany({});
    await Order.deleteMany({});

    testProduct1 = await Product.create({
      name: 'iPhone 15 Pro Max 256GB',
      slug: 'iphone-15-pro-max-256gb',
      brand: 'Apple',
      category: 'phones',
      price: 29990000,
      stock: 5
    });

    testProduct2 = await Product.create({
      name: 'MacBook Air 13-inch M2',
      slug: 'macbook-air-13-inch-m2',
      brand: 'Apple',
      category: 'laptops',
      price: 26990000,
      stock: 2
    });
  });

  test.after(async () => {
    await Product.deleteMany({});
    await Order.deleteMany({});
    await mongoose.connection.close();
  });

  test.beforeEach(async () => {
    await Product.findByIdAndUpdate(testProduct1._id, { stock: 5 });
    await Product.findByIdAndUpdate(testProduct2._id, { stock: 2 });
    await Order.deleteMany({});
  });

  test('Should fail if customer or items list is invalid', async () => {
    const invalidOrder = {
      customer: {
        fullName: 'Nguyen Van A',
        phone: '0901234567',
        email: 'test@example.com',
        address: '123 Test St'
      },
      items: [],
      paymentMethod: 'cod_demo'
    };

    await assert.rejects(
      orderService.createOrder(invalidOrder),
      /Đơn hàng phải chứa ít nhất một sản phẩm/
    );
  });

  test('Should fail if product price does not match db price', async () => {
    const priceMismatchOrder = {
      customer: {
        fullName: 'Nguyen Van A',
        phone: '0901234567',
        email: 'test@example.com',
        address: '123 Test St'
      },
      items: [
        {
          productId: testProduct1._id.toString(),
          name: testProduct1.name,
          price: 20000000,
          quantity: 1
        }
      ],
      paymentMethod: 'cod_demo'
    };

    await assert.rejects(
      orderService.createOrder(priceMismatchOrder),
      /Giá của sản phẩm/
    );

    const p1 = await Product.findById(testProduct1._id);
    assert.strictEqual(p1.stock, 5);
  });

  test('Should succeed for valid order and update stock correctly', async () => {
    const validOrder = {
      customer: {
        fullName: 'Nguyen Van A',
        phone: '0901234567',
        email: 'test@example.com',
        address: '123 Test St'
      },
      items: [
        {
          productId: testProduct1._id.toString(),
          name: testProduct1.name,
          price: 29990000,
          quantity: 2
        }
      ],
      paymentMethod: 'cod_demo'
    };

    const order = await orderService.createOrder(validOrder);
    assert.ok(order);
    assert.strictEqual(order.status, 'pending');
    assert.strictEqual(order.total, 29990000 * 2);

    const p1 = await Product.findById(testProduct1._id);
    assert.strictEqual(p1.stock, 3);
  });

  test('Should fail and rollback stock if order quantity exceeds available stock', async () => {
    const insufficientStockOrder = {
      customer: {
        fullName: 'Nguyen Van A',
        phone: '0901234567',
        email: 'test@example.com',
        address: '123 Test St'
      },
      items: [
        {
          productId: testProduct1._id.toString(),
          name: testProduct1.name,
          price: 29990000,
          quantity: 2
        },
        {
          productId: testProduct2._id.toString(),
          name: testProduct2.name,
          price: 26990000,
          quantity: 5
        }
      ],
      paymentMethod: 'cod_demo'
    };

    await assert.rejects(
      orderService.createOrder(insufficientStockOrder),
      /không đủ hàng trong kho/
    );

    const p1 = await Product.findById(testProduct1._id);
    const p2 = await Product.findById(testProduct2._id);
    assert.strictEqual(p1.stock, 5);
    assert.strictEqual(p2.stock, 2);
  });

  test('Should handle concurrent ordering safely and only allow stock limit', async () => {
    await Product.findByIdAndUpdate(testProduct2._id, { stock: 1 });

    const customerInfo = {
      fullName: 'Nguyen Van A',
      phone: '0901234567',
      email: 'test@example.com',
      address: '123 Test St'
    };

    const createOrderCall = () => orderService.createOrder({
      customer: customerInfo,
      items: [
        {
          productId: testProduct2._id.toString(),
          name: testProduct2.name,
          price: 26990000,
          quantity: 1
        }
      ],
      paymentMethod: 'cod_demo'
    });

    const results = await Promise.allSettled([
      createOrderCall(),
      createOrderCall(),
      createOrderCall(),
      createOrderCall(),
      createOrderCall()
    ]);

    const succeeded = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');

    assert.strictEqual(succeeded.length, 1);
    assert.strictEqual(failed.length, 4);

    const p2 = await Product.findById(testProduct2._id);
    assert.strictEqual(p2.stock, 0);

    failed.forEach(f => {
      assert.ok(f.reason.message.includes('không đủ hàng trong kho'));
    });
  });
});
